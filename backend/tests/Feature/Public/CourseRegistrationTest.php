<?php

namespace Tests\Feature\Public;

use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_can_be_submitted_for_an_active_course(): void
    {
        $course = Course::factory()->create();

        $response = $this->postJson('/api/course-registrations', [
            'course_id' => $course->id,
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+250788000000',
            'training_mode' => 'face_to_face',
            'experience_level' => 'Beginner (No technical background)',
            'goals' => 'I want to learn CCTV installation.',
        ]);

        $response->assertCreated();
        $this->assertSame('pending', $response->json('data.status'));
        $this->assertSame($course->title, $response->json('data.course.title'));

        $this->assertDatabaseHas('course_registrations', [
            'course_id' => $course->id,
            'email' => 'jane@example.com',
        ]);
    }

    public function test_registration_is_rejected_for_an_inactive_course(): void
    {
        $course = Course::factory()->inactive()->create();

        $response = $this->postJson('/api/course-registrations', [
            'course_id' => $course->id,
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+250788000000',
            'training_mode' => 'online',
            'experience_level' => 'Beginner',
            'goals' => 'Learn.',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('course_id');
    }

    public function test_registration_is_rejected_for_a_nonexistent_course(): void
    {
        $response = $this->postJson('/api/course-registrations', [
            'course_id' => 999999,
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+250788000000',
            'training_mode' => 'online',
            'experience_level' => 'Beginner',
            'goals' => 'Learn.',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('course_id');
    }

    public function test_missing_required_fields_are_rejected(): void
    {
        $response = $this->postJson('/api/course-registrations', []);

        $response->assertStatus(422)->assertJsonValidationErrors([
            'course_id', 'full_name', 'email', 'phone', 'training_mode', 'experience_level', 'goals',
        ]);
    }
}
