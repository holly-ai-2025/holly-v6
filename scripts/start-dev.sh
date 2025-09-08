#!/bin/bash
set -e

# Ensure logs dir exists
mkdir -p ./logs

echo "=== Starting Holly Dev Environment ==="

# 1. Frontend
echo "-> Installing frontend dependencies"
cd apps/frontend
pnpm install

echo "-> Starting frontend (Vite) on logs/frontend-ops.log"
nohup pnpm run dev >> ../../logs/frontend-ops.log 2>&1 &
cd ../..

# 2. Backend (always restart 8000, leave 5000 alone)
echo "-> Restarting backend on port 8000"
PIDS=$(lsof -t -i:8000 -sTCP:LISTEN)
if [ -n "$PIDS" ]; then
  echo "-> Killing old Uvicorn process on port 8000 (PIDs: $PIDS)"
  kill -9 $PIDS
fi
nohup uvicorn apps.backend.main:app --host 0.0.0.0 --port 8000 --log-level debug >> ./logs/backend-live.log 2>&1 &

echo "=== Holly Dev Environment Started ==="