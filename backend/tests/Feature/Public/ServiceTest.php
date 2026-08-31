<?php

namespace Tests\Feature\Public;

use App\Models\Service;
use App\Models\SolutionCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_only_active_services(): void
    {
        Service::factory()->create(['name' => 'Active Service']);
        Service::factory()->inactive()->create(['name' => 'Hidden Service']);

        $response = $this->getJson('/api/services');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Active Service', $response->json('data.0.name'));
    }

    public function test_show_returns_service_with_faqs_and_category(): void
    {
        $category = SolutionCategory::factory()->create(['slug' => 'technology-solutions']);
        $service = Service::factory()->for($category, 'category')->create(['slug' => 'it-infrastructure']);
        $service->faqs()->create(['question' => 'Q1?', 'answer' => 'A1', 'sort_order' => 0]);

        $response = $this->getJson('/api/services/it-infrastructure');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'it-infrastructure')
            ->assertJsonPath('data.category.slug', 'technology-solutions');
        $this->assertCount(1, $response->json('data.faqs'));
    }

    public function test_show_returns_404_for_inactive_service(): void
    {
        Service::factory()->inactive()->create(['slug' => 'hidden-service']);

        $response = $this->getJson('/api/services/hidden-service');

        $response->assertStatus(404);
    }
}
