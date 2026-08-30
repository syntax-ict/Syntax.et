<?php

namespace Database\Factories;

use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inquiry>
 */
class InquiryFactory extends Factory
{
    public function definition(): array
    {
        $type = fake()->randomElement(['consultation', 'quote', 'support']);

        return [
            'reference' => Inquiry::generateReference($type),
            'type' => $type,
            'full_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->e164PhoneNumber(),
            'organization' => fake()->company(),
            'subject' => $type === 'support' ? fake()->sentence() : null,
            'priority' => 'medium',
            'status' => 'pending_review',
            'details' => fake()->paragraph(),
            'meta' => null,
        ];
    }
}
