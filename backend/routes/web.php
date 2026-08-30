<?php

use Illuminate\Support\Facades\Route;

// This backend is an API host; the actual site is the separately-built React
// SPA (repo root). A later phase wires this route (and its catch-all) to
// serve the SPA's built `index.html` from `public/build`, matching the
// architecture's same-origin deployment assumption. Until then, this exists
// only so the app has a working root route and `/up` health check.
Route::get('/', fn () => response()->json([
    'success' => true,
    'data' => ['message' => 'Syntax Technology API'],
]));
