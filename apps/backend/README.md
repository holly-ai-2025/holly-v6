# Backend API (Tasks, Projects, Boards, Phases)

## Database Models

### Board
- `board_id` (int, PK)
- `name` (string, required)
- `type` (string, optional)
- `goal` (text, optional)
- `created_at` (datetime)

### Project
- `project_id` (int, PK)
- `name` (string, required)
- `notes` (text, optional)
- `goal` (text, optional)
- `board_id` (FK → boards.board_id)
- `created_at` (datetime)

### Phase
- `phase_id` (int, PK)
- `project_id` (FK → projects.project_id)
- `name` (string, required)
- `deadline` (datetime, optional)

### Task
- `task_id` (int, PK)
- `task_name` (string, required)
- `description` (text, optional)
- `due_date` (datetime, optional)
- `status` (enum: `Todo`, `In Progress`, `Done`, `Pinned`; default = `Todo`)
- `priority` (enum: `Tiny`, `Small`, `Medium`, `Big`)
- `category` (string, optional)
- `board_id` (FK → boards.board_id)
- `project_id` (FK → projects.project_id)
- `phase_id` (FK → phases.phase_id)
- `parent_task_id` (FK → tasks.task_id)
- `token_value` (int, default = 0)
- `notes` (text, optional)
- `urgency_score` (int, default = 0)
- `effort_level` (string, optional)
- `created_at` (datetime)
- `updated_at` (datetime auto-update)

### Tag
- `tag_id` (int, PK)
- `name` (string, required)

### Attachment
- `attachment_id` (int, PK)
- `task_id` (FK → tasks.task_id)
- `file_path` (string, required)
- `uploaded_at` (datetime)

### Reflection
- `reflection_id` (int, PK)
- `content` (text, required)
- `mood` (string, optional)
- `created_at` (datetime)

### TaskActivity
- `activity_id` (int, PK)
- `task_id` (FK → tasks.task_id)
- `action` (string, required)
- `timestamp` (datetime)

---

## API Contracts

### `POST /db/tasks`
- Creates a new task.
- Allowed fields: all fields from Task model.

### `PATCH /db/tasks/{id}`
- Updates a task by ID.
- Partial updates supported (only changed fields are required).
- Allowed fields:
  - `status`
  - `priority`
  - `due_date`
  - `project_id`
  - `phase_id`
  - `notes`
  - `description`
  - `token_value`
  - `urgency_score`
  - `effort_level`
  - `category`
  - `task_name`

### `POST /db/projects`
- Creates a new project.

### `PATCH /db/projects/{id}`
- Updates an existing project.

### `POST /db/phases`
- Creates a new phase.

### `PATCH /db/phases/{id}`
- Updates an existing phase.

### `POST /db/boards`
- Creates a new board.

### `PATCH /db/boards/{id}`
- Updates an existing board.

### `POST /db/tags`
- Creates a new tag.

### `POST /db/attachments`
- Creates a new attachment.

### `POST /db/reflections`
- Creates a new reflection.

### `POST /db/task_activity`
- Creates a new task activity log.

---

## Development Notes
- **Schemas**: `schemas.py` defines `TaskBase`, `TaskCreate`, `TaskUpdate`. `TaskUpdate` uses `exclude_unset=True` to allow partial updates.
- **CORS**: In dev, all origins (`*`) are allowed. Do not enable `allow_credentials=True` with `*` — this breaks preflight checks.
- **TaskActivity logging**: Only logs `task_id` and `action`. Adding extra fields like `user_id` or `details` without updating the model causes crashes.
- **Common errors we hit**:
  - Sending invalid enum values → 422 errors.
  - Attempting to patch with missing fields → fixed by partial update support.
  - Misconfigured CORS with credentials + `*` → invalid, caused 500 errors misreported as CORS failures.
  - Incorrect TaskActivity fields (`user_id`, `details`) → caused hidden 500s.

---

## Running the Backend

```bash
scripts/start-dev.sh
```

Backend logs: `logs/backend-live.log`
Frontend logs: `logs/frontend-console.log`