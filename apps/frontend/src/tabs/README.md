# Frontend Notes for Tasks

## Task Updates
- When calling `PATCH /db/tasks/{id}`, always exclude `created_at` and `updated_at` from the payload.
- Dates should be sent as ISO8601 strings (e.g. `YYYY-MM-DD`).
- Only mutable fields (task_name, description, due_date, status, priority, etc.) should be sent.

## Debugging
- If updates fail with 500 errors, check that no server-managed fields are being patched.
- Confirm backend is parsing ISO8601 dates correctly.

## Common Gotchas
- **Never leave placeholder markers** like `<UPDATED FILE CONTENT>` in source files. They break the build immediately.
- **Never strip the rendering loop**. Without it, the Tasks tab will show a blank screen even if data is fetched.
- Always verify that group rendering (expand/collapse, task list) is present when editing.
