<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restricts a route to the "admin" role. Staff-role users are authenticated
 * admin-panel users too, but are denied here (architecture §9: two roles,
 * admin-only actions are user management, deletes, and settings writes).
 *
 * This middleware must always run after `auth:sanctum` so `$request->user()`
 * is guaranteed to be resolved before the role check.
 */
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            abort(403, 'This action requires administrator privileges.');
        }

        return $next($request);
    }
}
