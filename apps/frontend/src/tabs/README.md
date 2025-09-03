# Tabs Folder Guide

This folder contains the React components for each main dashboard tab (Tasks, Projects, Habits, etc.). Each tab fetches data from the backend API (`apps/backend/main.py`) and renders it using MUI components.

---

## 🔄 Updating Tabs for New Columns / Data
When the backend database schema changes (new columns, renamed fields, new tables), you’ll likely need to:

### 1. **Backend**
- Add the new field to `apps/backend/models.py`.
- Ensure the database table has the column (either via `Base.metadata.create_all()` or migrations).
- Update the API route in `apps/backend/main.py` to include the new field in its response JSON.

### 2. **Frontend**
- Update the interface for the tab (e.g., `Task` interface in `TabTasks.tsx`).
- Adjust how data is displayed (add new MUI components for new fields).
- If the frontend must send updates (PATCH/POST), ensure the new field is included in `updateTask` (or similar functions).

### 3. **Seeding / Testing**
- If working locally, seed the DB with dummy values for the new field so you can test UI changes.
- Example: add a new column `xp_level` to tasks:
  - Backend: add to `Task` model + `/db/tasks` response.
  - Frontend: add `xp_level?: number` to `Task` interface, render a badge in the UI.

---

## 🚀 Best Practices
- Always keep **backend models** and **frontend interfaces** in sync.
- Log the raw API response in the tab when testing (`console.log("Raw data", data)`) — this catches mismatches early.
- Remove old DB files when switching to a new schema to avoid confusion.
- Consider migrations (Alembic) once the schema stabilizes.

---

## 📌 Tip
If the frontend renders empty data (`[]`) but the DB has rows, it usually means:
- Wrong DB file is in use.
- Backend models don’t match actual DB schema.
- API route isn’t returning the new field.

Check backend logs (`print(f"Returning {len(items)} ...")`) to confirm what’s being sent.
