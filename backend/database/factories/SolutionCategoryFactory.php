<?php

namespace Database\Factories;

use App\Models\SolutionCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<SolutionCategory>
 */
class SolutionCategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'slug' => Str::slug($name),
            'name' => Str::title($name),
            'short_description' => fake()->sentence(),
            'detailed_description' => fake()->paragraph(),
            'icon' => 'Cpu',
            'color_primary' => 'bg-blue-600',
            'color_bg' => 'bg-blue-50',
            'color_border' => 'border-blue-100',
            'color_accent' => 'text-blue-600',
            'sort_order' => 0,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
