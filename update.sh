#!/bin/bash
set -e

# Go to repo root
dirname=$(dirname "$0")
cd "$dirname"

# Stash any local changes
echo "💾 Stashing local changes (if any)..."
git stash push -m "auto-stash before update" || true

# Update repo
echo "📥 Pulling latest changes from main..."
git checkout main
git pull origin main

# Frontend setup
echo "🧹 Cleaning frontend node_modules and lockfile..."
rm -rf apps/frontend/node_modules apps/frontend/package-lock.json

echo "📦 Installing frontend dependencies..."
cd apps/frontend
npm install
cd ../..

# Backend setup (placeholder - extend if needed)
echo "⚡ Backend setup placeholder - adjust if backend deps are added."

# Restore stashed changes
echo "🔄 Restoring stashed changes (if any)..."
git stash pop || true

# Start frontend dev server
echo "🚀 Starting Vite dev server for frontend..."
cd apps/frontend
npm run dev