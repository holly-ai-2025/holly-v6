from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from apps.backend.database import SessionLocal
from apps.backend import models
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS setup - allow all origins for debug
def custom_allow_origin(origin: str) -> bool:
    logger.info(f"[CORS] Checking origin: {origin}")
    return True

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for logging requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    origin = request.headers.get("origin")
    logger.info(f"[Request] {request.method} {request.url} from origin={origin}")
    response = await call_next(request)
    logger.info(f"[Response] status={response.status_code} for {request.method} {request.url}")
    return response

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- SCHEMAS ---
class TaskUpdate(BaseModel):
    task_name: Optional[str]
    description: Optional[str]
    due_date: Optional[date]
    status: Optional[str]
    priority: Optional[str]
    category: Optional[str]
    project_id: Optional[int]
    phase_id: Optional[int]
    parent_task_id: Optional[int]
    token_value: Optional[int]
    notes: Optional[str]
    urgency_score: Optional[int]
    effort_level: Optional[str]
    board_id: Optional[int]

# --- TASK ROUTES ---
@app.get("/db/tasks")
def get_tasks(db: Session = Depends(get_db)):
    logger.info("[Route] GET /db/tasks")
    return db.query(models.Task).all()

@app.patch("/db/tasks/{task_id}")
def update_task(task_id: int, updates: TaskUpdate, db: Session = Depends(get_db)):
    logger.info(f"[Route] PATCH /db/tasks/{task_id} with updates={updates.dict(exclude_unset=True)}")
    task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = updates.dict(exclude_unset=True)
    update_data.pop("created_at", None)
    update_data["updated_at"] = datetime.utcnow()

    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    # Log activity
    activity = models.TaskActivity(
        task_id=task_id,
        user_id="system",
        action="update",
        details=str(update_data)
    )
    db.add(activity)
    db.commit()
    return task

@app.post("/db/tasks")
def create_task(task: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] POST /db/tasks with task={task}")
    new_task = models.Task(**task)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.delete("/db/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    logger.info(f"[Route] DELETE /db/tasks/{task_id}")
    task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}

# --- PROJECT ROUTES ---
@app.get("/db/projects")
def get_projects(db: Session = Depends(get_db)):
    logger.info("[Route] GET /db/projects")
    return db.query(models.Project).all()

@app.patch("/db/projects/{project_id}")
def update_project(project_id: str, updates: dict, db: Session = Depends(get_db)):
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
@app.get("/db/boards")
def get_boards(db: Session = Depends(get_db)):
    logger.info("[Route] GET /db/boards")
    return db.query(models.Board).all()

# --- TAGS ---
@app.get("/db/tags")
def get_tags(db: Session = Depends(get_db)):
    logger.info("[Route] GET /db/tags")
    return db.query(models.Tag).all()

@app.post("/db/tags")
def create_tag(tag: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] POST /db/tags with tag={tag}")
    new_tag = models.Tag(**tag)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

# --- REFLECTIONS ---
@app.get("/db/reflections")
def get_reflections(db: Session = Depends(get_db)):
    logger.info("[Route] GET /db/reflections")
    return db.query(models.Reflection).all()

@app.post("/db/reflections")
def create_reflection(reflection: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] POST /db/reflections with reflection={reflection}")
    new_reflection = models.Reflection(**reflection)
    db.add(new_reflection)
    db.commit()
    db.refresh(new_reflection)
    return new_reflection

# --- ATTACHMENTS ---
@app.post("/db/attachments")
def create_attachment(attachment: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] POST /db/attachments with attachment={attachment}")
    new_attachment = models.Attachment(**attachment)
    db.add(new_attachment)
    db.commit()
    db.refresh(new_attachment)
    return new_attachment

# --- LINKS ---
@app.post("/db/links")
def create_link(link: dict, db: Session = Depends(get_db)):
    logger.info(f"[Route] POST /db/links with link={link}")
    new_link = models.Link(**link)
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    return new_link