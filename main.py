import requests
import time
import os
import subprocess
from fastapi import FastAPI, Request, HTTPException
from dotenv import load_dotenv
from pathlib import Path

# --- Load .env file so OPS_TOKEN and GITHUB_TOKEN are available ---
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# Tokens: allow multiple OPS_TOKEN values, comma-separated in .env
OPS_TOKENS = [
    t.strip()
    for t in os.getenv("OPS_TOKEN", "my-super-secret-token").split(",")
]
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = "holly-ai-2025/holly-v6"

# Force root path to your dev folder
ROOT_PATH = "/users/juliesimac/dev/holly-v6"

# Track uptime
START_TIME = time.time()

print(f"[startup] Allowed OPS_TOKENS: {OPS_TOKENS}")
print(f"[startup] Using ROOT_PATH: {ROOT_PATH}")

# ---------- Middleware for Bearer Token ----------
@app.middleware("http")
async def check_auth(request: Request, call_next):
    # Debug logging
    headers_dict = {k: v for k, v in request.headers.items()}
    print(f"[DEBUG] Incoming request → path: {request.url.path}, headers: {headers_dict}")

    # ⚠️ Dev mode: skip token checks (ngrok testing)
    return await call_next(request)


# =====================================================
# ================ OPS ENDPOINTS ======================
# =====================================================

@app.get("/ops/status")
async def ops_status():
    uptime = time.time() - START_TIME
    sha = "unknown"

    try:
        sha = subprocess.check_output(
            ["git", "rev-parse", "HEAD"],
            stderr=subprocess.STDOUT,
            cwd=ROOT_PATH
        ).decode().strip()
    except Exception as e:
        print(f"[ops_status] Git SHA lookup failed: {e}")

    return {
        "ok": True,
        "api": {
            "uptime": f"{uptime:.2f} seconds",
            "version": "1.0.0",
            "sha": sha,
        },
        "services": [{"name": "backend", "status": "running"}],
    }


@app.get("/health")
async def health_check():
    uptime = time.time() - START_TIME
    try:
        sha = subprocess.check_output(
            ["git", "rev-parse", "HEAD"], stderr=subprocess.DEVNULL, cwd=ROOT_PATH
        ).decode().strip()
    except Exception:
        sha = "unknown"

    return {
        "status": "healthy",
        "uptime": f"{uptime:.2f} seconds",
        "version": "1.0.0",
        "sha": sha,
    }


@app.post("/ops/deploy")
async def ops_deploy():
    try:
        output = subprocess.check_output(
            ["git", "pull"], stderr=subprocess.STDOUT, cwd=ROOT_PATH
        ).decode()
        return {"ok": True, "output": output, "error": ""}
    except subprocess.CalledProcessError as e:
        return {"ok": False, "output": e.output.decode(), "error": str(e)}


@app.post("/ops/restart")
async def ops_restart():
    pid = os.getpid()
    return {"ok": True, "message": "Service restart triggered", "pid": pid}


# ---------- GitHub Integration ----------
@app.get("/git/check-token")
async def check_token():
    if GITHUB_TOKEN:
        return {"ok": True, "message": "GitHub token is loaded", "prefix": GITHUB_TOKEN[:6] + "..."}
    else:
        return {"ok": False, "message": "GitHub token is NOT loaded"}


@app.post("/git/create-branch")
async def create_branch(request: Request):
    data = await request.json()
    branch_name = data.get("branch")
    if not branch_name:
        raise HTTPException(status_code=400, detail="Branch name is required")

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    r = requests.get(
        f"https://api.github.com/repos/{GITHUB_REPO}/git/refs/heads/main",
        headers=headers
    )
    if r.status_code != 200:
        return {"ok": False, "step": "fetch-base", "error": r.text}

    sha = r.json()["object"]["sha"]
    payload = {"ref": f"refs/heads/{branch_name}", "sha": sha}

    r = requests.post(
        f"https://api.github.com/repos/{GITHUB_REPO}/git/refs",
        headers=headers,
        json=payload
    )
    if r.status_code in (200, 201):
        return {"ok": True, "branch": branch_name, "repo": GITHUB_REPO}
    return {"ok": False, "step": "create-branch", "error": r.text}


