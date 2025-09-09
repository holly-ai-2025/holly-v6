# Frontend (React + Vite + MUI)

The frontend app is built with React, Vite, and MUI (Material UI).

## Workspace

The header menu includes a **Workspace** section combining three areas:
- **Flowboard** → placeholder tab (to be implemented).
- **Tasks** → handled by `TabTasks.tsx`.
- **Boards** → uses `TabProjects.tsx` logic.
- **Calendar** → uses `TabCalendar.tsx`.

## TabTasks

Tasks are grouped by due date:
- **Overdue** (muted red background)
- **Today** (includes *Suggested* tasks if `due_date` is null and urgency is high)
- **Tomorrow** (includes *Suggested* tasks if `due_date` is null and urgency is low)
- **This Week**
- **Later**
- **Completed** (collapsed by default, grey background/text)

Suggested tasks appear inside a **Paper container box** within the Today/Tomorrow groups. The container has darker grey to stand out visually.

### Styling Notes
- Token value badges are slimmed down for readability.
- Left padding on task cards adjusted so text does not touch card edge.
- Project icons remain inside task cards (right-aligned).
- Right-hand dropdown indicators for task status were removed.

### Editing Tasks
- Clicking a task card opens the **TaskDialog** popup for editing.
- Updates and new tasks are sent via **PATCH /db/tasks/{id}** or **POST /db/tasks**.
- Only changed values are sent (backend now supports partial updates).

### Known Pitfalls
- **Enums must match backend values**:
  - Status: `Todo | In Progress | Done | Pinned`
  - Priority: `Tiny | Small | Medium | Big`
- Invalid values will throw warnings and break save requests.
- Do not assume all fields are required — backend now accepts partial updates.

## Environment Variables
- `VITE_API_URL` → Backend API base URL.
- `VITE_OPS_TOKEN` → Bearer token for API authentication.

## Development

Run the full dev stack with:

```bash
scripts/start-dev.sh
```

This launches frontend, backend, and log server (port 9000). Browser console logs stream into `logs/frontend-console.log`.

For frontend-only:

```bash
cd apps/frontend
pnpm dev
```