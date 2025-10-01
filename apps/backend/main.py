import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.backend import models, schemas
from apps.backend.database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "User-Agent",
        "ngrok-skip-browser-warning"
    ],
)

# --- Debug Startup Check ---
try:
    with SessionLocal() as db:
        cols = db.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects';").fetchall()
        logging.info("[DB DEBUG] Projects table columns: %s", [c[0] for c in cols])
except Exception as e:
    logging.error("[DB DEBUG] Failed to fetch projects table columns: %s", e)

# --- Routes will follow (not truncated here, full file intact) ---
# Existing routes for /db/boards, /db/projects, /db/phases, etc. remain unchanged.

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from apps.backend.database import get_db

@app.get("/db/boards", response_model=list[schemas.Board])
def read_boards(db: Session = Depends(get_db)):
    return db.query(models.Board).filter(models.Board.archived == False).all()

@app.get("/db/projects", response_model=list[schemas.Project])
def read_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).filter(models.Project.archived == False).all()

@app.patch("/db/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.project_id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for var, value in vars(project).items():
        if value is not None:
            setattr(db_project, var, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/db/phases", response_model=list[schemas.Phase])
def read_phases(db: Session = Depends(get_db)):
    return db.query(models.Phase).filter(models.Phase.archived == False).all()

@app.patch("/db/phases/{phase_id}", response_model=schemas.Phase)
def update_phase(phase_id: int, phase: schemas.PhaseUpdate, db: Session = Depends(get_db)):
    db_phase = db.query(models.Phase).filter(models.Phase.phase_id == phase_id).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Phase not found")
    for var, value in vars(phase).items():
        if value is not None:
            setattr(db_phase, var, value)
    db.commit()
    db.refresh(db_phase)
    return db_phase