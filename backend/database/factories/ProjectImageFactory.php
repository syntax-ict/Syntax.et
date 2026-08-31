<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectImage>
 */
class ProjectImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'disk_path' => 'project-images/'.fake()->uuid().'.jpg',
            'alt_text' => fake()->sentence(),
            'sort_order' => 0,
        ];
    }
}
