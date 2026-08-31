<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Baseline security response headers (audit finding M2). Deliberately does
 * NOT set a Content-Security-Policy — a correct CSP has to enumerate every
 * script/style/font/image source the specific production deployment
 * actually serves, which is deployment-specific tuning, not a safe
 * one-size-fits-all default; shipping a wrong one risks breaking the site.
 *
 * Strict-Transport-Security is safe to send unconditionally even over
 * plain HTTP in local development — browsers only honor it when received
 * over an actual HTTPS connection.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }
}
