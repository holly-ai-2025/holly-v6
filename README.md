# Holly AI v6

## Overview
Holly AI v6 integrates **task management with calendar scheduling**, supporting full drag-and-drop task workflows.

---

## 🔧 Backend
- FastAPI backend with SQLite database.
- Entities: Task, Project, Board, Tag, Reflection, Attachment, Link, Phase, TaskActivity.
- Database:
  - `due_date` (`DATE`, formatted as **DDMMYYYY**)
  - `start_date` (`DATETIME`, `YYYY-MM-DDTHH:mm:ss`)
  - `end_date` (`DATETIME`, `YYYY-MM-DDTHH:mm:ss`)
- Schemas:
  - Updated for Pydantic v2 (`from_attributes = True`).
- Endpoints:
  - `/db/tasks` (CRUD)
  - `/db/projects` (read/update)
  - `/db/boards` (read)
  - `/db/tags` (create/read)
  - `/db/reflections` (create/read)
  - `/db/attachments` (create)
  - `/db/links` (create)
  - `/log` (frontend log capture)

---

## 🎨 Frontend
- Built with React + MUI.
- Features:
  - TaskDialog with start/end time pickers.
  - TabTasks with inline times.
  - TabCalendar with drag, drop, resize.
- Styles:
  - CalendarStyles.css with event coloring by status.

---

## ⚠️ Known Fixes
- Date formatting requires:
  - `due_date` = `DDMMYYYY`
  - `start_date`, `end_date` = `YYYY-MM-DDTHH:mm:ss`
- Tasks without `end_date` default to +1h.
- Tooltip ref errors fixed with `<span>` wrapper.

---

## 📝 Summary
Holly AI v6 delivers **time-based task scheduling** across database, backend API, and frontend UI, with correct synchronization and developer logging support.