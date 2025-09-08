# Frontend Notes for Tasks

## Task Updates
- When calling `PATCH /db/tasks/{id}`, the payload must:
  - **Exclude server-managed fields**: `task_id`, `created_at`, `updated_at`.
  - **Exclude null/undefined fields**. Only include fields being changed.
  - **Normalize values**:
    - `status` must map to backend enums: `todo`, `in_progress`, `done`, `pinned`.
    - `due_date` must be sent as `YYYY-MM-DD`.

## Examples
- Update status:
```json
{ "status": "done" }
```
- Update due date + notes:
```json
{ "due_date": "2025-09-10", "notes": "Final review" }
```
- Update multiple fields:
```json
{
  "task_name": "Update homepage banner",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2025-09-10",
  "notes": "Assets received",
  "effort_level": "medium",
  "board_id": 4,
  "project_id": 1,
  "phase_id": 2
}
```

## Debugging
- If you see `422 Unprocessable Content`, check the console debug log for the payload.
- Common causes: sending nulls, or sending `task_id` in the body.

## Styling Notes
- Preserve the styled JSX: token badges, emoji status select, compact date picker.
- Don’t simplify the layout when editing TabTasks.
