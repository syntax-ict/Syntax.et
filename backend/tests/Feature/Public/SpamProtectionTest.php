<?php

namespace Tests\Feature\Public;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

/**
 * The honeypot field (architecture §6, Phase 4) on all three public write
 * forms.
 */
class SpamProtectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_inquiry_is_rejected_when_honeypot_field_is_filled(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'type' => 'support',
            'full_name' => 'A Bot',
            'email' => 'bot@example.com',
            'phone' => '+1234567890',
            'subject' => 'x',
            'details' => 'x',
            'website_url' => 'http://spam.example.com',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('website_url');
        $this->assertDatabaseCount('inquiries', 0);
    }

    public function test_contact_message_is_rejected_when_honeypot_field_is_filled(): void
    {
        $response = $this->postJson('/api/contact-messages', [
            'full_name' => 'A Bot',
            'email' => 'bot@example.com',
            'subject' => 'x',
            'message' => 'x',
            'website_url' => 'http://spam.example.com',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('website_url');
        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_course_registration_is_rejected_when_honeypot_field_is_filled(): void
    {
        $response = $this->postJson('/api/course-registrations', [
            'course_id' => 1,
            'full_name' => 'A Bot',
            'email' => 'bot@example.com',
            'phone' => '+1234567890',
            'training_mode' => 'online',
            'experience_level' => 'Beginner',
            'goals' => 'x',
            'website_url' => 'http://spam.example.com',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('website_url');
        $this->assertDatabaseCount('course_registrations', 0);
    }

    public function test_honeypot_trip_is_logged_to_security_channel(): void
    {
        Log::shouldReceive('channel')
            ->with('security')
            ->andReturnSelf();
        Log::shouldReceive('warning')
            ->once()
            ->with('spam_submission_blocked', \Mockery::type('array'));

        $this->postJson('/api/contact-messages', [
            'full_name' => 'A Bot',
            'email' => 'bot@example.com',
            'subject' => 'x',
            'message' => 'x',
            'website_url' => 'http://spam.example.com',
        ]);
    }

    public function test_leaving_honeypot_field_empty_does_not_block_submission(): void
    {
        $response = $this->postJson('/api/contact-messages', [
            'full_name' => 'Real Person',
            'email' => 'real@example.com',
            'subject' => 'Real subject',
            'message' => 'Real message.',
            'website_url' => '',
        ]);

        $response->assertCreated();
    }
}
