# Backend (FastAPI)

This backend is built with FastAPI and SQLite.

## Endpoints

- `GET /db/tasks` → Fetch all tasks.
- `POST /db/tasks` → Create a new task.
- `PATCH /db/tasks/{id}` → Update a task. Supported fields: `status`, `priority`, `due_date`, `project_id`, `phase_id`, `notes`, `description`, `token_value`, `urgency_score`.

## Suggested Tasks Logic

Tasks with **no `due_date`** are considered *suggested* by the frontend. They are categorized using `urgency_score`:
- Higher urgency scores (≥ 5) → grouped under **Today → Suggested**.
- Lower urgency scores → grouped under **Tomorrow → Suggested**.

The backend simply returns raw tasks; categorization is done client-side.

## Logs

Backend logs are stored in:
- `logs/backend-live.log` (from `scripts/start-dev.sh`)
- `logs/backend-hypercorn.log` (manual runs with Hypercorn)

## Development

Start backend with:

```bash
cd apps/backend
uvicorn main:app --reload --port 8000
```