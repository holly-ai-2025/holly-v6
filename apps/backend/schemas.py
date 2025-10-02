from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, datetime

# -----------------------------
# Task Schemas
# -----------------------------

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[date] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    token_value: Optional[int] = None
    notes: Optional[str] = None
    urgency_score: Optional[int] = None
    effort_level: Optional[str] = None
    completed: bool = False
    pinned: bool = False
    archived: bool = False


class TaskCreate(TaskBase):
    board_id: Optional[int] = None
    phase_id: Optional[int] = None
    group_id: Optional[int] = None
    parent_task_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[date] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    token_value: Optional[int] = None
    notes: Optional[str] = None
    urgency_score: Optional[int] = None
    effort_level: Optional[str] = None
    completed: Optional[bool] = None
    pinned: Optional[bool] = None
    archived: Optional[bool] = None
    board_id: Optional[int] = None
    phase_id: Optional[int] = None
    group_id: Optional[int] = None
    parent_task_id: Optional[int] = None


class Task(TaskBase):
    task_id: int
    board_id: Optional[int] = None
    phase_id: Optional[int] = None
    group_id: Optional[int] = None
    parent_task_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------
# Phase Schemas
# -----------------------------

class PhaseBase(BaseModel):
    name: str
    deadline: Optional[date] = None
    depends_on_previous: bool = False
    archived: bool = False


class PhaseCreate(PhaseBase):
    board_id: int


class PhaseUpdate(BaseModel):
    name: Optional[str] = None
    deadline: Optional[date] = None
    depends_on_previous: Optional[bool] = None
    archived: Optional[bool] = None
    board_id: Optional[int] = None


class Phase(PhaseBase):
    phase_id: int
    board_id: int
    created_at: datetime
    updated_at: datetime
    tasks: List[Task] = []

    model_config = ConfigDict(from_attributes=True)


# -----------------------------
# Group Schemas
# -----------------------------

class GroupBase(BaseModel):
    name: str
    archived: bool = False


class GroupCreate(GroupBase):
    board_id: int


class GroupUpdate(BaseModel):
    name: Optional[str] = None
    archived: Optional[bool] = None
    board_id: Optional[int] = None


class Group(GroupBase):
    group_id: int
    board_id: int
    created_at: datetime
    updated_at: datetime
    tasks: List[Task] = []

    model_config = ConfigDict(from_attributes=True)


# -----------------------------
# Board Schemas
# -----------------------------

class BoardBase(BaseModel):
    name: str
    board_type: str  # must be 'list' or 'project'
    category: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    pinned: bool = False
    archived: bool = False


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
    created_at: datetime
    updated_at: datetime
    phases: List[Phase] = []
    groups: List[Group] = []
    tasks: List[Task] = []

    model_config = ConfigDict(from_attributes=True)