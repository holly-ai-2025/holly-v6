from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from apps.backend import models, schemas
from apps.backend.database import SessionLocal, engine

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =============================
# Boards
# =============================
@app.get("/db/boards", response_model=List[schemas.Board])
def get_boards(db: Session = Depends(get_db)):
    return db.query(models.Board).filter(models.Board.archived == False).all()

@app.post("/db/boards", response_model=schemas.Board)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    db_board = models.Board(**board.dict())
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

@app.patch("/db/boards/{board_id}", response_model=schemas.Board)
def update_board(board_id: int, board_update: schemas.Board, db: Session = Depends(get_db)):
    db_board = db.query(models.Board).filter(models.Board.board_id == board_id).first()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")

    for key, value in board_update.dict(exclude_unset=True).items():
        setattr(db_board, key, value)

    if getattr(board_update, "archived", False):
        # Cascade archive phases + tasks
        db.query(models.Phase).filter(models.Phase.board_id == board_id).update({"archived": True})
        db.query(models.Task).filter(models.Task.board_id == board_id).update({"archived": True})

    db.commit()
    db.refresh(db_board)
    return db_board

# =============================
# Phases
# =============================
@app.post("/db/phases", response_model=schemas.Phase)
def create_phase(phase: schemas.PhaseCreate, db: Session = Depends(get_db)):
    db_phase = models.Phase(**phase.dict())
    db.add(db_phase)
    db.commit()
    db.refresh(db_phase)
    return db_phase

@app.get("/db/phases/{board_id}", response_model=List[schemas.Phase])
def get_phases(board_id: int, db: Session = Depends(get_db)):
    return db.query(models.Phase).filter(models.Phase.board_id == board_id, models.Phase.archived == False).all()

@app.patch("/db/phases/{phase_id}", response_model=schemas.Phase)
def update_phase(phase_id: int, phase_update: schemas.PhaseCreate, db: Session = Depends(get_db)):
    db_phase = db.query(models.Phase).filter(models.Phase.phase_id == phase_id).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Phase not found")

    for key, value in phase_update.dict(exclude_unset=True).items():
        setattr(db_phase, key, value)

    db.commit()
    db.refresh(db_phase)
    return db_phase

@app.delete("/db/phases/{phase_id}")
def archive_phase(phase_id: int, db: Session = Depends(get_db)):
    db_phase = db.query(models.Phase).filter(models.Phase.phase_id == phase_id).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Phase not found")
    db_phase.archived = True
    db.commit()
    return {"message": "Phase archived"}

# =============================
# Tasks
# =============================
@app.post("/db/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/db/tasks/{board_id}", response_model=List[schemas.Task])
def get_tasks(board_id: int, db: Session = Depends(get_db)):
    return db.query(models.Task).filter(models.Task.board_id == board_id, models.Task.archived == False).all()

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/db/tasks/{task_id}")
def archive_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db_task.archived = True
    db.commit()
    return {"message": "Task archived"}

# =============================
# Projects (handled via boards)
# =============================
@app.get("/db/projects", response_model=List[schemas.Board])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Board).filter(models.Board.board_type == "project", models.Board.archived == False).all()