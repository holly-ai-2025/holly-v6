from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from apps.backend.database import Base

class Board(Base):
    __tablename__ = "boards"

    board_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String)
    goal = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="board")
    tasks = relationship("Task", back_populates="board")

class Project(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    notes = Column(Text)
    goal = Column(Text)
    board_id = Column(Integer, ForeignKey("boards.board_id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    board = relationship("Board", back_populates="projects")
    phases = relationship("Phase", back_populates="project")
    tasks = relationship("Task", back_populates="project")

class Phase(Base):
    __tablename__ = "phases"

    phase_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"))
    name = Column(String, nullable=False)
    deadline = Column(DateTime)

    project = relationship("Project", back_populates="phases")
    tasks = relationship("Task", back_populates="phase")

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String, nullable=False)
    description = Column(Text)
    due_date = Column(Date)  # store as YYYY-MM-DD, display as DDMMYYYY
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String)
    priority = Column(String)
    category = Column(String)
    board_id = Column(Integer, ForeignKey("boards.board_id"))
    project_id = Column(Integer, ForeignKey("projects.project_id"))
    phase_id = Column(Integer, ForeignKey("phases.phase_id"))
    parent_task_id = Column(Integer, ForeignKey("tasks.task_id"))
    token_value = Column(Integer, default=0)
    notes = Column(Text)
    urgency_score = Column(Integer, default=0)
    effort_level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    board = relationship("Board", back_populates="tasks")
    project = relationship("Project", back_populates="tasks")
    phase = relationship("Phase", back_populates="tasks")
    parent_task = relationship("Task", remote_side=[task_id])
    attachments = relationship("Attachment", back_populates="task")
    activities = relationship("TaskActivity", back_populates="task")

class Tag(Base):
    __tablename__ = "tags"

    tag_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class Reflection(Base):
    __tablename__ = "reflections"

    reflection_id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    mood = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Attachment(Base):
    __tablename__ = "attachments"

    attachment_id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.task_id"))
    file_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="attachments")

class TaskActivity(Base):
    __tablename__ = "task_activity"

    activity_id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.task_id"))
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="activities")