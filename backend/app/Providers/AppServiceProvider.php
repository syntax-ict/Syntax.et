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

        // Architecture §8: brute-force protection on the admin login route,
        // keyed by email+IP so one leaked/guessed email can't be hammered
        // from a single client, and one client can't spray many emails.
        RateLimiter::for('login', function (Request $request) {
            $email = (string) $request->input('email');

            return Limit::perMinute(5)->by($email.'|'.$request->ip());
        });

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
