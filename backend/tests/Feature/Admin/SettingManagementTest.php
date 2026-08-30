<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Directly closes the frontend audit's finding that the header and footer
 * showed two different contact phone numbers because each was hard-coded
 * separately — settings are now the single source of truth.
 */
class SettingManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_read_but_not_write_settings(): void
    {
        $staff = User::factory()->staff()->create();

        $this->actingAs($staff)->getJson('/api/admin/settings')->assertOk();

        $response = $this->actingAs($staff)->putJson('/api/admin/settings', [
            'settings' => [['key' => 'contact_phone', 'value' => '+251911234567']],
        ]);
        $response->assertStatus(403);
    }

    public function test_admin_can_set_the_single_contact_phone_setting(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->putJson('/api/admin/settings', [
            'settings' => [['key' => 'contact_phone', 'value' => '+251911234567']],
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('settings', ['key' => 'contact_phone', 'value' => '+251911234567']);

        $public = $this->getJson('/api/settings/public');
        $public->assertOk()->assertJsonPath('data.contact_phone', '+251911234567');
    }

    public function test_boolean_and_json_setting_types_round_trip_correctly(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->putJson('/api/admin/settings', [
            'settings' => [
                ['key' => 'maintenance_mode', 'value' => true, 'type' => 'boolean'],
                ['key' => 'social_links', 'value' => ['facebook' => 'https://facebook.com/x'], 'type' => 'json'],
            ],
        ])->assertOk();

        $list = $this->actingAs($admin)->getJson('/api/admin/settings');
        $byKey = collect($list->json('data'))->keyBy('key');

        $this->assertTrue($byKey['maintenance_mode']['value']);
        $this->assertSame('https://facebook.com/x', $byKey['social_links']['value']['facebook']);
    }

    public function test_public_settings_endpoint_never_exposes_a_non_whitelisted_key(): void
    {
        Setting::factory()->create(['key' => 'internal_notes', 'value' => 'not for the public']);

        $response = $this->getJson('/api/settings/public');

        $response->assertOk();
        $this->assertArrayNotHasKey('internal_notes', $response->json('data'));
    }
}
