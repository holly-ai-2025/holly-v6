from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from apps.backend import models, schemas
from apps.backend.database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Middleware for CORS - allow all origins, disable credentials (Safari compatible)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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

# -------------------- TASKS --------------------
@app.get("/db/tasks", response_model=list[schemas.Task])
def read_tasks():
    with SessionLocal() as db:
        return db.query(models.Task).filter(models.Task.archived == False).all()

@app.post("/db/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate):
    with SessionLocal() as db:
        db_task = models.Task(**task.model_dump())
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

@app.patch("/db/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate):
    with SessionLocal() as db:
        db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")
        for var, value in vars(task).items():
            if value is not None:
                setattr(db_task, var, value)
        db.commit()
        db.refresh(db_task)
        return db_task

# -------------------- BOARDS --------------------
@app.get("/db/boards", response_model=list[schemas.Board])
def read_boards():
    with SessionLocal() as db:
        return db.query(models.Board).filter(models.Board.archived == False).all()

@app.post("/db/boards", response_model=schemas.Board)
def create_board(board: schemas.BoardCreate):
    with SessionLocal() as db:
        data = board.model_dump(exclude_unset=True)
        allowed_keys = {c.name for c in models.Board.__table__.columns}
        clean_data = {k: v for k, v in data.items() if k in allowed_keys}
        db_board = models.Board(**clean_data)
        db.add(db_board)
        db.commit()
        db.refresh(db_board)
        return db_board

@app.patch("/db/boards/{board_id}", response_model=schemas.Board)
def update_board(board_id: int, board: schemas.BoardUpdate):
    with SessionLocal() as db:
        db_board = db.query(models.Board).filter(models.Board.board_id == board_id).first()
        if not db_board:
            raise HTTPException(status_code=404, detail="Board not found")

        # Apply incoming updates
        for var, value in vars(board).items():
            if value is not None:
                setattr(db_board, var, value)

        # Cascade soft delete if board is archived
        if board.archived is True:
            phases = db.query(models.Phase).filter(models.Phase.board_id == board_id).all()
            for phase in phases:
                phase.archived = True
                tasks = db.query(models.Task).filter(models.Task.phase_id == phase.phase_id).all()
                for task in tasks:
                    task.archived = True

            # Also archive any tasks directly under the board (not tied to a phase)
            tasks = db.query(models.Task).filter(models.Task.board_id == board_id).all()
            for task in tasks:
                task.archived = True

        db.commit()
        db.refresh(db_board)
        return db_board

# -------------------- PROJECTS --------------------
@app.get("/db/projects", response_model=list[schemas.Project])
def read_projects():
    with SessionLocal() as db:
        return db.query(models.Project).filter(models.Project.archived == False).all()

@app.post("/db/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate):
    with SessionLocal() as db:
        db_project = models.Project(**project.model_dump())
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

@app.patch("/db/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate):
    with SessionLocal() as db:
        db_project = db.query(models.Project).filter(models.Project.project_id == project_id).first()
        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")
        for var, value in vars(project).items():
            if value is not None:
                setattr(db_project, var, value)
        db.commit()
        db.refresh(db_project)
        return db_project

# -------------------- PHASES --------------------
@app.get("/db/phases", response_model=list[schemas.Phase])
def read_phases():
    with SessionLocal() as db:
        return db.query(models.Phase).filter(models.Phase.archived == False).all()

@app.post("/db/phases", response_model=schemas.Phase)
def create_phase(phase: schemas.PhaseCreate):
    with SessionLocal() as db:
        db_phase = models.Phase(**phase.model_dump())
        db.add(db_phase)
        db.commit()
        db.refresh(db_phase)
        return db_phase

@app.patch("/db/phases/{phase_id}", response_model=schemas.Phase)
def update_phase(phase_id: int, phase: schemas.PhaseUpdate):
    with SessionLocal() as db:
        db_phase = db.query(models.Phase).filter(models.Phase.phase_id == phase_id).first()
        if not db_phase:
            raise HTTPException(status_code=404, detail="Phase not found")
        for var, value in vars(phase).items():
            if value is not None:
                setattr(db_phase, var, value)
        db.commit()
        db.refresh(db_phase)
        return db_phase

# -------------------- GROUPS --------------------
@app.get("/db/groups", response_model=list[schemas.Group])
def read_groups():
    with SessionLocal() as db:
        return db.query(models.Group).filter(models.Group.archived == False).all()

@app.post("/db/groups", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate):
    with SessionLocal() as db:
        db_group = models.Group(**group.model_dump())
        db.add(db_group)
        db.commit()
        db.refresh(db_group)
        return db_group

@app.patch("/db/groups/{group_id}", response_model=schemas.Group)
def update_group(group_id: int, group: schemas.GroupUpdate):
    with SessionLocal() as db:
        db_group = db.query(models.Group).filter(models.Group.group_id == group_id).first()
        if not db_group:
            raise HTTPException(status_code=404, detail="Group not found")
        for var, value in vars(group).items():
            if value is not None:
                setattr(db_group, var, value)
        db.commit()
        db.refresh(db_group)
        return db_group

# -------------------- ITEMS --------------------
@app.get("/db/items", response_model=list[schemas.Item])
def read_items():
    with SessionLocal() as db:
        return db.query(models.Item).filter(models.Item.archived == False).all()

@app.post("/db/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate):
    with SessionLocal() as db:
        db_item = models.Item(**item.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

@app.patch("/db/items/{item_id}", response_model=schemas.Item)
def update_item(item_id: int, item: schemas.ItemUpdate):
    with SessionLocal() as db:
        db_item = db.query(models.Item).filter(models.Item.item_id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Item not found")
        for var, value in vars(item).items():
            if value is not None:
                setattr(db_item, var, value)
        db.commit()
        db.refresh(db_item)
        return db_item

# -------------------- ACTIVITY LOG --------------------
@app.get("/db/activity", response_model=list[schemas.ActivityLog])
def read_activity():
    with SessionLocal() as db:
        return db.query(models.ActivityLog).filter(models.ActivityLog.archived == False).all()

@app.post("/db/activity/undo/{log_id}", response_model=schemas.ActivityLog)
def undo_activity(log_id: int):
    with SessionLocal() as db:
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
                created_at=models.datetime.utcnow(),
            )
            db.add(undo_log)
            db.commit()
        return log_entry