<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Api\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Api\Admin\CourseRegistrationController as AdminCourseRegistrationController;
use App\Http\Controllers\Api\Admin\CustomerProblemController as AdminCustomerProblemController;
use App\Http\Controllers\Api\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Api\Admin\PageController as AdminPageController;
use App\Http\Controllers\Api\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\Admin\ProjectImageController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\ServiceFaqController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\Admin\SolutionCategoryController as AdminSolutionCategoryController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Public\ContactMessageController;
use App\Http\Controllers\Api\Public\CourseController;
use App\Http\Controllers\Api\Public\CourseRegistrationController;
use App\Http\Controllers\Api\Public\CustomerProblemController;
use App\Http\Controllers\Api\Public\InquiryController;
use App\Http\Controllers\Api\Public\PageController;
use App\Http\Controllers\Api\Public\ProjectController;
use App\Http\Controllers\Api\Public\ServiceController;
use App\Http\Controllers\Api\Public\SettingController;
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

    Route::get('/pages/{slug}', [PageController::class, 'show'])->name('pages.show');
    Route::get('/settings/public', [SettingController::class, 'index'])->name('settings.public');

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
| the `auth:sanctum` group; everything else in this file requires it. Every
| controller enforces its own Policy on top of this — `auth:sanctum` alone
| only proves "some admin-panel account", not which one may do what.
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/me', [AuthController::class, 'me'])->name('me');

        // Content management (architecture §2/§1/§3/§4/§10). `parameters()`
        // forces the route segment to `{id}` to match AdminCrudController's
        // plain-integer signature (it looks up the model itself rather than
        // relying on implicit route-model binding, so its subclasses don't
        // each need their own binding key).
        Route::apiResource('solution-categories', AdminSolutionCategoryController::class)->parameters(['solution-categories' => 'id']);

        Route::apiResource('services', AdminServiceController::class)->parameters(['services' => 'id']);
        Route::post('/services/{service}/faqs', [ServiceFaqController::class, 'store']);
        Route::patch('/services/{service}/faqs/{faq}', [ServiceFaqController::class, 'update']);
        Route::delete('/services/{service}/faqs/{faq}', [ServiceFaqController::class, 'destroy']);

        Route::apiResource('customer-problems', AdminCustomerProblemController::class)->parameters(['customer-problems' => 'id']);

        Route::apiResource('courses', AdminCourseController::class)->parameters(['courses' => 'id']);

        Route::apiResource('projects', AdminProjectController::class)->parameters(['projects' => 'id']);
        Route::post('/projects/{project}/images', [ProjectImageController::class, 'store']);
        Route::delete('/projects/{project}/images/{image}', [ProjectImageController::class, 'destroy']);

        Route::apiResource('pages', AdminPageController::class)->parameters(['pages' => 'id']);

        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::put('/settings', [AdminSettingController::class, 'update']);

        // Lead management (architecture §6/§7/§9).
        Route::get('/inquiries', [AdminInquiryController::class, 'index']);
        Route::get('/inquiries/{inquiry}', [AdminInquiryController::class, 'show']);
        Route::patch('/inquiries/{inquiry}', [AdminInquiryController::class, 'update']);
        Route::post('/inquiries/{inquiry}/notes', [AdminInquiryController::class, 'storeNote']);

        // Support management (architecture §8).
        Route::get('/contact-messages', [AdminContactMessageController::class, 'index']);
        Route::get('/contact-messages/{contact_message}', [AdminContactMessageController::class, 'show']);
        Route::patch('/contact-messages/{contact_message}', [AdminContactMessageController::class, 'update']);
        Route::delete('/contact-messages/{contact_message}', [AdminContactMessageController::class, 'destroy']);

        // Course management — registrations (architecture §5). The course
        // catalog itself is content management, above.
        Route::get('/course-registrations', [AdminCourseRegistrationController::class, 'index']);
        Route::get('/course-registrations/{course_registration}', [AdminCourseRegistrationController::class, 'show']);
        Route::patch('/course-registrations/{course_registration}', [AdminCourseRegistrationController::class, 'update']);

        // Admin management (architecture §9) — admin-only, enforced by
        // UserPolicy denying every method to a non-admin.
        Route::apiResource('users', UserController::class);
    });
});
