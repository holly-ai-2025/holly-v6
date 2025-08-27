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
OPS_TOKENS = [t.strip() for t in os.getenv("OPS_TOKEN", "").split(",") if t.strip()]
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
async def verify_ops_token(request: Request, call_next):
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
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

DB_PATH = os.getenv("SQLITE_DB_PATH", "infra/data/holly.db")
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

class Project(Base):
    __tablename__ = "projects"
    project_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String)
    progress = Column(Integer)

class Phase(Base):
    __tablename__ = "phases"
    phase_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    project_id = Column(String)

class Habit(Base):
    __tablename__ = "habits"
    habit_id = Column(String, primary_key=True, index=True)
    habit_name = Column(String, nullable=False)
    frequency = Column(String)
    streak = Column(Integer, default=0)
    goal = Column(String)
    last_completed = Column(String)

Base.metadata.create_all(bind=engine)

@app.post("/db/query")
async def db_query(request: Request):
    data = await request.json()
    sql = data.get("sql")
    if not sql:
        raise HTTPException(status_code=400, detail="'sql' is required")
    try:
        conn = engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        cursor.close()
        conn.close()
        return {"ok": True, "columns": columns, "rows": rows}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/db/exec")
async def db_exec(request: Request):
    data = await request.json()
    sql = data.get("sql")
    if not sql:
        raise HTTPException(status_code=400, detail="'sql' is required")
    try:
        conn = engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        cursor.close()
        conn.close()
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}
