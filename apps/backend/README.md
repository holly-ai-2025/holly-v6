# Backend Guide

This folder contains the FastAPI backend for Holly AI.

---

## 🔄 Updating Backend for New Columns / Tables

### 1. **Models (`models.py`)**
- Add new columns to the appropriate SQLAlchemy model.
- Example:
  ```python
  class Task(Base):
      xp_level = Column(Integer, default=0)
  ```

### 2. **Database (`database.py`)**
- Ensure the DB file is correct (`apps/backend/holly.db`).
- Run `Base.metadata.create_all(bind=engine)` to apply changes (for dev).
- For production/stable usage, consider **Alembic migrations**.

### 3. **Routes (`main.py`)**
- **Current:**
  - `GET /db/tasks` → fetch grouped tasks
  - `PATCH /db/tasks/{task_id}` → update fields like `status`, `due_date`
  - `GET /db/projects` → fetch projects

- **Future (to be implemented):**
  - `POST /db/tasks` → create new task
  - `DELETE /db/tasks/{task_id}` → delete task
  - Extended `PATCH /db/tasks/{task_id}` → allow updating notes, categories, tags, etc.

### 4. **Seeding**
- Insert dummy data with new fields for testing.
- Example (SQLite):
  ```sql
  ALTER TABLE tasks ADD COLUMN notes TEXT;
  UPDATE tasks SET notes = 'Example note' WHERE task_id = 1;
  ```

---

## 🚀 Best Practices
- Keep `models.py` and DB schema in sync.
- Remove old DB files when schema changes to avoid mismatches.
- Use debug logs in routes to confirm how many items are returned.
- Consider migrations once schema stabilizes.

---

## 📌 Next Step: Task Popup Cards
We plan to add a **task detail popup** in the frontend:
- Triggered when a task card is clicked.
- Displays full details: notes, categories, due date, status.
- Allows editing inline (notes textarea, dropdowns for categories, etc.).

### Backend requirements for that:
- Extend `PATCH /db/tasks/{task_id}` to update:
  - `notes`
  - `category`
  - `priority`
- Add `POST /db/tasks` for creating tasks directly from frontend.
- Add `DELETE /db/tasks/{task_id}` for cleanup.

When starting this step:
1. Add missing fields to `Task` model.
2. Update DB schema (via migration or reset).
3. Extend PATCH route.
4. Adjust frontend popup to call these endpoints.
