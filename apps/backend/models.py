from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from apps.backend.database import Base

class Board(Base):
    __tablename__ = "boards"
    board_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=True)
    goal = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    projects = relationship("Project", back_populates="board")
    tasks = relationship("Task", back_populates="board")

class Project(Base):
    __tablename__ = "projects"
    project_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    board_id = Column(Integer, ForeignKey("boards.board_id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    board = relationship("Board", back_populates="projects")
    phases = relationship("Phase", back_populates="project")
    tasks = relationship("Task", back_populates="project")

class Phase(Base):
    __tablename__ = "phases"
    phase_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"))
    name = Column(String, nullable=False)
    deadline = Column(DateTime, nullable=True)
    project = relationship("Project", back_populates="phases")
    tasks = relationship("Task", back_populates="phase")

class Task(Base):
    __tablename__ = "tasks"
    task_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    status = Column(String, default="Todo")
    priority = Column(String, nullable=True)
    category = Column(String, nullable=True)
    board_id = Column(Integer, ForeignKey("boards.board_id"))
    project_id = Column(Integer, ForeignKey("projects.project_id"))
    phase_id = Column(Integer, ForeignKey("phases.phase_id"))
    parent_task_id = Column(Integer, ForeignKey("tasks.task_id"))
    token_value = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    urgency_score = Column(Integer, default=0)
    effort_level = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    board = relationship("Board", back_populates="tasks")
    project = relationship("Project", back_populates="tasks")
    phase = relationship("Phase", back_populates="tasks")
    parent_task = relationship("Task", remote_side=[task_id])

class Tag(Base):
    __tablename__ = "tags"
    tag_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)

class Attachment(Base):
    __tablename__ = "attachments"
    attachment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("tasks.task_id"))
    file_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class Reflection(Base):
    __tablename__ = "reflections"
    reflection_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    content = Column(Text, nullable=False)
    mood = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TaskActivity(Base):
    __tablename__ = "task_activity"
    activity_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("tasks.task_id"))
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)