<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Architecture §9: "admin" bypasses every Policy check. Every
        // resource-specific authorization rule below this only needs to
        // encode what "staff" is additionally allowed to do.
        Gate::before(fn ($user) => $user->isAdmin() ? true : null);

        // Architecture §8: the per-account/IP lockout (5 attempts/60s,
        // keyed by email+IP) is enforced manually inside
        // AuthController::login() via RateLimiter::tooManyAttempts(),
        // rather than as route middleware — it needs to render the app's
        // own JSON error shape with a countdown message, not the generic
        // 429 a `throttle:` middleware would produce.
        //
        // That per-account check alone does not cap trying many different
        // emails from one IP (security audit finding M3): each new email
        // gets its own untouched bucket, so credential-spraying across
        // many admin emails from one client would never trip it. This
        // named limiter is that hard per-IP ceiling, applied as
        // `throttle:login-ip` route middleware in routes/api.php.
        RateLimiter::for('login-ip', fn (Request $request) => Limit::perMinute(20)->by($request->ip()));

        // Phase 4: the public write endpoints (inquiries, course
        // registrations, contact messages) are unauthenticated by design —
        // this is the only thing standing between them and being scripted
        // into a spam or storage-exhaustion vector (architecture §6/§11).
        RateLimiter::for('public-write', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));

        // Read-only content routes are cheap but still worth a ceiling —
        // generous enough that no real visitor or the frontend's own
        // polling ever notices it.
        RateLimiter::for('public-read', fn (Request $request) => Limit::perMinute(60)->by($request->ip()));
    }
}
