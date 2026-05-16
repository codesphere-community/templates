#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Starting File Converter server..."
PORT=3000 node server.js