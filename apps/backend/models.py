from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from .database import Base


class Board(Base):
    __tablename__ = "boards"

    board_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    board_type = Column(String, nullable=False)  # must be 'list' or 'project'
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    phases = relationship("Phase", back_populates="board", cascade="all, delete-orphan")


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
    description = Column(String, nullable=True)
    deadline = Column(Date, nullable=True)
    completed = Column(Boolean, default=False)
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    phase_id = Column(Integer, ForeignKey("phases.phase_id", ondelete="CASCADE"), nullable=False)
    phase = relationship("Phase", back_populates="tasks")