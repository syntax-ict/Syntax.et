<?php

namespace Database\Factories;

use App\Models\CustomerProblem;
use App\Models\SolutionCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomerProblem>
 */
class CustomerProblemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'solution_category_id' => SolutionCategory::factory(),
            'target_user' => fake()->jobTitle(),
            'problem' => fake()->sentence(),
            'impact' => fake()->paragraph(),
            'solution_text' => fake()->paragraph(),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
