# Backend (FastAPI)

## Overview
The backend is a FastAPI app that manages data for Holly AI. It uses SQLAlchemy ORM with Postgres, and exposes a consistent set of CRUD endpoints for all major entities.

---

## Endpoints

### Tasks
- `GET    /db/tasks`
- `POST   /db/tasks`
- `PATCH  /db/tasks/{task_id}`
- `DELETE /db/tasks/{task_id}`

### Boards
- `GET    /db/boards`
- `POST   /db/boards`
- `PATCH  /db/boards/{board_id}`
- `DELETE /db/boards/{board_id}`

### Projects
- `GET    /db/projects`
- `POST   /db/projects`
- `PATCH  /db/projects/{project_id}`
- `DELETE /db/projects/{project_id}`

### Phases
- `GET    /db/phases`
- `POST   /db/phases`
- `PATCH  /db/phases/{phase_id}`
- `DELETE /db/phases/{phase_id}`

### Groups
- `GET    /db/groups`
- `POST   /db/groups`
- `PATCH  /db/groups/{group_id}`
- `DELETE /db/groups/{group_id}`

### Items
- `GET    /db/items`
- `POST   /db/items`
- `PATCH  /db/items/{item_id}`
- `DELETE /db/items/{item_id}`

---

## Primary Key Naming
⚠️ **Important**: Do not use `.id` in filters — each table uses its own key field:
- `Task.task_id`
- `Board.board_id`
- `Project.project_id`
- `Phase.phase_id`
- `Group.group_id`
- `Item.item_id`

Example:
```python
# Correct
 db.query(models.Task).filter(models.Task.task_id == task_id).first()

# Wrong (will throw AttributeError)
 db.query(models.Task).filter(models.Task.id == task_id).first()
```

---

## Schemas
Schemas are defined in `schemas.py`. They:
- Use `extra = "forbid"` → unknown fields are rejected.
- Separate `Create`, `Update`, and full models.

### Task fields
- `task_id` (int)
- `task_name` (string, required)
- `description` (string)
- `due_date` (date)
- `start_date` (datetime)
- `end_date` (datetime)
- `status` (string)
- `priority` (string)
- `category` (string)
- `token_value` (int)
- `urgency_score` (int)
- `effort_level` (string)
- Relations: `board_id`, `group_id`, `project_id`, `phase_id`
- `archived` (bool)
- `pinned` (bool)

---

## CORS
For development, backend allows all origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
⚠️ In production, restrict this to the actual frontend domain.

---

## Migrations
We use **Alembic** for database migrations.

To create a migration after editing `models.py`:
```bash
alembic revision --autogenerate -m "Add priority to tasks"
alembic upgrade head
```

To roll back one step:
```bash
alembic downgrade -1
```

---

## Development
Run backend with:
```bash
scripts/start-dev.sh
```
Logs:
- `logs/backend-live.log` (live server)
- `logs/backend-hypercorn.log` (manual run)

---

## Adding New Fields (Backend + Frontend Workflow)
When adding a new field to a model:
1. Update the model in `models.py`.
2. Add field to Pydantic schema in `schemas.py`.
3. Generate and apply Alembic migration.
4. **Update the corresponding frontend wrapper** (`src/api/<entity>.ts`) to include the new field.
   - Normalize the field into **camelCase**.
   - Add it to the entity’s TypeScript interface.
   - Ensure defaults are set if needed.
5. Update README files (backend + frontend) to document the new field.

This ensures backend and frontend stay in sync and all content pages use consistent naming and structure.