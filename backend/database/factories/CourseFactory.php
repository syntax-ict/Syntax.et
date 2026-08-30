<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\SolutionCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->words(4, true);

        return [
            'solution_category_id' => SolutionCategory::factory(),
            'slug' => Str::slug($title),
            'title' => Str::title($title),
            'duration' => '4 weeks',
            'level' => fake()->randomElement(['beginner', 'intermediate', 'advanced', 'all_levels']),
            'mode' => fake()->randomElement(['online', 'face_to_face', 'corporate']),
            'description' => fake()->paragraphs(2, true),
            'syllabus' => fake()->sentences(4),
            'skills_gained' => fake()->sentences(3),
            'target_audience' => fake()->sentences(2),
            'requirements' => fake()->sentences(2),
            'modules' => [
                ['title' => 'Module 1', 'topics' => fake()->sentences(3)],
                ['title' => 'Module 2', 'topics' => fake()->sentences(3)],
            ],
            'schedule' => 'Weekday evenings',
            'location' => 'Main campus',
            'price_amount' => fake()->randomElement([null, 150.00, 350.00]),
            'price_currency' => 'ETB',
            'capacity' => null,
            'sort_order' => 0,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
