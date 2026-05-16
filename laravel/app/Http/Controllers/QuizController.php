<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function index()
    {
        $quizzes = Quiz::withCount('questions')->latest()->paginate(10);
        return view('quizzes.index', compact('quizzes'));
    }

    public function create()
    {
        return view('quizzes.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Quiz::create($validated);
        return redirect()->route('quizzes.index')->with('success', 'Quiz created!');
    }

    public function show(Quiz $quiz)
    {
        $quiz->load('questions');
        return view('quizzes.show', compact('quiz'));
    }

    public function take(Request $request, Quiz $quiz)
    {
        $answers = $request->except(['_token']);
        $quiz->load('questions');

        $score = 0;
        $total = $quiz->questions->count();

        foreach ($quiz->questions as $question) {
            if (isset($answers['question_' . $question->id]) &&
                $answers['question_' . $question->id] === $question->correct_answer) {
                $score++;
            }
        }

        return view('quizzes.result', compact('quiz', 'score', 'total'));
    }
}