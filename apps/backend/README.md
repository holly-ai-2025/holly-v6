# Backend (FastAPI + PostgreSQL)

## Overview
- FastAPI + SQLAlchemy ORM
- PostgreSQL (DB: `holly_v6`)
- Hypercorn server
- All entities support soft delete (`archived` flag)

---

## Database Entities
- **Boards** → `board_type` = project | list
- **Phases** → only for project boards
- **Groups** → only for list boards
- **Tasks** → may link to board, phase, or group
- **Items** → list board contents
- **ActivityLog** → stores JSON string payloads

---

## Schema Renames & Deprecations
| Old field     | New field   | Notes              |
|---------------|-------------|--------------------|
| end_date      | due_date    | Used everywhere    |
| project_id    | board_id    | Migration complete |
| urgency_score | ❌ removed  | May be readded     |

---

## Uniform CRUD
Each entity has:
- POST `/db/{entity}`
- PATCH `/db/{entity}/{id}`
- GET `/db/{entity}` / `/db/{entity}/{id}`

All responses include:
- `id`
- `archived`
- `created_at`
- `updated_at`

---

## Example: Tasks
```json
{
  "task_id": 1,
  "title": "Finish docs",
  "description": "Write README updates",
  "due_date": "2025-10-02",
  "status": "open",
  "priority": "high",
  "category": "general",
  "archived": false,
  "created_at": "...",
  "updated_at": "..."
}
```

---

## CORS
Configured in `apps/backend/main.py`:
```python
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

## Database Management

### Resetting Data
To clear test data:
```bash
psql -U holly_user -d holly_v6 -h localhost -f scripts/migrations/2025-10-02_reset_boards.sql
```
This clears:
- projects
- items
- groups
- activity_logs
- tasks
- phases
- boards

### Dummy Tasks
Seed with:
```bash
psql -U holly_user -d holly_v6 -h localhost -f scripts/migrations/2025-10-02_insert_dummy_tasks.sql
```
Populates overdue, today, tomorrow, future, and suggested tasks.

### Foreign Keys
- Must delete dependent rows before deleting boards.
- Example: delete phases/tasks/groups before a project board.

---

## Debugging
- Backend logs: `logs/backend-live.log`
- Restart backend:
  ```bash
  .venv/bin/hypercorn apps.backend.main:app --reload --bind 0.0.0.0:8000
  ```
- If tasks/phases return `405` → check request method vs API spec.
- If frontend blocked by CORS → ensure `ngrok-skip-browser-warning` header is present.

---

## Contribution Rules
- Never use placeholders.
- DB schema, models, and routes must remain aligned.
- All payloads in activity logs must be JSON strings.
- Frontend requests must always use `src/lib/api.ts`. 
