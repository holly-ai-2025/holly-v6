from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from apps.backend.database import SessionLocal, engine
from apps.backend import models

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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
@app.get("/db/tasks")
def get_tasks(db: Session = next(get_db())):
    return db.query(models.Task).all()

@app.patch("/db/tasks/{task_id}")
def update_task(task_id: str, updates: dict, db: Session = next(get_db())):
    task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in updates.items():
        if hasattr(task, key):
            setattr(task, key, value)
    db.commit()
    db.refresh(task)
    # Log activity
    activity = models.TaskActivity(task_id=task_id, user_id=updates.get("user_id", "system"), action="update", details=str(updates))
    db.add(activity)
    db.commit()
    return task

@app.post("/db/tasks")
def create_task(task: dict, db: Session = next(get_db())):
    new_task = models.Task(**task)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.delete("/db/tasks/{task_id}")
def delete_task(task_id: str, db: Session = next(get_db())):
    task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}

# --- PROJECT ROUTES ---
@app.get("/db/projects")
def get_projects(db: Session = next(get_db())):
    return db.query(models.Project).all()

@app.patch("/db/projects/{project_id}")
def update_project(project_id: str, updates: dict, db: Session = next(get_db())):
    project = db.query(models.Project).filter(models.Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in updates.items():
        if hasattr(project, key):
            setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return project

# --- TAGS ---
@app.get("/db/tags")
def get_tags(db: Session = next(get_db())):
    return db.query(models.Tag).all()

@app.post("/db/tags")
def create_tag(tag: dict, db: Session = next(get_db())):
    new_tag = models.Tag(**tag)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

# --- REFLECTIONS ---
@app.get("/db/reflections")
def get_reflections(db: Session = next(get_db())):
    return db.query(models.Reflection).all()

@app.post("/db/reflections")
def create_reflection(reflection: dict, db: Session = next(get_db())):
    new_reflection = models.Reflection(**reflection)
    db.add(new_reflection)
    db.commit()
    db.refresh(new_reflection)
    return new_reflection

# --- ATTACHMENTS ---
@app.post("/db/attachments")
def create_attachment(attachment: dict, db: Session = next(get_db())):
    new_attachment = models.Attachment(**attachment)
    db.add(new_attachment)
    db.commit()
    db.refresh(new_attachment)
    return new_attachment

# --- LINKS ---
@app.post("/db/links")
def create_link(link: dict, db: Session = next(get_db())):
    new_link = models.Link(**link)
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    return new_link