# Frontend (Vite + React + MUI)

## Overview
- Built with **Vite + React**.
- UI with **MUI Core + Joy UI**.
- API calls **must** go through `src/lib/api.ts`.

---

## Standards
- No direct Axios calls inside components.
- All CRUD endpoints go via `lib/api.ts`.
- All entities support `archived` flag (soft delete).

---

## Schema Adjustments
- Use `due_date` (not `end_date`).
- Use `board_id` (not `project_id`).
- `urgency_score` has been removed.

---

## Task Grouping (TabTasks)
Tasks are automatically bucketed into:
- **Today** → `due_date = current_date`
- **Tomorrow** → `due_date = current_date + 1`
- **Overdue** → `due_date < today`
- **Future** → `due_date > tomorrow`
- **Suggested** → `due_date IS NULL` (max 3 shown per day, shuffled)

👉 Suggested tasks are intentional. They support ADHD-style workflows by allowing freeform entry without dates.

---

## Drag & Drop
- Dragging a **Suggested** task into Today/Tomorrow assigns the appropriate `due_date`.
- Dragging between groups updates `due_date` accordingly.

---

## Boards
- Boards load via `GET /db/boards` → frontend filters out `archived`.
- **BoardDetailPage → ProjectBoardView** handles project-type boards:
  - Phases load from `/db/phases?board_id={id}`
  - Tasks load from `/db/tasks?board_id={id}`
  - Supports creating phases, adding tasks, archiving boards.

---

## Known Fixes
- `ProjectBoardView` was restored from main branch after accidental stripping of UI features.
- `TaskDialog` fixed: `onSave` now passed properly.
- **Calendar (TabCalendar)** still needs update to use `due_date` instead of `end_date`.

---

## Development
Start frontend via:
```bash
scripts/start-dev.sh
```

Frontend console logs are piped to:
```
logs/frontend-console.log
```

---

## Contribution Rules
- Never use placeholders.
- Always use `lib/api.ts` for requests.
- When adding new entity:
  1. Ensure backend migration + models.py + schemas.py + main.py updated
  2. Add frontend API methods in `lib/api.ts`
  3. Update relevant tabs/pages
  4. Test with curl before UI integration
