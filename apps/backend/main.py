from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas, database
from datetime import datetime
import json, logging, os, sys

app = FastAPI()

# Setup logging with absolute path and flush
log_dir = os.path.abspath("logs")
os.makedirs(log_dir, exist_ok=True)
debug_log_path = os.path.join(log_dir, "debug.log")

logger = logging.getLogger("activity_debug")
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler(debug_log_path, mode="a", encoding="utf-8")
file_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Ensure immediate flushing
class FlushFileHandler(logging.FileHandler):
    def emit(self, record):
        super().emit(record)
        self.flush()

logger.handlers.clear()
logger.addHandler(FlushFileHandler(debug_log_path, mode="a", encoding="utf-8"))

# CORS setup to allow frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        payload={},
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

    prev_state = {}
    for column in db_task.__table__.columns:
        val = getattr(db_task, column.name)
        prev_state[column.name] = val.isoformat() if isinstance(val, datetime) else val

    logger.debug(f"prev_state before update: {json.dumps(prev_state, default=str)}")

    serialized_state = json.loads(json.dumps(prev_state, default=str))

    incoming_data = task.model_dump(exclude_unset=True)
    action_type = "update"
    if "archived" in incoming_data and incoming_data["archived"] is True and db_task.archived is False:
        action_type = "delete"

    log_entry = models.ActivityLog(
        entity_type="task",
        entity_id=db_task.task_id,
        action=action_type,
        payload=serialized_state,
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
        payload={},
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
        payload=incoming_data,
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)

    for k, v in incoming_data.items():
        setattr(db_board, k, v)
    db.commit()
    db.refresh(db_board)

    return db_board

# -------------------- PROJECTS --------------------
@app.get("/db/projects", response_model=list[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Project).filter(models.Project.archived == False).offset(skip).limit(limit).all()

@app.post("/db/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    log_entry = models.ActivityLog(
        entity_type="project",
        entity_id=db_project.project_id,
        action="create",
        payload={},
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)
    db.commit()

    return db_project

@app.patch("/db/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.project_id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    incoming_data = project.model_dump(exclude_unset=True)
    action_type = "update"
    if "archived" in incoming_data and incoming_data["archived"] is True and db_project.archived is False:
        action_type = "delete"

    log_entry = models.ActivityLog(
        entity_type="project",
        entity_id=db_project.project_id,
        action=action_type,
        payload=incoming_data,
        created_at=datetime.utcnow(),
    )
    db.add(log_entry)

    for k, v in incoming_data.items():
        setattr(db_project, k, v)
    db.commit()
    db.refresh(db_project)

    return db_project

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
        payload={},
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
        payload=incoming_data,
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
        payload={},
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
        payload=incoming_data,
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
        payload={},
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
        payload=incoming_data,
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

    if log_entry.entity_type == "task":
        task = db.query(models.Task).filter(models.Task.task_id == log_entry.entity_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Entity not found")
        for k, v in log_entry.payload.items():
            setattr(task, k, v)
        db.commit()
        db.refresh(task)

        undo_log = models.ActivityLog(
            entity_type="task",
            entity_id=task.task_id,
            action="undo",
            payload=log_entry.payload,
            created_at=datetime.utcnow(),
        )
        db.add(undo_log)
        db.commit()

    return log_entry