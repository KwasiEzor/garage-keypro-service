<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Key Programming',
            'Key Duplication',
            'Lockout Service',
            'Ignition Repair',
            'ECU Programming',
            'Diagnostic Service',
            'Transponder Key',
            'Remote Programming',
            'Key Extraction',
            'Lock Replacement',
        ]).' '.fake()->unique()->numberBetween(1, 10000);

        return [
            'name' => $name,
            'slug' => str($name)->slug(),
            'description' => fake()->sentence(12),
            'long_description' => fake()->paragraph(4),
            'icon' => fake()->randomElement(['Key', 'KeyRound', 'Wrench', 'Cpu', 'Settings', 'Car']),
            'starting_price' => fake()->randomFloat(2, 50, 500),
            'estimated_duration' => fake()->numberBetween(30, 180),
            'is_featured' => fake()->boolean(30),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
