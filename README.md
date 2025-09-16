# Holly v6

## Overview
Holly v6 is a task and workflow management system with frontend (React + MUI) and backend (FastAPI + SQLite) applications.

---

## Task Model

Tasks include the following fields:
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

## Soft Delete
- Deletion uses **soft delete** with `archived: true`.
- `DELETE /db/tasks/:id` is **not supported** and returns 405.
- Instead, use:
  ```http
  PATCH /db/tasks/:id
  { "archived": true }
  ```

---

## Frontend Highlights
- Built with **React + MUI Core/Joy UI**.
- Task dialog features:
  - Gradient sliders for **Priority**, **Effort**, and **Tokens** (with live values).
  - Standardized input fields (42px height).
  - Date + Time controls (Due Date, Start/End Time with +1h logic).
  - Status toggles with colors (Todo = Blue, In Progress = Orange, Done = Green).
  - Connections accordion (Board, Phase, Category).
  - Notes accordion with rich text editor (`react-quill`).
- Soft delete integrated into frontend: deleting a task sets `archived: true`.

---

## Backend Highlights
- FastAPI with SQLite.
- Endpoints under `/db/*`.
- Tasks API supports CRUD with **soft delete** and `notes`.
- Payloads use **snake_case**; frontend handles mapping.
