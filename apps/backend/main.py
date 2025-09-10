from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import logging

from apps.backend import models, schemas
from apps.backend.database import SessionLocal, engine

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure DB is initialized
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dev-safe CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- TASK ROUTES ---
@app.post("/db/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.dict(exclude_unset=True))
    # Convert due_date back to ISO before storing
    if task.due_date:
        db_task.due_date = datetime.strptime(task.due_date, "%d%m%Y").date()
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/db/tasks", response_model=List[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Task).offset(skip).limit(limit).all()

@app.get("/db/tasks/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task_data = task.dict(exclude_unset=True)
    if "due_date" in task_data and task_data["due_date"]:
        task_data["due_date"] = datetime.strptime(task_data["due_date"], "%d%m%Y").date()
    for key, value in task_data.items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/db/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted"}

# --- PROJECT ROUTES ---
@app.get("/db/projects", response_model=List[schemas.Project])
def get_projects(db: Session = Depends(get_db)):
    logger.info("[Route] GET /db/projects")
    return db.query(models.Project).all()

@app.patch("/db/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, updates: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] PATCH /db/projects/{project_id} with updates={updates}")
    project = db.query(models.Project).filter(models.Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in updates.items():
        if hasattr(project, key):
            setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return project

# --- BOARD ROUTES ---
@app.get("/db/boards", response_model=List[schemas.Board])
def get_boards(db: Session = Depends(get_db)):
    logger.info("[Route] GET /db/boards")
    return db.query(models.Board).all()

# --- TAGS ---
@app.get("/db/tags", response_model=List[schemas.Tag])
def get_tags(db: Session = Depends(get_db)):
    logger.info("[Route] GET /db/tags")
    return db.query(models.Tag).all()

@app.post("/db/tags", response_model=schemas.Tag)
def create_tag(tag: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] POST /db/tags with tag={tag}")
    new_tag = models.Tag(**tag)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

# --- REFLECTIONS ---
@app.get("/db/reflections", response_model=List[schemas.Reflection])
def get_reflections(db: Session = Depends(get_db)):
    logger.info("[Route] GET /db/reflections")
    return db.query(models.Reflection).all()

@app.post("/db/reflections", response_model=schemas.Reflection)
def create_reflection(reflection: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] POST /db/reflections with reflection={reflection}")
    new_reflection = models.Reflection(**reflection)
    db.add(new_reflection)
    db.commit()
    db.refresh(new_reflection)
    return new_reflection

# --- ATTACHMENTS ---
@app.post("/db/attachments", response_model=schemas.Attachment)
def create_attachment(attachment: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] POST /db/attachments with attachment={attachment}")
    new_attachment = models.Attachment(**attachment)
    db.add(new_attachment)
    db.commit()
    db.refresh(new_attachment)
    return new_attachment

# --- LINKS ---
@app.post("/db/links", response_model=schemas.Link)
def create_link(link: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] POST /db/links with link={link}")
    new_link = models.Link(**link)
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    return new_link

# --- FRONTEND LOG CAPTURE ---
@app.post("/log")
async def capture_log(request: Request):
    payload = await request.json()
    level = payload.get("level", "info")
    message = payload.get("message", "")
    data = payload.get("data")

    if level == "error":
        logger.error(f"[Frontend] {message} | {data}")
    elif level == "warn":
        logger.warning(f"[Frontend] {message} | {data}")
    else:
        logger.info(f"[Frontend] {message} | {data}")

    return {"status": "ok"}