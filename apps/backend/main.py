from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date

from . import models, schemas, database

app = FastAPI()

# --- CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

# --- HELPERS ---
def normalize_dates(payload: dict) -> dict:
    if payload.get("due_date") and isinstance(payload["due_date"], str):
        payload["due_date"] = date.fromisoformat(payload["due_date"])
    if payload.get("start_date") and isinstance(payload["start_date"], str):
        payload["start_date"] = datetime.fromisoformat(payload["start_date"])
    if payload.get("end_date") and isinstance(payload["end_date"], str):
        payload["end_date"] = datetime.fromisoformat(payload["end_date"])
    return payload

# --- TASKS ---
@app.get("/db/tasks", response_model=List[schemas.Task], response_model_exclude_none=True)
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = db.query(models.Task).offset(skip).limit(limit).all()
    return tasks

@app.post("/db/tasks", response_model=schemas.Task, response_model_exclude_none=True)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    payload = normalize_dates(task.model_dump())
    db_task = models.Task(**payload)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task, response_model_exclude_none=True)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    updates = normalize_dates(task.model_dump(exclude_unset=True))
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