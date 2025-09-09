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

## Pre-commit

Pre-commit hooks are configured and enforced across the repo.