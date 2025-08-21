#!/bin/bash
set -e

# Navigate to project root
cd "$(dirname "$0")"

# Ensure we're in frontend folder
cd ..
cd frontend

# Make sure git is clean before pulling
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  You have uncommitted changes. Please commit or stash before updating."
  exit 1
fi

# Update repo
echo "📥 Pulling latest changes from main..."
git checkout main
git pull origin main

# Clean install
echo "🧹 Cleaning node_modules and lockfile..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies..."
npm install

# Start dev server
echo "🚀 Starting Vite dev server..."
npm run dev