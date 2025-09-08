from datetime import datetime, timedelta
from apps.backend import models
from apps.backend.database import engine, Base, SessionLocal


def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # --- Boards ---
    boards = [
        models.Board(name="Home", type="Personal", goal="Stay on top of household"),
        models.Board(name="Work", type="Professional", goal="Deliver client projects"),
        models.Board(name="Health", type="Wellbeing", goal="Stay consistent with health"),
    ]
    db.add_all(boards)
    db.commit()

    # --- Projects ---
    projects = [
        models.Project(name="Kitchen Renovation", board_id=1, goal="Finish by October"),
        models.Project(name="Client Website", board_id=2, goal="Deliver MVP this month"),
    ]
    db.add_all(projects)
    db.commit()

    # --- Phases ---
    phases = [
        models.Phase(name="Planning", project_id=1),
        models.Phase(name="Execution", project_id=1),
        models.Phase(name="Research", project_id=2),
        models.Phase(name="Development", project_id=2),
    ]
    db.add_all(phases)
    db.commit()

    # --- Tasks ---
    today = datetime.utcnow().date()
    tasks = [
        # ✅ Overdue
        models.Task(
            task_name="Fix leaking sink",
            description="Urgent plumbing issue in the kitchen",
            due_date=(today - timedelta(days=2)),  # now a date object
            status="Pending",
            priority="High",
            project_id=1,
            phase_id=2,
            token_value=10,
            urgency_score=85,
            effort_level=4,
            created_at=datetime.utcnow() - timedelta(days=3),
        ),
        models.Task(
            task_name="Send overdue invoice",
            description="Client invoice #231 still pending",
            due_date=(today - timedelta(days=1)),
            status="In Progress",
            priority="High",
            project_id=2,
            phase_id=3,
            token_value=15,
            urgency_score=95,
            effort_level=2,
            created_at=datetime.utcnow() - timedelta(days=5),
        ),

        # ✅ Today
        models.Task(
            task_name="Weekly grocery shopping",
            description="Include healthy snacks",
            due_date=today,
            status="Pending",
            priority="Medium",
            project_id=1,
            token_value=5,
            urgency_score=70,
            effort_level=2,
            created_at=datetime.utcnow() - timedelta(days=1),
        ),
        models.Task(
            task_name="Review project proposal",
            description="Review draft and send feedback",
            due_date=today,
            status="In Progress",
            priority="High",
            project_id=2,
            token_value=10,
            urgency_score=60,
            effort_level=3,
            created_at=datetime.utcnow() - timedelta(days=2),
        ),

        # ✅ Tomorrow
        models.Task(
            task_name="Doctor appointment",
            description="Annual checkup at 9am",
            due_date=(today + timedelta(days=1)),
            status="Pending",
            priority="High",
            board_id=3,
            token_value=20,
            urgency_score=80,
            effort_level=1,
            created_at=datetime.utcnow() - timedelta(days=1),
        ),

        # ✅ Later this week
        models.Task(
            task_name="Prepare presentation slides",
            description="Slides for Friday’s meeting",
            due_date=(today + timedelta(days=3)),
            status="Pending",
            priority="High",
            project_id=2,
            phase_id=4,
            token_value=15,
            urgency_score=75,
            effort_level=5,
            created_at=datetime.utcnow(),
        ),

        # ✅ Floating (Suggested pool)
        models.Task(
            task_name="Organize photo library",
            description="Clean up duplicates and tag memories",
            due_date=None,
            status="Pending",
            priority="Low",
            token_value=5,
            urgency_score=50,
            effort_level=3,
            created_at=datetime.utcnow() - timedelta(days=7),
        ),
        models.Task(
            task_name="Brainstorm blog post ideas",
            description="Think of at least 10 concepts",
            due_date=None,
            status="Pending",
            priority="Medium",
            token_value=5,
            urgency_score=65,
            effort_level=2,
            created_at=datetime.utcnow() - timedelta(days=2),
        ),
        models.Task(
            task_name="Read AI research paper",
            description="Skim and take notes",
            due_date=None,
            status="Pending",
            priority="Medium",
            token_value=10,
            urgency_score=85,
            effort_level=4,
            created_at=datetime.utcnow() - timedelta(days=1),
        ),
    ]

    db.add_all(tasks)
    db.commit()
    print("✅ Seeded DB with boards, projects, phases, and tasks.")


if __name__ == "__main__":
    reset_db()