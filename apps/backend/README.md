# Backend README

## Database Sessions
This backend uses **`SessionLocal`** directly for all database access.

### Pattern
Each route should open a new session context using:

```python
with SessionLocal() as db:
    # your queries here
```

This ensures:
- No stale connections.
- Consistent transaction handling.
- Explicit session lifecycle.

### Important
- Do **not** import or use a `get_db` dependency — it is not defined in this project.
- Stick to the `SessionLocal` pattern consistently across all routes.

## Soft Delete
- All core tables (`boards`, `projects`, `phases`, `tasks`, `groups`, `items`, `activity_log`) include an `archived BOOLEAN DEFAULT FALSE` column.
- Routes must always filter on `archived == False` for read endpoints.
- Delete actions are implemented as soft deletes by setting `archived = True`.

## CORS
The backend allows the following headers:
- `Authorization`
- `Content-Type`
- `Accept`
- `Origin`
- `User-Agent`
- `ngrok-skip-browser-warning`

## Logs
- Main backend logs: `logs/backend-live.log`
- Debug logs: `logs/debug.log`
- Frontend console logs: forwarded via `http://localhost:9000/log`

## Dev Workflow
- Always start with `scripts/start-dev.sh` — this kills stale processes and restarts backend, frontend, and log server.
- Manual DB migrations only: `psql -U holly_user -d holly_v6 -f scripts/migrations/<migration>.sql`
- Ensure DB schema and ORM models remain in sync before committing.