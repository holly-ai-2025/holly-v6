# Holly v6 – Architecture Map (Draft 1)

## 📦 Repo Structure
- **Root**: `main.py` (legacy?), `update.sh`, `vercel.json`, `package.json`
- **apps/frontend**: React + Vite app, MUI components, tabs UI
- **apps/backend**: currently only `__init__.py` + dummy data, missing FastAPI app
- **apps/ops**: FastAPI service for DevOps & GitOps (`/ops/*`, `/git/*` endpoints)
- **infra**: SQLite database (`holly.db`, `seed.sql`), docker-compose scaffolding
- **tests**: placeholder

---

## 🖥️ Frontend
- **Entrypoint**: `src/main.tsx` (React root), `src/App.tsx` (container)
- **Tabs**: `TabTasks`, `TabCalendar`, `TabProjects`, `TabHabits`, `TabRewards`, `TabSettings`, `TabDashboard`
- **Data**: `src/data/*` (dummy static data for tasks, habits, projects, rewards)
- **Store**: `useTaskStore.ts` (likely Zustand or custom)
- **Styling**: `index.css`, `styles/calendar.css`, `theme.ts`

### 🔎 API Calls from Tabs
- `TabTasks.tsx` → `GET /db/tasks`
- `TabProjects.tsx` → `POST /db/query`
- `TabHabits.tsx` → `POST /db/query`

👉 These expect a backend that doesn’t yet exist.

---

## ⚙️ Backend (expected)
- **apps/backend**: should host FastAPI app exposing `/db/*` endpoints.
- Right now: only dummy CSV (`dummy_tasks.csv`).
- Missing: `/db/tasks`, `/db/query` → must be implemented against SQLite.

---

## 🛠️ Ops Service
- **apps/ops/main.py** → FastAPI app for DevOps only.
- Endpoints:
  - `/ops/status`, `/health`
  - `/ops/shell`, `/ops/ls`, `/ops/cat`, `/ops/write`, `/ops/exec`
  - `/ops/deploy`, `/ops/restart`
  - `/git/check-token`, `/git/create-branch`, `/git/commit-multi`, `/git/open-pr`, `/git/close-pr`
- ✅ Works, but not part of runtime backend.

---

## 📊 Infra
- `infra/data/holly.db` → SQLite DB (with seed SQL)
- `infra/docker-compose.yml` → future multi-service orchestration

---

## 🚨 Gaps & Next Steps
- ❌ Backend app missing in `apps/backend`.
- ❌ No `/db/tasks` or `/db/query` endpoints → causes frontend 404s.
- ⚠️ Frontend seeded with inconsistent task statuses (`Todo`, `In Progress`, etc.) vs allowed values (`todo`, `in progress`, `done`).

### ✅ Next Steps
1. Scaffold `apps/backend/main.py`:
   - FastAPI + SQLite connection.
   - `/db/tasks` returning tasks.
   - `/db/query` for habits/projects.
2. Normalize task status values.
3. Update architecture map after backend scaffolding.
