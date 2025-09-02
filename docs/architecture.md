# Holly v6 – Architecture Map (Auto-Generated)

_Last updated by CI/CD pipeline._

## 📦 Repo Structure
```
README.md
ROADMAP.md
Users:juliesimac:dev:holly-.textClipping
__pycache__
apps
docs
infra
local_agent.py
main.py
package.json
pnpm-lock.yaml
scripts
tests
update.sh
vercel.json

./__pycache__:
main.cpython-313.pyc

./apps:
backend
frontend
ops

./apps/backend:
__init__.py
data

./apps/backend/data:
dummy_tasks.csv

./apps/frontend:
index.html
node_modules
package-lock.json
package.json
placeholder.md
pnpm-lock.yaml
postcss.config.js
src
tailwind.config.js
tsconfig.json
tsconfig.node.json
update.sh
vite.config.ts

./apps/frontend/node_modules:
@fullcalendar
typescript

./apps/frontend/node_modules/@fullcalendar:
core
interaction

./apps/frontend/src:
App.tsx
Calendar.tsx
CalendarView.tsx
LeftPanel.tsx
Logo.png
MainContent.tsx
RightPanel.tsx
components
data
dummyData.ts
index.css
main.tsx
store
styles
tabs
theme.ts
utils

./apps/frontend/src/components:
CalendarTab.tsx
CalendarView.tsx
Header.tsx
InboxTab.tsx
LeftPanel.tsx
MainPanel.tsx
MainView.tsx
ProjectsTab.tsx
RightPanel.tsx
SidePanel.tsx
Sidebar.tsx
TasksTab.tsx
TopBar.tsx
VoiceBar.tsx
ui

./apps/frontend/src/components/ui:
Card.tsx
NavItem.tsx

./apps/frontend/src/data:
habits.ts
projects.ts
rewards.ts
tasks.ts

./apps/frontend/src/store:
useTaskStore.ts

./apps/frontend/src/styles:
calendar.css

./apps/frontend/src/tabs:
TabCalendar.tsx
TabDashboard.tsx
TabHabits.tsx
TabProjects.tsx
TabRewards.tsx
TabSettings.tsx
TabTasks.tsx

./apps/frontend/src/utils:
dbUtils.ts
groupTasks.ts

./apps/ops:
main.py

./docs:

./infra:
README.md
data
docker-compose.yml

./infra/data:
holly.db
seed.sql

./scripts:
generate_architecture.py

./tests:
test_placeholder.py

```

## 🔎 Frontend API Calls
- apps/frontend/src/tabs/TabTasks.tsx: `${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    }
- apps/frontend/src/tabs/TabCalendar.tsx: `${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    }
- apps/frontend/src/tabs/TabHabits.tsx: `${import.meta.env.VITE_API_URL}/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
      },
      body: JSON.stringify({ sql: "SELECT habit_id, habit_name, frequency, streak, goal, last_completed FROM habits" }
- apps/frontend/src/tabs/TabProjects.tsx: `${import.meta.env.VITE_API_URL}/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
      },
      body: JSON.stringify({ sql: "SELECT project_id, name, status, progress FROM projects" }

## ⚙️ Backend Endpoints (FastAPI)
- apps/ops/main.py: GET /ops/status
- apps/ops/main.py: GET /health
- apps/ops/main.py: POST /ops/deploy
- apps/ops/main.py: POST /ops/restart
- apps/ops/main.py: POST /ops/shell
- apps/ops/main.py: GET /ops/ls
- apps/ops/main.py: POST /ops/cat
- apps/ops/main.py: POST /ops/write
- apps/ops/main.py: POST /ops/exec
- apps/ops/main.py: GET /git/check-token
- apps/ops/main.py: POST /git/create-branch
- apps/ops/main.py: POST /git/commit-multi
- apps/ops/main.py: POST /git/open-pr
- apps/ops/main.py: POST /git/close-pr
- main.py: GET /db/tasks
- main.py: POST /db/tasks
- main.py: GET /ops/status
- main.py: POST /ops/shell
- main.py: POST /ops/ls
- main.py: POST /ops/cat
- main.py: POST /ops/write
- main.py: POST /git/create-branch
- main.py: POST /git/commit-multi
- main.py: POST /git/open-pr
- main.py: POST /git/close-pr

## 🔗 Cross-link Frontend ↔ Backend
- apps/frontend/src/tabs/TabTasks.tsx: `${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    } → GET /db/tasks (main.py)
- apps/frontend/src/tabs/TabTasks.tsx: `${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    } → POST /db/tasks (main.py)
- apps/frontend/src/tabs/TabCalendar.tsx: `${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    } → GET /db/tasks (main.py)
- apps/frontend/src/tabs/TabCalendar.tsx: `${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    } → POST /db/tasks (main.py)
- apps/frontend/src/tabs/TabHabits.tsx: `${import.meta.env.VITE_API_URL}/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
      },
      body: JSON.stringify({ sql: "SELECT habit_id, habit_name, frequency, streak, goal, last_completed FROM habits" } → ❌ no backend match
- apps/frontend/src/tabs/TabProjects.tsx: `${import.meta.env.VITE_API_URL}/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
      },
      body: JSON.stringify({ sql: "SELECT project_id, name, status, progress FROM projects" } → ❌ no backend match
