from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskBase(BaseModel):
    task_name: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None   # ✅ store/serialize as date
    start_date: Optional[datetime] = None  # ✅ store/serialize as datetime
    end_date: Optional[datetime] = None    # ✅ store/serialize as datetime
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