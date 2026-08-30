<?php

namespace Tests\Feature\Public;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_message_can_be_submitted(): void
    {
        $response = $this->postJson('/api/contact-messages', [
            'full_name' => 'Erick Ndlovu',
            'email' => 'erick@example.com',
            'phone' => '+27825550199',
            'subject' => 'General inquiry',
            'message' => 'Do you install signage outside Addis Ababa?',
        ]);

        $response->assertCreated();
        $this->assertSame('General inquiry', $response->json('data.subject'));

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'erick@example.com',
            'is_read' => false,
        ]);
    }

    public function test_phone_is_optional(): void
    {
        $response = $this->postJson('/api/contact-messages', [
            'full_name' => 'Erick Ndlovu',
            'email' => 'erick@example.com',
            'subject' => 'General inquiry',
            'message' => 'A message with no phone number provided.',
        ]);

        $response->assertCreated();
    }

    public function test_missing_required_fields_are_rejected(): void
    {
        $response = $this->postJson('/api/contact-messages', []);

        $response->assertStatus(422)->assertJsonValidationErrors(['full_name', 'email', 'subject', 'message']);
    }

    public function test_message_length_is_capped(): void
    {
        $response = $this->postJson('/api/contact-messages', [
            'full_name' => 'Erick Ndlovu',
            'email' => 'erick@example.com',
            'subject' => 'General inquiry',
            'message' => str_repeat('a', 2001),
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('message');
    }
}
