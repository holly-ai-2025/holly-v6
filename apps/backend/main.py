from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apps.backend.models import Task, Project, Base
from apps.backend.database import SessionLocal, engine

app = FastAPI()

# ✅ Enable CORS for Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ensure DB tables exist
Base.metadata.create_all(bind=engine)

@app.get("/db/tasks")
async def get_tasks():
    session = SessionLocal()
    tasks = session.query(Task).all()
    print(f"[Backend] Returning {len(tasks)} tasks")

    grouped = {"Overdue": [], "Today": [], "Tomorrow": [], "This Week": [], "Later": []}
    for t in tasks:
        task_data = {
            "task_id": t.task_id,
            "task_name": t.task_name,
            "description": t.description,
            "due_date": t.due_date,
            "status": t.status,
            "priority": t.priority,
            "category": t.category,
            "project_id": t.project_id,
            "phase_id": t.phase_id,
            "token_value": t.token_value,
        }
        grouped["Today"].append(task_data)

    session.close()
    return grouped

@app.patch("/db/tasks/{task_id}")
async def update_task(task_id: str, updates: dict):
    session = SessionLocal()
    task = session.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        session.close()
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in updates.items():
        if hasattr(task, key):
            setattr(task, key, value)

    session.commit()
    session.refresh(task)
    session.close()
    return {"message": "Task updated", "task_id": task.task_id}

@app.get("/db/projects")
async def get_projects():
    session = SessionLocal()
    projects = session.query(Project).all()
    print(f"[Backend] Returning {len(projects)} projects")

    result = [
        {
            "project_id": p.project_id,
            "name": p.name,
            "status": p.status,
            "progress": p.progress,
        }
        for p in projects
    ]

    session.close()
    return result