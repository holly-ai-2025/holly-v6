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

## Date Handling
- DB stores dates as ISO `YYYY-MM-DD`.
- API exposes `due_date` as `DDMMYYYY` (legacy), but now tolerant:
  - Accepts both `DDMMYYYY` and `YYYY-MM-DD`.
  - Always normalizes to ISO before saving.

## Known Issues & Fixes
- **Problem**: Tasks disappeared from repo (backend not in Git).
  - **Fix**: Backend code restored into Git. `.gitignore` updated (only `holly.db` ignored).
- **Problem**: Date mismatches between DB and frontend.
  - **Fix**: Conversion layer in schemas + tolerant parsing in backend.
- **Problem**: Wrong primary key used (`id` instead of `task_id`).
  - **Fix**: All backend queries updated to use `task_id`.

## Adding Fields / Tables
When adding a new field to `Task` or creating a new table:
1. **Update models** (`apps/backend/models.py`).
   - Define new column(s).
2. **Update schemas** (`apps/backend/schemas.py`).
   - Add field(s) to Pydantic models.
   - Ensure proper serialization (e.g. enums, dates).
3. **Update main routes** (`apps/backend/main.py`).
   - Handle new fields in create/update routes.
   - Add validators if needed.
4. **Update frontend**:
   - Update API layer (`apps/frontend/src/api/tasks.ts`).
   - Update components (e.g. TaskDialog) to collect and send new fields.
5. **Run migrations** (if switching from SQLite, consider Alembic for versioned migrations).

## Development Notes
- Always run `./scripts/dev.sh` to start backend+frontend+logs.
- Use logs to debug (`tail -f logs/backend-live.log`).
- When debugging date or serialization issues, confirm both frontend payload and backend parse.
- Central rule: Frontend can send ISO dates. Backend must accept both ISO and DDMMYYYY.