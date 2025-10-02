from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Board(Base):
    __tablename__ = "boards"

    board_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    board_type = Column(String, nullable=False)
    category = Column(String, nullable=True)
    color = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    pinned = Column(Boolean, default=False)
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    phases = relationship("Phase", back_populates="board", cascade="all, delete")
    groups = relationship("Group", back_populates="board", cascade="all, delete")
    tasks = relationship("Task", back_populates="board", cascade="all, delete")
    items = relationship("Item", back_populates="board", cascade="all, delete")

class Phase(Base):
    __tablename__ = "phases"

    phase_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    board_id = Column(Integer, ForeignKey("boards.board_id", ondelete="CASCADE"))
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    board = relationship("Board", back_populates="phases")
    tasks = relationship("Task", back_populates="phase", cascade="all, delete")

class Group(Base):
    __tablename__ = "groups"

    group_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    board_id = Column(Integer, ForeignKey("boards.board_id", ondelete="CASCADE"))
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    board = relationship("Board", back_populates="groups")
    items = relationship("Item", back_populates="group", cascade="all, delete")
    tasks = relationship("Task", back_populates="group", cascade="all, delete")

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.board_id", ondelete="CASCADE"), nullable=True)
    phase_id = Column(Integer, ForeignKey("phases.phase_id", ondelete="CASCADE"), nullable=True)
    group_id = Column(Integer, ForeignKey("groups.group_id", ondelete="CASCADE"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)  # ✅ renamed from end_date
    status = Column(String, nullable=True)
    priority = Column(String, nullable=True)
    category = Column(String, nullable=True)
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    board = relationship("Board", back_populates="tasks")
    phase = relationship("Phase", back_populates="tasks")
    group = relationship("Group", back_populates="tasks")

class Item(Base):
    __tablename__ = "items"

    item_id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.board_id", ondelete="CASCADE"))
    group_id = Column(Integer, ForeignKey("groups.group_id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    board = relationship("Board", back_populates="items")
    group = relationship("Group", back_populates="items")

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String, nullable=False)
    entity_id = Column(Integer, nullable=False)
    action = Column(String, nullable=False)
    payload = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    archived = Column(Boolean, default=False)