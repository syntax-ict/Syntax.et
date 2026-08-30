<?php

namespace Tests\Feature\Admin;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_list_and_mark_a_message_read(): void
    {
        $staff = User::factory()->staff()->create();
        $message = ContactMessage::factory()->create(['is_read' => false]);

        $this->actingAs($staff)->getJson('/api/admin/contact-messages')->assertOk();

        $response = $this->actingAs($staff)->patchJson("/api/admin/contact-messages/{$message->id}", [
            'is_read' => true,
        ]);

        $response->assertOk()->assertJsonPath('data.is_read', true);
    }

    public function test_marking_responded_sets_a_timestamp(): void
    {
        $staff = User::factory()->staff()->create();
        $message = ContactMessage::factory()->create();

        $response = $this->actingAs($staff)->patchJson("/api/admin/contact-messages/{$message->id}", [
            'responded' => true,
        ]);

        $response->assertOk();
        $this->assertNotNull($response->json('data.responded_at'));
    }

    public function test_staff_cannot_delete_a_message(): void
    {
        $staff = User::factory()->staff()->create();
        $message = ContactMessage::factory()->create();

        $this->actingAs($staff)->deleteJson("/api/admin/contact-messages/{$message->id}")->assertStatus(403);
    }

    public function test_admin_can_delete_a_message(): void
    {
        $admin = User::factory()->admin()->create();
        $message = ContactMessage::factory()->create();

        $this->actingAs($admin)->deleteJson("/api/admin/contact-messages/{$message->id}")->assertOk();
        $this->assertDatabaseMissing('contact_messages', ['id' => $message->id]);
    }

    public function test_filtering_by_read_status_works(): void
    {
        $staff = User::factory()->staff()->create();
        ContactMessage::factory()->create(['is_read' => true]);
        ContactMessage::factory()->create(['is_read' => false]);

        $response = $this->actingAs($staff)->getJson('/api/admin/contact-messages?is_read=0');

        $this->assertCount(1, $response->json('data'));
    }
}
