# Frontend (Holly v6)

## Overview
The frontend is a React + Vite application using MUI Core + Joy UI for all styling and components.
No other UI libraries are permitted except explicitly listed dependencies.

### Directory Structure
apps/frontend/
│
├── src/
│   ├── main.tsx       # React entrypoint
│   ├── App.tsx        # Main layout wrapper
│   ├── api/           # REST API clients (e.g. tasks.ts, boards.ts)
│   ├── components/    # Reusable dialogs, forms, modals
│   └── tabs/          # Feature views (Tasks, Boards, Calendar, etc.)
│
├── vite.config.ts     # Vite build configuration
├── package.json
└── README.md          # (this file)

### Tech Stack
- React 18 (Vite)
- MUI Core + Joy UI (no other UI kits)
- TypeScript
- Axios (API requests)
- Redux Toolkit (state management)

### API Clients
- Located in src/api/.
- Handle REST calls to backend /db/* endpoints.
- Automatic camelCase ↔ snake_case mapping for API compatibility.

### Components
- `src/components/TaskDialog.tsx` → Handles create/edit for tasks.
- `src/components/ProjectBoardView.tsx` → Displays board + project hierarchy.
- Shared dialogs and UI primitives live here.

### Tabs
Feature views under `src/tabs/`:
- `TabTasks.tsx` → Task lists, Kanban view.
- `TabBoards.tsx` → Board management.
- `TabCalendar.tsx` → FullCalendar integration with tasks.

### Required Dependencies
- @mui/material
- @mui/joy
- @mui/system
- @mui/x-data-grid
- @mui/x-date-pickers
- @date-io/date-fns@^3
- date-fns@^3
- dayjs
- react-quill
- @fullcalendar/react
- @fullcalendar/daygrid
- @fullcalendar/timegrid
- @fullcalendar/interaction
- @hello-pangea/dnd

### Development
Start frontend manually:
```bash
cd apps/frontend
pnpm install
pnpm dev
```
Runs on http://localhost:5173 (auto-increments if busy).

### Integration with Backend
- Backend API served by Hypercorn on port 8000.
- Frontend talks to backend via REST API (/db/*).
- Ensure Postgres is running before starting frontend.

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

---

## TaskDialog Updates

### Sliders
- **Priority**, **Effort**, and **Tokens** use custom gradient sliders.
- Value shown on the right of each slider.

### Input Fields
- Standardized to **42px height**.
- Description allows multiline input.

### Date & Time
- Task supports **Due Date**, **Start Time**, **End Time**.
- End auto-fills to +1h after Start (editable).
- Tasks cannot span multiple days.

### Status Toggles
- Controlled by ToggleButtonGroup:
  - **Todo** → Blue
  - **In Progress** → Orange
  - **Done** → Green

### Connections Section
- Accordion with grey header + white text.
- Dropdowns for **Board**, **Phase**, free-text **Category**.

### Notes Section
- Accordion for long-form notes.
- Includes placeholder **Attach Files** button (disabled).
- `notes` included in payload.

### Delete Behavior
- Always soft delete (`archived=true`).
- Archived tasks fetched but filtered out in views.

---

## Task Management

### Archived Tasks
- Soft deleted via `archived = true`.
- Tabs (`TabTasks`, `TabCalendar`, `TabBoards`) filter out archived tasks.
- Possible future Archive tab → skip filter.

### Delete Support
- `TaskDialog` supports `onDelete` → triggers soft delete + refresh.
- Passed down as `handleDialogDelete` from tabs.

### Consistency
- Each tab implements its own `fetchTasks()` with `!t.archived` filter.
- Do not move filter into `api/tasks.ts` (reserved for archive view).

---

## Development Notes
- All UI = **MUI Core + Joy UI** only.
- Styling → `sx` props or `styled()`.
- ✅ Removed obsolete Tailwind components.
- Critical files (App.tsx, MainContent.tsx, BoardDetailPage.tsx, TaskDialog.tsx) must never be stripped or placeholdered.
- Tooltip usage:
  - Children must forward `ref`.
  - Use `React.forwardRef` in custom components (e.g., TaskCard).
  - Do not wrap MUI X components directly; wrap in `<span>` if needed.
- Tab components must `export default` (imports rely on it).
- Drag and drop → use `@hello-pangea/dnd` (not react-beautiful-dnd).
