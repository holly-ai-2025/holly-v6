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

---

## Database Management & Resets

### Active DB
- All work is done in **holly_v6**.
- Connect via:
  ```bash
  psql -U holly_user -d holly_v6 -h localhost
  ```

### Resetting Data
Reset scripts live in `scripts/migrations/`.
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

### Schema Notes
- `end_date` → renamed to `due_date`
- `project_id` → renamed to `board_id`
- `urgency_score` → removed (may be reintroduced later)

### Known Gotchas
- Archived test boards may persist until cleared with reset scripts.
- Foreign key constraints may block board deletion (projects, groups, tasks).
  → Always delete dependent entities first.
- Frontend may appear “empty” if tasks lack `due_date`.  
  → They’ll appear in the **Suggested** group.

---

## Development
Start everything with:
```bash
scripts/start-dev.sh
```

### Logs
- Backend: `logs/backend-live.log`
- Frontend console: `logs/frontend-console.log`

---

## Contribution Rules
- Never use placeholders (`TODO`, `...`).
- Keep DB schema, models, schemas, and routes aligned.
- All API calls in frontend must use `src/lib/api.ts`.
- Every commit must be atomic and describe exactly what was changed.
