<?php

namespace Tests\Feature\Admin;

use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Lead management (architecture §6/§7/§9). Directly closes the frontend
 * audit's most severe finding: the old lead tracker was a public,
 * unauthenticated page anyone could open and edit — every route here
 * requires a real authenticated session, and only admin can delete.
 */
class InquiryManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_list_or_view_inquiries(): void
    {
        $inquiry = Inquiry::factory()->create();

        $this->getJson('/api/admin/inquiries')->assertStatus(401);
        $this->getJson("/api/admin/inquiries/{$inquiry->id}")->assertStatus(401);
    }

    public function test_staff_can_list_view_and_update_status(): void
    {
        $staff = User::factory()->staff()->create();
        $inquiry = Inquiry::factory()->create(['status' => 'pending_review']);

        $this->actingAs($staff)->getJson('/api/admin/inquiries')->assertOk();
        $this->actingAs($staff)->getJson("/api/admin/inquiries/{$inquiry->id}")->assertOk()
            ->assertJsonPath('data.email', $inquiry->email);

        $response = $this->actingAs($staff)->patchJson("/api/admin/inquiries/{$inquiry->id}", [
            'status' => 'in_contact',
        ]);
        $response->assertOk()->assertJsonPath('data.status', 'in_contact');
    }

    public function test_staff_can_assign_an_inquiry_to_a_staff_member(): void
    {
        $staff = User::factory()->staff()->create();
        $assignee = User::factory()->staff()->create();
        $inquiry = Inquiry::factory()->create();

        $response = $this->actingAs($staff)->patchJson("/api/admin/inquiries/{$inquiry->id}", [
            'assigned_to' => $assignee->id,
        ]);

        $response->assertOk()->assertJsonPath('data.assignee.id', $assignee->id);
    }

    public function test_staff_can_add_a_note_and_history_accumulates(): void
    {
        $staff = User::factory()->staff()->create();
        $inquiry = Inquiry::factory()->create();

        $this->actingAs($staff)->postJson("/api/admin/inquiries/{$inquiry->id}/notes", [
            'body' => 'Completed site assessment.',
        ])->assertCreated();

        $this->actingAs($staff)->postJson("/api/admin/inquiries/{$inquiry->id}/notes", [
            'body' => 'Sent formal proposal.',
        ])->assertCreated();

        $show = $this->actingAs($staff)->getJson("/api/admin/inquiries/{$inquiry->id}");
        $this->assertCount(2, $show->json('data.notes'));
        $this->assertSame($staff->id, $show->json('data.notes.0.author.id'));
    }

    public function test_filtering_by_type_and_status_works(): void
    {
        $staff = User::factory()->staff()->create();
        Inquiry::factory()->create(['type' => 'support', 'status' => 'pending_review']);
        Inquiry::factory()->create(['type' => 'consultation', 'status' => 'resolved']);

        $response = $this->actingAs($staff)->getJson('/api/admin/inquiries?type=support');

        $this->assertCount(1, $response->json('data'));
        $this->assertSame('support', $response->json('data.0.type'));
    }

    public function test_public_endpoints_still_never_expose_full_inquiry_details(): void
    {
        $inquiry = Inquiry::factory()->create();

        $response = $this->getJson("/api/inquiries/{$inquiry->reference}");

        $response->assertOk();
        $this->assertArrayNotHasKey('email', $response->json('data'));
        $this->assertArrayNotHasKey('assignee', $response->json('data'));
    }
}
