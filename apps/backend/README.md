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
- `status` (enum: `todo`, `in_progress`, `done`, `pinned`; default = `todo`)
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
- Allowed fields:
  - `task_name`
  - `description`
  - `due_date` (YYYY-MM-DD)
  - `status` (todo, in_progress, done, pinned)
  - `priority` (Tiny, Small, Medium, Big)
  - `category`
  - `project_id`
  - `phase_id`
  - `parent_task_id`
  - `token_value`
  - `notes`
  - `urgency_score`
  - `effort_level`

### `PATCH /db/tasks/{id}`
- Updates a task by ID.
- Allowed fields:
  - `status`
  - `priority`
  - `due_date` (YYYY-MM-DD)
  - `project_id`
  - `phase_id`
  - `notes`
  - `description`
  - `token_value`
  - `urgency_score`
  - `effort_level`
  - `category`
- ❌ `task_name` is **not editable** via PATCH.

### `POST /db/projects`
- Creates a new project.
- Allowed fields: `name`, `notes`, `goal`, `board_id`

### `PATCH /db/projects/{id}`
- Updates an existing project.
- Allowed fields: `name`, `notes`, `goal`

### `POST /db/phases`
- Creates a new phase.
- Allowed fields: `name`, `project_id`, `deadline`

### `PATCH /db/phases/{id}`
- Updates an existing phase.
- Allowed fields: `name`, `deadline`

### `POST /db/boards`
- Creates a new board.
- Allowed fields: `name`, `type`, `goal`

### `PATCH /db/boards/{id}`
- Updates an existing board.
- Allowed fields: `name`, `type`, `goal`

### `POST /db/tags`
- Creates a new tag.
- Allowed fields: `name`

### `POST /db/attachments`
- Creates a new attachment.
- Allowed fields: `task_id`, `file_path`

### `POST /db/reflections`
- Creates a new reflection.
- Allowed fields: `content`, `mood`

### `POST /db/task_activity`
- Creates a new task activity log.
- Allowed fields: `task_id`, `action`