<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Http\Resources\Admin\UserResource;
use App\Models\User;
use App\Support\ApiResponse;
use App\Support\SecurityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

/**
 * Session-based (Sanctum SPA cookie) authentication for the admin panel.
 * There is no public-facing account system — architecture §8.
 */
class AuthController extends Controller
{
    use ApiResponse;

    public function login(LoginRequest $request): JsonResponse
    {
        $throttleKey = $request->string('email').'|'.$request->ip();

        $email = (string) $request->string('email');

        if (RateLimiter::tooManyAttempts('login:'.$throttleKey, 5)) {
            $seconds = RateLimiter::availableIn('login:'.$throttleKey);
            SecurityLog::loginRateLimited($email, $request);

            throw ValidationException::withMessages([
                'email' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ]);
        }

        $credentials = $request->only('email', 'password');

        // Explicitly pinned to the 'web' guard throughout this method
        // (matching logout(), below) rather than the bare Auth:: facade's
        // implicit default guard: the `auth:sanctum` middleware elsewhere
        // in the app calls Auth::shouldUse('sanctum') on successful
        // authentication, which would otherwise make the "default" guard
        // resolution here depend on what else has run earlier in the same
        // process — RequestGuard (what 'sanctum' resolves to) doesn't even
        // implement attempt().
        if (! Auth::guard('web')->attempt($credentials, remember: false)) {
            RateLimiter::hit('login:'.$throttleKey, 60);
            SecurityLog::loginFailed($email, $request);

            throw ValidationException::withMessages([
                'email' => 'These credentials do not match our records.',
            ]);
        }

        RateLimiter::clear('login:'.$throttleKey);

        /** @var User $user */
        $user = Auth::guard('web')->user();

        if (! $user->is_active) {
            Auth::guard('web')->logout();
            SecurityLog::loginBlockedInactiveAccount($email, $request);

            throw ValidationException::withMessages([
                'email' => 'This account has been deactivated. Contact an administrator.',
            ]);
        }

        $request->session()->regenerate();
        $user->forceFill(['last_login_at' => now()])->save();
        SecurityLog::loginSucceeded($email, $request);

        return $this->ok(new UserResource($user));
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->noContent();
    }

    public function me(Request $request): JsonResponse
    {
        return $this->ok(new UserResource($request->user()));
    }
}
