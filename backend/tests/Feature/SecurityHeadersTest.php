<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Security audit finding M2: baseline hardening headers on every response.
 */
class SecurityHeadersTest extends TestCase
{
    public function test_baseline_security_headers_are_present(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertOk();
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
}
