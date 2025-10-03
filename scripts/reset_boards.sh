#!/bin/bash
# Reset boards, phases, and linked tasks
# This will wipe all boards, all phases, and tasks linked to boards/phases.
# Standalone tasks remain untouched.

set -e

DB_PATH="apps/backend/app.db"

if [ ! -f "$DB_PATH" ]; then
  echo "Database not found at $DB_PATH"
  exit 1
fi

sqlite3 $DB_PATH <<EOF
DELETE FROM tasks WHERE board_id IS NOT NULL OR phase_id IS NOT NULL;
DELETE FROM phases;
DELETE FROM boards;
EOF

echo "✅ Boards, phases, and linked tasks have been reset."