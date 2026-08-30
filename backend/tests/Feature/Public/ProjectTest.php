<?php

namespace Tests\Feature\Public;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_only_active_projects(): void
    {
        Project::factory()->create(['title' => 'Active Project']);
        Project::factory()->inactive()->create(['title' => 'Hidden Project']);

        $response = $this->getJson('/api/projects');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_show_returns_project_with_resolved_image_urls(): void
    {
        Storage::fake('public');
        $project = Project::factory()->create(['slug' => 'national-hq-security']);
        $project->images()->create([
            'disk_path' => 'project-images/example.jpg',
            'alt_text' => 'Front gate camera installation',
            'sort_order' => 0,
        ]);

        $response = $this->getJson('/api/projects/national-hq-security');

        $response->assertOk()->assertJsonPath('data.slug', 'national-hq-security');
        $this->assertStringContainsString('project-images/example.jpg', $response->json('data.images.0.url'));
        $this->assertArrayNotHasKey('disk_path', $response->json('data.images.0'));
    }

    public function test_show_returns_404_for_inactive_project(): void
    {
        Project::factory()->inactive()->create(['slug' => 'hidden-project']);

        $response = $this->getJson('/api/projects/hidden-project');

        $response->assertStatus(404);
    }
}
