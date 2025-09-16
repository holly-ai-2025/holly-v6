# Backend (Holly v6)

## Task Schema

Each task record contains the following fields:

- `task_id` (integer, primary key)
- `task_name` (string)
- `description` (string, nullable)
- `board_id` (integer, nullable)
- `project_id` (integer, nullable)
- `phase_id` (integer, nullable)
- `group_id` (integer, nullable)
- `status` (string, e.g. "Todo", "In Progress", "Done")
- `urgency_score` (integer)
- `priority` (string, e.g. "Low", "Medium", "High", "Urgent")
- `category` (string, nullable)
- `token_value` (integer)
- `due_date` (date)
- `start_date` (timestamp, nullable)
- `end_date` (timestamp, nullable)
- `effort_level` (string, e.g. "Low", "Medium", "High")
- `archived` (boolean, soft delete flag)
- `pinned` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `notes` (text, nullable) ✅

---

## Soft Delete Behavior

- `DELETE /db/tasks/:id` is **not supported** → returns HTTP 405.
- Instead, tasks are soft deleted by setting `archived: true` via:
  ```http
  PATCH /db/tasks/:id
  { "archived": true }
  ```
- Archived tasks remain in the database and may still be returned in API responses until frontend filtering is applied.

---

## Development Notes

- All API payloads expect **snake_case**.
- Frontend handles mapping between camelCase and snake_case in `apps/frontend/src/api/tasks.ts`.
- `notes` field is persisted end-to-end via this mapping.
