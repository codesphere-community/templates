@extends('layouts.app')

@section('title', 'Quiz Results')

@section('content')
<div class="card">
    <h2 style="text-align: center; margin-bottom: 20px;">{{ $quiz->title }} - Results</h2>

    <div class="score-display {{ $score >= $total * 0.7 ? 'pass' : '' }}">
        {{ $score }} / {{ $total }}
    </div>

    <p style="text-align: center; font-size: 18px; color: #718096;">
        @if($score >= $total * 0.7)
            Great job! You passed!
        @elseif($score >= $total * 0.4)
            Not bad! Keep practicing.
        @else
            Keep learning and try again!
        @endif
    </p>

    <div style="text-align: center; margin-top: 30px;">
        <a href="{{ route('quizzes.show', $quiz) }}" class="btn">Retake Quiz</a>
        <a href="{{ route('quizzes.index') }}" class="btn" style="margin-left: 10px;">All Quizzes</a>
    </div>
</div>
@endsection