# Holly v6

## Overview
Holly v6 is a task and workflow management system with frontend (React + MUI) and backend (FastAPI + PostgreSQL) applications.
⚠️ SQLite is no longer supported in current dev setup. Use Postgres 15.

## Architecture Overview
Holly v6 is structured as a monorepo with frontend and backend apps, plus supporting scripts and logs.

### Repository Layout
holly-v6/
│
├── apps/
│   ├── backend/              # FastAPI + SQLAlchemy service
│   │   ├── main.py           # API entrypoint (CRUD routes)
│   │   ├── models.py         # SQLAlchemy ORM models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── database.py       # DB session + engine setup
│   │   └── README.md         # Backend API rules & examples
│   │
│   └── frontend/             # React + MUI (Vite build)
│       ├── src/
│       │   ├── main.tsx      # React entrypoint
│       │   ├── App.tsx       # Main layout wrapper
│       │   ├── api/          # REST API clients (e.g. tasks.ts)
│       │   ├── lib/api.ts    # Unified Axios client (all API calls go through here)
│       │   ├── components/   # Reusable UI components
│       │   └── tabs/         # Feature views (e.g. Task tabs)
│       └── README.md         # Frontend UI rules & guidelines
│
├── scripts/                  # Dev & ops scripts
│   └── start-dev.sh          # Starts backend + frontend + logging
│
├── logs/                     # Runtime logs
│   ├── backend-live.log      # FastAPI live logs
│   ├── backend-hypercorn.log # Manual Hypercorn runs
│   └── frontend-console.log  # Captured browser console logs
│
├── main.py                   # Ops Agent API (git + ops tooling)
├── README.md                 # High-level overview + architecture
├── docs/CHANGELOG.md         # All schema + API changes (mandatory updates)
└── .env / .env.example       # Environment configuration

## Backend Overview
Framework: FastAPI + SQLAlchemy.
Entrypoint: apps/backend/main.py → exposes REST API under /db/*.
Models: ORM definitions in models.py.
Schemas: Pydantic models in schemas.py (validation + serialization).
Database: Configured via database.py, using DATABASE_URL (Postgres only).
Rules: See apps/backend/README.md for API reference and soft delete behavior.
CRUD: All major entities (tasks, boards, projects, phases, groups, items) have CRUD endpoints. Soft delete is supported for tasks + boards.

## Frontend Overview
Framework: React (Vite) with MUI Core + Joy UI (no other UI libs allowed).
Entrypoint: apps/frontend/src/main.tsx.
Layout: Root component in App.tsx.
API Client: src/lib/api.ts is the unified Axios client. All modules in src/api/ now use this client, which:
- Applies camelCase ↔ snake_case mapping in each API wrapper.
- Automatically attaches the header `ngrok-skip-browser-warning: true`.
- Selects baseURL dynamically: localhost:8000 in dev, VITE_API_URL in Vercel.
- Legacy `client.ts` re-exports this unified client for compatibility.
UI Components: src/components/ for dialogs/forms, src/tabs/ for feature views.
Dependencies: Requires date-fns@^3, @date-io/date-fns@^3, @mui/system, @mui/x-date-pickers, react-quill, dayjs, and @fullcalendar/*.
Rules: See apps/frontend/README.md for UI guidelines and TaskDialog behaviors.

## Development Workflow
- Frontend: React app with MUI Core + Joy UI, talks to backend via REST API.
- Backend: FastAPI + SQLAlchemy + Postgres (configured via DATABASE_URL).
- Logging: All dev output is written to logs/. Always check logs when debugging.
- Ops Agent: Root main.py provides /ops/* and /git/* endpoints for automation (used by GPT assistant).
- Startup Script: Use scripts/start-dev.sh to launch both backend (Hypercorn) and frontend (Vite) together.

### Changelog Rule
- ⚠️ **All schema or API changes must include a matching update in `docs/CHANGELOG.md`.**
- If committing changes to `models.py`, `schemas.py`, or `main.py`, update the changelog in the same PR/commit.
- Format: date + description of fields/endpoints added/changed/deprecated.

### Pre-commit Hook
- A safety hook is installed under `.githooks/pre-commit`.
- To enable it, run:
```bash
git config core.hooksPath .githooks
```
- It enforces:
  - ❌ No placeholders/stubs (`...`, `placeholder`, `unchanged`).
  - 📑 Schema/API changes require `docs/CHANGELOG.md` update.
  - 🎨 Frontend must not import stray UI libraries (Tailwind, Chakra, AntD, Shadcn).

### Snapshot Branch Workflow
For safeguarding local work:
```bash
git add -A
git commit -m "SNAPSHOT: local working state"
git push origin backup/my-snapshot-$(date +%Y%m%d%H%M%S)
```

## Database Setup
### Start Postgres
```bash
brew services start postgresql@15
brew services list | grep postgres
```

### Create DB + User
```sql
CREATE DATABASE holly_v6;
CREATE USER holly_user WITH PASSWORD 'holly_pass';
GRANT ALL PRIVILEGES ON DATABASE holly_v6 TO holly_user;
```

## Troubleshooting
- Lock file errors: remove postmaster.pid after killing old processes.
- Shared memory issues: clear with:
  ```bash
  ipcs -m | awk '/juliesimac/ {print $2}' | xargs -n 1 ipcrm -m
  ```

## Task Model
Tasks include the following fields:
- task_id (integer, primary key)
- task_name (string)
- description (string, nullable)
- board_id (integer, nullable)
- project_id (integer, nullable)
- phase_id (integer, nullable)
- group_id (integer, nullable)
- status (string, e.g. "Todo", "In Progress", "Done")
- urgency_score (integer)
- priority (string, e.g. "Low", "Medium", "High", "Urgent")
- category (string, nullable)
- token_value (integer)
- due_date (date)
- start_date (timestamp, nullable)
- end_date (timestamp, nullable)
- effort_level (string, e.g. "Low", "Medium", "High")
- archived (boolean, soft delete flag)
- pinned (boolean)
- created_at (timestamp)
- updated_at (timestamp)
- notes (text, nullable) ✅

## Intended Dependency Structure (Not Fully Implemented)
Holly v6 is designed to support task and phase dependencies.
This logic is not yet fully implemented, but the database fields exist to enable it.

### Phases
- Belong to projects.
- `depends_on_previous` (boolean) defines whether a phase must wait for the previous one to complete.
- If true, all tasks in the prior phase must be marked as Done before this phase is considered active.

### Tasks
- Tasks can belong to a board, project, or phase.
- `parent_task_id` allows tasks to depend on another task.
- By chaining parent IDs, tasks can be set in strict sequence.

Example:
```
Task 2 → parent_task_id = Task 1
Task 3 → parent_task_id = Task 2
Task 4 → parent_task_id = Task 3
```

Branching dependencies (Task 5 depends on Task 2 + Task 3) are not yet implemented.

## Future Extensions
- A `task_dependencies` join table could be introduced to support branching dependencies.
- Additional UI/UX will enforce blocked tasks until prerequisites are complete.

## Known Gotchas
- SQLite is not supported: must use Postgres 15.
- Ops Agent uses uvicorn; backend API uses hypercorn.
- Frontend ports: Vite will increment ports if 5173 is already in use.
- Goal field deprecated: present in schemas, not in DB.
- Shared memory cleanup may be required after hard crashes.