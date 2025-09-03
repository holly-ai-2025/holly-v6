from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base

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
    project_id = Column(String)
    phase_id = Column(String)
    token_value = Column(Integer)
    notes = Column(String)  # ✅ new field

class Project(Base):
    __tablename__ = "projects"

    project_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String)
    progress = Column(Integer)

class Phase(Base):
    __tablename__ = "phases"

    phase_id = Column(String, primary_key=True, index=True)
    project_id = Column(String, index=True)
    name = Column(String, nullable=False)
    description = Column(String)