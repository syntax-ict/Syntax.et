<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\SolutionCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->words(5, true);

        return [
            'solution_category_id' => SolutionCategory::factory(),
            'slug' => Str::slug($title),
            'title' => Str::title($title),
            'client_type' => fake()->randomElement(['government', 'private_enterprise', 'retail_hub', 'corporate_office']),
            'industry' => fake()->word(),
            'description' => fake()->paragraph(),
            'challenge' => fake()->paragraph(),
            'solution_detail' => fake()->paragraph(),
            'outcome' => fake()->paragraph(),
            'scope_of_implementation' => fake()->sentences(3),
            'technologies_involved' => fake()->words(4),
            'deliverables' => fake()->sentences(3),
            'results' => fake()->sentences(3),
            'is_featured' => false,
            'sort_order' => 0,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
