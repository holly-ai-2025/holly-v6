from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas, database
from datetime import datetime
import json

app = FastAPI()

# CORS setup to allow frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (safe for dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------- TASKS --------------------
@app.get("/db/tasks", response_model=list[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Task).offset(skip).limit(limit).all()

@app.post("/db/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    # Log creation
    log_entry = models.ActivityLog(
        entity_type="task",
        entity_id=db_task.task_id,
        action="create",
        payload={},
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)
    db.commit()

    return db_task

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Log full previous state (all fields, serialized)
    prev_state = {}
    for column in db_task.__table__.columns:
        val = getattr(db_task, column.name)
        if isinstance(val, datetime):
            prev_state[column.name] = val.isoformat()
        else:
            prev_state[column.name] = val

    # Determine action type
    incoming_data = task.model_dump(exclude_unset=True)
    action_type = "update"
    if "archived" in incoming_data and incoming_data["archived"] is True and db_task.archived is False:
        action_type = "delete"

    log_entry = models.ActivityLog(
        entity_type="task",
        entity_id=db_task.task_id,
        action=action_type,
        payload=prev_state,
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)

    for k, v in incoming_data.items():
        setattr(db_task, k, v)
    db.commit()
    db.refresh(db_task)

    return db_task

# -------------------- BOARDS --------------------
@app.get("/db/boards", response_model=list[schemas.Board])
def read_boards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Board).offset(skip).limit(limit).all()

# -------------------- PROJECTS --------------------
@app.get("/db/projects", response_model=list[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Project).offset(skip).limit(limit).all()

# -------------------- PHASES --------------------
@app.get("/db/phases", response_model=list[schemas.Phase])
def read_phases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Phase).offset(skip).limit(limit).all()

# -------------------- ACTIVITY LOG --------------------
@app.get("/db/activity", response_model=list[schemas.ActivityLog])
def read_activity(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.ActivityLog).order_by(desc(models.ActivityLog.created_at)).offset(skip).limit(limit).all()

@app.post("/db/activity/undo/{log_id}", response_model=schemas.ActivityLog)
def undo_activity(log_id: int, db: Session = Depends(get_db)):
    log_entry = db.query(models.ActivityLog).filter(models.ActivityLog.log_id == log_id).first()
    if not log_entry:
        raise HTTPException(status_code=404, detail="Activity log not found")

    if log_entry.entity_type == "task":
        task = db.query(models.Task).filter(models.Task.task_id == log_entry.entity_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Entity not found")
        for k, v in log_entry.payload.items():
            setattr(task, k, v)
        db.commit()
        db.refresh(task)

        undo_log = models.ActivityLog(
            entity_type="task",
            entity_id=task.task_id,
            action="undo",
            payload=log_entry.payload,
            created_at=datetime.utcnow(),
        )
        db.add(undo_log)
        db.commit()

    return log_entry