from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

# -------------------- TASKS --------------------
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None  # ✅ unified on due_date
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None

class TaskCreate(TaskBase):
    phase_id: Optional[int] = None
    board_id: Optional[int] = None
    group_id: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    archived: Optional[bool] = None

class Task(TaskBase):
    task_id: int
    board_id: Optional[int] = None
    phase_id: Optional[int] = None
    group_id: Optional[int] = None
    archived: Optional[bool] = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# -------------------- BOARDS --------------------
class BoardBase(BaseModel):
    name: str
    board_type: str
    category: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    pinned: Optional[bool] = False

class BoardCreate(BoardBase):
    pass

class BoardUpdate(BaseModel):
    name: Optional[str] = None
    board_type: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    pinned: Optional[bool] = None
    archived: Optional[bool] = None

class Board(BoardBase):
    board_id: int
    archived: Optional[bool] = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# -------------------- PHASES --------------------
class PhaseBase(BaseModel):
    name: str
    board_id: int

class PhaseCreate(PhaseBase):
    pass

class PhaseUpdate(BaseModel):
    name: Optional[str] = None
    archived: Optional[bool] = None

class Phase(PhaseBase):
    phase_id: int
    archived: Optional[bool] = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# -------------------- GROUPS --------------------
class GroupBase(BaseModel):
    name: str
    board_id: int

class GroupCreate(GroupBase):
    pass

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    archived: Optional[bool] = None

class Group(GroupBase):
    group_id: int
    archived: Optional[bool] = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# -------------------- ITEMS --------------------
class ItemBase(BaseModel):
    name: str
    board_id: int
    group_id: int
    description: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    archived: Optional[bool] = None

class Item(ItemBase):
    item_id: int
    archived: Optional[bool] = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# -------------------- ACTIVITY LOG --------------------
class ActivityLog(BaseModel):
    log_id: int
    entity_type: str
    entity_id: int
    action: str
    payload: Optional[str] = None
    created_at: datetime
    archived: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)