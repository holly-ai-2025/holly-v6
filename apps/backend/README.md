# Backend (Holly AI v6)

## Overview
The backend now supports **time-based task scheduling**, with full handling of `start_date` and `end_date`.

---

## 🔧 Database Changes
- Added `start_date` (`DATETIME`) column to `tasks`.
- Added `end_date` (`DATETIME`) column to `tasks`.
- Changed `due_date` to **DATE only**.

---

## 📦 Schemas
- Updated `TaskBase`, `TaskCreate`, `TaskUpdate`:
  - `start_date: Optional[datetime]`
  - `end_date: Optional[datetime]`
  - `due_date: Optional[date]`
- Validation formats:
  - `due_date` → `YYYY-MM-DD`
  - `start_date`, `end_date` → `YYYY-MM-DDTHH:mm:ss`

---

## 🔌 Endpoints
- `POST /db/tasks`
  - Accepts `task_name`, `due_date`, `start_date`, `end_date`, plus other fields.
- `PATCH /db/tasks/{id}`
  - Accepts updates for `start_date` and `end_date`.
- **Validation fixes**:
  - Replaced `.toISOString()` with `dayjs().format("YYYY-MM-DDTHH:mm:ss")` to avoid 422 errors.

---

## ⚠️ Problems & Fixes
- **422 Unprocessable Entity**: Caused by ISO timestamps ending in `Z`. Fixed by enforcing format `YYYY-MM-DDTHH:mm:ss`.
- **Missing end times**: Certain views failed without `end_date`. Fixed by assigning default `end_date = start_date + 1h` if not provided.

---

## 📝 Summary
The backend now fully supports **time-based task scheduling**, with proper validation, formatting, and database fields aligned with frontend requirements.