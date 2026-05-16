@extends('layouts.app')

@section('title', $quiz->title)

@section('content')
<div class="card">
    <h2 style="margin-bottom: 10px;">{{ $quiz->title }}</h2>
    @if($quiz->description)
        <p style="color: #718096; margin-bottom: 20px;">{{ $quiz->description }}</p>
    @endif

    @if($quiz->questions->count() > 0)
        <form action="{{ route('quizzes.take', $quiz) }}" method="POST">
            @csrf
            @foreach($quiz->questions as $index => $question)
                <div class="quiz-question">
                    <p style="margin-bottom: 10px;"><strong>Q{{ $index + 1 }}:</strong> {{ $question->question_text }}</p>
                    <div class="options">
                        @foreach($question->options as $option)
                            <label class="option-label">
                                <input type="radio" name="question_{{ $question->id }}" value="{{ $option }}" required>
                                {{ $option }}
                            </label>
                        @endforeach
                    </div>
                </div>
            @endforeach

            <div style="margin-top: 20px;">
                <button type="submit" class="btn btn-success">Submit Answers</button>
                <a href="{{ route('quizzes.index') }}" class="btn" style="margin-left: 10px;">Back</a>
            </div>
        </form>
    @else
        <p style="text-align: center; color: #718096; padding: 40px 0;">
            No questions yet. Add some questions to make the quiz playable.
        </p>
    @endif
</div>

<div class="card">
    <h3 style="margin-bottom: 15px;">Add Question</h3>
    <form action="{{ route('questions.store') }}" method="POST">
        @csrf
        <input type="hidden" name="quiz_id" value="{{ $quiz->id }}">

        <div>
            <label for="question_text">Question</label>
            <input type="text" name="question_text" id="question_text" required placeholder="Enter your question">
        </div>

        <div>
            <label>Options (enter 4 options)</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <input type="text" name="options[]" placeholder="Option A" required>
                <input type="text" name="options[]" placeholder="Option B" required>
                <input type="text" name="options[]" placeholder="Option C" required>
                <input type="text" name="options[]" placeholder="Option D" required>
            </div>
        </div>

        <div>
            <label for="correct_answer">Correct Answer (must match exactly one option above)</label>
            <input type="text" name="correct_answer" id="correct_answer" required placeholder="e.g., Option A">
        </div>

        <button type="submit" class="btn">Add Question</button>
    </form>
</div>
@endsection