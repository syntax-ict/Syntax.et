<?php

namespace Tests\Feature\Public;

use App\Models\Inquiry;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InquiryTest extends TestCase
{
    use RefreshDatabase;

    public function test_consultation_request_can_be_submitted(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'type' => 'consultation',
            'full_name' => 'Jean-Pierre Mugisha',
            'email' => 'jp@example.com',
            'phone' => '+250788123456',
            'organization' => 'National Procurement Agency',
            'details' => 'We need biometric attendance for 150 staff.',
            'meta' => ['problem_area' => 'Security & Smart Systems', 'budget' => '$5,000 - $10,000'],
        ]);

        $response->assertCreated();
        $this->assertSame('consultation', $response->json('data.type'));
        $this->assertSame('pending_review', $response->json('data.status'));
        $this->assertStringStartsWith('ST-CONS-', $response->json('data.reference'));

        $this->assertDatabaseHas('inquiries', [
            'type' => 'consultation',
            'email' => 'jp@example.com',
        ]);
    }

    public function test_consultation_request_requires_problem_area(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'type' => 'consultation',
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+250788000000',
            'details' => 'Need help.',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('meta.problem_area');
    }

    public function test_quote_request_requires_at_least_one_valid_service_slug(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'type' => 'quote',
            'full_name' => 'Sarah K',
            'email' => 'sarah@example.com',
            'phone' => '+256701987654',
            'details' => 'Need a quote.',
            'meta' => ['selected_services' => ['not-a-real-service']],
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('meta.selected_services.0');
    }

    public function test_quote_request_succeeds_with_valid_service_slug(): void
    {
        $service = Service::factory()->create(['slug' => 'cctv-surveillance']);

        $response = $this->postJson('/api/inquiries', [
            'type' => 'quote',
            'full_name' => 'Sarah K',
            'email' => 'sarah@example.com',
            'phone' => '+256701987654',
            'details' => 'Need a quote for CCTV.',
            'meta' => ['selected_services' => [$service->slug], 'quantity' => 4],
        ]);

        $response->assertCreated();
    }

    public function test_support_request_requires_subject(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'type' => 'support',
            'full_name' => 'Marcus Aurelius',
            'email' => 'marcus@example.com',
            'phone' => '+27114009000',
            'details' => 'Camera offline.',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('subject');
    }

    public function test_support_request_succeeds_with_subject(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'type' => 'support',
            'full_name' => 'Marcus Aurelius',
            'email' => 'marcus@example.com',
            'phone' => '+27114009000',
            'subject' => 'CCTV Stream Offline on Channel 4',
            'priority' => 'urgent',
            'details' => 'Camera offline since this morning.',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('inquiries', ['type' => 'support', 'priority' => 'urgent']);
    }

    public function test_invalid_type_is_rejected(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'type' => 'not-a-real-type',
            'full_name' => 'A',
            'email' => 'a@example.com',
            'phone' => '+1234567890',
            'details' => 'x',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('type');
    }

    public function test_invalid_email_and_phone_are_rejected(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'type' => 'support',
            'full_name' => 'A',
            'email' => 'not-an-email',
            'phone' => 'abc',
            'subject' => 'x',
            'details' => 'x',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'phone']);
    }

    public function test_creation_response_never_echoes_contact_details_or_meta(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'type' => 'support',
            'full_name' => 'Marcus Aurelius',
            'email' => 'marcus@example.com',
            'phone' => '+27114009000',
            'subject' => 'Issue',
            'details' => 'Details here.',
        ]);

        $response->assertCreated();
        $data = $response->json('data');
        $this->assertArrayNotHasKey('email', $data);
        $this->assertArrayNotHasKey('phone', $data);
        $this->assertArrayNotHasKey('details', $data);
        $this->assertArrayNotHasKey('meta', $data);
    }

    public function test_status_lookup_by_reference_returns_only_reference_type_and_status(): void
    {
        $inquiry = Inquiry::factory()->create();

        $response = $this->getJson("/api/inquiries/{$inquiry->reference}");

        $response->assertOk();
        $data = $response->json('data');
        $this->assertSame($inquiry->reference, $data['reference']);
        $this->assertSame($inquiry->status, $data['status']);
        $this->assertArrayNotHasKey('email', $data);
        $this->assertArrayNotHasKey('phone', $data);
        $this->assertArrayNotHasKey('full_name', $data);
        $this->assertArrayNotHasKey('details', $data);
    }

    public function test_status_lookup_returns_404_for_unknown_reference(): void
    {
        $response = $this->getJson('/api/inquiries/ST-CONS-NOTREAL');

        $response->assertStatus(404);
    }
}
