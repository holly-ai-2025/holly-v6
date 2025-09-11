from sqlalchemy import Column, Integer, String, Text, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(Date, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    status = Column(String, default="Todo")
    priority = Column(String, default="Medium")
    category = Column(String, nullable=True)

    board_id = Column(Integer, ForeignKey("boards.board_id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"), nullable=True)
    phase_id = Column(Integer, ForeignKey("phases.phase_id"), nullable=True)
    group_id = Column(Integer, ForeignKey("groups.group_id"), nullable=True)

    parent_task_id = Column(Integer, ForeignKey("tasks.task_id"), nullable=True)
    token_value = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    urgency_score = Column(Integer, nullable=True)
    effort_level = Column(String, nullable=True)

    archived = Column(Boolean, default=False)
    pinned = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# --- Boards ---
class Board(Base):
    __tablename__ = "boards"

    board_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # 'project' or 'list'
    category = Column(String, nullable=True)  # 'work', 'home', 'social'
    color = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# --- Groups ---
class Group(Base):
    __tablename__ = "groups"

    group_id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.board_id"), nullable=False)
    name = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)

# --- Items ---
class Item(Base):
    __tablename__ = "items"

    item_id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.board_id"), nullable=False)
    group_id = Column(Integer, ForeignKey("groups.group_id"), nullable=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# --- Projects ---
class Project(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.board_id"), nullable=False)
    name = Column(String, nullable=False)
    goal = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    deadline = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# --- Phases ---
class Phase(Base):
    __tablename__ = "phases"

    phase_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"), nullable=False)
    name = Column(String, nullable=False)
    deadline = Column(Date, nullable=True)
    depends_on_previous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)