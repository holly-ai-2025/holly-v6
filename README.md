# Holly AI – Monorepo

This repo contains both **frontend (Vite + React + MUI)** and **backend (FastAPI + PostgreSQL)**.

---

## Key Standards
- **Backend = source of truth.**
- **holly_v6** is the active database.  
  - Do not connect to `holly` or other old DBs.
- **Soft delete only** → entities are archived, never hard-deleted (except via reset scripts).
- **Frontend API calls must go through `src/lib/api.ts`**.  
  No direct Axios calls inside components.
- **All new fields, schema changes, or workflows must be reflected in these README files** so future GPT sessions stay in sync.

---

## Database Management & Resets

### Active DB
- Work is done in **holly_v6**.
- Connect via:
  ```bash
  psql -U holly_user -d holly_v6 -h localhost
  ```

### Resetting Data
Reset scripts live in `scripts/migrations/`. Example:
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

## Schema Rules

### Renames & Deprecations
- `end_date` → `due_date`
- `project_id` → `board_id`
- `urgency_score` → removed (may be reintroduced later)

### Relationships
- **Boards**: top-level, `board_type` = `project` or `list`.
- **Phases**: only for `project` boards. Require `board_id`.
- **Tasks**: always require `board_id`; may also require `phase_id` if in project boards.
- **Groups**: only for `list` boards.
- **Items**: only for list boards, linked to `group_id`.

---

## Cascade Archiving Rules
- Archiving a **board** → must also archive all phases, groups, items, and tasks under it.
- Archiving a **phase** → must archive only tasks within that phase (not others in the same board).
- Archiving a **group** → must archive items under it.
- Tasks and items should disappear from frontend views immediately after archive.

---

## Debugging Gotchas
- `422` errors → usually missing `board_id` or `phase_id` in payload.
- `404` errors → usually wrong endpoint or route prefix.
- Archived test boards may persist unless reset scripts are run.
- Frontend may look empty if tasks have no `due_date` → they’ll show under **Suggested**.

---

## Development
- Start everything with:
  ```bash
  scripts/start-dev.sh
  ```
- Logs:
  - Backend: `logs/backend-live.log`
  - Frontend console: `logs/frontend-console.log`

---

# Frontend (`apps/frontend/README.md`)

# Frontend (Vite + React + MUI)

## Overview
- Built with **Vite + React**.
- UI with **MUI Core + Joy UI** only.
- API calls must go through `src/lib/api.ts`.

---

## Standards
- No direct Axios calls in components.
- All CRUD endpoints via `lib/api.ts`.
- All entities support `archived` flag (soft delete).

---

## Schema Adjustments
- Use `due_date` (not `end_date`).
- Use `board_id` (not `project_id`).
- `urgency_score` removed.

---

## Task Grouping (TabTasks)
- **Today** → `due_date = current_date`
- **Tomorrow** → `due_date = current_date + 1`
- **Overdue** → `due_date < today`
- **Future** → `due_date > tomorrow`
- **Suggested** → `due_date IS NULL` (max 3 shown per day, shuffled)

👉 Suggested tasks are intentional for ADHD workflows.

---

## Drag & Drop
- Dragging a Suggested task into Today/Tomorrow assigns appropriate `due_date`.
- Dragging between groups updates `due_date`.

---

## Boards & Views
- Boards load via `GET /db/boards` → frontend filters out `archived`.
- **ProjectBoardView** (project boards):
  - Fetch phases via `/db/phases?board_id={id}`.
  - Fetch tasks via `/db/tasks?board_id={id}`.
  - Create phases with `{ name, board_id }`.
  - Create tasks with `{ title, board_id, phase_id?, due_date }`.
  - Archive boards with `PATCH /db/boards/{id}` → `{ archived: true }`.
  - Archive phases with `PATCH /db/phases/{id}` → `{ archived: true }`.

---

## Dialogs
- **TaskDialog**: must receive `board_id`, and optionally `phase_id`. Payload must include them.
- **PhaseDialog**: must receive `board_id` and pass it in payload.
- **BoardDialog**: creates boards with `{ name, board_type }`.

---

## Optimistic Updates
- After archive or creation, update local state immediately for good UX.
- If not, re-fetch data from API.

---

## Known Caveats
- TabCalendar still uses `end_date` in places → must be updated to `due_date`.
- React key warnings in TaskDialog are harmless but should be fixed eventually.

---

## Development
Start frontend via:
```bash
scripts/start-dev.sh
```
Logs:
- `logs/frontend-console.log`

---

# Backend (`apps/backend/README.md`)

# Backend (FastAPI + PostgreSQL)

## Overview
- FastAPI + SQLAlchemy ORM.
- PostgreSQL DB: `holly_v6`.
- Hypercorn server.
- Entities use soft delete (`archived` flag).

---

## Entities
- **Boards** → `board_type = project | list`
- **Phases** → only for project boards, require `board_id`
- **Groups** → only for list boards
- **Tasks** → link to `board_id`, optional `phase_id` or `group_id`
- **Items** → list board contents, require `group_id`
- **ActivityLog** → JSON payloads

---

## Schema Renames & Deprecations
| Old field  | New field  | Notes |
|------------|------------|-------|
| end_date   | due_date   | Used everywhere |
| project_id | board_id   | Migration complete |
| urgency_score | ❌ removed | May return later |

---

## Cascade Archive Behavior
- Archiving a board → cascade archive all its phases, groups, items, and tasks.
- Archiving a phase → cascade archive all tasks within it.
- Archiving a group → cascade archive its items.
- Implemented in routers to enforce consistency.

---

## CRUD API Pattern
All entities:
- `POST /db/{entity}`
- `PATCH /db/{entity}/{id}`
- `GET /db/{entity}` / `/db/{entity}/{id}`

All responses include:
- `id`, `archived`, `created_at`, `updated_at`

---

## Example Task
```json
{
  "task_id": 1,
  "title": "Finish docs",
  "description": "Update READMEs",
  "due_date": "2025-10-02",
  "status": "open",
  "priority": "high",
  "category": "general",
  "board_id": 19,
  "phase_id": 5,
  "archived": false,
  "created_at": "...",
  "updated_at": "..."
}
```

---

## Debugging
- `422` → check payload includes required IDs (`board_id`, `phase_id`).
- `404` → wrong route or prefix.
- Backend logs: `logs/backend-live.log`.
- Restart backend manually:
  ```bash
  .venv/bin/hypercorn apps.backend.main:app --reload --bind 0.0.0.0:8000
  ```

---

## CORS
Configured in `main.py` with required headers, including `ngrok-skip-browser-warning`.

---

## Data Reset & Dummy Tasks
To clear data:
```bash
psql -U holly_user -d holly_v6 -h localhost -f scripts/migrations/2025-10-02_reset_boards.sql
```
To seed tasks:
```bash
psql -U holly_user -d holly_v6 -h localhost -f scripts/migrations/2025-10-02_insert_dummy_tasks.sql
```

---

## Future GPT Guidance
Whenever new fields are added (e.g. due_date for phases), always:
1. Update **SQLAlchemy models**.
2. Update **Pydantic schemas**.
3. Update **routers**.
4. Update **frontend dialogs and api.ts**.
5. Update these README files with schema changes and cascade rules.
