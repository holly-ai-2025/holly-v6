# Backend (Holly v6)

## Overview
The backend is a FastAPI + SQLAlchemy application using PostgreSQL 15 as the database. It exposes REST APIs under the `/db/*` namespace and supports full project/board/task management with **soft delete**.

All entities — Boards, Projects, Phases, Tasks, Groups, Items, ActivityLog — implement **soft delete** via an `archived` boolean column. Queries filter out archived entities, and delete actions are performed via `PATCH` setting `archived=true`.

### Directory Structure
```
apps/backend/
├── main.py        # API entrypoint (CRUD routes)
├── models.py      # SQLAlchemy ORM models
├── schemas.py     # Pydantic schemas (validation/serialization)
├── database.py    # DB engine + session setup
└── README.md      # (this file)
```

### Tech Stack
- FastAPI (web framework)
- SQLAlchemy (ORM)
- Pydantic (validation/serialization)
- PostgreSQL 15 (preferred DB)

---

## Database Setup
Start PostgreSQL:
```bash
brew services start postgresql@15
```

Create DB + User (first time only):
```sql
CREATE DATABASE holly_v6;
CREATE USER holly_user WITH PASSWORD 'holly_pass';
GRANT ALL PRIVILEGES ON DATABASE holly_v6 TO holly_user;
```

### Schema Evolution
- ⚠️ No Alembic. Schema evolves via **manual SQL migrations**.
- Migrations live in `scripts/migrations/`.
- Example migration:
```sql
ALTER TABLE projects ADD COLUMN archived BOOLEAN DEFAULT FALSE;
```
- Apply migration:
```bash
psql -U holly_user -d holly_v6 -f scripts/migrations/<file>.sql
```
- Verify:
```bash
psql -U holly_user -d holly_v6
\d projects;
```
- Always update `models.py` and `schemas.py` in sync.
- Restart backend after migrations: `scripts/start-dev.sh`

---

## API Conventions
All routes live under `/db/*`.

CRUD endpoints are implemented for:
- Boards → `/db/boards`
- Projects → `/db/projects`
- Phases → `/db/phases`
- Tasks → `/db/tasks`
- Groups → `/db/groups`
- Items → `/db/items`
- Activity Log → `/db/activity`

### Soft Deletes
- All tables have `archived BOOLEAN DEFAULT FALSE`.
- `GET` routes always filter out archived entities.
- `PATCH` routes toggle `archived`.
- No hard DELETE is used.
- Example:
```bash
curl -X PATCH http://localhost:8000/db/projects/1 \
  -H "Content-Type: application/json" \
  -d '{"archived": true}'
```

### Primary Key Conventions
- Task → `task_id`
- Board → `board_id`
- Project → `project_id`
- Phase → `phase_id`
- Group → `group_id`
- Item → `item_id`
- Activity Log → `log_id`

---

## CORS Setup
The backend uses explicit headers for CORS to support the frontend.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "User-Agent",
        "ngrok-skip-browser-warning"
    ],
)
```

This is required because the frontend API client always sends `ngrok-skip-browser-warning: true`.

---

## Development Workflow
- Always start backend using the script:
```bash
scripts/start-dev.sh
```
This kills stale processes and starts backend, frontend, and log server.

- Never edit `main` directly. Always branch from main and commit atomic changes.
- Never use placeholders (`...`, `unchanged`, `TODO`).

### Adding or Editing Tables
1. Add/modify model in `models.py` (must include `archived`).
2. Add/modify schema in `schemas.py` (must include `archived`).
3. Add/update CRUD endpoints in `main.py`.
4. Create a migration SQL file under `scripts/migrations/`.
5. Apply migration with `psql`.
6. Restart dev with `scripts/start-dev.sh`.
7. Test with curl and frontend.

---

## Logging
- All backend logs go to `logs/backend-live.log`.
- Debug log for activity tracking: `logs/debug.log`.
- Frontend console logs are proxied to `http://localhost:9000/log`.

---

## Known Issues
- Postgres lock errors: may require clearing `postmaster.pid` and shared memory.
- Pre-commit hook enforces: no placeholders, schemas must match DB, frontend must not import stray UI libraries.