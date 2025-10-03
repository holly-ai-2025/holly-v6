-- Remove the legacy project_id column from phases
ALTER TABLE phases DROP COLUMN IF EXISTS project_id;