<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\SecurityHeaders;
use App\Support\SecurityLog;
use App\Support\TrustedProxies;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Sanctum SPA cookie auth for the same-origin admin panel (architecture §8).
        $middleware->statefulApi();

        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
        ]);

        // Security audit finding M2: baseline hardening headers on every response.
        $middleware->append(SecurityHeaders::class);

        // Security audit finding H4: without this, $request->ip() (which
        // every rate limiter below keys on) always resolves to the raw TCP
        // peer address. Deployed behind any reverse proxy/load balancer/CDN
        // — the standard shape for production — that peer is the proxy for
        // every visitor, collapsing every IP-keyed rate limit into one
        // shared bucket for the whole site. Trusting no proxies (the
        // default, TRUSTED_PROXIES unset) preserves today's exact behavior
        // for a direct (no-proxy) deployment. An operator who does put a
        // proxy in front sets TRUSTED_PROXIES to that proxy's own
        // address/CIDR so X-Forwarded-For is honored only from that
        // trusted hop — never blanket-trusted ('*'), which would let any
        // client spoof its own apparent IP and bypass every limiter below.
        $trustedProxies = TrustedProxies::parse((string) env('TRUSTED_PROXIES', ''));

        if ($trustedProxies !== []) {
            $middleware->trustProxies(at: $trustedProxies);
        }
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Architecture §11: one JSON envelope for every API error, regardless
        // of which exception produced it. This is the single place that
        // shape is defined — controllers never build their own error bodies.
        $isApi = fn (Request $request) => $request->is('api/*') || $request->expectsJson();

        $exceptions->render(function (ValidationException $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], $e->status);
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'Authentication required.',
            ], 401);
        });

        $exceptions->render(function (AuthorizationException $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'This action is unauthorized.',
            ], 403);
        });

        $exceptions->render(function (ModelNotFoundException $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'The requested resource was not found.',
            ], 404);
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'The requested resource was not found.',
            ], 404);
        });

        $exceptions->render(function (TooManyRequestsHttpException $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            SecurityLog::rateLimitTripped($request);

            return response()->json([
                'success' => false,
                'message' => 'Too many requests. Please try again shortly.',
            ], 429);
        });

        // A unique-constraint violation (a duplicate slug/email/reference)
        // is a client-fixable conflict, not a server error — give it a 409
        // instead of falling through to the generic 500 below.
        $exceptions->render(function (UniqueConstraintViolationException $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'A record with these details already exists.',
            ], 409);
        });

        // Any other HTTP-mapped exception (e.g. a plain abort(403)/abort(422)):
        // keep its status code, normalize the body.
        $exceptions->render(function (HttpExceptionInterface $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'Request failed.',
            ], $e->getStatusCode());
        });

        // Final catch-all: never leak a stack trace or exception class name
        // to an API client — regardless of APP_DEBUG. Deliberately NOT
        // gated on config('app.debug'): that would mean a misconfigured or
        // forgotten-default APP_DEBUG=true (the historical default in this
        // app's own .env.example) leaks full traces, file paths, and
        // exception messages to any anonymous client on every unhandled
        // error (security audit finding C1). Laravel still reports() every
        // exception to storage/logs/laravel.log independently of what
        // render() returns, so local debugging is unaffected — read the
        // log instead of the HTTP response.
        $exceptions->render(function (Throwable $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred.',
            ], 500);
        });
    })->create();
