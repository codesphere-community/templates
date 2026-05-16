#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Starting AI Code Completion dev server..."
npm run dev