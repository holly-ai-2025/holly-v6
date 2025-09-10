# Frontend (Holly AI v6)

## Overview
The frontend now supports **time-based tasks** integrated into both the task list and calendar views.

---

## 🎨 TaskDialog.tsx
- Added **Start Date, Start Time, and End Time** pickers.
- Serializes dates/times correctly for backend:
  - `due_date` → `YYYY-MM-DD`
  - `start_date` / `end_date` → `YYYY-MM-DDTHH:mm:ss`
- Ensures task name is required.

---

## 📋 TabTasks.tsx
- Shows times inline with task title in grey font (e.g. `Doctor appointment 16:00 – 17:30`).
- Payload builder strips null/empty fields.
- Debug logs added for PATCH/POST payloads.

---

## 📅 TabCalendar.tsx
- Full integration with FullCalendar:
  - **Day/Week views**: timed tasks placed in correct slots.
  - **Month view**: tasks ordered by time, untimed at top as all-day.
  - **Drag-to-create**: passes selected times into TaskDialog.
  - **Drag all-day → timed slot**: assigns proper `start_date`/`end_date`.
  - **Drag/resize**: updates DB correctly.
- Tooltip fix: `<span>` wrapper avoids MUI ref error.
- Event coloring based on task status.

---

## 🎨 CalendarStyles.css
- Custom styles for FullCalendar events based on task status:
  - `Todo`
  - `In Progress`
  - `Done`
  - `Pinned`

---

## ⚠️ Problems & Fixes
- `.toISOString()` rejected by backend → fixed with `dayjs().format("YYYY-MM-DDTHH:mm:ss")`.
- Missing end times in Day/Week views → fixed with fallback `end_date = start_date + 1h`.
- Drag-to-create not setting times → fixed by passing times into TaskDialog.
- Dragging all-day tasks not updating → fixed by enforcing `start_date`/`end_date` in `eventDrop`.
- Resize support added via `eventResizableFromStart` + `eventResize` handler.
- Tooltip ref errors fixed with `<span>` wrapper.

---

## 📝 Summary
The frontend now provides **seamless drag, drop, and resize task scheduling** across tasks and calendar views, synchronized with backend.