# Frontend Notes for Tasks

## Task Updates
- When calling `PATCH /db/tasks/{id}`, always exclude `created_at` and `updated_at` from the payload.
- Dates should be sent as ISO8601 strings (e.g. `YYYY-MM-DD`).
- Only mutable fields (task_name, description, due_date, status, priority, etc.) should be sent.

## Debugging
- If updates fail with 500 errors, check that no server-managed fields are being patched.
- Confirm backend is parsing ISO8601 dates correctly.

## Common Gotcha
- **Never leave placeholder markers** like `<UPDATED FILE CONTENT>` in source files. They break the build immediately.
- Always ensure changes replace the entire file with valid code.
