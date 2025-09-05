from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(String, primary_key=True, index=True)
    task_name = Column(String, nullable=False)
    description = Column(String)
    due_date = Column(Date)
    status = Column(String)
    priority = Column(String)
    category = Column(String)
    project_id = Column(String, ForeignKey("projects.project_id"))
    phase_id = Column(String, ForeignKey("phases.phase_id"))
    board_id = Column(String, ForeignKey("boards.board_id"))
    parent_task_id = Column(String, ForeignKey("tasks.task_id"))
    token_value = Column(Integer)
    notes = Column(Text)
    urgency_score = Column(Integer, default=0)
    effort_level = Column(String)  # tiny/small/medium/big
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"

    project_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String)
    progress = Column(Integer)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Phase(Base):
    __tablename__ = "phases"

    phase_id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.project_id"), index=True)
    name = Column(String, nullable=False)
    description = Column(String)

class Board(Base):
    __tablename__ = "boards"

    board_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String)  # standard | project
    goal = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class TaskActivity(Base):
    __tablename__ = "task_activity"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, ForeignKey("tasks.task_id"))
    user_id = Column(String, ForeignKey("users.user_id"))
    action = Column(String, nullable=False)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    color = Column(String)

class TaskTag(Base):
    __tablename__ = "task_tags"

    task_id = Column(String, ForeignKey("tasks.task_id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, ForeignKey("tasks.task_id"))
    project_id = Column(String, ForeignKey("projects.project_id"))
    file_name = Column(String)
    file_type = Column(String)
    file_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Link(Base):
    __tablename__ = "links"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, ForeignKey("tasks.task_id"))
    project_id = Column(String, ForeignKey("projects.project_id"))
    url = Column(String, nullable=False)
    title = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    entry = Column(Text)
    mood = Column(String)
    energy_level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    settings = Column(Text)  # JSON string for preferences
    created_at = Column(DateTime, default=datetime.utcnow)
