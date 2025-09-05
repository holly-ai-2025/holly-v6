from sqlalchemy.orm import Session
from apps.backend.database import engine, Base, SessionLocal
from apps.backend import models
import os

# Drop and recreate the database
if os.path.exists("holly.db"):
    os.remove("holly.db")

Base.metadata.create_all(bind=engine)

# Seed demo data
db: Session = SessionLocal()

# Boards
home_board = models.Board(name="Home")
work_board = models.Board(name="Work")
db.add_all([home_board, work_board])
db.commit()

# Project
demo_project = models.Project(name="Demo Project", notes="This is a seeded demo project.")
db.add(demo_project)
db.commit()

# Tasks
t1 = models.Task(
    task_name="Buy groceries",
    description="Milk, eggs, bread",
    status="Todo",
    board_id=home_board.board_id,
    effort_level="Small",
    urgency_score=5,
    notes="Remember to check for discounts.",
)

t2 = models.Task(
    task_name="Finish report",
    description="Client deadline approaching",
    status="In Progress",
    board_id=work_board.board_id,
    project_id=demo_project.project_id,
    effort_level="Big",
    urgency_score=9,
    notes="Need graphs finalized.",
)

t3 = models.Task(
    task_name="Book dentist appointment",
    description="Call Dr. Smith’s office",
    status="Todo",
    board_id=home_board.board_id,
    effort_level="Tiny",
    urgency_score=3,
)

db.add_all([t1, t2, t3])
db.commit()
db.close()

print("Database reset and demo data seeded.")