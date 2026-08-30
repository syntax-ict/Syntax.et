<?php

namespace Tests\Feature\Public;

use App\Models\Service;
use App\Models\SolutionCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SolutionCategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_only_active_categories_ordered(): void
    {
        SolutionCategory::factory()->create(['name' => 'B Category', 'sort_order' => 2]);
        SolutionCategory::factory()->create(['name' => 'A Category', 'sort_order' => 1]);
        SolutionCategory::factory()->inactive()->create(['name' => 'Hidden Category']);

        $response = $this->getJson('/api/solution-categories');

        $response->assertOk();
        $names = collect($response->json('data'))->pluck('name');
        $this->assertSame(['A Category', 'B Category'], $names->all());
    }

    public function test_index_includes_active_services_for_each_category(): void
    {
        $category = SolutionCategory::factory()->create();
        Service::factory()->for($category, 'category')->create(['name' => 'Visible Service']);
        Service::factory()->for($category, 'category')->inactive()->create(['name' => 'Hidden Service']);

        $response = $this->getJson('/api/solution-categories');

        $serviceNames = collect($response->json('data.0.services'))->pluck('name');
        $this->assertSame(['Visible Service'], $serviceNames->all());

        // The nested service's own category isn't eager-loaded here (it
        // would just duplicate the parent category), so the key must be
        // omitted entirely — not a broken, empty-looking object.
        $this->assertArrayNotHasKey('category', $response->json('data.0.services.0'));
    }

    public function test_show_returns_category_by_slug_with_faqs(): void
    {
        $category = SolutionCategory::factory()->create(['slug' => 'security-smart-systems']);
        $service = Service::factory()->for($category, 'category')->create();
        $service->faqs()->create([
            'question' => 'Is it reliable?',
            'answer' => 'Yes.',
            'sort_order' => 0,
        ]);

        $response = $this->getJson('/api/solution-categories/security-smart-systems');

        $response->assertOk()->assertJsonPath('data.slug', 'security-smart-systems');
        $this->assertCount(1, $response->json('data.services.0.faqs'));
    }

    public function test_show_returns_404_for_unknown_slug(): void
    {
        $response = $this->getJson('/api/solution-categories/does-not-exist');

        $response->assertStatus(404)->assertJson([
            'success' => false,
            'message' => 'The requested resource was not found.',
        ]);
    }

    public function test_show_returns_404_for_inactive_category(): void
    {
        SolutionCategory::factory()->inactive()->create(['slug' => 'inactive-one']);

        $response = $this->getJson('/api/solution-categories/inactive-one');

        $response->assertStatus(404);
    }
}
