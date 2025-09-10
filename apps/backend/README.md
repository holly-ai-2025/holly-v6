# Backend README – Holly v6

## Current State
- Backend rebuilt (apps/backend/) after previous code loss.
- Database is SQLite (`holly.db`), ignored in Git.
- Backend runs with FastAPI + SQLAlchemy.
- Startup handled by `scripts/dev.sh` (runs backend, frontend, log server).
- Logs:
  - Backend: `logs/backend-live.log`
  - Frontend: `logs/frontend-console.log`
  - Log server: `logs/log-server.log`

## Routes
### Tasks
- `GET /db/tasks` → list all tasks.
- `POST /db/tasks` → create a new task.
- `PATCH /db/tasks/{task_id}` → update an existing task.
- `DELETE /db/tasks/{task_id}` → delete a task.

## Date Handling
- DB stores dates as ISO `YYYY-MM-DD`.
- API exposes `due_date` tolerant to both ISO and DDMMYYYY (legacy).
- **Frontend unified on ISO only**.
- Conversion helpers live in `apps/frontend/src/utils/taskUtils.ts`.

## Known Issues & Fixes
- **Problem**: Tasks disappeared from repo (backend not in Git).
  - **Fix**: Backend code restored into Git. `.gitignore` updated (only `holly.db` ignored).
- **Problem**: Date mismatches between DB and frontend.
  - **Fix**: Conversion layer + unified ISO handling.
- **Problem**: Wrong primary key used (`id` instead of `task_id`).
  - **Fix**: All backend queries updated to use `task_id`.
- **Problem**: TaskDialog duplicate task creation.
  - **Fix**: TaskDialog now only updates via API response.
- **Problem**: Tasks not deletable.
  - **Fix**: Added DELETE route and Delete button in TaskDialog.

## Adding Fields / Tables
When adding a new field to `Task` or creating a new table:
1. **Update models** (`apps/backend/models.py`).
2. **Update schemas** (`apps/backend/schemas.py`).
3. **Update routes** (`apps/backend/main.py`).
4. **Update frontend** (API + components).
5. Always use ISO dates in frontend.

## Development Notes
- Always run `./scripts/dev.sh` to start backend+frontend+logs.
- Debug with `tail -f logs/backend-live.log logs/frontend-console.log`.
- Central rule: Frontend always uses ISO. Backend accepts ISO or DDMMYYYY for backwards compatibility.