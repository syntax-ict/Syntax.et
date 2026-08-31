<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Note on `assertGuest('web')` throughout this file: the `auth:sanctum`
     * middleware switches the app's *default* guard to "sanctum" for the
     * rest of the request via `Auth::shouldUse()`, so `assertGuest()`'s
     * default null-guard check would silently check the wrong guard. Always
     * name the guard explicitly in tests that touch a Sanctum route.
     */
    public function test_staff_user_can_log_in_with_correct_credentials(): void
    {
        $user = User::factory()->staff()->create(['password' => 'correct-password']);

        $response = $this->postJson('/api/admin/login', [
            'email' => $user->email,
            'password' => 'correct-password',
        ]);

        $response->assertOk()->assertJsonPath('data.email', $user->email);
        $this->assertAuthenticatedAs($user, 'web');
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create(['password' => 'correct-password']);

        $response = $this->postJson('/api/admin/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('email');
        $this->assertGuest('web');
    }

    public function test_deactivated_user_cannot_log_in(): void
    {
        $user = User::factory()->inactive()->create(['password' => 'correct-password']);

        $response = $this->postJson('/api/admin/login', [
            'email' => $user->email,
            'password' => 'correct-password',
        ]);

        $response->assertStatus(422);
        $this->assertGuest('web');
    }

    public function test_login_is_rate_limited_after_repeated_failures(): void
    {
        $user = User::factory()->create(['email' => 'someone@example.com', 'password' => 'correct-password']);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/admin/login', [
                'email' => $user->email,
                'password' => 'wrong-password',
            ]);
        }

        $response = $this->postJson('/api/admin/login', [
            'email' => $user->email,
            'password' => 'correct-password',
        ]);

        $response->assertStatus(422);
        $this->assertMatchesRegularExpression(
            '/^Too many login attempts\. Please try again in \d+ seconds\.$/',
            $response->json('errors.email.0'),
        );
        $this->assertGuest('web');
    }

    /**
     * Security audit finding M3: the per-account lockout above is keyed by
     * (email, IP), so spraying one guess each across many different emails
     * from a single IP never trips it — each email gets its own untouched
     * bucket. This is the separate, IP-only ceiling that closes that gap.
     */
    public function test_login_is_rate_limited_per_ip_across_different_emails(): void
    {
        for ($i = 0; $i < 20; $i++) {
            $response = $this->postJson('/api/admin/login', [
                'email' => "nonexistent-{$i}@example.com",
                'password' => 'whatever-password',
            ]);

            $response->assertStatus(422);
        }

        $response = $this->postJson('/api/admin/login', [
            'email' => 'nonexistent-21@example.com',
            'password' => 'whatever-password',
        ]);

        $response->assertStatus(429);
    }

    public function test_authenticated_user_can_fetch_own_profile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/admin/me');

        $response->assertOk()->assertJsonPath('data.id', $user->id);
    }

    public function test_guest_cannot_fetch_profile(): void
    {
        $response = $this->getJson('/api/admin/me');

        $response->assertStatus(401)->assertJson([
            'success' => false,
            'message' => 'Authentication required.',
        ]);
    }

    public function test_authenticated_user_can_log_out(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/admin/logout');

        $response->assertOk();
        $this->assertGuest('web');
    }
}
