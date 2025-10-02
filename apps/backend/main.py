from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas, database
from datetime import datetime
import json, logging, os

app = FastAPI()

# Setup logging
log_dir = os.path.abspath("logs")
os.makedirs(log_dir, exist_ok=True)

# ✅ CORS configuration
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
    return db.query(models.Task).filter(models.Task.archived == False).offset(skip).limit(limit).all()

@app.post("/db/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    log_entry = models.ActivityLog(
        entity_type="task",
        entity_id=db_task.task_id,
        action="create",
        payload=json.dumps({}, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)
    db.commit()

    return db_task

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    incoming_data = task.model_dump(exclude_unset=True)
    action_type = "update"
    if "archived" in incoming_data and incoming_data["archived"] is True and db_task.archived is False:
        action_type = "delete"

    log_entry = models.ActivityLog(
        entity_type="task",
        entity_id=db_task.task_id,
        action=action_type,
        payload=json.dumps(incoming_data, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)

    for k, v in incoming_data.items():
        setattr(db_task, k, v)
    db.commit()
    db.refresh(db_task)

    return db_task

# -------------------- BOARDS --------------------
@app.get("/db/boards", response_model=list[schemas.Board])
def read_boards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Board).filter(models.Board.archived == False).offset(skip).limit(limit).all()

@app.post("/db/boards", response_model=schemas.Board)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    data = board.model_dump(exclude_unset=True)
    allowed_keys = {c.name for c in models.Board.__table__.columns}
    clean_data = {k: v for k, v in data.items() if k in allowed_keys}
    db_board = models.Board(**clean_data)
    db.add(db_board)
    db.commit()
    db.refresh(db_board)

    log_entry = models.ActivityLog(
        entity_type="board",
        entity_id=db_board.board_id,
        action="create",
        payload=json.dumps({}, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)
    db.commit()

    return db_board

@app.patch("/db/boards/{board_id}", response_model=schemas.Board)
def update_board(board_id: int, board: schemas.BoardUpdate, db: Session = Depends(get_db)):
    db_board = db.query(models.Board).filter(models.Board.board_id == board_id).first()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")

    incoming_data = board.model_dump(exclude_unset=True)
    action_type = "update"
    if "archived" in incoming_data and incoming_data["archived"] is True and db_board.archived is False:
        action_type = "delete"

    log_entry = models.ActivityLog(
        entity_type="board",
        entity_id=db_board.board_id,
        action=action_type,
        payload=json.dumps(incoming_data, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)

    for k, v in incoming_data.items():
        setattr(db_board, k, v)
    db.commit()
    db.refresh(db_board)

    return db_board

# -------------------- PHASES --------------------
@app.get("/db/phases", response_model=list[schemas.Phase])
def read_phases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Phase).filter(models.Phase.archived == False).offset(skip).limit(limit).all()

@app.post("/db/phases", response_model=schemas.Phase)
def create_phase(phase: schemas.PhaseCreate, db: Session = Depends(get_db)):
    db_phase = models.Phase(**phase.model_dump())
    db.add(db_phase)
    db.commit()
    db.refresh(db_phase)

    log_entry = models.ActivityLog(
        entity_type="phase",
        entity_id=db_phase.phase_id,
        action="create",
        payload=json.dumps({}, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)
    db.commit()

    return db_phase

@app.patch("/db/phases/{phase_id}", response_model=schemas.Phase)
def update_phase(phase_id: int, phase: schemas.PhaseUpdate, db: Session = Depends(get_db)):
    db_phase = db.query(models.Phase).filter(models.Phase.phase_id == phase_id).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Phase not found")

    incoming_data = phase.model_dump(exclude_unset=True)
    action_type = "update"
    if "archived" in incoming_data and incoming_data["archived"] is True and db_phase.archived is False:
        action_type = "delete"

    log_entry = models.ActivityLog(
        entity_type="phase",
        entity_id=db_phase.phase_id,
        action=action_type,
        payload=json.dumps(incoming_data, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)

    for k, v in incoming_data.items():
        setattr(db_phase, k, v)
    db.commit()
    db.refresh(db_phase)

    return db_phase

# -------------------- GROUPS --------------------
@app.get("/db/groups", response_model=list[schemas.Group])
def read_groups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Group).filter(models.Group.archived == False).offset(skip).limit(limit).all()

@app.post("/db/groups", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = models.Group(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)

    log_entry = models.ActivityLog(
        entity_type="group",
        entity_id=db_group.group_id,
        action="create",
        payload=json.dumps({}, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)
    db.commit()

    return db_group

@app.patch("/db/groups/{group_id}", response_model=schemas.Group)
def update_group(group_id: int, group: schemas.GroupUpdate, db: Session = Depends(get_db)):
    db_group = db.query(models.Group).filter(models.Group.group_id == group_id).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Group not found")

    incoming_data = group.model_dump(exclude_unset=True)
    action_type = "update"
    if "archived" in incoming_data and incoming_data["archived"] is True and db_group.archived is False:
        action_type = "delete"

    log_entry = models.ActivityLog(
        entity_type="group",
        entity_id=db_group.group_id,
        action=action_type,
        payload=json.dumps(incoming_data, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)

    for k, v in incoming_data.items():
        setattr(db_group, k, v)
    db.commit()
    db.refresh(db_group)

    return db_group

# -------------------- ITEMS --------------------
@app.get("/db/items", response_model=list[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Item).filter(models.Item.archived == False).offset(skip).limit(limit).all()

@app.post("/db/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    log_entry = models.ActivityLog(
        entity_type="item",
        entity_id=db_item.item_id,
        action="create",
        payload=json.dumps({}, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)
    db.commit()

    return db_item

@app.patch("/db/items/{item_id}", response_model=schemas.Item)
def update_item(item_id: int, item: schemas.ItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.item_id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    incoming_data = item.model_dump(exclude_unset=True)
    action_type = "update"
    if "archived" in incoming_data and incoming_data["archived"] is True and db_item.archived is False:
        action_type = "delete"

    log_entry = models.ActivityLog(
        entity_type="item",
        entity_id=db_item.item_id,
        action=action_type,
        payload=json.dumps(incoming_data, default=str),
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)

    for k, v in incoming_data.items():
        setattr(db_item, k, v)
    db.commit()
    db.refresh(db_item)

    return db_item

# -------------------- ACTIVITY LOG --------------------
@app.get("/db/activity", response_model=list[schemas.ActivityLog])
def read_activity(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.ActivityLog).filter(models.ActivityLog.archived == False).order_by(desc(models.ActivityLog.created_at)).offset(skip).limit(limit).all()

@app.post("/db/activity/undo/{log_id}", response_model=schemas.ActivityLog)
def undo_activity(log_id: int, db: Session = Depends(get_db)):
    log_entry = db.query(models.ActivityLog).filter(models.ActivityLog.log_id == log_id).first()
    if not log_entry:
        raise HTTPException(status_code=404, detail="Activity log not found")

    payload_data = {}
    try:
        payload_data = json.loads(log_entry.payload)
    except Exception:
        pass

    if log_entry.entity_type == "task":
        task = db.query(models.Task).filter(models.Task.task_id == log_entry.entity_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Entity not found")
        for k, v in payload_data.items():
            setattr(task, k, v)
        db.commit()
        db.refresh(task)

        undo_log = models.ActivityLog(
            entity_type="task",
            entity_id=task.task_id,
            action="undo",
            payload=json.dumps(payload_data, default=str),
            created_at=datetime.utcnow(),
        )
        db.add(undo_log)
        db.commit()

    return log_entry