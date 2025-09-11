from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import logging

from . import models, schemas, database
from .database import SQLALCHEMY_DATABASE_URL

# Debug: confirm which database.py is loaded
print("[DB DEBUG] Loaded database module from:", database.__file__)

from sqlalchemy import inspect

app = FastAPI()

print(f"[BACKEND STARTUP] Connected DB: {SQLALCHEMY_DATABASE_URL}")

# --- Debug DB columns ---
try:
    inspector = inspect(database.engine)
    print("[DEBUG] Runtime Tasks Columns:", [c['name'] for c in inspector.get_columns("tasks")])
except Exception as e:
    print(f"[DEBUG] Could not inspect tasks table: {e}")

# --- Logging setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("holly-backend")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- HEALTHCHECK ---
@app.get("/ping")
def ping():
    return {"ok": True, "time": datetime.utcnow().isoformat()}

# --- Middleware for logging ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    if request.url.path.startswith("/db/") and request.method == "POST":
        body = await request.body()
        logger.info(f"[BACKEND] POST {request.url.path} received: {body.decode()}")
    response = await call_next(request)
    return response

# -------------------- TASKS --------------------
@app.get("/db/tasks", response_model=List[schemas.Task], response_model_exclude_none=True)
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Task).offset(skip).limit(limit).all()

@app.post("/db/tasks", response_model=schemas.Task, response_model_exclude_none=True)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task, response_model_exclude_none=True)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    updates = task.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/db/tasks/{task_id}", response_model=dict)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"ok": True, "deleted": task_id}

# -------------------- BOARDS --------------------
@app.get("/db/boards", response_model=List[schemas.Board])
def read_boards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Board).offset(skip).limit(limit).all()

@app.post("/db/boards", response_model=schemas.Board)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    db_board = models.Board(**board.model_dump())
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

# -------------------- GROUPS --------------------
@app.get("/db/groups", response_model=List[schemas.Group])
def read_groups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Group).offset(skip).limit(limit).all()

@app.post("/db/groups", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = models.Group(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

# -------------------- ITEMS --------------------
@app.get("/db/items", response_model=List[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Item).offset(skip).limit(limit).all()

@app.post("/db/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# -------------------- PROJECTS --------------------
@app.get("/db/projects", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Project).offset(skip).limit(limit).all()

@app.post("/db/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# -------------------- PHASES --------------------
@app.get("/db/phases", response_model=List[schemas.Phase])
def read_phases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Phase).offset(skip).limit(limit).all()

@app.post("/db/phases", response_model=schemas.Phase)
def create_phase(phase: schemas.PhaseCreate, db: Session = Depends(get_db)):
    db_phase = models.Phase(**phase.model_dump())
    db.add(db_phase)
    db.commit()
    db.refresh(db_phase)
    return db_phase