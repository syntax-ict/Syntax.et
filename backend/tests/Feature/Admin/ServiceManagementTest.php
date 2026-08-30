<?php

namespace Tests\Feature\Admin;

use App\Models\Service;
use App\Models\SolutionCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceManagementTest extends TestCase
{
    use RefreshDatabase;

    private function payload(int $categoryId, array $overrides = []): array
    {
        return array_merge([
            'solution_category_id' => $categoryId,
            'slug' => 'cctv-surveillance',
            'name' => 'CCTV Surveillance Design',
            'short_description' => 'IP camera networks.',
            'description' => 'Full design and installation.',
            'icon' => 'Camera',
            'benefits' => ['Night vision', 'Remote viewing'],
        ], $overrides);
    }

    public function test_staff_cannot_create_a_service(): void
    {
        $staff = User::factory()->staff()->create();
        $category = SolutionCategory::factory()->create();

        $this->actingAs($staff)->postJson('/api/admin/services', $this->payload($category->id))->assertStatus(403);
    }

    public function test_admin_can_create_a_service_with_faqs_managed_separately(): void
    {
        $admin = User::factory()->admin()->create();
        $category = SolutionCategory::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/services', $this->payload($category->id));
        $response->assertCreated();
        $serviceId = $response->json('data.id');

        $faqResponse = $this->actingAs($admin)->postJson("/api/admin/services/{$serviceId}/faqs", [
            'question' => 'Is it reliable?',
            'answer' => 'Yes.',
        ]);
        $faqResponse->assertCreated();

        $show = $this->actingAs($admin)->getJson("/api/admin/services/{$serviceId}");
        $this->assertCount(1, $show->json('data.faqs'));
    }

    public function test_admin_can_delete_a_faq(): void
    {
        $admin = User::factory()->admin()->create();
        $service = Service::factory()->create();
        $faq = $service->faqs()->create(['question' => 'Q?', 'answer' => 'A', 'sort_order' => 0]);

        $response = $this->actingAs($admin)->deleteJson("/api/admin/services/{$service->id}/faqs/{$faq->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('service_faqs', ['id' => $faq->id]);
    }

    public function test_service_create_requires_a_valid_category(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/services', $this->payload(999999));

        $response->assertStatus(422)->assertJsonValidationErrors('solution_category_id');
    }
}
