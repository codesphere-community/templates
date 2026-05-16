#!/bin/bash
set -e

echo "Installing dependencies..."
composer install --no-interaction --no-scripts

echo "Creating SQLite database..."
touch database/database.sqlite

echo "Running migrations..."
php artisan migrate --force

echo "Starting Laravel development server..."
php artisan serve --host=0.0.0.0 --port=3000