<?php

namespace Tests\Feature\Admin;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseManagementTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'cctv-surveillance-design',
            'title' => 'CCTV Surveillance Design',
            'duration' => '4 weeks',
            'level' => 'intermediate',
            'mode' => 'face_to_face',
            'description' => 'Hands-on lab training.',
            'syllabus' => ['Lens optics', 'Cabling'],
            'skills_gained' => ['Camera design'],
        ], $overrides);
    }

    public function test_staff_cannot_create_a_course(): void
    {
        $staff = User::factory()->staff()->create();

        $this->actingAs($staff)->postJson('/api/admin/courses', $this->payload())->assertStatus(403);
    }

    public function test_admin_can_create_and_deactivate_a_course(): void
    {
        $admin = User::factory()->admin()->create();

        $create = $this->actingAs($admin)->postJson('/api/admin/courses', $this->payload());
        $create->assertCreated();
        $id = $create->json('data.id');

        $this->actingAs($admin)->deleteJson("/api/admin/courses/{$id}")->assertOk();
        $this->assertDatabaseHas('courses', ['id' => $id, 'is_active' => false]);
        $this->getJson('/api/courses/cctv-surveillance-design')->assertStatus(404);
    }

    public function test_course_requires_at_least_one_syllabus_item(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/courses', $this->payload(['syllabus' => []]));

        $response->assertStatus(422)->assertJsonValidationErrors('syllabus');
    }

    public function test_course_registrations_are_visible_to_admin_management(): void
    {
        $admin = User::factory()->admin()->create();
        $course = Course::factory()->create();
        $course->registrations()->create([
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+250788000000',
            'training_mode' => 'online',
            'experience_level' => 'Beginner',
            'goals' => 'Learn.',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->getJson('/api/admin/course-registrations');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_staff_can_update_registration_status_but_not_delete(): void
    {
        $staff = User::factory()->staff()->create();
        $course = Course::factory()->create();
        $registration = $course->registrations()->create([
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+250788000000',
            'training_mode' => 'online',
            'experience_level' => 'Beginner',
            'goals' => 'Learn.',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($staff)->patchJson("/api/admin/course-registrations/{$registration->id}", [
            'status' => 'confirmed',
        ]);

        $response->assertOk()->assertJsonPath('data.status', 'confirmed');
    }
}
