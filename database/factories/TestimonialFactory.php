<?php

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_name' => fake()->name(),
            'customer_location' => fake()->city(),
            'vehicle_info' => fake()->randomElement(['Toyota Camry', 'BMW 320d', 'Mercedes C-Class', 'Honda Accord', 'Ford Focus']),
            'content' => fake()->paragraph(2),
            'rating' => fake()->numberBetween(4, 5),
            'avatar_path' => null,
            'is_featured' => fake()->boolean(40),
            'is_active' => true,
            'service_date' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
