<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Thin wrapper around the `security` log channel (architecture §12) so
 * every call site logs the same shape of context instead of ad-hoc arrays,
 * and so what counts as a security event is defined in one place.
 */
class SecurityLog
{
    public static function loginSucceeded(string $email, Request $request): void
    {
        static::log('info', 'admin_login_succeeded', $email, $request);
    }

    public static function loginFailed(string $email, Request $request): void
    {
        static::log('warning', 'admin_login_failed', $email, $request);
    }

    public static function loginBlockedInactiveAccount(string $email, Request $request): void
    {
        static::log('warning', 'admin_login_blocked_inactive_account', $email, $request);
    }

    public static function loginRateLimited(string $email, Request $request): void
    {
        static::log('warning', 'admin_login_rate_limited', $email, $request);
    }

    public static function spamSubmissionBlocked(string $form, Request $request): void
    {
        Log::channel('security')->warning('spam_submission_blocked', [
            'form' => $form,
            'ip' => $request->ip(),
            'path' => $request->path(),
        ]);
    }

    public static function rateLimitTripped(Request $request): void
    {
        Log::channel('security')->warning('rate_limit_tripped', [
            'ip' => $request->ip(),
            'path' => $request->path(),
            'method' => $request->method(),
        ]);
    }

    private static function log(string $level, string $event, string $email, Request $request): void
    {
        Log::channel('security')->log($level, $event, [
            'email' => $email,
            'ip' => $request->ip(),
        ]);
    }
}
