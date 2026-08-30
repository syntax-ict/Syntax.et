<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Every real request from the SPA carries a Referer/Origin header that
     * Sanctum's `EnsureFrontendRequestsAreStateful` middleware uses to decide
     * whether to treat the request as a stateful, session-based one (see
     * vendor/laravel/sanctum .../EnsureFrontendRequestsAreStateful::fromFrontend()).
     * Raw test requests send neither, so we set it once here to match
     * production traffic instead of special-casing every admin test.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->withHeader('Referer', 'http://localhost:8000');
    }
}
