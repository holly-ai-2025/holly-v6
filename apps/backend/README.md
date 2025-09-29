# Backend (Holly v6)

## Overview
The backend is a FastAPI + SQLAlchemy application using Postgres 15 (preferred) as the database.
It exposes REST APIs under the /db/* namespace.

### Directory Structure
apps/backend/
│
├── main.py        # API entrypoint (CRUD routes)
├── models.py      # SQLAlchemy ORM models
├── schemas.py     # Pydantic schemas (validation/serialization)
├── database.py    # DB engine + session setup
└── README.md      # (this file)

### Tech Stack
- FastAPI (web framework)
- SQLAlchemy (ORM)
- Pydantic (validation + serialization)
- Postgres 15 (preferred DB)

### Database Setup
Start Postgres:
```bash
brew services start postgresql@15
```

Create DB + User:
```sql
CREATE DATABASE holly_v6;
CREATE USER holly_user WITH PASSWORD 'holly_pass';
GRANT ALL PRIVILEGES ON DATABASE holly_v6 TO holly_user;
```

### Schema Evolution
- ⚠️ No Alembic migrations. Schema evolves via **manual SQL**.
- Example migration:
```sql
ALTER TABLE boards ADD COLUMN archived BOOLEAN DEFAULT FALSE;
```
- Update `models.py` and `schemas.py` in sync.
- Clear `__pycache__` if changes don’t take effect:
```bash
find apps/backend -type d -name "__pycache__" -exec rm -rf {} +
```
- Restart backend and test changes with `curl`.
- Log all schema changes in `docs/CHANGELOG.md`.

### Pre-commit Hook
- A safety hook is installed under `.githooks/pre-commit`.
- To enable it, run:
```bash
git config core.hooksPath .githooks
```
- It enforces:
  - ❌ No placeholders/stubs (`...`, `placeholder`, `unchanged`).
  - 📑 Schema/API changes require `docs/CHANGELOG.md` update.
  - 🎨 Frontend must not import stray UI libraries (Tailwind, Chakra, AntD, Shadcn).

---

## API Conventions
All routes live under /db/*.
CRUD endpoints implemented for:
- Boards (/db/boards)
- Projects (/db/projects)
- Phases (/db/phases)
- Tasks (/db/tasks)
- Groups (/db/groups)
- Items (/db/items)
- Activity Log (/db/activity)

Soft deletes: records are never truly deleted.
- `archived = true` used for tasks and boards (implemented).
- Projects, phases, groups, items: planned but not yet implemented.

Timestamps are UTC.

---

## Primary Key Conventions
- Task → `task_id`
- Board → `board_id`
- Project → `project_id`
- Phase → `phase_id`
- Group → `group_id`
- Item → `item_id`
- Activity Log → `log_id`

---

## Task Model
- task_id (integer, primary key)
- task_name (string)
- description (string, nullable)
- board_id (integer, nullable)
- project_id (integer, nullable)
- phase_id (integer, nullable)
- group_id (integer, nullable)
- status (string: "Todo" | "In Progress" | "Done")
- urgency_score (integer)
- priority (string: "Low" | "Medium" | "High" | "Urgent")
- category (string, nullable)
- token_value (integer)
- due_date (date)
- start_date (timestamp, nullable)
- end_date (timestamp, nullable)
- effort_level (string: "Low" | "Medium" | "High")
- archived (boolean, soft delete flag)
- pinned (boolean)
- created_at (timestamp)
- updated_at (timestamp)
- notes (text, nullable)
- parent_task_id (integer, nullable)

---

## Known Issues
- `goal` field deprecated: present in schemas, not persisted in DB.
- Postgres lock errors may require clearing `postmaster.pid` and shared memory.
- No DELETE endpoints implemented (use PATCH archived=true).
