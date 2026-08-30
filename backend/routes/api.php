<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Public\ContactMessageController;
use App\Http\Controllers\Api\Public\CourseController;
use App\Http\Controllers\Api\Public\CourseRegistrationController;
use App\Http\Controllers\Api\Public\CustomerProblemController;
use App\Http\Controllers\Api\Public\InquiryController;
use App\Http\Controllers\Api\Public\ProjectController;
use App\Http\Controllers\Api\Public\ServiceController;
use App\Http\Controllers\Api\Public\SolutionCategoryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API routes
|--------------------------------------------------------------------------
| No authentication. Read-only content routes (architecture §5) plus the
| public submission routes below (architecture §6): inquiries covers
| consultation/quote/support requests, which share one staff workflow.
*/
Route::get('/health', fn () => response()->json([
    'success' => true,
    'data' => ['status' => 'ok', 'time' => now()->toIso8601String()],
]));

Route::middleware('throttle:public-read')->group(function () {
    Route::get('/solution-categories', [SolutionCategoryController::class, 'index'])->name('solution-categories.index');
    Route::get('/solution-categories/{slug}', [SolutionCategoryController::class, 'show'])->name('solution-categories.show');

    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
    Route::get('/services/{slug}', [ServiceController::class, 'show'])->name('services.show');

    Route::get('/customer-problems', [CustomerProblemController::class, 'index'])->name('customer-problems.index');

    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/{slug}', [CourseController::class, 'show'])->name('courses.show');

    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');

    Route::get('/inquiries/{reference}', [InquiryController::class, 'show'])->name('inquiries.show');
});

Route::middleware('throttle:public-write')->group(function () {
    Route::post('/inquiries', [InquiryController::class, 'store'])->name('inquiries.store');
    Route::post('/course-registrations', [CourseRegistrationController::class, 'store'])->name('course-registrations.store');
    Route::post('/contact-messages', [ContactMessageController::class, 'store'])->name('contact-messages.store');
});

/*
|--------------------------------------------------------------------------
| Admin API routes
|--------------------------------------------------------------------------
| Sanctum SPA cookie auth (architecture §8). `login` is deliberately outside
| the `auth:sanctum` group; everything else in this file requires it.
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/me', [AuthController::class, 'me'])->name('me');

        // Phase 5 adds: users (admin-only), content management, lead
        // management, support management, course management here.
    });
});
