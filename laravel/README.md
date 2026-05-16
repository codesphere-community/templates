# Laravel Quiz App Template

A basic quiz application built with Laravel for Codesphere workspaces.

## Features

- Create and manage quizzes
- Add multiple-choice questions to each quiz
- Take quizzes and see your score
- SQLite database (no external DB required)

## Deployment on Codesphere

1. Fork this template
2. In Codesphere, create a new workspace from your fork
3. Set up the CI pipeline (it will auto-run on Codesphere)
4. Click "Run" stage to start the dev server
5. Click "Open deployment" to access the app

## Local Development

```bash
composer install
touch database/database.sqlite
php artisan migrate
php artisan serve --host=0.0.0.0 --port=3000
```

## Tech Stack

- PHP 8.1+
- Laravel 10
- SQLite (file-based, no setup required)