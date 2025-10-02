-- Migration: Create groups table for list boards

CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    board_id INT NOT NULL REFERENCES boards(board_id) ON DELETE CASCADE,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for board lookups
CREATE INDEX ix_groups_board_id ON groups(board_id);