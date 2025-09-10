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
    due_date: Optional[str] = None  # DDMMYYYY format
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
        from_attributes = True

# --- PROJECTS ---
class Project(BaseModel):
    project_id: int
    name: str
    notes: Optional[str]
    goal: Optional[str]
    board_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

# --- BOARDS ---
class Board(BaseModel):
    board_id: int
    name: str
    type: Optional[str]
    goal: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# --- PHASES ---
class Phase(BaseModel):
    phase_id: int
    project_id: int
    name: str
    deadline: Optional[datetime]

    class Config:
        from_attributes = True

# --- TAGS ---
class Tag(BaseModel):
    tag_id: int
    name: str

    class Config:
        from_attributes = True

# --- REFLECTIONS ---
class Reflection(BaseModel):
    reflection_id: int
    content: str
    mood: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# --- ATTACHMENTS ---
class Attachment(BaseModel):
    attachment_id: int
    task_id: int
    file_path: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

# --- LINKS ---
class Link(BaseModel):
    link_id: int
    url: str
    description: Optional[str]

    class Config:
        from_attributes = True

# --- TASK ACTIVITY ---
class TaskActivity(BaseModel):
    activity_id: int
    task_id: int
    action: str
    timestamp: datetime

    class Config:
        from_attributes = True