import requests
import time
import os
import subprocess
from fastapi import FastAPI, Request, HTTPException
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timedelta

# --- Load .env file ---
load_dotenv(override=True)

app = FastAPI()

# ---------- CORS middleware ----------
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Tokens ----------
OPS_TOKENS = [t.strip() for t in os.getenv("OPS_TOKEN", "").split(",") if t.strip()]
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = "holly-ai-2025/holly-v6"
ROOT_PATH = str(Path(__file__).resolve().parent)
START_TIME = time.time()

print(f"[startup] Allowed OPS_TOKENS: {OPS_TOKENS}")
print(f"[startup] Using ROOT_PATH: {ROOT_PATH}")

# ---------- Middleware for Bearer Token ----------
@app.middleware("http")
async def verify_ops_token(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)

    if request.url.path.startswith(("/ops/", "/git/", "/db/")):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing Authorization header")

        token = auth_header.split("Bearer ")[-1].strip()
        if token not in OPS_TOKENS:
            raise HTTPException(status_code=403, detail="Invalid token")

    return await call_next(request)

# ---------- Utility ----------
async def get_json_or_empty(request: Request):
    """Safely parse JSON body, return {} if missing/invalid."""
    try:
        return await request.json()
    except Exception:
        return {}


# =====================================================
# ================ OPS ENDPOINTS ======================
# =====================================================
@app.post("/ops/status")
async def ops_status():
    uptime = time.time() - START_TIME
    return {"ok": True, "uptime_seconds": uptime, "root_path": ROOT_PATH}

@app.post("/ops/shell")
async def ops_shell(request: Request):
    data = await get_json_or_empty(request)
    cmd = data.get("cmd")
    if not cmd:
        raise HTTPException(status_code=400, detail="'cmd' is required")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
        return {"ok": True, "stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/ops/ls")
async def ops_ls(request: Request):
    data = await get_json_or_empty(request)
    path = data.get("path", ".")
    try:
        files = os.listdir(path)
        return {"ok": True, "files": files}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/ops/cat")
async def ops_cat(request: Request):
    data = await get_json_or_empty(request)
    path = data.get("path")
    if not path:
        raise HTTPException(status_code=400, detail="'path' is required")
    try:
        content = Path(path).read_text()
        return {"ok": True, "content": content}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/ops/write")
async def ops_write(request: Request):
    data = await get_json_or_empty(request)
    path = data.get("path")
    content = data.get("content")
    if not path or content is None:
        raise HTTPException(status_code=400, detail="'path' and 'content' are required")
    try:
        Path(path).write_text(content)
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}

# =====================================================
# ================ GITHUB ENDPOINTS ===================
# =====================================================
@app.post("/git/create-branch")
async def git_create_branch(request: Request):
    data = await get_json_or_empty(request)
    branch = data.get("branch")
    if not branch:
        raise HTTPException(status_code=400, detail="'branch' is required")
    try:
        result = subprocess.run(
            ["git", "checkout", "-b", branch],
            capture_output=True, text=True, cwd=ROOT_PATH
        )
        return {"ok": result.returncode == 0, "stdout": result.stdout, "stderr": result.stderr}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/git/commit-multi")
async def git_commit_multi(request: Request):
    data = await get_json_or_empty(request)
    branch = data.get("branch")
    message = data.get("message")
    files = data.get("files", [])

    if not branch or not message or not files:
        raise HTTPException(status_code=400, detail="'branch', 'message', and 'files' are required")

    try:
        subprocess.run(["git", "checkout", branch], cwd=ROOT_PATH, check=True)

        for f in files:
            path = Path(ROOT_PATH) / f["path"]
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(f["content"])

        subprocess.run(["git", "add", "."], cwd=ROOT_PATH, check=True)
        result = subprocess.run(["git", "commit", "-m", message], cwd=ROOT_PATH, capture_output=True, text=True)

        return {"ok": result.returncode == 0, "stdout": result.stdout, "stderr": result.stderr}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/git/open-pr")
async def git_open_pr(request: Request):
    data = await get_json_or_empty(request)
    branch = data.get("branch")
    title = data.get("title")
    body = data.get("body", "")

    if not branch or not title:
        raise HTTPException(status_code=400, detail="'branch' and 'title' are required")

    url = f"https://api.github.com/repos/{GITHUB_REPO}/pulls"
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}", "Accept": "application/vnd.github+json"}
    payload = {"title": title, "head": branch, "base": "main", "body": body}

    try:
        resp = requests.post(url, headers=headers, json=payload)
        return {"ok": resp.status_code == 201, "status_code": resp.status_code, "response": resp.json()}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/git/close-pr")
async def git_close_pr(request: Request):
    data = await get_json_or_empty(request)
    pr_number = data.get("pr_number")
    if not pr_number:
        raise HTTPException(status_code=400, detail="'pr_number' is required")

    url = f"https://api.github.com/repos/{GITHUB_REPO}/pulls/{pr_number}"
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}", "Accept": "application/vnd.github+json"}
    payload = {"state": "closed"}

    try:
        resp = requests.patch(url, headers=headers, json=payload)
        return {"ok": resp.status_code == 200, "status_code": resp.status_code, "response": resp.json()}
    except Exception as e:
        return {"ok": False, "error": str(e)}

