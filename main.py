import requests
import time
import os
import subprocess
from fastapi import FastAPI, Request, HTTPException
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timedelta

# --- Load .env file so OPS_TOKEN and GITHUB_TOKEN are available ---
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# ---------- NEW: CORS middleware ----------
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for now allow all, can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Tokens: allow multiple OPS_TOKEN values, comma-separated in .env
OPS_TOKENS = [t.strip() for t in os.getenv("OPS_TOKEN", "").split(",") if t.strip()]
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = "holly-ai-2025/holly-v6"

# Root path (dynamic fallback if not set properly)
ROOT_PATH = str(Path(__file__).resolve().parent)

# Track uptime
START_TIME = time.time()

print(f"[startup] Allowed OPS_TOKENS: {OPS_TOKENS}")
print(f"[startup] Using ROOT_PATH: {ROOT_PATH}")

# ---------- Middleware for Bearer Token ----------
@app.middleware("http")
async def verify_ops_token(request: Request, call_next):
    # Allow CORS preflight requests through (they never have Authorization headers)
    if request.method == "OPTIONS":
        return await call_next(request)

    if request.url.path.startswith("/ops/") or request.url.path.startswith("/git/") or request.url.path.startswith("/db/"):
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

# Ensure directory exists
db_dir = Path(DB_PATH).parent
db_dir.mkdir(parents=True, exist_ok=True)

engine = create_engine(f"sqlite:///{DB_PATH}", echo=False, connect_args={"check_same_thread": False})
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
            "category": t.category
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
