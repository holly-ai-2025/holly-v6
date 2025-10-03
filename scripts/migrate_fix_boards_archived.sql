-- Migration: fix boards with NULL archived
-- Date: 2025-10-02
-- This sets all boards with NULL archived → false

UPDATE boards
SET archived = false
WHERE archived IS NULL;