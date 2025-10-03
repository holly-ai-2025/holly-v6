-- Migration: Rename task_name to title in tasks
ALTER TABLE tasks RENAME COLUMN task_name TO title;