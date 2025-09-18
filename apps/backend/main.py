from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, database

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
    return db_task

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for k, v in task.model_dump(exclude_unset=True).items():
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