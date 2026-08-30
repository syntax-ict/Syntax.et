<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Mockery;
use Tests\TestCase;

/**
 * Phase 4: login outcomes land on the `security` log channel (architecture
 * §12), not just the default application log.
 */
class SecurityLoggingTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_login_is_logged_to_security_channel(): void
    {
        $user = User::factory()->create(['password' => 'correct-password']);

        Log::shouldReceive('channel')->with('security')->andReturnSelf();
        Log::shouldReceive('log')->once()->with('info', 'admin_login_succeeded', Mockery::type('array'));

        $this->postJson('/api/admin/login', [
            'email' => $user->email,
            'password' => 'correct-password',
        ]);
    }

    public function test_failed_login_is_logged_to_security_channel(): void
    {
        $user = User::factory()->create(['password' => 'correct-password']);

        Log::shouldReceive('channel')->with('security')->andReturnSelf();
        Log::shouldReceive('log')->once()->with('warning', 'admin_login_failed', Mockery::type('array'));

        $this->postJson('/api/admin/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);
    }

    public function test_deactivated_account_login_attempt_is_logged(): void
    {
        $user = User::factory()->inactive()->create(['password' => 'correct-password']);

        Log::shouldReceive('channel')->with('security')->andReturnSelf();
        Log::shouldReceive('log')->once()->with('warning', 'admin_login_blocked_inactive_account', Mockery::type('array'));

        $this->postJson('/api/admin/login', [
            'email' => $user->email,
            'password' => 'correct-password',
        ]);
    }
}
