<?php

namespace Tests\Feature\Admin;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_cannot_create_a_page(): void
    {
        $staff = User::factory()->staff()->create();

        $response = $this->actingAs($staff)->postJson('/api/admin/pages', [
            'slug' => 'privacy-policy',
            'title' => 'Privacy Policy',
            'body' => '<p>...</p>',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_and_publish_a_page(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/pages', [
            'slug' => 'privacy-policy',
            'title' => 'Privacy Policy',
            'body' => '<p>Our policy.</p>',
            'is_published' => true,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('pages', ['slug' => 'privacy-policy', 'updated_by' => $admin->id]);

        $public = $this->getJson('/api/pages/privacy-policy');
        $public->assertOk()->assertJsonPath('data.title', 'Privacy Policy');
    }

    public function test_unpublished_page_is_not_visible_publicly(): void
    {
        Page::factory()->create(['slug' => 'draft-page', 'is_published' => false]);

        $this->getJson('/api/pages/draft-page')->assertStatus(404);
    }

    public function test_unpublishing_a_page_via_destroy_hides_it_publicly(): void
    {
        $admin = User::factory()->admin()->create();
        $page = Page::factory()->published()->create(['slug' => 'about-us']);

        $this->getJson('/api/pages/about-us')->assertOk();

        $this->actingAs($admin)->deleteJson("/api/admin/pages/{$page->id}")->assertOk();

        $this->assertDatabaseHas('pages', ['id' => $page->id, 'is_published' => false]);
        $this->getJson('/api/pages/about-us')->assertStatus(404);
    }
}
