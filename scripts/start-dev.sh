#!/bin/bash

set -e

echo "=== Starting Holly Dev Environment ==="

# Force Postgres DB URL
export DATABASE_URL="postgresql+psycopg2://holly:holly@localhost:5432/holly"

# --- Frontend ---
echo "-> Installing frontend dependencies"
cd apps/frontend
pnpm install || true
cd ../..

echo "-> Starting frontend (Vite) on logs/frontend-ops.log"
nohup pnpm --dir apps/frontend run dev >> ./logs/frontend-ops.log 2>&1 & disown

# --- Backend ---
echo "-> Restarting backend on port 8000"
PIDS=$(lsof -t -i:8000 -sTCP:LISTEN || true)
if [ ! -z "$PIDS" ]; then
  echo "Killing processes on port 8000: $PIDS"
  kill -9 $PIDS || true
fi
PYTHONPATH=$(pwd) nohup python scripts/run_backend.py >> ./logs/backend-live.log 2>&1 & disown

# --- Frontend Log Server ---
echo "-> Restarting frontend log server on port 9000"
PIDS=$(lsof -t -i:9000 -sTCP:LISTEN || true)
if [ ! -z "$PIDS" ]; then
  echo "Killing processes on port 9000: $PIDS"
  kill -9 $PIDS || true
fi
nohup node scripts/log_server.js >> ./logs/frontend-console.log 2>&1 & disown

echo "=== Holly Dev Environment Started ==="