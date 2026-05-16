<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'correct_answer' => 'required|string',
        ]);

        Question::create($validated);
        return redirect()->route('quizzes.show', $validated['quiz_id'])->with('success', 'Question added!');
    }

    public function destroy(Question $question)
    {
        $quiz_id = $question->quiz_id;
        $question->delete();
        return redirect()->route('quizzes.show', $quiz_id)->with('success', 'Question deleted!');
    }
}