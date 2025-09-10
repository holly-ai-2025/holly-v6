# Frontend (Holly AI v6)

## Overview
The frontend is built with **React + MUI** and integrates task management with **calendar scheduling**.

---

## 🎨 Features
- TaskDialog with Start Date, Start Time, End Time pickers.
- TabTasks with inline task time display.
- TabCalendar with drag, drop, and resize support.
- CalendarStyles.css with custom styles for task statuses.

---

## 🔌 Backend Integration
- Correctly serializes dates/times for backend:
  - `due_date` → `YYYY-MM-DD`
  - `start_date`, `end_date` → `YYYY-MM-DDTHH:mm:ss`
- Uses fetch API with proper PATCH/POST payloads.
- Captures console logs and forwards them to backend `/log` endpoint.

---

## ⚠️ Problems & Fixes
- Fixed `.toISOString()` errors by switching to `dayjs().format("YYYY-MM-DDTHH:mm:ss")`.
- Fixed missing end times by defaulting `end_date = start_date + 1h`.
- Fixed drag-to-create not setting times.
- Fixed tooltip ref errors with `<span>` wrapper.

---

## 📝 Summary
The frontend now provides **seamless scheduling** of tasks across list and calendar views, fully synchronized with backend.