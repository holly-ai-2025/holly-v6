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
- Update response JSON in API endpoints to include the new field.
- Example:
  ```python
  "xp_level": t.xp_level,
  ```
- If accepting updates, extend `PATCH`/`POST` to handle the new field.

### 4. **Seeding**
- Insert dummy data with the new field for testing.
- Example (SQLite):
  ```sql
  ALTER TABLE tasks ADD COLUMN xp_level INTEGER DEFAULT 0;
  UPDATE tasks SET xp_level = 5 WHERE task_id = 1;
  ```

---

## 🚀 Best Practices
- Keep `models.py` and DB schema in sync.
- Remove old DB files when schema changes to avoid mismatches.
- Use debug logs in routes to confirm how many items are returned.
- Consider migrations once schema stabilizes.

---

## 📌 Tip
If frontend shows empty arrays but DB has rows:
- Confirm backend is pointing at the right DB (`apps/backend/holly.db`).
- Check if the new column exists in both model + table.
- Verify API route returns the field.