@app.post("/git/commit-multi")
async def git_commit_multi(request: Request):
    data = await request.json()
    branch = data.get("branch")
    files = data.get("files", [])
    message = data.get("message", "Update via Holly Ops Service")

    if not branch or not files:
        raise HTTPException(status_code=400, detail="branch and files are required")

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json"
    }

    # get base sha
    ref_url = f"https://api.github.com/repos/{GITHUB_REPO}/git/refs/heads/{branch}"
    r = requests.get(ref_url, headers=headers)
    if r.status_code != 200:
        return {"ok": False, "step": "fetch-ref", "error": r.text}
    base_sha = r.json()["object"]["sha"]

    commit_url = f"https://api.github.com/repos/{GITHUB_REPO}/git/commits/{base_sha}"
    r = requests.get(commit_url, headers=headers)
    if r.status_code != 200:
        return {"ok": False, "step": "fetch-commit", "error": r.text}
    base_tree = r.json()["tree"]["sha"]

    tree = []
    for f in files:
        tree.append({
            "path": f["path"],
            "mode": "100644",
            "type": "blob",
            "content": f["content"]
        })

    payload = {"base_tree": base_tree, "tree": tree}
    r = requests.post(
        f"https://api.github.com/repos/{GITHUB_REPO}/git/trees",
        headers=headers,
        json=payload
    )
    if r.status_code not in (200, 201):
        return {"ok": False, "step": "create-tree", "error": r.text}
    new_tree = r.json()["sha"]

    payload = {"message": message, "tree": new_tree, "parents": [base_sha]}
    r = requests.post(
        f"https://api.github.com/repos/{GITHUB_REPO}/git/commits",
        headers=headers,
        json=payload
    )
    if r.status_code not in (200, 201):
        return {"ok": False, "step": "create-commit", "error": r.text}
    new_commit = r.json()["sha"]

    payload = {"sha": new_commit, "force": True}
    r = requests.patch(
        f"https://api.github.com/repos/{GITHUB_REPO}/git/refs/heads/{branch}",
        headers=headers,
        json=payload
    )
    if r.status_code != 200:
        return {"ok": False, "step": "update-ref", "error": r.text}

    return {"ok": True, "branch": branch, "commit": new_commit, "files": [f["path"] for f in files]}


@app.post("/git/open-pr")
async def open_pr(request: Request):
    data = await request.json()
    branch = data.get("branch")
    title = data.get("title", f"PR from {branch}")
    body = data.get("body", "")

    if not branch:
        raise HTTPException(status_code=400, detail="branch is required")

    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}", "Accept": "application/vnd.github+json"}
    payload = {"title": title, "head": branch, "base": "main", "body": body}

    r = requests.post(f"https://api.github.com/repos/{GITHUB_REPO}/pulls", headers=headers, json=payload)
    if r.status_code in (200, 201):
        pr = r.json()
        return {"ok": True, "branch": branch, "pr_url": pr.get("html_url"), "pr_number": pr.get("number")}
    else:
        return {"ok": False, "error": r.text}


@app.post("/git/close-pr")
async def close_pr(request: Request):
    data = await request.json()
    pr_number = data.get("pr_number")
    if not pr_number:
        raise HTTPException(status_code=400, detail="PR number is required")

    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}", "Accept": "application/vnd.github+json"}
    r = requests.patch(f"https://api.github.com/repos/{GITHUB_REPO}/pulls/{pr_number}", headers=headers, json={"state": "closed"})
    if r.status_code == 200:
        return {"ok": True, "pr_number": pr_number, "state": "closed"}
    else:
        return {"ok": False, "error": r.text}


# ---------- Unrestricted Shell Execution ----------
@app.post("/ops/shell")
async def ops_shell(request: Request):
    data = await request.json()
    cmd = data.get("cmd")
    if not cmd:
        raise HTTPException(status_code=400, detail="cmd is required")

    try:
        output = subprocess.check_output(
            cmd, shell=True, stderr=subprocess.STDOUT, timeout=60
        ).decode()
        return {"ok": True, "cmd": cmd, "cwd": os.getcwd(), "output": output}
    except subprocess.CalledProcessError as e:
        return {"ok": False, "cmd": cmd, "output": e.output.decode(), "error": str(e)}
    except subprocess.TimeoutExpired:
        return {"ok": False, "cmd": cmd, "error": "Command timed out"}
    except Exception as e:
        return {"ok": False, "cmd": cmd, "error": str(e)}


# =====================================================
# ================ AGENT ENDPOINTS ====================
# =====================================================

@app.get("/ls")
async def agent_ls(path: str = ROOT_PATH):
    try:
        files = os.listdir(path)
        return {"ok": True, "files": files}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@app.post("/cat")
async def agent_cat(request: Request):
    data = await request.json()
    path = data.get("path")
    if not path:
        return {"ok": False, "error": "Missing 'path'"}
    try:
        with open(path, "r") as f:
            content = f.read()
        return {"ok": True, "content": content}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@app.post("/write")
async def agent_write(request: Request):
    data = await request.json()
    path = data.get("path")
    content = data.get("content")
    if not path or content is None:
        return {"ok": False, "error": "Missing 'path' or 'content'"}
    try:
        with open(path, "w") as f:
            f.write(content)
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@app.post("/exec")
async def agent_exec(request: Request):
    data = await request.json()
    cmd = data.get("cmd")
    if not cmd:
        return {"ok": False, "error": "Missing 'cmd'"}
    try:
        output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT).decode()
        return {"ok": True, "output": output, "error": ""}
    except subprocess.CalledProcessError as e:
        return {"ok": False, "output": e.output.decode(), "error": str(e)}
