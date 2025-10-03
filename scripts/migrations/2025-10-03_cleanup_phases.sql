-- Cleanup migration: remove invalid phases with NULL board_id
DELETE FROM phases WHERE board_id IS NULL;