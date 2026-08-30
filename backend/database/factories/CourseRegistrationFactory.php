<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\CourseRegistration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CourseRegistration>
 */
class CourseRegistrationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'full_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->e164PhoneNumber(),
            'organization' => fake()->optional()->company(),
            'training_mode' => fake()->randomElement(['online', 'face_to_face', 'corporate']),
            'experience_level' => 'Beginner (No technical background)',
            'goals' => fake()->paragraph(),
            'status' => 'pending',
        ];
    }
}
