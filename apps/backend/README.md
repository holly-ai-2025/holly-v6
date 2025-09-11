# Holly v6 Backend

## Database & Task API

### Database Setup
- SQLite DB (file-based): `infra/data/holly.db`
- ORM: SQLAlchemy models in `apps/backend/models.py`
- Pydantic schemas in `apps/backend/schemas.py`
- Session factory in `apps/backend/database.py`

### Resetting the Database (Dev Workflow)
⚠️ SQLite is file-based — schema changes do **not** auto-apply.
When you add/remove columns:
1. Delete the DB:
   ```bash
   rm -f infra/data/holly.db
   ```
2. Run reset script:
   ```bash
   python scripts/reset-db.py
   ```
3. Restart backend:
   ```bash
   bash scripts/start-dev.sh
   ```

This **drops & recreates all tables** from `models.py`.
Do this every time you edit schema in dev. (In production, migrations will be managed with Alembic).

### Routes
- `GET /db/tasks` → Fetch all tasks.
- `POST /db/tasks` → Create a new task.
- `PATCH /db/tasks/{id}` → Update a task.
- `DELETE /db/tasks/{id}` → Delete a task.
- `GET /db/boards` → Fetch boards.
- `GET /db/projects` → Fetch projects.
- `GET /db/phases` → Fetch phases.
- `GET /db/groups` → Fetch groups.
- `GET /db/items` → Fetch items.

(All support `POST`, `PATCH`, `DELETE` as well.)

### Date Handling
- **DB layer**:
  - Use `Date` for `due_date`, `deadline`.
  - Use `DateTime` for `start_date`, `end_date`.
- **Schemas**:
  - Validators normalize ISO strings (`YYYY-MM-DD` / `YYYY-MM-DDTHH:mm:ss`).
  - Serializers always output ISO (`YYYY-MM-DD` or full ISO datetime).
- **Frontend**:
  - Always use `dateUtils.ts` → `formatForApi`, `formatDateTimeForApi`.
  - Never handcraft date strings.
- ✅ This fixes the old **year 1008 / 2508 bug**.

### Adding New Fields to Tasks
Safe additions include:
- `board_id`, `phase_id`, `group_id` (FKs)
- `archived` (bool)
- `pinned` (bool)
- `labels`, `effort_level`, `urgency_score`

Rules:
1. **`models.py`** → Add column with correct type (`Integer`, `String`, `Boolean`, `Date`, `DateTime`).
   - ⚠️ Never use `String` for dates.
2. **`schemas.py`** → Add to `TaskBase`, `TaskCreate`, `TaskUpdate`.
   - Mark optional unless required.
   - Provide defaults (`archived: bool = False`).
3. **`main.py`** → No changes unless validation needed. CRUD routes auto-accept schema fields.
4. **Frontend**:
   - If editable → update `TaskDialog.tsx`.
   - If not editable (e.g. archived) → update `taskUtils.ts` → `normalizeTaskForApi`.
   - `TabTasks.tsx` and `TabCalendar.tsx` won’t break unless you remove/rename existing fields.

### Boards & Projects Schema
- **Boards**: top-level container (`project` or `list`).
- **Projects**: linked to boards, contain phases.
- **Phases**: linked to projects, optional deadlines, dependency flag.
- **Groups**: sections inside list boards, can hold tasks/items.
- **Items**: non-task entries (notes, journal, etc.), live in groups/boards.

### Logs
- Backend live logs: `logs/backend-live.log`
- Hypercorn logs (manual run): `logs/backend-hypercorn.log`
- Tail logs:
  ```bash
  tail -f logs/backend-live.log
  ```

### CORS Config
Already correct in `main.py`:
```python
allow_origins=["http://localhost:5173"]
```
Do **not** edit unless adding more dev origins.

### Dev Tips
- Always drop DB after schema changes.
- Never bypass schema validators for dates.
- Never edit CORS middleware.
- Verify `/db/tasks` works before adding new boards/projects endpoints.

---
✅ With this workflow, schema extensions (Boards, Projects, Groups, Items, Task fields) are safe and won’t break frontend. 