# Holly v6

This is the main monorepo for Holly v6, containing both frontend and backend applications.

## Getting Started

Run the development stack (frontend, backend, and log server) with:

```bash
scripts/start-dev.sh
```

This will:
- Start the backend (FastAPI + SQLite)
- Start the frontend (React + Vite + MUI)
- Start the log server on port `9000` to capture browser console output into `logs/frontend-console.log`

## Workspace Menu

The **Workspace** menu consolidates `Tasks`, `Projects`, and `Calendar` into a single tab, with sub-tabs:
- **Flowboard** (placeholder for future work)
- **Tasks** (TabTasks.tsx)
- **Boards** (previously Projects)
- **Calendar**

## Logs

Logs are always written to the `logs/` directory:
- Backend logs: `logs/backend-live.log` (startup script) and `logs/backend-hypercorn.log` (manual Hypercorn runs).
- Frontend logs: `logs/frontend-console.log` (browser console forwarded via log server).

## Development Workflow
- **Never edit `main` directly.** Always create a feature branch and open a PR for review.
- Use `scripts/start-dev.sh` to ensure logs are captured consistently.
- All debugging must be done with live log monitoring.

## Known Pitfalls & Fixes
- **Task updates**: `PATCH /db/tasks/{id}` now supports partial updates using `schemas.TaskUpdate` with `exclude_unset=True`. Only changed fields are required.
- **CORS**: During development, `allow_origins=["*"]` is enabled (no credentials). Do not combine `allow_credentials=True` with `*` — this causes invalid CORS behavior.
- **TaskActivity**: Only logs `task_id` and `action`. Fields like `user_id` and `details` are not implemented yet. Adding them without updating the model will cause crashes.
- **Enums**: Task `status` must be one of `Todo | In Progress | Done | Pinned`. Priority must be `Tiny | Small | Medium | Big`. Invalid values will throw errors.

## Pre-commit

Pre-commit hooks are configured and enforced across the repo.