<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Same-origin production deployment (architecture assumption, top of the
    | design doc) needs none of this. It exists only so the Vite dev server
    | (a different port = a different origin to the browser) can call the
    | API with cookies during local development. `supports_credentials`
    | must stay true for Sanctum's SPA cookie auth to work at all.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(explode(',', env('CORS_ALLOWED_ORIGINS', '')))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
