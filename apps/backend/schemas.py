from pydantic import BaseModel, field_validator, field_serializer
from typing import Optional
from datetime import date, datetime

# -------------------- TASKS --------------------
class TaskBase(BaseModel):
    task_name: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    project_id: Optional[int] = None
    phase_id: Optional[int] = None
    notes: Optional[str] = None
    token_value: Optional[int] = None
    urgency_score: Optional[int] = None
    effort_level: Optional[str] = None
    board_id: Optional[int] = None
    group_id: Optional[int] = None
    archived: bool = False
    pinned: bool = False

    @field_validator("due_date", mode="before")
    def parse_due_date(cls, v):
        if isinstance(v, str):
            try:
                return date.fromisoformat(v.split("T")[0])
            except Exception:
                raise ValueError(f"Invalid due_date format: {v}")
        return v

    @field_validator("start_date", mode="before")
    def parse_start_date(cls, v):
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v)
            except Exception:
                raise ValueError(f"Invalid start_date format: {v}")
        return v

    @field_validator("end_date", mode="before")
    def parse_end_date(cls, v):
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v)
            except Exception:
                raise ValueError(f"Invalid end_date format: {v}")
        return v

    @field_serializer("due_date")
    def serialize_due_date(self, v: Optional[date]) -> Optional[str]:
        return v.strftime("%Y-%m-%d") if v else None

    @field_serializer("start_date")
    def serialize_start_date(self, v: Optional[datetime]) -> Optional[str]:
        return v.strftime("%Y-%m-%dT%H:%M:%S") if v else None

    @field_serializer("end_date")
    def serialize_end_date(self, v: Optional[datetime]) -> Optional[str]:
        return v.strftime("%Y-%m-%dT%H:%M:%S") if v else None

class TaskCreate(TaskBase):
    task_name: str

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    task_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# -------------------- BOARDS --------------------
class BoardBase(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    goal: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    pinned: Optional[int] = None
    archived: bool = False

class BoardCreate(BoardBase):
    name: str

class BoardUpdate(BoardBase):
    pass

class Board(BoardBase):
    board_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# -------------------- PROJECTS --------------------
class ProjectBase(BaseModel):
    name: Optional[str] = None
    notes: Optional[str] = None
    goal: Optional[str] = None
    board_id: Optional[int] = None
    deadline: Optional[date] = None
    archived: bool = False

    @field_validator("deadline", mode="before")
    def parse_deadline(cls, v):
        if isinstance(v, str):
            try:
                return date.fromisoformat(v.split("T")[0])
            except Exception:
                raise ValueError(f"Invalid deadline format: {v}")
        return v

    @field_serializer("deadline")
    def serialize_deadline(self, v: Optional[date]) -> Optional[str]:
        return v.strftime("%Y-%m-%d") if v else None

class ProjectCreate(ProjectBase):
    name: str

class ProjectUpdate(ProjectBase):
    pass

class Project(ProjectBase):
    project_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# -------------------- PHASES --------------------
class PhaseBase(BaseModel):
    name: Optional[str] = None
    project_id: Optional[int] = None
    deadline: Optional[date] = None
    depends_on_previous: Optional[bool] = None
    archived: bool = False

    @field_validator("deadline", mode="before")
    def parse_deadline(cls, v):
        if isinstance(v, str):
            try:
                return date.fromisoformat(v.split("T")[0])
            except Exception:
                raise ValueError(f"Invalid deadline format: {v}")
        return v

    @field_serializer("deadline")
    def serialize_deadline(self, v: Optional[date]) -> Optional[str]:
        return v.strftime("%Y-%m-%d") if v else None

class PhaseCreate(PhaseBase):
    name: str
    project_id: int

class PhaseUpdate(PhaseBase):
    pass

class Phase(PhaseBase):
    phase_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# -------------------- GROUPS --------------------
class GroupBase(BaseModel):
    name: Optional[str] = None
    board_id: Optional[int] = None
    sort_order: Optional[int] = None
    archived: bool = False

class GroupCreate(GroupBase):
    name: str
    board_id: int

class GroupUpdate(GroupBase):
    pass

class Group(GroupBase):
    group_id: int

    class Config:
        from_attributes = True

# -------------------- ITEMS --------------------
class ItemBase(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    pinned: Optional[int] = None
    board_id: Optional[int] = None
    group_id: Optional[int] = None
    archived: bool = False

class ItemCreate(ItemBase):
    title: str
    board_id: int

class ItemUpdate(ItemBase):
    pass

class Item(ItemBase):
    item_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# -------------------- ACTIVITY LOG --------------------
class ActivityLog(BaseModel):
    log_id: int
    entity_type: str
    entity_id: int
    action: str
    payload: dict   # raw JSON snapshot
    archived: bool = False
    created_at: datetime

    class Config:
        from_attributes = True