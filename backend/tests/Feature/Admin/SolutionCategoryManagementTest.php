<?php

namespace Tests\Feature\Admin;

use App\Models\SolutionCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Representative content-management test — the other five content
 * resources (services, customer-problems, courses, projects, pages) follow
 * the identical AdminCrudController shape and are covered by their own
 * test files at the same depth: create/update validation, the staff-vs-
 * admin write boundary, and the soft-delete-not-hard-delete destroy
 * behavior.
 */
class SolutionCategoryManagementTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'technology-solutions',
            'name' => 'Technology Solutions',
            'short_description' => 'IT infrastructure and networking.',
            'detailed_description' => 'Structured cabling and network overhauls.',
            'icon' => 'Network',
            'color_primary' => 'bg-blue-600',
            'color_bg' => 'bg-blue-50',
            'color_border' => 'border-blue-100',
            'color_accent' => 'text-blue-600',
        ], $overrides);
    }

    public function test_guest_cannot_access_admin_content_routes(): void
    {
        $this->getJson('/api/admin/solution-categories')->assertStatus(401);
    }

    public function test_staff_can_list_and_view_but_not_write(): void
    {
        $staff = User::factory()->staff()->create();
        $category = SolutionCategory::factory()->create();

        $this->actingAs($staff)->getJson('/api/admin/solution-categories')->assertOk();
        $this->actingAs($staff)->getJson("/api/admin/solution-categories/{$category->id}")->assertOk();

        $this->actingAs($staff)->postJson('/api/admin/solution-categories', $this->payload())->assertStatus(403);
        $this->actingAs($staff)->putJson("/api/admin/solution-categories/{$category->id}", $this->payload())->assertStatus(403);
        $this->actingAs($staff)->deleteJson("/api/admin/solution-categories/{$category->id}")->assertStatus(403);
    }

    public function test_admin_can_create_a_category(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/solution-categories', $this->payload());

        $response->assertCreated()->assertJsonPath('data.slug', 'technology-solutions');
        $this->assertDatabaseHas('solution_categories', ['slug' => 'technology-solutions']);
    }

    public function test_admin_create_requires_a_valid_slug_format(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/solution-categories', $this->payload(['slug' => 'Not A Valid Slug!']));

        $response->assertStatus(422)->assertJsonValidationErrors('slug');
    }

    public function test_admin_cannot_create_a_duplicate_slug(): void
    {
        $admin = User::factory()->admin()->create();
        SolutionCategory::factory()->create(['slug' => 'technology-solutions']);

        $response = $this->actingAs($admin)->postJson('/api/admin/solution-categories', $this->payload());

        $response->assertStatus(422)->assertJsonValidationErrors('slug');
    }

    public function test_admin_can_update_a_category_keeping_its_own_slug(): void
    {
        $admin = User::factory()->admin()->create();
        $category = SolutionCategory::factory()->create(['slug' => 'technology-solutions']);

        $response = $this->actingAs($admin)->putJson(
            "/api/admin/solution-categories/{$category->id}",
            $this->payload(['name' => 'Updated Name']),
        );

        $response->assertOk()->assertJsonPath('data.name', 'Updated Name');
    }

    public function test_admin_destroy_deactivates_rather_than_deletes(): void
    {
        $admin = User::factory()->admin()->create();
        $category = SolutionCategory::factory()->create();

        $response = $this->actingAs($admin)->deleteJson("/api/admin/solution-categories/{$category->id}");

        $response->assertOk();
        $this->assertDatabaseHas('solution_categories', ['id' => $category->id, 'is_active' => false]);
    }

    public function test_deactivated_category_disappears_from_the_public_endpoint(): void
    {
        $admin = User::factory()->admin()->create();
        $category = SolutionCategory::factory()->create(['slug' => 'to-hide']);

        $this->actingAs($admin)->deleteJson("/api/admin/solution-categories/{$category->id}")->assertOk();

        $this->getJson('/api/solution-categories/to-hide')->assertStatus(404);
    }
}
