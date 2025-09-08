# Frontend Notes for Tasks

## Task Updates
- When calling `PATCH /db/tasks/{id}`, always exclude `created_at` and `updated_at` from the payload.
- Dates must be sent as `YYYY-MM-DD` (SQLite `DATE` expects plain date, not datetime).
- Status values must be mapped to backend enums:
  - `Todo` → `todo`
  - `In Progress` → `in_progress`
  - `Done` → `done`
  - `Pinned` → `pinned`

## Debugging
- If you see a `422 Unprocessable Content`, log the payload being sent. Likely cause is wrong status value or date format.
- The TabTasks component includes a debug log of every PATCH payload.

## Styling Notes
- Do **not** simplify or strip JSX when editing TabTasks. The layout is carefully styled:
  - Token badges show gradients and shadows.
  - Status select uses emoji icons + colored circles.
  - Date picker is compact with a calendar icon button.
- Removing these makes the UI look broken. Always preserve them when making edits.

## Common Gotchas
- **Never leave placeholder markers** like `<UPDATED FILE CONTENT>` in source files.
- **Never strip the rendering loop**. Without it, the Tasks tab will show a blank screen even if data is fetched.
