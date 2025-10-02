-- Migration: Add board_id column to phases table
-- Ensures each phase is linked to a board

ALTER TABLE phases
ADD COLUMN board_id INTEGER REFERENCES boards(board_id) ON DELETE CASCADE;