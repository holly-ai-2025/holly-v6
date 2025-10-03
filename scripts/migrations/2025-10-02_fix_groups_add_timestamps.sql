-- Migration: Add timestamps to groups table

ALTER TABLE groups ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE groups ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Backfill any null values just in case
UPDATE groups SET created_at = NOW() WHERE created_at IS NULL;
UPDATE groups SET updated_at = NOW() WHERE updated_at IS NULL;