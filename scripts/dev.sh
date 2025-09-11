#!/bin/bash
set -e

mkdir -p logs

# Kill old processes
pkill -f "hypercorn" || true
pkill -f "vite" || true
pkill -f "log_server.js" || true

# Start backend (FastAPI via Hypercorn)
echo "Starting backend..."
PYTHONPATH=$(pwd) .venv/bin/python -m hypercorn apps.backend.main:app --bind 127.0.0.1:8000 --workers 1 > logs/backend-live.log 2>&1 &

# Start frontend (Vite)
echo "Starting frontend..."
cd apps/frontend
npm run dev > ../../logs/frontend-console.log 2>&1 &
cd ../..

# Start log server (Node-based capture)
echo "Starting log server..."
node scripts/log_server.js > logs/log-server.log 2>&1 &

echo "✅ Dev environment running!"
echo "- Backend:   http://127.0.0.1:8000/docs"
echo "- Frontend:  http://localhost:5173"