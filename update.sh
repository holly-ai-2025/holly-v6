#!/bin/bash

# Ensure we're in the project root
echo "Switching to repo root..."
cd "$(dirname "$0")" || exit 1

# Pull latest changes from GitHub
echo "Pulling latest changes..."
git pull origin main

# Install dependencies in frontend
echo "Installing frontend dependencies..."
cd apps/frontend || exit 1
npm install

# Start frontend
echo "Starting frontend dev server..."
npm run dev &

# Go back to root
cd ../../
echo "✅ Update complete: code pulled, dependencies installed, dev server running."