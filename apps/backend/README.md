# Backend (Holly AI v6)

## Overview
The backend provides a **FastAPI service** with task, project, board, tag, reflection, attachment, and link management, fully integrated with a SQLite database.

---

## 🔧 Database
- `tasks` now support:
  - `start_date` (`DATETIME`)
  - `end_date` (`DATETIME`)
  - `due_date` (`DATE` only)

---

## 📦 Schemas
- All Pydantic models updated to Pydantic v2 style:
  - Use `from_attributes = True` instead of `orm_mode = True`.
- Includes:
  - Task, Project, Board, Tag, Reflection, Attachment, Link.
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
  - `due_date` → `YYYY-MM-DD`
  - `start_date`, `end_date` → `YYYY-MM-DDTHH:mm:ss`

---

## 📝 Summary
Backend now supports **time-based task scheduling** and full CRUD across related entities, with updated Pydantic v2 schemas and clean imports.