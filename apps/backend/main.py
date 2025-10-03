import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from apps.backend import models, schemas, database
from apps.backend.routers import boards, tasks, phases, groups, items

app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Authorization",
        "Content-Language",
        "Content-Type",
        "Origin",
        "User-Agent",
        "ngrok-skip-browser-warning",
    ],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Boards Endpoints ---
@app.patch("/db/boards/{board_id}", response_model=schemas.Board)
def update_board(board_id: int, board: schemas.BoardUpdate, db: Session = Depends(get_db)):
    db_board = db.query(models.Board).filter(models.Board.board_id == board_id, models.Board.archived == False).first()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")

    for key, value in board.dict(exclude_unset=True).items():
        setattr(db_board, key, value)

    # Cascade archive if archived = true
    if board.archived is True:
        # Archive tasks
        tasks_list = db.query(models.Task).filter(models.Task.board_id == board_id).all()
        for t in tasks_list:
            t.archived = True
        # Archive phases
        phases_list = db.query(models.Phase).filter(models.Phase.board_id == board_id).all()
        for p in phases_list:
            p.archived = True
        # Archive groups
        groups_list = db.query(models.Group).filter(models.Group.board_id == board_id).all()
        for g in groups_list:
            g.archived = True

    db.commit()
    db.refresh(db_board)
    return db_board

# --- Phases Endpoints ---
@app.patch("/db/phases/{phase_id}", response_model=schemas.Phase)
def update_phase(phase_id: int, phase: schemas.PhaseUpdate, db: Session = Depends(get_db)):
    db_phase = db.query(models.Phase).filter(models.Phase.phase_id == phase_id, models.Phase.archived == False).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Phase not found")

    for key, value in phase.dict(exclude_unset=True).items():
        setattr(db_phase, key, value)

    # Cascade archive if archived = true
    if phase.archived is True:
        tasks_list = db.query(models.Task).filter(models.Task.phase_id == phase_id).all()
        for t in tasks_list:
            t.archived = True

    db.commit()
    db.refresh(db_phase)
    return db_phase

# --- Groups Endpoints ---
@app.patch("/db/groups/{group_id}", response_model=schemas.Group)
def update_group(group_id: int, group: schemas.GroupUpdate, db: Session = Depends(get_db)):
    db_group = db.query(models.Group).filter(models.Group.group_id == group_id, models.Group.archived == False).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Group not found")

    for key, value in group.dict(exclude_unset=True).items():
        setattr(db_group, key, value)

    # Cascade archive if archived = true
    if group.archived is True:
        tasks_list = db.query(models.Task).filter(models.Task.group_id == group_id).all()
        for t in tasks_list:
            t.archived = True

    db.commit()
    db.refresh(db_group)
    return db_group

# --- Include Routers ---
app.include_router(boards.router, prefix="/db/boards", tags=["boards"])
app.include_router(tasks.router, prefix="/db/tasks", tags=["tasks"])
app.include_router(phases.router, prefix="/db/phases", tags=["phases"])
app.include_router(groups.router, prefix="/db/groups", tags=["groups"])
app.include_router(items.router, prefix="/db/items", tags=["items"])