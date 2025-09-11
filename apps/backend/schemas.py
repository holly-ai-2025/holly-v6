from pydantic import BaseModel, field_validator, field_serializer
from typing import Optional
from datetime import date, datetime

class TaskBase(BaseModel):
    task_name: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None   # stored internally as date
    start_date: Optional[datetime] = None  # stored internally as datetime
    end_date: Optional[datetime] = None    # stored internally as datetime
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

    # --- Validators (input) ---
    @field_validator("due_date", mode="before")
    def parse_due_date(cls, v):
        if isinstance(v, str):
            return date.fromisoformat(v)
        return v

    @field_validator("start_date", mode="before")
    def parse_start_date(cls, v):
        if isinstance(v, str):
            return datetime.fromisoformat(v)
        return v

    @field_validator("end_date", mode="before")
    def parse_end_date(cls, v):
        if isinstance(v, str):
            return datetime.fromisoformat(v)
        return v

    # --- Serializers (output) ---
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