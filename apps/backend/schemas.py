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
    completed: bool = False
    archived: bool = False


class TaskCreate(TaskBase):
    phase_id: int


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[date] = None
    completed: Optional[bool] = None
    archived: Optional[bool] = None
    phase_id: Optional[int] = None


class Task(TaskBase):
    task_id: int
    phase_id: int
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
# Board Schemas
# -----------------------------

class BoardBase(BaseModel):
    name: str
    board_type: str  # must be 'list' or 'project'
    archived: bool = False


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BaseModel):
    name: Optional[str] = None
    board_type: Optional[str] = None
    archived: Optional[bool] = None


class Board(BoardBase):
    board_id: int
    created_at: datetime
    updated_at: datetime
    phases: List[Phase] = []

    model_config = ConfigDict(from_attributes=True)