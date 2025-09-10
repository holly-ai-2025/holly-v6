# Frontend README – Holly v6

## Current State
- Frontend rebuilt to sync with backend changes.
- UI framework: MUI Core + Joy UI.
- Startup: run `./scripts/dev.sh` (starts backend, frontend, logs).

## Tasks Integration
- Tasks load from `/db/tasks`.
- Create/update via TaskDialog → uses `createTask`, `updateTask`.
- Delete supported via DELETE route.

## Date Handling
- All dates handled as ISO (`YYYY-MM-DD`).
- Utilities in `src/utils/taskUtils.ts`:
  - `parseToISO` → normalize DDMMYYYY or ISO to ISO.
  - `parseToDate` → get JS Date from string.
  - `todayISO` → get today in ISO.
  - `normalizeTaskForApi` → prepares task payload for backend.

## Components
- **TaskDialog**
  - Fields: name, description, due_date, start/end time, priority, status.
  - New tasks default due_date = today.
  - Delete button shown for existing tasks.
- **TasksTab**
  - Groups tasks into Overdue, Today, Later.
  - Uses `parseToDate` to align with ISO.
  - Comparison is date-only (ignores time) to prevent mis-grouping.
- **TabCalendar (ACTIVE)**
  - Main calendar implementation.
  - Located at `src/tabs/TabCalendar.tsx`.
  - Handles task fetch, event mapping, drag/drop, and editing.
  - Uses ISO dates consistently via `parseToISO`.
  - Legacy files `CalendarView.tsx` and `CalendarTab.tsx` have been removed.

## Development Notes
- Always use ISO for new features.
- If adding fields to Task:
  1. Update API calls in `src/api/tasks.ts`.
  2. Update TaskDialog to include inputs.
  3. Ensure `normalizeTaskForApi` prepares new fields properly.
- Use logs at `logs/frontend-console.log` to debug.