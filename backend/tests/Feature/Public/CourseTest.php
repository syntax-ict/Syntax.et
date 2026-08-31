<?php

namespace Tests\Feature\Public;

use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_only_active_courses(): void
    {
        Course::factory()->create(['title' => 'Active Course']);
        Course::factory()->inactive()->create(['title' => 'Hidden Course']);

        $response = $this->getJson('/api/courses');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_show_returns_course_by_slug(): void
    {
        Course::factory()->create(['slug' => 'cctv-surveillance-design', 'price_amount' => 250.00]);

        $response = $this->getJson('/api/courses/cctv-surveillance-design');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'cctv-surveillance-design')
            ->assertJsonPath('data.price.amount', '250.00');
    }

    public function test_show_returns_404_for_inactive_course(): void
    {
        Course::factory()->inactive()->create(['slug' => 'hidden-course']);

        $response = $this->getJson('/api/courses/hidden-course');

        $response->assertStatus(404);
    }
}
