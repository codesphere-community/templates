<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Laravel Quiz App')</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        header { background: #2d3748; color: white; padding: 20px 0; margin-bottom: 30px; }
        header h1 { text-align: center; }
        .card { background: white; border-radius: 8px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn { display: inline-block; padding: 10px 20px; background: #4299e1; color: white; text-decoration: none; border-radius: 6px; border: none; cursor: pointer; }
        .btn:hover { background: #3182ce; }
        .btn-success { background: #48bb78; }
        .btn-success:hover { background: #38a169; }
        .btn-danger { background: #e53e3e; }
        .btn-danger:hover { background: #c53030; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f7fafc; font-weight: 600; }
        form div { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: 500; }
        input[type="text"], textarea { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
        .quiz-question { margin-bottom: 20px; padding: 15px; background: #f7fafc; border-radius: 6px; }
        .options { display: flex; flex-direction: column; gap: 8px; }
        .option-label { display: flex; align-items: center; gap: 8px; padding: 8px; background: white; border: 1px solid #e2e8f0; border-radius: 4px; cursor: pointer; }
        .option-label:hover { background: #edf2f7; }
        .alert { padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        .alert-success { background: #c6f6d5; color: #22543d; }
        .alert-danger { background: #fed7d7; color: #822727; }
        .score-display { font-size: 64px; font-weight: bold; text-align: center; color: #4299e1; margin: 30px 0; }
        .score-display.pass { color: #48bb78; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Laravel Quiz App</h1>
        </div>
    </header>
    <div class="container">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @yield('content')
    </div>
</body>
</html>