from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# -------------------- TASKS --------------------
class TaskBase(BaseModel):
    task_name: str
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    archived: Optional[bool] = False
    pinned: Optional[bool] = False
    board_id: Optional[int] = None
    project_id: Optional[int] = None
    phase_id: Optional[int] = None
    group_id: Optional[int] = None
    due_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    effort_level: Optional[str] = None
    token_value: Optional[int] = None
    notes: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    task_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    archived: Optional[bool] = None
    pinned: Optional[bool] = None
    board_id: Optional[int] = None
    project_id: Optional[int] = None
    phase_id: Optional[int] = None
    group_id: Optional[int] = None
    due_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    effort_level: Optional[str] = None
    token_value: Optional[int] = None
    notes: Optional[str] = None

class Task(TaskBase):
    task_id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

# -------------------- BOARDS --------------------
class Board(BaseModel):
    board_id: int
    name: str
    type: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    pinned: Optional[bool] = False

    class Config:
        orm_mode = True

# -------------------- PROJECTS --------------------
class Project(BaseModel):
    project_id: int
    board_id: Optional[int] = None
    name: str
    goal: Optional[str] = None
    notes: Optional[str] = None
    deadline: Optional[datetime] = None

    class Config:
        orm_mode = True

# -------------------- PHASES --------------------
class Phase(BaseModel):
    phase_id: int
    project_id: Optional[int] = None
    name: str
    deadline: Optional[datetime] = None
    depends_on_previous: Optional[bool] = False

    class Config:
        orm_mode = True

# -------------------- ACTIVITY LOG --------------------
class ActivityLog(BaseModel):
    log_id: int
    entity_type: str
    entity_id: int
    action: str
    payload: dict   # raw JSON dict, no stripping
    created_at: datetime

    class Config:
        orm_mode = True