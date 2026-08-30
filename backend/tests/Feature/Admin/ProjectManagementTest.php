<?php

namespace Tests\Feature\Admin;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectManagementTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'national-hq-security',
            'title' => 'National HQ Security Deployment',
            'client_type' => 'government',
            'description' => 'Full-site CCTV and biometric access control.',
            'deliverables' => ['32-channel NVR stack'],
            'results' => ['Digitized 100% of entry/exit timestamps'],
        ], $overrides);
    }

    public function test_staff_cannot_create_a_project(): void
    {
        $staff = User::factory()->staff()->create();

        $this->actingAs($staff)->postJson('/api/admin/projects', $this->payload())->assertStatus(403);
    }

    public function test_admin_can_create_a_project(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/projects', $this->payload());

        $response->assertCreated()->assertJsonPath('data.slug', 'national-hq-security');
    }

    public function test_admin_can_upload_and_delete_a_project_image(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        $project = Project::factory()->create();

        $upload = $this->actingAs($admin)->postJson("/api/admin/projects/{$project->id}/images", [
            'image' => UploadedFile::fake()->image('front-gate.jpg', 1000, 800),
            'alt_text' => 'Front gate installation',
        ]);

        $upload->assertCreated();
        $imageId = $upload->json('data.id');
        $this->assertNotEmpty($upload->json('data.url'));
        $this->assertArrayNotHasKey('disk_path', $upload->json('data'));

        $stored = $project->fresh()->images()->first();
        Storage::disk('public')->assertExists($stored->disk_path);

        $delete = $this->actingAs($admin)->deleteJson("/api/admin/projects/{$project->id}/images/{$imageId}");
        $delete->assertOk();
        Storage::disk('public')->assertMissing($stored->disk_path);
        $this->assertDatabaseMissing('project_images', ['id' => $imageId]);
    }

    public function test_staff_cannot_upload_a_project_image(): void
    {
        $staff = User::factory()->staff()->create();
        $project = Project::factory()->create();

        $response = $this->actingAs($staff)->postJson("/api/admin/projects/{$project->id}/images", [
            'image' => UploadedFile::fake()->image('x.jpg', 1000, 800),
            'alt_text' => 'x',
        ]);

        $response->assertStatus(403);
    }

    public function test_oversized_image_upload_is_rejected(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        $project = Project::factory()->create();

        $response = $this->actingAs($admin)->postJson("/api/admin/projects/{$project->id}/images", [
            'image' => UploadedFile::fake()->create('huge.jpg', 6000, 'image/jpeg'),
            'alt_text' => 'Too big',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('image');
    }
}
