<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Architecture §9: user management is entirely admin-only, staff cannot
 * even list other admin-panel accounts.
 */
class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_cannot_list_users(): void
    {
        $staff = User::factory()->staff()->create();

        $this->actingAs($staff)->getJson('/api/admin/users')->assertStatus(403);
    }

    public function test_staff_cannot_view_a_single_user(): void
    {
        $staff = User::factory()->staff()->create();
        $other = User::factory()->create();

        $this->actingAs($staff)->getJson("/api/admin/users/{$other->id}")->assertStatus(403);
    }

    public function test_admin_can_list_and_create_a_user(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->getJson('/api/admin/users')->assertOk();

        $response = $this->actingAs($admin)->postJson('/api/admin/users', [
            'name' => 'New Staff',
            'email' => 'newstaff@example.com',
            'password' => 'a-strong-password-1',
            'password_confirmation' => 'a-strong-password-1',
            'role' => 'staff',
        ]);

        $response->assertCreated()->assertJsonPath('data.role', 'staff');
        $this->assertDatabaseHas('users', ['email' => 'newstaff@example.com', 'role' => 'staff']);
    }

    public function test_new_user_password_is_hashed_not_stored_in_plaintext(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->postJson('/api/admin/users', [
            'name' => 'New Staff',
            'email' => 'newstaff2@example.com',
            'password' => 'a-strong-password-1',
            'password_confirmation' => 'a-strong-password-1',
            'role' => 'staff',
        ])->assertCreated();

        $stored = User::query()->where('email', 'newstaff2@example.com')->firstOrFail();
        $this->assertNotSame('a-strong-password-1', $stored->password);
        $this->assertTrue(Hash::check('a-strong-password-1', $stored->password));
    }

    public function test_admin_cannot_delete_their_own_account(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->deleteJson("/api/admin/users/{$admin->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_admin_can_deactivate_another_user(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->staff()->create();

        $response = $this->actingAs($admin)->putJson("/api/admin/users/{$target->id}", [
            'is_active' => false,
        ]);

        $response->assertOk()->assertJsonPath('data.is_active', false);
    }

    public function test_deactivated_user_is_immediately_unable_to_log_in(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->staff()->create(['password' => 'correct-password']);

        $this->actingAs($admin)->putJson("/api/admin/users/{$target->id}", ['is_active' => false])->assertOk();

        $login = $this->postJson('/api/admin/login', [
            'email' => $target->email,
            'password' => 'correct-password',
        ]);

        $login->assertStatus(422);
    }

    public function test_email_uniqueness_is_enforced_on_create(): void
    {
        $admin = User::factory()->admin()->create();
        $existing = User::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/users', [
            'name' => 'Dup',
            'email' => $existing->email,
            'password' => 'a-strong-password-1',
            'password_confirmation' => 'a-strong-password-1',
            'role' => 'staff',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('email');
    }
}
