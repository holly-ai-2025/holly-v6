import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from apps.backend import models, schemas, database

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
@app.get("/db/boards", response_model=list[schemas.Board])
def get_boards(db: Session = Depends(get_db)):
    return db.query(models.Board).all()

@app.post("/db/boards", response_model=schemas.Board)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    db_board = models.Board(**board.dict())
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

@app.patch("/db/boards/{board_id}", response_model=schemas.Board)
def update_board(board_id: int, board: schemas.BoardUpdate, db: Session = Depends(get_db)):
    db_board = db.query(models.Board).filter(models.Board.board_id == board_id, models.Board.archived == False).first()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")

    for key, value in board.dict(exclude_unset=True).items():
        setattr(db_board, key, value)

    # Cascade archive if archived = true
    if board.archived is True:
        tasks_list = db.query(models.Task).filter(models.Task.board_id == board_id).all()
        for t in tasks_list:
            t.archived = True
        phases_list = db.query(models.Phase).filter(models.Phase.board_id == board_id).all()
        for p in phases_list:
            p.archived = True
        groups_list = db.query(models.Group).filter(models.Group.board_id == board_id).all()
        for g in groups_list:
            g.archived = True

    db.commit()
    db.refresh(db_board)
    return db_board

# --- Phases Endpoints ---
@app.get("/db/phases", response_model=list[schemas.Phase])
def get_phases(board_id: int, db: Session = Depends(get_db)):
    return db.query(models.Phase).filter(models.Phase.board_id == board_id).all()

@app.post("/db/phases", response_model=schemas.Phase)
def create_phase(phase: schemas.PhaseCreate, db: Session = Depends(get_db)):
    db_phase = models.Phase(**phase.dict())
    db.add(db_phase)
    db.commit()
    db.refresh(db_phase)
    return db_phase

@app.patch("/db/phases/{phase_id}", response_model=schemas.Phase)
def update_phase(phase_id: int, phase: schemas.PhaseUpdate, db: Session = Depends(get_db)):
    db_phase = db.query(models.Phase).filter(models.Phase.phase_id == phase_id, models.Phase.archived == False).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Phase not found")

    for key, value in phase.dict(exclude_unset=True).items():
        setattr(db_phase, key, value)

    if phase.archived is True:
        tasks_list = db.query(models.Task).filter(models.Task.phase_id == phase_id).all()
        for t in tasks_list:
            t.archived = True

    db.commit()
    db.refresh(db_phase)
    return db_phase

# --- Groups Endpoints ---
@app.get("/db/groups", response_model=list[schemas.Group])
def get_groups(board_id: int, db: Session = Depends(get_db)):
    return db.query(models.Group).filter(models.Group.board_id == board_id).all()

@app.post("/db/groups", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = models.Group(**group.dict())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@app.patch("/db/groups/{group_id}", response_model=schemas.Group)
def update_group(group_id: int, group: schemas.GroupUpdate, db: Session = Depends(get_db)):
    db_group = db.query(models.Group).filter(models.Group.group_id == group_id, models.Group.archived == False).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Group not found")

    for key, value in group.dict(exclude_unset=True).items():
        setattr(db_group, key, value)

    if group.archived is True:
        tasks_list = db.query(models.Task).filter(models.Task.group_id == group_id).all()
        for t in tasks_list:
            t.archived = True

    db.commit()
    db.refresh(db_group)
    return db_group

# --- Tasks Endpoints ---
@app.get("/db/tasks", response_model=list[schemas.Task])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@app.post("/db/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id, models.Task.archived == False).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task.dict(exclude_unset=True).items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)
    return db_task

# --- Items Endpoints ---
@app.get("/db/items", response_model=list[schemas.Item])
def get_items(board_id: int, db: Session = Depends(get_db)):
    return db.query(models.Item).filter(models.Item.board_id == board_id).all()

@app.post("/db/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.patch("/db/items/{item_id}", response_model=schemas.Item)
def update_item(item_id: int, item: schemas.ItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.item_id == item_id, models.Item.archived == False).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    for key, value in item.dict(exclude_unset=True).items():
        setattr(db_item, key, value)

    db.commit()
    db.refresh(db_item)
    return db_item