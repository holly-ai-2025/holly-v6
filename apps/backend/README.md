# Holly v6 Backend

## Database & Task API

### Database Setup
- SQLite DB: `holly.db`
- ORM: SQLAlchemy models in `apps/backend/models.py`
- Pydantic schemas in `apps/backend/schemas.py`

### Routes
- `GET /db/tasks` → Fetch all tasks.
- `POST /db/tasks` → Create a new task.
- `PATCH /db/tasks/{id}` → Update a task.
- `DELETE /db/tasks/{id}` → Delete a task.

### Date Handling
- DB stores dates as **ISO** `YYYY-MM-DD`.
- API exposes `due_date` as `DDMMYYYY` for backwards compatibility.
- Conversion:
  - On **read** → DB `YYYY-MM-DD` → API `DDMMYYYY`.
  - On **write** → API `DDMMYYYY` → DB `YYYY-MM-DD`.
- This prevents old DB rows from crashing serialization.

### Problems & Fixes
- **Disappearing backend code** → Fixed by moving backend into `apps/backend/` and correcting `.gitignore`.
- **Date mismatch (year 1008/2508 issue)** → Fixed by introducing strict parsing in frontend (`dateUtils.ts`).
- **PATCH not working** → Updated backend routes to accept partial updates and validate fields.
- **Duplicate tasks in Calendar** → Caused by double POST (Calendar + TaskDialog).
  - Fixed by ensuring only TaskDialog creates tasks.
  - Backend logs (`[BACKEND] POST /db/tasks`) confirm requests.

### Adding New Fields
When adding new DB fields:
1. **`models.py`** → Add SQLAlchemy column.
2. **`schemas.py`** → Add to Pydantic models (`TaskBase`, `TaskCreate`, `TaskUpdate`).
3. **`main.py`** → Ensure routes include field.
4. **Migrations** → For SQLite, update schema manually if needed (currently auto-drop + recreate in dev).

### Logs
Backend logs live in `logs/backend-live.log`. Tail them with:
```bash
tail -f logs/backend-live.log
```