from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from .database import Base


class Board(Base):
    __tablename__ = "boards"

    board_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    board_type = Column(String, nullable=False)  # renamed from type
    category = Column(String, nullable=True)
    color = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    pinned = Column(Boolean, default=False)
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    phases = relationship("Phase", back_populates="board", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="board", cascade="all, delete-orphan")


class Phase(Base):
    __tablename__ = "phases"

    phase_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    deadline = Column(Date, nullable=True)
    depends_on_previous = Column(Boolean, default=False)
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    board_id = Column(Integer, ForeignKey("boards.board_id", ondelete="CASCADE"), nullable=False)
    board = relationship("Board", back_populates="phases")

    tasks = relationship("Task", back_populates="phase", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    deadline = Column(Date, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    status = Column(String, nullable=True)
    priority = Column(String, nullable=True)
    category = Column(String, nullable=True)
    token_value = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    urgency_score = Column(Integer, nullable=True)
    effort_level = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    pinned = Column(Boolean, default=False)
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    board_id = Column(Integer, ForeignKey("boards.board_id"), nullable=True)
    phase_id = Column(Integer, ForeignKey("phases.phase_id", ondelete="CASCADE"), nullable=True)
    group_id = Column(Integer, ForeignKey("groups.group_id"), nullable=True)
    parent_task_id = Column(Integer, ForeignKey("tasks.task_id"), nullable=True)

    board = relationship("Board", back_populates="tasks")
    phase = relationship("Phase", back_populates="tasks")
    parent_task = relationship("Task", remote_side=[task_id])