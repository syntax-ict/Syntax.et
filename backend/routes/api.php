<?php

use App\Http\Controllers\Api\Admin\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API routes
|--------------------------------------------------------------------------
| No authentication. Phase 2 adds read-only content routes here
| (solution-categories, services, courses, projects); Phase 3 adds the
| public submission routes (inquiries, course-registrations,
| contact-messages).
*/
Route::get('/health', fn () => response()->json([
    'success' => true,
    'data' => ['status' => 'ok', 'time' => now()->toIso8601String()],
]));

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
