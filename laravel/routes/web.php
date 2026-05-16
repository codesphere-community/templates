<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuestionController;

Route::get('/', function () {
    return redirect('/quizzes');
});

Route::resource('quizzes', QuizController::class);
Route::resource('questions', QuestionController::class)->except(['index']);
Route::post('/quizzes/{quiz}/take', [QuizController::class, 'take'])->name('quizzes.take');