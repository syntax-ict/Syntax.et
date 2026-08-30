<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\SolutionCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'solution_category_id' => SolutionCategory::factory(),
            'slug' => str($name)->slug(),
            'name' => str($name)->title(),
            'short_description' => fake()->sentence(),
            'description' => fake()->paragraphs(3, true),
            'icon' => 'Shield',
            'benefits' => fake()->sentences(3),
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
