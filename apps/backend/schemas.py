from pydantic import BaseModel
from datetime import date
from typing import Optional


class TaskBase(BaseModel):
    task_name: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    project_id: Optional[int] = None
    phase_id: Optional[int] = None
    parent_task_id: Optional[int] = None
    token_value: Optional[int] = None
    notes: Optional[str] = None
    urgency_score: Optional[int] = None
    effort_level: Optional[str] = None
    board_id: Optional[int] = None

    class Config:
        extra = "forbid"


class TaskCreate(TaskBase):
    task_name: str


class TaskUpdate(TaskBase):
    pass