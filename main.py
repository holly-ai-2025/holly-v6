import requests
import time
import os
import subprocess
from fastapi import FastAPI, Request, HTTPException
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timedelta

# --- Load .env file ---
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

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


# =====================================================
# ================ SQLITE DB INTEGRATION ===============
# =====================================================
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = os.getenv("SQLITE_DB_PATH", "infra/data/holly.db")

db_dir = Path(DB_PATH).parent
db_dir.mkdir(parents=True, exist_ok=True)

engine = create_engine(
    f"sqlite:///{DB_PATH}", echo=False, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"
    task_id = Column(String, primary_key=True, index=True)
    task_name = Column(String, nullable=False)
    description = Column(String)
    due_date = Column(String)
    status = Column(String)
    priority = Column(String)
    category = Column(String)
    project_id = Column(String)
    phase_id = Column(String)
    token_value = Column(Integer)

class Project(Base):
    __tablename__ = "projects"
    project_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String)
    progress = Column(String)

class Habit(Base):
    __tablename__ = "habits"
    habit_id = Column(String, primary_key=True, index=True)
    habit_name = Column(String, nullable=False)
    frequency = Column(String)
    streak = Column(Integer)
    goal = Column(Integer)
    last_completed = Column(String)

Base.metadata.create_all(bind=engine)

@app.get("/db/tasks")
async def get_tasks():
    session = SessionLocal()
    tasks = session.query(Task).all()
    session.close()

    today = datetime.today().date()
    tomorrow = today + timedelta(days=1)
    week_end = today + timedelta(days=7)

    grouped = {"Overdue": [], "Today": [], "Tomorrow": [], "This Week": [], "Later": []}

    for t in tasks:
        due = None
        try:
            due = datetime.strptime(t.due_date, "%Y-%m-%d").date() if t.due_date else None
        except:
            pass

        task_data = {
            "id": t.task_id,
            "name": t.task_name,
            "due_date": t.due_date,
            "status": t.status,
            "priority": t.priority,
            "project": t.project_id,
            "category": t.category,
        }

        if due:
            if due < today:
                grouped["Overdue"].append(task_data)
            elif due == today:
                grouped["Today"].append(task_data)
            elif due == tomorrow:
                grouped["Tomorrow"].append(task_data)
            elif today < due <= week_end:
                grouped["This Week"].append(task_data)
            else:
                grouped["Later"].append(task_data)
        else:
            grouped["Later"].append(task_data)

    return grouped

@app.post("/db/tasks")
async def create_task(request: Request):
    data = await request.json()
    if not data.get("task_id") or not data.get("task_name"):
        raise HTTPException(status_code=400, detail="'task_id' and 'task_name' are required")

    session = SessionLocal()
    new_task = Task(
        task_id=data["task_id"],
        task_name=data["task_name"],
        description=data.get("description"),
        due_date=data.get("due_date"),
        status=data.get("status"),
        priority=data.get("priority"),
        category=data.get("category"),
        project_id=data.get("project_id"),
        phase_id=data.get("phase_id"),
    )
    session.add(new_task)
    session.commit()
    session.close()

    return {"ok": True, "task": data}

@app.get("/db/projects")
async def get_projects():
    session = SessionLocal()
    projects = session.query(Project).all()
    session.close()

    return [
        {"id": p.project_id, "name": p.name, "status": p.status, "progress": p.progress}
        for p in projects
    ]

@app.get("/db/habits")
async def get_habits():
    session = SessionLocal()
    habits = session.query(Habit).all()
    session.close()

    return [
        {
            "id": h.habit_id,
            "name": h.habit_name,
            "frequency": h.frequency,
            "streak": h.streak,
            "goal": h.goal,
            "last_completed": h.last_completed,
        }
        for h in habits
    ]

# =====================================================
# ================ OPS ENDPOINTS ======================
# =====================================================
@app.get("/ops/status")
async def ops_status():
    uptime = time.time() - START_TIME
    return {"ok": True, "uptime_seconds": uptime, "root_path": ROOT_PATH}

@app.post("/ops/shell")
async def ops_shell(request: Request):
    data = await request.json()
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
    data = await request.json()
    path = data.get("path", ".")
    try:
        files = os.listdir(path)
        return {"ok": True, "files": files}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/ops/cat")
async def ops_cat(request: Request):
    data = await request.json()
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
    data = await request.json()
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
    data = await request.json()
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
    data = await request.json()
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
    data = await request.json()
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
    data = await request.json()
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
