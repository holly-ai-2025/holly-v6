# Holly AI v6

## Overview
Holly AI v6 is a full-stack application built with:
- **Frontend**: React + Vite + MUI (Core + Joy UI)
- **Backend**: FastAPI + Hypercorn + SQLAlchemy + PostgreSQL
- **Logging**: Browser console logs are forwarded to a log server running at port 9000

Entities:
- Boards (two types: `list`, `project`)
- Phases (for project boards)
- Groups (for list boards)
- Tasks (attached to boards, phases, or groups)
- Items (attached to list boards/groups)
- ActivityLog (captures create/update/archive actions)

All entities use **soft delete** via `archived: boolean`. Delete = `PATCH { archived: true }`. The frontend must always filter archived = false when displaying data.

---

## Development Setup
Always start with the unified dev script:
```bash
scripts/start-dev.sh
```
This will:
- Install frontend dependencies (via pnpm)
- Start frontend (Vite) on port 5173
- Start backend (FastAPI + Hypercorn) on port 8000
- Start log server on port 9000

Do **not** run frontend/backend directly in isolation unless debugging.

### Debugging Backend Crashes
If backend dies immediately after startup, run Hypercorn manually:
```bash
.venv/bin/hypercorn apps.backend.main:app --reload --bind 0.0.0.0:8000
```
This shows the raw traceback (often schema mismatch, migration issues, or CORS misconfig).

---

## Database
PostgreSQL schema lives in `/apps/backend/models.py` and `/apps/backend/schemas.py`. Migrations are SQL scripts in `/migrations`.

### Inspect Tables
```bash
psql -U holly_user -d holly_v6 -h localhost -c "\\d boards"
psql -U holly_user -d holly_v6 -h localhost -c "\\d tasks"
```

### Migration Workflow
1. Create SQL migration file in `/migrations`: `YYYY-MM-DD_short_description.sql`
2. Apply migration:
   ```bash
   psql -U holly_user -d holly_v6 -h localhost -f migrations/2025-10-02_add_groups.sql
   ```
3. Update backend:
   - `apps/backend/models.py`
   - `apps/backend/schemas.py`
   - `apps/backend/main.py`
4. Test with curl:
   ```bash
   curl -X POST http://localhost:8000/db/boards -H "Content-Type: application/json" -d '{"name":"Test","board_type":"project"}'
   ```

### Uniform CRUD Contract
Every entity follows this:
- `CreateModel` → POST `/db/{entity}`
- `UpdateModel` → PATCH `/db/{entity}/{id}`
- `ResponseModel` → GET `/db/{entity}` or `/db/{entity}/{id}`
- Common fields: `archived`, `created_at`, `updated_at`

---

## API Standards
- Delete = soft delete: `PATCH { archived: true }`
- Responses always include: `{ entity_id, created_at, updated_at, archived }`
- Activity logs must store payload as JSON string.

---

## CORS
Backend enables CORS in `main.py`:
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

This ensures local dev (`http://localhost:5173`) and ngrok tunneling both work.

---

## Logging
- Backend logs: `logs/backend-live.log`
- Frontend console logs: `logs/frontend-console.log`

To reset logs before debugging:
```bash
> logs/backend-live.log
scripts/start-dev.sh
```

---

## Contribution Rules
- Never use placeholders (e.g. `TODO`, `...`).
- Always keep DB schema, models, schemas, and main routes aligned.
- Every commit must be atomic and describe exactly what was changed.
- All API calls in frontend must go through `src/lib/api.ts`.
