from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apps.backend.models import Task, Project, Phase, Base
from apps.backend.database import SessionLocal, engine
from datetime import datetime, date, timedelta
import uuid

app = FastAPI()

# ✅ Enable wide-open CORS for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # explicitly allow all origins
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
    today = date.today()
    tomorrow = today + timedelta(days=1)
    end_of_week = today + timedelta(days=(6 - today.weekday()))

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
            "notes": t.notes,
        }
        if not t.due_date:
            grouped["Later"].append(task_data)
        elif t.due_date < today:
            grouped["Overdue"].append(task_data)
        elif t.due_date == today:
            grouped["Today"].append(task_data)
        elif t.due_date == tomorrow:
            grouped["Tomorrow"].append(task_data)
        elif t.due_date <= end_of_week:
            grouped["This Week"].append(task_data)
        else:
            grouped["Later"].append(task_data)

    session.close()
    return grouped

@app.post("/db/tasks")
async def create_task(task: dict):
    session = SessionLocal()
    new_task = Task(
        task_id=str(uuid.uuid4()),
        task_name=task.get("task_name"),
        description=task.get("description"),
        due_date=datetime.strptime(task["due_date"], "%Y-%m-%d").date() if task.get("due_date") else None,
        status=task.get("status"),
        priority=task.get("priority"),
        category=task.get("category"),
        project_id=task.get("project_id") or None,
        phase_id=task.get("phase_id") or None,
        token_value=task.get("token_value"),
        notes=task.get("notes"),
    )
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    session.close()
    return {"message": "Task created", "task_id": new_task.task_id}

@app.patch("/db/tasks/{task_id}")
async def update_task(task_id: str, updates: dict):
    session = SessionLocal()
    task = session.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        session.close()
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in updates.items():
        if hasattr(task, key):
            if key == "due_date" and isinstance(value, str):
                try:
                    value = datetime.strptime(value, "%Y-%m-%d").date()
                except ValueError:
                    session.close()
                    raise HTTPException(status_code=400, detail="Invalid date format")
            if key in ["project_id", "phase_id"] and value == "":
                value = None
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

@app.get("/db/projects/{project_id}/phases")
async def get_phases(project_id: str):
    session = SessionLocal()
    phases = session.query(Phase).filter(Phase.project_id == project_id).all()
    print(f"[Backend] Returning {len(phases)} phases for project {project_id}")

    result = [
        {
            "phase_id": ph.phase_id,
            "project_id": ph.project_id,
            "name": ph.name,
            "description": ph.description,
        }
        for ph in phases
    ]

    session.close()
    return result

@app.post("/db/projects/{project_id}/phases")
async def create_phase(project_id: str, phase: dict):
    session = SessionLocal()
    new_phase = Phase(
        phase_id=str(uuid.uuid4()),
        project_id=project_id,
        name=phase.get("name"),
        description=phase.get("description"),
    )
    session.add(new_phase)
    session.commit()
    session.refresh(new_phase)
    session.close()
    return {"message": "Phase created", "phase_id": new_phase.phase_id}