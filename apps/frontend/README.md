# Frontend (Holly v6)

## Overview
The frontend is built with React, Vite, and MUI (Core + Joy UI). It communicates with the backend through a unified API client (`src/lib/api.ts`).

All entities (Boards, Projects, Phases, Groups, Items, Tasks, ActivityLog) implement **soft delete** via `archived: boolean`. The frontend must always send `PATCH { archived: true }` for deletes and filter out archived items when rendering.

---

## API Client
- Location: `src/lib/api.ts`
- All API calls **must** use this client. Do not import `axios` directly in components.
- Development:
  - Base URL: `http://localhost:8000`
- Production (Vercel):
  - Base URL: `VITE_API_URL` (must be set in Vercel environment variables)
- Automatically attaches the header:
  ```
  ngrok-skip-browser-warning: true
  ```
  This is required because backend CORS explicitly allows it.

### Debugging API Requests
- Every API request is logged to the browser console:
  ```
  [API Request] http://localhost:8000 /db/tasks {...headers}
  ```
- If you see requests as relative paths (e.g. `/db/tasks`), it means `VITE_API_URL` was not set in production.
- If `VITE_API_URL` is missing, an error is logged:
  ```
  [API] Missing VITE_API_URL in production build!
  ```

---

## Logging
- Console logs are forwarded to the backend log server.
- Development: `http://localhost:9000/log`
- Production: `VITE_LOG_SERVER_URL`

---

## Development Setup
Always start with the unified dev script:
```bash
scripts/start-dev.sh
```
This will:
- Install frontend dependencies
- Start Vite dev server on port 5173
- Start backend (FastAPI + Hypercorn) on port 8000
- Start log server on port 9000

Do **not** run `npm run dev` directly — always use the script to avoid stale processes.

---

## Coding Rules
- Never use placeholders (`...`, `TODO`, `unchanged`).
- Always commit atomic changes.
- Delete operations must use `PATCH { archived: true }`.
- UI must filter out archived entities (e.g. tasks, phases, boards).

---

## Example Usage
```ts
import api from "../lib/api";

// Archive a task
await api.patch(`/db/tasks/${taskId}`, { archived: true });

// Fetch projects (archived filtered by backend)
const res = await api.get("/db/projects");
```

This ensures consistent API usage, soft delete handling, and stable dev workflow.