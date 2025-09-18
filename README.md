# Holly v6

## Overview
Holly v6 is a task and workflow management system with frontend (React + MUI) and backend (FastAPI + SQLite/Postgres) applications.

---

## Architecture Overview

Holly v6 is structured as a monorepo with **frontend** and **backend** apps, plus supporting scripts and logs.

### Repository Layout
```
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
└── .env / .env.example       # Environment configuration
```

### Backend Overview
- **Framework**: FastAPI + SQLAlchemy.
- **Entrypoint**: `apps/backend/main.py` → exposes REST API under `/db/*`.
- **Models**: ORM definitions in `models.py`.
- **Schemas**: Pydantic models in `schemas.py` (validation + serialization).
- **Database**: Configured via `database.py`, using `DATABASE_URL` (Postgres/SQLite).
- **Rules**: See `apps/backend/README.md` for full API reference and soft delete behavior.

### Frontend Overview
- **Framework**: React (Vite) with **MUI Core + Joy UI** (no other UI libs allowed).
- **Entrypoint**: `apps/frontend/src/main.tsx`.
- **Layout**: Root component in `App.tsx`.
- **API Client**: `src/api/` contains REST clients (e.g. `tasks.ts`) with camelCase ↔ snake_case mapping.
- **UI Components**: `src/components/` for dialogs/forms, `src/tabs/` for feature views.
- **Rules**: See `apps/frontend/README.md` for UI guidelines and TaskDialog behaviors.

### Development Workflow
1. **Frontend**: React app with MUI Core + Joy UI, talks to backend via REST API.
2. **Backend**: FastAPI + SQLAlchemy + Postgres/SQLite (configured via `DATABASE_URL`).
3. **Logging**: All dev output is written to `logs/`. Always check logs when debugging.
4. **Ops Agent**: Root `main.py` provides `/ops/*` and `/git/*` endpoints for automation (used by GPT assistant).

### Key Principles
- **Single Source of Truth**:  
  - Frontend rules → `apps/frontend/README.md`.  
  - Backend rules → `apps/backend/README.md`.  
  - Architecture overview → `README.md` (this file).  
- **No duplication**: Each README owns its own scope.

---

## Task Model

Tasks include the following fields:
- `task_id` (integer, primary key)
- `task_name` (string)
- `description` (string, nullable)
- `board_id` (integer, nullable)
- `project_id` (integer, nullable)
- `phase_id` (integer, nullable)
- `group_id` (integer, nullable)
- `status` (string, e.g. "Todo", "In Progress", "Done")
- `urgency_score` (integer)
- `priority` (string, e.g. "Low", "Medium", "High", "Urgent")
- `category` (string, nullable)
- `token_value` (integer)
- `due_date` (date)
- `start_date` (timestamp, nullable)
- `end_date` (timestamp, nullable)
- `effort_level` (string, e.g. "Low", "Medium", "High")
- `archived` (boolean, soft delete flag)
- `pinned` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `notes` (text, nullable) ✅

---

## Intended Dependency Structure (Not Fully Implemented)

Holly v6 is designed to support **task and phase dependencies**.  
This logic is not yet fully implemented, but the database fields exist to enable it.

### Phases
- Phases belong to projects.
- `depends_on_previous` (boolean) defines whether a phase must wait for the previous one to complete.
- If true, all tasks in the prior phase must be marked as `Done` before this phase is considered active.

### Tasks
- Tasks can belong to a board, project, or phase.
- `parent_task_id` allows tasks to depend on another task.
- By chaining parent IDs, tasks can be set in strict sequence:
  - Task 2 → `parent_task_id = Task 1`
  - Task 3 → `parent_task_id = Task 2`
  - Task 4 → `parent_task_id = Task 3`
- This provides **linear dependencies** (tasks must be completed in order).
- Branching dependencies (Task 5 depends on both Task 2 and Task 3) are not yet implemented.
  - For now, this is modeled using **phase-level dependencies** instead.

### Future Extensions
- A `task_dependencies` join table could be introduced to support branching dependencies.
- Additional UI/UX will enforce blocked tasks until their prerequisites are complete.