from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel

class TaskBase(BaseModel):
    task_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    project_id: Optional[int] = None
    notes: Optional[str] = None
    token_value: Optional[int] = None
    urgency_score: Optional[int] = None
    effort_level: Optional[str] = None
    board_id: Optional[int] = None
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