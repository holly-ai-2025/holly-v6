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
- **Overdue**
- **Today** (includes *Suggested* tasks if `due_date` is null and urgency is high)
- **Tomorrow** (includes *Suggested* tasks if `due_date` is null and urgency is low)
- **This Week**
- **Later**

Suggested tasks appear inside a **Paper container box** within the Today/Tomorrow groups. This provides visual separation while maintaining alignment with normal tasks.

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