<?php

namespace Tests\Feature\Public;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Mockery;
use Tests\TestCase;

/**
 * Phase 4: the public write endpoints were completely unthrottled through
 * Phase 3 — anyone could script them into a spam or storage-exhaustion
 * vector (architecture §6/§11). These confirm the new named limiters
 * actually apply to the routes, without needing to hard-code the exact
 * limit (which would make this test brittle against tuning the number
 * later); it only asserts that a 429 is reachable at all.
 */
class RateLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_message_endpoint_is_rate_limited(): void
    {
        $payload = [
            'full_name' => 'Someone',
            'email' => 'someone@example.com',
            'subject' => 'Hello',
            'message' => 'A message.',
        ];

        $response = null;
        for ($i = 0; $i < 15; $i++) {
            $response = $this->postJson('/api/contact-messages', $payload);
            if ($response->getStatusCode() === 429) {
                break;
            }
        }

        $response->assertStatus(429)->assertJson([
            'success' => false,
            'message' => 'Too many requests. Please try again shortly.',
        ]);
    }

    public function test_public_read_endpoint_is_rate_limited(): void
    {
        $response = null;
        for ($i = 0; $i < 65; $i++) {
            $response = $this->getJson('/api/solution-categories');
            if ($response->getStatusCode() === 429) {
                break;
            }
        }

        $response->assertStatus(429);
    }

    public function test_rate_limit_trip_is_logged_to_security_channel(): void
    {
        for ($i = 0; $i < 65; $i++) {
            $response = $this->getJson('/api/solution-categories');
            if ($response->getStatusCode() === 429) {
                break;
            }
        }
        $this->assertSame(429, $response->getStatusCode(), 'Precondition: the request must actually be throttled.');

        Log::shouldReceive('channel')->with('security')->andReturnSelf();
        Log::shouldReceive('warning')->once()->with('rate_limit_tripped', Mockery::type('array'));

        $this->getJson('/api/solution-categories');
    }
}
