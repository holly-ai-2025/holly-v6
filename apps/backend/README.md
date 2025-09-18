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
- `notes` (text, nullable)

---

## Endpoints: Tasks API

### `GET /db/tasks`
Fetch a list of tasks. Supports `skip` and `limit` query params for pagination.
```http
GET /db/tasks?skip=0&limit=100
```
Response:
```json
[
  {
    "task_id": 1,
    "task_name": "Example Task",
    "description": "This is a task",
    "status": "Todo",
    "priority": "Medium",
    "archived": false,
    "created_at": "2025-01-01T12:00:00",
    "updated_at": "2025-01-01T12:00:00"
  }
]
```

### `POST /db/tasks`
Create a new task.
```http
POST /db/tasks
Content-Type: application/json

{
  "task_name": "Write backend docs",
  "description": "Expand README with examples",
  "status": "In Progress",
  "priority": "High",
  "due_date": "2025-09-20",
  "board_id": 1,
  "project_id": 2,
  "phase_id": 3,
  "notes": "This task was created via API"
}
```
Response:
```json
{
  "task_id": 42,
  "task_name": "Write backend docs",
  "description": "Expand README with examples",
  "status": "In Progress",
  "priority": "High",
  "archived": false,
  "board_id": 1,
  "project_id": 2,
  "phase_id": 3,
  "notes": "This task was created via API",
  "created_at": "2025-09-18T10:30:00",
  "updated_at": "2025-09-18T10:30:00"
}
```

### `PATCH /db/tasks/{task_id}`
Update a task. This is also used for **soft delete**.
```http
PATCH /db/tasks/42
Content-Type: application/json

{
  "archived": true
}
```
Response:
```json
{
  "task_id": 42,
  "task_name": "Write backend docs",
  "status": "In Progress",
  "priority": "High",
  "archived": true,
  "created_at": "2025-09-18T10:30:00",
  "updated_at": "2025-09-18T11:00:00"
}
```

Notes:
- `DELETE /db/tasks/{task_id}` is **not supported** and returns `405 Method Not Allowed`.
- Always use PATCH with `{ "archived": true }` for deletion.
- Partial updates are supported: you may send any subset of fields.
- Soft deletes are logged as `delete` actions in the Activity Log.

---

## Endpoints: Boards API

### `GET /db/boards`
Fetch all boards.
```http
GET /db/boards
```
Response:
```json
[
  {
    "board_id": 1,
    "name": "Work Projects",
    "type": "project",
    "category": "work",
    "color": "#2196F3",
    "description": "Main work board",
    "pinned": false
  }
]
```

---

## Endpoints: Projects API

### `GET /db/projects`
Fetch all projects.
```http
GET /db/projects
```
Response:
```json
[
  {
    "project_id": 2,
    "name": "Backend Rewrite",
    "notes": "Using FastAPI + SQLAlchemy",
    "goal": "Restore CRUD",
    "board_id": 1,
    "deadline": "2025-09-30"
  }
]
```

---

## Endpoints: Phases API

### `GET /db/phases`
Fetch all phases.
```http
GET /db/phases
```
Response:
```json
[
  {
    "phase_id": 3,
    "project_id": 2,
    "name": "Step 1 - Core CRUD",
    "deadline": "2025-09-18",
    "depends_on_previous": false
  }
]
```

---

## Endpoints: Activity Log API

### `GET /db/activity`
Fetch recent activity logs. Supports pagination.
```http
GET /db/activity?skip=0&limit=50
```
Response:
```json
[
  {
    "log_id": 101,
    "entity_type": "task",
    "entity_id": 42,
    "action": "delete",
    "payload": {
      "task_id": 42,
      "task_name": "Write backend docs",
      "status": "In Progress",
      "priority": "High",
      "archived": false
    },
    "created_at": "2025-09-18T11:00:00"
  }
]
```

### `POST /db/activity/undo/{log_id}`
Undo a previous action by restoring its snapshot.
```http
POST /db/activity/undo/101
```
Response:
```json
{
  "log_id": 101,
  "entity_type": "task",
  "entity_id": 42,
  "action": "delete",
  "payload": {
    "task_id": 42,
    "task_name": "Write backend docs",
    "status": "In Progress",
    "priority": "High",
    "archived": false
  },
  "created_at": "2025-09-18T11:00:00"
}
```

Notes:
- `undo` creates a new log entry with `action: "undo"`.
- Currently implemented for tasks only. Future: extend to boards, projects, phases, etc.

---

## Development Notes

- All API payloads use **snake_case** (frontend handles mapping to camelCase).
- `notes` field is persisted end-to-end.
- Soft delete is enforced via `archived: true`.
- Filtering out archived tasks is handled in frontend (future work).
- Activity Log persists all changes for auditing + undo.
- ⚠️ The ORM model defines `task_id` as the primary key (not `id`). Always query tasks using `Task.task_id` instead of `Task.id`. 