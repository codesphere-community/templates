@extends('layouts.app')

@section('title', 'Create Quiz')

@section('content')
<div class="card">
    <h2 style="margin-bottom: 20px;">Create New Quiz</h2>

    <form action="{{ route('quizzes.store') }}" method="POST">
        @csrf
        <div>
            <label for="title">Quiz Title</label>
            <input type="text" name="title" id="title" required placeholder="e.g., General Knowledge">
        </div>

        <div>
            <label for="description">Description (optional)</label>
            <input type="text" name="description" id="description" placeholder="Brief description of this quiz">
        </div>

        <div style="display: flex; gap: 10px;">
            <button type="submit" class="btn btn-success">Create Quiz</button>
            <a href="{{ route('quizzes.index') }}" class="btn">Cancel</a>
        </div>
    </form>
</div>
@endsection