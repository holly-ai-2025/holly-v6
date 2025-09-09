#!/bin/bash
set -e

# Ensure logs dir exists
mkdir -p ./logs

echo "=== Starting Holly Dev Environment ==="

# 0. Ensure no env var is forcing reload
unset UVICORN_RELOAD

# 1. Frontend
echo "-> Installing frontend dependencies"
cd apps/frontend
pnpm install

echo "-> Starting frontend (Vite) on logs/frontend-ops.log"
nohup pnpm run dev >> ../../logs/frontend-ops.log 2>&1 & disown
cd ../..

# 2. Backend (always restart 8000, leave 5000 alone)
echo "-> Restarting backend on port 8000"
PIDS=$(lsof -t -i:8000 -sTCP:LISTEN)
if [ -n "$PIDS" ]; then
  echo "-> Killing old process on port 8000 (PIDs: $PIDS)"
  kill -9 $PIDS
fi

PYTHONPATH=$(pwd) nohup python scripts/run_backend.py >> ./logs/backend-live.log 2>&1 & disown

# 3. Log server (port 9000)
echo "-> Starting frontend log server on port 9000"
PIDS_LOG=$(lsof -t -i:9000 -sTCP:LISTEN)
if [ -n "$PIDS_LOG" ]; then
  echo "-> Killing old log server (PIDs: $PIDS_LOG)"
  kill -9 $PIDS_LOG
fi
nohup node scripts/log_server.js >> ./logs/frontend-console.log 2>&1 & disown

echo "=== Holly Dev Environment Started ==="