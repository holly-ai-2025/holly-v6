# Holly AI – Monorepo

This repo contains both **frontend (Vite + React + MUI)** and **backend (FastAPI + PostgreSQL)**.

---

## Key Standards
- **Backend = source of truth.**
- **holly_v6** is the active database.  
  - Do not connect to `holly` or old test DBs.
- **Soft delete only** → entities are archived, never hard-deleted (except when running reset scripts).
- **Frontend API calls must go through `src/lib/api.ts`**.  
  No direct Axios calls in components.
- **Inline CRUD endpoints** are implemented directly in `apps/backend/main.py`. Routers are not used.

---

## Database Management & Resets

### Active DB
- All work is done in **holly_v6**.
- Connect via:
  ```bash
  psql -U holly_user -d holly_v6 -h localhost
  ```

### Resetting Data
Reset scripts live in `scripts/migrations`.
For example:
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

### Dummy Data
Insert sample tasks with:
```bash
psql -U holly_user -d holly_v6 -h localhost -f scripts/migrations/2025-10-02_insert_dummy_tasks.sql
```
This seeds tasks across categories (overdue, today, tomorrow, future, suggested).

---

## Schema Notes
- `end_date` → renamed to `due_date`
- `project_id` → renamed to `board_id`
- `urgency_score` → removed (may be reintroduced later)

---

## Cascade Archive Rules
When an entity is archived (soft delete via `archived=true`), related entities are also archived:
- Archiving a **board** → archives all its tasks, phases, and groups.
- Archiving a **phase** → archives all tasks in that phase.
- Archiving a **group** → archives all tasks in that group.

Archived entities remain in DB but are excluded from normal queries.

---

## Known Gotchas
- Archived test boards may persist until cleared with reset scripts.
- Foreign key constraints may block board deletion if dependent entities aren’t archived first.
- Tasks may still appear in frontend if cascade archive fails — check backend logs.
- Frontend sometimes needs explicit refresh after archive (optimistic updates not fully wired).
- 422 errors usually mean payload missing required fields (e.g. `board_id` or `phase_id`).
- Bad rows (e.g. `board_id=NULL`) cause ResponseValidationErrors. Remove with:
  ```sql
  DELETE FROM boards WHERE board_id IS NULL;
  ```

---

## Development
Start everything with:
```bash
scripts/start-dev.sh
```
Logs:
- Backend: `logs/backend-live.log`
- Frontend console: `logs/frontend-console.log`

---

# apps/frontend/README.md

# Frontend (Vite + React + MUI)

## Overview
- Built with **Vite + React**.
- UI with **MUI Core + Joy UI**.
- API calls **must** go through `src/lib/api.ts`.

---

## Standards
- No direct Axios calls inside components.
- All CRUD endpoints go via `lib/api.ts`.
- All entities support `archived` flag (soft delete).
- **Project vs List Boards:**
  - `board_type = project` → use ProjectBoardView (phases + tasks).
  - `board_type = list` → use ListBoardView (groups + items).

---

## Schema Adjustments
- Use `due_date` (not `end_date`).
- Use `board_id` (not `project_id`).
- `urgency_score` has been removed.

---

## Task Grouping (TabTasks)
Tasks are automatically bucketed into:
- **Today** → `due_date = current_date`
- **Tomorrow** → `due_date = current_date + 1`
- **Overdue** → `due_date < today`
- **Future** → `due_date > tomorrow`
- **Suggested** → `due_date IS NULL` (max 3 shown per day, shuffled)

👉 Suggested tasks are intentional. They support ADHD-style workflows by allowing freeform entry without dates.

---

## Dialogs
### TaskDialog
- Must always be passed `board_id`.
- Should also be passed `phase_id` when opened inside a project phase.
- If opened in a list board, should be passed `group_id`.
- Missing IDs will cause 422 errors.

### PhaseDialog
- Must always be passed `board_id`.
- Currently only supports `name` field. Start/end dates may be added later.

---

## Drag & Drop
- Dragging a **Suggested** task into Today/Tomorrow assigns the appropriate `due_date`.
- Dragging between groups updates `due_date` accordingly.

---

## Boards
- Boards load via `GET /db/boards` → frontend filters out `archived`.
- **BoardDetailPage → ProjectBoardView** handles project-type boards:
  - Phases load from `/db/phases?board_id={id}`
  - Tasks load from `/db/tasks?board_id={id}`
  - Supports creating phases, adding tasks, archiving boards.
- **List boards** load groups + items instead.

---

## Known Fixes & Issues
- `ProjectBoardView` was restored from main branch after accidental stripping of UI features.
- `TaskDialog` fixed: `onSave` now passed properly.
- **TabCalendar** still needs update to use `due_date` instead of `end_date`.
- Optimistic updates are partial → sometimes need manual refresh.

---

## Development
Start frontend via:
```bash
scripts/start-dev.sh
```
Frontend console logs are piped to:
```
logs/frontend-console.log
```

---

# apps/backend/README.md

# Backend (FastAPI + PostgreSQL)

## Overview
- FastAPI + SQLAlchemy ORM
- PostgreSQL (DB: `holly_v6`)
- Hypercorn server
- All entities support soft delete (`archived` flag)
- All CRUD endpoints are defined inline in `apps/backend/main.py` (not modular routers).

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

## Cascade Archive Rules
- Archiving a **board** → archives its tasks, phases, and groups.
- Archiving a **phase** → archives its tasks.
- Archiving a **group** → archives its tasks.

Entities are never hard deleted (except via reset scripts).

---

## Uniform CRUD
Each entity has:
- POST `/db/{entity}`
- PATCH `/db/{entity}/{id}`
- GET `/db/{entity}` / `/db/{entity}/{id}`

All responses include:
- primary key ID
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
  "board_id": 12,
  "phase_id": 3,
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

### Foreign Keys & Integrity
- Must archive dependent rows before archiving boards.
- Example: board archive → auto-archives phases, groups, tasks.
- Bad rows (e.g. `board_id=NULL`) must be deleted manually.

---

## Debugging
- Backend logs: `logs/backend-live.log`
- Restart backend:
  ```bash
  .venv/bin/hypercorn apps.backend.main:app --reload --bind 0.0.0.0:8000
  ```
- If tasks/phases return `405` → check request method vs API spec.
- If tasks/boards return `422` → check payload includes required IDs (`board_id`, `phase_id`, etc.).
- If frontend blocked by CORS → ensure `ngrok-skip-browser-warning` header is present.
- If `ResponseValidationError` → check for NULL values in DB.

---

## Contribution Rules
- Never use placeholders.
- DB schema, models, and routes must remain aligned.
- All payloads in activity logs must be JSON strings.
- Frontend requests must always use `src/lib/api.ts`. 
