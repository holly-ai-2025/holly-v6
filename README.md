# Holly AI v6

## Overview
Holly AI v6 integrates task management with calendar-based scheduling. Tasks can now include start and end times, enabling full day/week calendar visualization and drag-and-drop scheduling.

---

## 🔧 Backend Changes

### Database
- Added new fields to **tasks** table:
  - `start_date` (`DATETIME`)
  - `end_date` (`DATETIME`)
- Changed `due_date` to **DATE only** (no time component).

### Schemas
- Updated `TaskBase`, `TaskCreate`, and `TaskUpdate` to include:
  - `start_date: Optional[datetime]`
  - `end_date: Optional[datetime]`
- Serialization rules:
  - `due_date` → `YYYY-MM-DD`
  - `start_date`, `end_date` → `YYYY-MM-DDTHH:mm:ss`

### API Endpoints
- `POST /db/tasks` and `PATCH /db/tasks/{id}` now accept `start_date` and `end_date`.
- Fixed **422 errors** caused by `.toISOString()` (with `Z` suffix). Backend requires `dayjs().format("YYYY-MM-DDTHH:mm:ss")`.

---

## 🎨 Frontend Changes

### TaskDialog.tsx
- Added Start Date, Start Time, End Time fields.
- Handles serialization to correct backend formats.
- Validation: task name required.

### TabTasks.tsx
- Displays task times inline with title.
- Times shown as `HH:mm – HH:mm` in grey font.
- Introduced `buildPayload` function to strip null/empty values.
- Debug logging for PATCH/POST payloads.

### TabCalendar.tsx
- Integrated with FullCalendar:
  - **Day/Week Views**: tasks with times render in correct slots.
  - **Month View**: tasks ordered by time within each day; untimed tasks appear as all-day at top.
  - **Drag-to-create**: fills TaskDialog with selected start/end.
  - **Drag all-day → timed slot**: assigns proper `start_date`/`end_date`.
  - **Drag/resize**: updates DB with correct time format.
- Tooltip fix: wrapped `<span>` inside `<Tooltip>` to prevent ref errors.

### CalendarStyles.css
- Defines event colors for task statuses (`Todo`, `In Progress`, `Done`, `Pinned`).

---

## ⚠️ Problems & Fixes
- **422 validation errors** → caused by `.toISOString()` → fixed by enforcing `dayjs().format("YYYY-MM-DDTHH:mm:ss")`.
- **Tasks missing in Day/Week views** → no `end_date` → fixed with fallback `end_date = start_date + 1h`.
- **Drag-to-create not saving times** → fixed by passing `start_date` and `end_date` into TaskDialog.
- **Dragging all-day tasks into timed slots not updating** → fixed by forcing assignment of times in `eventDrop`.
- **Resizing tasks unsupported** → enabled `eventResizableFromStart` and added `eventResize` handler.
- **Tooltip ref errors** → fixed with `<span>` wrapper.
- **Placeholder overwrites** during development → rolled back and carefully rewrote full files.

---

## 📝 Summary
The system now supports **time-based scheduling for tasks**, integrated across:
- Database
- Backend API
- Frontend task list (TabTasks)
- Frontend calendar views (TabCalendar)

This enables full drag/drop and resize task management with correct synchronization to the database.