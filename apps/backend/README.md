# Backend (FastAPI + PostgreSQL)

## Overview
Backend provides REST API for boards, phases, groups, tasks, items, and activity logs.
- Built with FastAPI, SQLAlchemy ORM, PostgreSQL
- Served with Hypercorn
- All entities support soft delete via `archived` flag

---

## Database
### Entities
- **Boards**: project or list
- **Phases**: only for project boards
- **Groups**: only for list boards
- **Tasks**: linked to boards, phases, or groups
- **Items**: linked to list boards and groups
- **ActivityLog**: logs all create/update/archive actions

### Uniform CRUD
Each entity has:
- CreateModel → POST `/db/{entity}`
- UpdateModel → PATCH `/db/{entity}/{id}`
- ResponseModel → GET `/db/{entity}` or `/db/{entity}/{id}`

All include: `archived`, `created_at`, `updated_at`.

### Schema Alignment
The **source of truth** is PostgreSQL. Always:
1. Inspect DB with `psql`:
   ```bash
   psql -U holly_user -d holly_v6 -h localhost -c "\\d tasks"
   ```
2. Create migration in `/migrations`.
3. Update:
   - `apps/backend/models.py`
   - `apps/backend/schemas.py`
   - `apps/backend/main.py`

**Never leave DB columns undocumented in schema or model.**

### Example Migration
Rename column `end_date` to `due_date`:
```sql
ALTER TABLE tasks RENAME COLUMN end_date TO due_date;
```

---

## API Endpoints
### Boards
- `GET /db/boards`
- `POST /db/boards` { name, board_type }
- `PATCH /db/boards/{id}` { archived: true }

### Tasks
- `GET /db/tasks`
- `POST /db/tasks` { title, description, board_id?, phase_id?, group_id? }
- `PATCH /db/tasks/{id}` { due_date, status, archived }

### Activity Logs
- Created automatically on entity create/update/archive
- `payload` always stored as **JSON string** (never raw dict)

---

## Running Backend
Use startup script:
```bash
scripts/start-dev.sh
```

If backend crashes, run manually:
```bash
.venv/bin/hypercorn apps.backend.main:app --reload --bind 0.0.0.0:8000
```
This ensures raw Python traceback is visible.

---

## CORS
Configured in `apps/backend/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Authorization",
        "Content-Language",
        "Content-Type",
        "Origin",
        "User-Agent",
        "ngrok-skip-browser-warning"
    ],
)
```

---

## Debugging
- Logs: `logs/backend-live.log`
- Reset logs:
  ```bash
  > logs/backend-live.log
  scripts/start-dev.sh
  ```
- If schema mismatch error → inspect DB, apply migration, update models.py + schemas.py

---

## Known Standards
- Soft delete only (archived = true)
- All frontend API requests use `src/lib/api.ts`
- Do not add direct axios calls inside components
- Always JSON-encode payloads in activity logs