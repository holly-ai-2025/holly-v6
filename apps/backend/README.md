# Backend (Holly AI v6)

## Overview
The backend provides a **FastAPI service** with task, project, board, tag, reflection, attachment, link, phase, and task activity management, fully integrated with a SQLite database.

---

## 🔧 Database
- `tasks` now support:
  - `due_date` (`DATE`, formatted as **DDMMYYYY**)
  - `start_date` (`DATETIME`, `YYYY-MM-DDTHH:mm:ss`)
  - `end_date` (`DATETIME`, `YYYY-MM-DDTHH:mm:ss`)
- Other entities:
  - boards, projects, phases, tags, reflections, attachments, task_activity.

---

## 📦 Schemas
- All Pydantic models updated to Pydantic v2 style:
  - Use `from_attributes = True` instead of `orm_mode = True`.
- Includes:
  - Task, Project, Board, Tag, Reflection, Attachment, Link, Phase, TaskActivity.
- Enums:
  - `StatusEnum` (`Todo`, `In Progress`, `Done`, `Pinned`).
  - `PriorityEnum` (`Tiny`, `Small`, `Medium`, `Big`).

---

## 🔌 Endpoints
- `/db/tasks` → create, read, update, delete tasks.
- `/db/projects` → read, update projects.
- `/db/boards` → read boards.
- `/db/tags` → create, read tags.
- `/db/reflections` → create, read reflections.
- `/db/attachments` → create attachments.
- `/db/links` → create links.
- `/log` → capture frontend logs.

---

## ⚠️ Notes
- All routes depend on `get_db()` which uses `SessionLocal` from `apps.backend.database`.
- `models.Base.metadata.create_all(bind=engine)` ensures DB is initialized.
- Date/time serialization must follow:
  - `due_date` → `DDMMYYYY`
  - `start_date`, `end_date` → `YYYY-MM-DDTHH:mm:ss`

---

## 📝 Summary
Backend now supports **time-based task scheduling** and full CRUD across related entities, with updated Pydantic v2 schemas and clean imports.