# Holly AI

## Development Workflow

This project has a **strict workflow** to prevent breakages when adding fields/tables or changing API contracts.

---

## Backend Changes

### Adding a new field to an existing table
1. Edit the model in `apps/backend/models.py`.
2. Add the field to the Pydantic schemas in `apps/backend/schemas.py`.
3. Ensure CRUD endpoints in `apps/backend/main.py` accept and return the new field.
4. Generate and apply an Alembic migration:
   ```bash
   alembic revision --autogenerate -m "Add priority to tasks"
   alembic upgrade head
   ```
5. Update `apps/backend/README.md` with the new field.

### Adding a new table
1. Define the model in `apps/backend/models.py`.
2. Add Pydantic schemas in `apps/backend/schemas.py`.
3. Add full CRUD endpoints (GET/POST/PATCH/DELETE) in `apps/backend/main.py`.
4. Generate and apply Alembic migration.
5. Update `apps/backend/README.md` with new endpoints.

---

## Frontend Changes

### API Wrappers
- All API calls go through `apps/frontend/src/api/*.ts`.
- Endpoints must match backend (`/db/*`).
- Never hardcode URLs inside components.

### Components
- Update relevant components (TaskDialog, TabTasks, TabCalendar, etc.) to include the new field.
- Add sensible defaults for new fields (e.g. priority = Medium).
- Components should gracefully handle missing fields.

### Documentation
- Update `apps/frontend/README.md` with the new field.

---

## Documentation Rules
- **Every code change must include README updates**.
- Backend README → endpoints & schema.
- Frontend README → API wrappers & fields.
- Root README → workflow & instructions.

---

## Logs & Debugging
- Backend logs → `logs/backend-live.log`
- Frontend logs → `logs/frontend-console.log`
- Run everything via:
  ```bash
  scripts/start-dev.sh
  ```

---

## Safety & Branching
- Never edit `main` directly.
- Always create a feature branch:
  ```bash
  git checkout -b feature/add-priority-field
  ```
- Commit code + README updates together.
- Open a PR → review → merge.

---

## Rollbacks
- If a migration breaks:
  ```bash
  alembic downgrade -1
  git revert <commit>
  ```

---

✅ Following this workflow ensures new DB fields/tables do not break existing frontend or cause contract mismatches.