@extends('layouts.app')

@section('title', 'All Quizzes')

@section('content')
<div class="card">
    <h2 style="margin-bottom: 20px;">Available Quizzes</h2>
    <a href="{{ route('quizzes.create') }}" class="btn" style="margin-bottom: 20px;">Create New Quiz</a>

    @if($quizzes->count())
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Questions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($quizzes as $quiz)
                <tr>
                    <td>
                        <strong>{{ $quiz->title }}</strong>
                        @if($quiz->description)
                            <br><small style="color: #718096;">{{ $quiz->description }}</small>
                        @endif
                    </td>
                    <td>{{ $quiz->questions_count }} questions</td>
                    <td>
                        <a href="{{ route('quizzes.show', $quiz) }}" class="btn">View</a>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div style="margin-top: 20px;">
            {{ $quizzes->links() }}
        </div>
    @else
        <p style="text-align: center; color: #718096; padding: 40px 0;">
            No quizzes yet. <a href="{{ route('quizzes.create') }}">Create the first one!</a>
        </p>
    @endif
</div>
@endsection