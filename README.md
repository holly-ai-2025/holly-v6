# Holly AI v6

## Overview
Holly AI is a development partner framework that provides both backend and frontend services. The backend runs on Hypercorn (FastAPI + SQLAlchemy) and provides REST API endpoints, while the frontend runs on Vite + React with MUI (Core + Joy UI).

All core entities (Boards, Projects, Phases, Groups, Items, Tasks, ActivityLog) implement **soft delete** via an `archived` boolean flag. Queries automatically exclude archived entities, and delete operations set `archived=True` instead of removing rows.

## Backend
- Entrypoint: `apps/backend/main.py`
- Runs with Hypercorn on port `8000`
- Example endpoint: `http://localhost:8000/db/tasks`
- Database: PostgreSQL (default: `holly_v6` via `holly_user`)
- Manual migrations with `.sql` files in `scripts/migrations/`

## Frontend
- Entrypoint: `apps/frontend/src/main.tsx`
- Framework: Vite + React + MUI (Core + Joy UI)
- Uses a unified API client at `apps/frontend/src/lib/api.ts`
- All frontend delete actions send PATCH requests with `{ archived: true }`

### API Client
- All frontend API requests **must** go through `lib/api.ts`.
- In development, requests are sent to `http://localhost:8000`.
- In production (Vercel), requests use `VITE_API_URL`.
- The client automatically includes the `ngrok-skip-browser-warning: true` header.
- Example log:
  ```
  [API Request] http://localhost:8000 /db/tasks {...headers}
  ```

### Logging
- Console logs are forwarded to the backend log server.
- In development: `http://localhost:9000/log`
- In production: `VITE_LOG_SERVER_URL`

## Development Workflow
### Branching Rules
- Never edit `main` directly.
- Always create a feature branch from the latest `main`.
- Each commit must be atomic, with no placeholders or stubs.

### Starting the Environment
Use the provided script:
```bash
scripts/start-dev.sh
```
This will:
- Install frontend dependencies
- Start the frontend (Vite) on port 5173
- Start the backend (FastAPI + Hypercorn) on port 8000
- Start the log server on port 9000

### Database Migrations
Migrations are manual and stored in `scripts/migrations/`.

To apply a migration:
```bash
psql -U holly_user -d holly_v6 -f scripts/migrations/<filename>.sql
```

To verify:
```bash
psql -U holly_user -d holly_v6
\d projects;
\d phases;
```

### Adding or Editing Tables
1. Add/modify the model in `apps/backend/models.py` (must include `archived = Column(Boolean, default=False)`).
2. Add/modify schema in `apps/backend/schemas.py` (must include `archived: bool = False`).
3. Add/update CRUD endpoints in `apps/backend/main.py`.
4. Create a migration SQL file under `scripts/migrations/`.
5. Apply the migration with `psql`.
6. Restart dev: `scripts/start-dev.sh`
7. Test with curl and frontend.

---

This ensures consistent handling of soft deletes, migrations, and development across the stack.