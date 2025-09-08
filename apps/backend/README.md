# Backend Notes

## Task Updates
- Use `PATCH /db/tasks/{id}` to update tasks.
- Frontend must **not** send `created_at` or `updated_at`.
- Dates should be sent as ISO8601 strings (e.g. `2025-09-08`). Backend automatically parses them.
- `updated_at` is always set server-side.

## Common Pitfalls
- Sending raw strings for `due_date`, `created_at`, or `updated_at` without schema parsing will cause SQLite errors. This is now fixed by using a Pydantic schema.
- `created_at` should never be overwritten once set.
