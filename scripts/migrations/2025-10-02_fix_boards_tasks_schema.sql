-- Migration: Align boards and tasks schema with backend models

-- Boards: rename `type` to `board_type`
ALTER TABLE boards RENAME COLUMN type TO board_type;

-- Tasks: remove legacy project_id, rename due_date, add completed
ALTER TABLE tasks DROP COLUMN project_id;
ALTER TABLE tasks RENAME COLUMN due_date TO deadline;
ALTER TABLE tasks ADD COLUMN completed BOOLEAN DEFAULT FALSE;