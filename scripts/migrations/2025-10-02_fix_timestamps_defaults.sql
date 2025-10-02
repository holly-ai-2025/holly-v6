-- Migration: Ensure created_at and updated_at have defaults and no NULL values

-- Boards
ALTER TABLE boards ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE boards ALTER COLUMN updated_at SET DEFAULT NOW();
UPDATE boards SET created_at = NOW() WHERE created_at IS NULL;
UPDATE boards SET updated_at = NOW() WHERE updated_at IS NULL;

-- Tasks
ALTER TABLE tasks ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE tasks ALTER COLUMN updated_at SET DEFAULT NOW();
UPDATE tasks SET created_at = NOW() WHERE created_at IS NULL;
UPDATE tasks SET updated_at = NOW() WHERE updated_at IS NULL;

-- Phases
ALTER TABLE phases ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE phases ALTER COLUMN updated_at SET DEFAULT NOW();
UPDATE phases SET created_at = NOW() WHERE created_at IS NULL;
UPDATE phases SET updated_at = NOW() WHERE updated_at IS NULL;