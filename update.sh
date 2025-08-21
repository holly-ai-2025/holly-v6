#!/bin/bash
set -e

# Go to repo root
dirname=$(dirname "$0")
cd "$dirname"

# Make sure git is clean
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  You have uncommitted changes. Please commit or stash before updating."
  exit 1
fi

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

# Start frontend dev server
echo "🚀 Starting Vite dev server for frontend..."
cd apps/frontend
npm run dev