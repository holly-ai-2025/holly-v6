-- ✅ Fix groups table: add missing timestamps
ALTER TABLE groups ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE groups ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- ✅ Fix boards table: remove invalid rows and reset sequence
DELETE FROM boards WHERE board_id IS NULL;

SELECT setval('boards_board_id_seq', (SELECT COALESCE(MAX(board_id), 0) + 1 FROM boards));