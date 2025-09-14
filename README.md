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
6. Update `apps/frontend/src/api/<entity>.ts` to include the field, normalize to camelCase, and expose via TypeScript interface.

### Adding a new table
1. Define the model in `apps/backend/models.py`.
2. Add Pydantic schemas in `apps/backend/schemas.py`.
3. Add full CRUD endpoints (GET/POST/PATCH/DELETE) in `apps/backend/main.py`.
4. Generate and apply Alembic migration.
5. Update `apps/backend/README.md` with new endpoints.
6. Create a new API wrapper in `apps/frontend/src/api/<entity>.ts`.
7. Update `apps/frontend/README.md` with wrapper details.

---

## Frontend Changes

### API Wrappers (⚠️ Source of Truth)
- All API calls go through `apps/frontend/src/api/*.ts`.
- Wrappers normalize backend snake_case → frontend camelCase.
- Wrappers denormalize frontend camelCase → backend snake_case.
- Every wrapper must:
  - Define a TypeScript interface for its entity.
  - Implement `get<Entity>, create<Entity>, update<Entity>, delete<Entity>`.
  - Ensure all objects include `.id`.

### Components
- Must never call `/db/...` endpoints directly.
- Always import from wrappers.
- Must only use camelCase field names.
- Examples:
  - `TaskDialog` → handles all task fields.
  - `TabTasks` → lists and groups tasks consistently.
  - `TabCalendar` → creates/edits/moves tasks but always routes through TaskDialog.

### Documentation
- Update `apps/frontend/README.md` whenever fields/entities change.

---

## Documentation Rules
- **Every code change must include README updates**.
- Backend README → endpoints & schema.
- Frontend README → API wrappers & fields.
- Root README → workflow & integration rules.

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

✅ Following this workflow ensures backend and frontend stay fully in sync. New DB fields/tables will not break existing components, and all integrations remain consistent.