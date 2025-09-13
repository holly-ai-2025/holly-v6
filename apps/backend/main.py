import logging
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine, SessionLocal

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

# Dev CORS: allow everything (safe for dev, not prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.DEBUG)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------- TASKS --------------------
@app.get("/db/tasks", response_model=list[schemas.Task])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@app.post("/db/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump(exclude_unset=True, exclude_none=True))
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for k, v in task.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(db_task, k, v)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/db/tasks/{task_id}", response_model=dict)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"ok": True}

# -------------------- BOARDS --------------------
@app.get("/db/boards", response_model=list[schemas.Board])
def get_boards(db: Session = Depends(get_db)):
    return db.query(models.Board).all()

@app.post("/db/boards", response_model=schemas.Board)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    db_board = models.Board(**board.model_dump(exclude_unset=True, exclude_none=True))
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

@app.patch("/db/boards/{board_id}", response_model=schemas.Board)
def update_board(board_id: int, board: schemas.BoardUpdate, db: Session = Depends(get_db)):
    db_board = db.query(models.Board).filter(models.Board.board_id == board_id).first()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    for k, v in board.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(db_board, k, v)
    db.commit()
    db.refresh(db_board)
    return db_board

@app.delete("/db/boards/{board_id}", response_model=dict)
def delete_board(board_id: int, db: Session = Depends(get_db)):
    db_board = db.query(models.Board).filter(models.Board.board_id == board_id).first()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    db.delete(db_board)
    db.commit()
    return {"ok": True}

# -------------------- PROJECTS --------------------
@app.get("/db/projects", response_model=list[schemas.Project])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.post("/db/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(**project.model_dump(exclude_unset=True, exclude_none=True))
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.patch("/db/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.project_id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for k, v in project.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(db_project, k, v)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/db/projects/{project_id}", response_model=dict)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.project_id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"ok": True}

# -------------------- PHASES --------------------
@app.get("/db/phases", response_model=list[schemas.Phase])
def get_phases(db: Session = Depends(get_db)):
    return db.query(models.Phase).all()

@app.post("/db/phases", response_model=schemas.Phase)
def create_phase(phase: schemas.PhaseCreate, db: Session = Depends(get_db)):
    db_phase = models.Phase(**phase.model_dump(exclude_unset=True, exclude_none=True))
    db.add(db_phase)
    db.commit()
    db.refresh(db_phase)
    return db_phase

@app.patch("/db/phases/{phase_id}", response_model=schemas.Phase)
def update_phase(phase_id: int, phase: schemas.PhaseUpdate, db: Session = Depends(get_db)):
    db_phase = db.query(models.Phase).filter(models.Phase.phase_id == phase_id).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Phase not found")
    for k, v in phase.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(db_phase, k, v)
    db.commit()
    db.refresh(db_phase)
    return db_phase

@app.delete("/db/phases/{phase_id}", response_model=dict)
def delete_phase(phase_id: int, db: Session = Depends(get_db)):
    db_phase = db.query(models.Phase).filter(models.Phase.phase_id == phase_id).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Phase not found")
    db.delete(db_phase)
    db.commit()
    return {"ok": True}

# -------------------- GROUPS --------------------
@app.get("/db/groups", response_model=list[schemas.Group])
def get_groups(db: Session = Depends(get_db)):
    return db.query(models.Group).all()

@app.post("/db/groups", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = models.Group(**group.model_dump(exclude_unset=True, exclude_none=True))
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@app.patch("/db/groups/{group_id}", response_model=schemas.Group)
def update_group(group_id: int, group: schemas.GroupUpdate, db: Session = Depends(get_db)):
    db_group = db.query(models.Group).filter(models.Group.group_id == group_id).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Group not found")
    for k, v in group.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(db_group, k, v)
    db.commit()
    db.refresh(db_group)
    return db_group

@app.delete("/db/groups/{group_id}", response_model=dict)
def delete_group(group_id: int, db: Session = Depends(get_db)):
    db_group = db.query(models.Group).filter(models.Group.group_id == group_id).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Group not found")
    db.delete(db_group)
    db.commit()
    return {"ok": True}

# -------------------- ITEMS --------------------
@app.get("/db/items", response_model=list[schemas.Item])
def get_items(db: Session = Depends(get_db)):
    return db.query(models.Item).all()

@app.post("/db/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.model_dump(exclude_unset=True, exclude_none=True))
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.patch("/db/items/{item_id}", response_model=schemas.Item)
def update_item(item_id: int, item: schemas.ItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.item_id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    for k, v in item.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(db_item, k, v)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/db/items/{item_id}", response_model=dict)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.item_id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"ok": True}