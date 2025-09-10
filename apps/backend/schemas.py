from datetime import date, datetime
from typing import Optional
from enum import Enum
from pydantic import BaseModel

# --- ENUMS ---
class StatusEnum(str, Enum):
    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    DONE = "Done"
    PINNED = "Pinned"

class PriorityEnum(str, Enum):
    TINY = "Tiny"
    SMALL = "Small"
    MEDIUM = "Medium"
    BIG = "Big"

# --- TASKS ---
class TaskBase(BaseModel):
    task_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StatusEnum] = StatusEnum.TODO
    priority: Optional[PriorityEnum] = None
    category: Optional[str] = None
    board_id: Optional[int] = None
    project_id: Optional[int] = None
    phase_id: Optional[int] = None
    parent_task_id: Optional[int] = None
    notes: Optional[str] = None
    token_value: Optional[int] = 0
    urgency_score: Optional[int] = 0
    effort_level: Optional[str] = None
    due_date: Optional[date] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    task_name: str

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    task_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# --- PROJECTS ---
class Project(BaseModel):
    project_id: int
    name: str

    class Config:
        orm_mode = True

# --- BOARDS ---
class Board(BaseModel):
    board_id: int
    name: str

    class Config:
        orm_mode = True

# --- TAGS ---
class Tag(BaseModel):
    tag_id: int
    name: str

    class Config:
        orm_mode = True

# --- REFLECTIONS ---
class Reflection(BaseModel):
    reflection_id: int
    content: str
    created_at: datetime

    class Config:
        orm_mode = True

# --- ATTACHMENTS ---
class Attachment(BaseModel):
    attachment_id: int
    file_name: str
    url: str

    class Config:
        orm_mode = True

# --- LINKS ---
class Link(BaseModel):
    link_id: int
    url: str
    description: Optional[str]

    class Config:
        orm_mode = True