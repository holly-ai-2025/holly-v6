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

# Go back to root
echo "Returning to repo root..."
cd ../../

# Success message
echo "✅ Update complete: code pulled and dependencies installed."