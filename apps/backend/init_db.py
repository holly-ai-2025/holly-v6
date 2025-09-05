from apps.backend.database import engine, Base, SessionLocal
from apps.backend import models
from apps.backend.seed_data import seed_boards, seed_projects, seed_phases, seed_tasks, seed_habits, seed_reflections
from datetime import datetime

# Reset database
def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Boards
    boards_map = {}
    for b in seed_boards:
        board = models.Board(
            name=b["name"],
            type=b.get("type"),
            goal=b.get("goal"),
            created_at=datetime.utcnow(),
        )
        db.add(board)
        db.commit()
        db.refresh(board)
        boards_map[b["name"]] = board.board_id
    print(f"Seeded {len(boards_map)} boards")

    # Projects
    projects_map = {}
    for p in seed_projects:
        project = models.Project(
            name=p["name"],
            board_id=boards_map[p["board_name"]],
            notes=p.get("notes"),
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        projects_map[p["name"]] = project.project_id
    print(f"Seeded {len(projects_map)} projects")

    # Phases
    phases_map = {}
    for ph in seed_phases:
        phase = models.Phase(
            project_id=projects_map[ph["project_name"]],
            name=ph["name"],
            deadline=ph.get("deadline"),
        )
        db.add(phase)
        db.commit()
        db.refresh(phase)
        phases_map[(ph["project_name"], ph["name"])] = phase.phase_id
    print(f"Seeded {len(phases_map)} phases")

    # Tasks
    for t in seed_tasks:
        task = models.Task(
            task_name=t["task_name"],
            board_id=boards_map[t["board_name"]],
            project_id=projects_map.get(t["project_name"]),
            phase_id=phases_map.get((t["project_name"], t["phase_name"])) if t.get("phase_name") else None,
            due_date=t.get("due_date"),
            status=t.get("status"),
            priority=t.get("priority"),
            effort_level=t.get("effort_level"),
            notes=t.get("notes"),
            created_at=datetime.utcnow(),
        )
        db.add(task)
    db.commit()
    print(f"Seeded {len(seed_tasks)} tasks")

    # Habits
    for h in seed_habits:
        habit = models.Habit(
            title=h["title"],
            frequency=h["frequency"],
            zone=h["zone"],
            streak=h["streak"]
        )
        db.add(habit)
    db.commit()
    print(f"Seeded {len(seed_habits)} habits")

    # Reflections
    for r in seed_reflections:
        reflection = models.Reflection(
            content=r["content"],
            mood=r["mood"]
        )
        db.add(reflection)
    db.commit()
    print(f"Seeded {len(seed_reflections)} reflections")

    db.close()

if __name__ == "__main__":
    reset_db()
    print("Database reset and seeded with realistic demo data.")