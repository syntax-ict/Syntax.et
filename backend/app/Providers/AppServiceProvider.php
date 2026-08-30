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
    }
}
