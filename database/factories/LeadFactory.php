<?php

namespace Database\Factories;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lead>
 */
class LeadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'vehicle_make' => fake()->randomElement(['Toyota', 'BMW', 'Mercedes', 'Honda', 'Ford', 'Volkswagen', 'Audi', 'Peugeot', 'Renault']),
            'vehicle_model' => fake()->word(),
            'vehicle_year' => fake()->numberBetween(2005, 2026),
            'service_id' => null,
            'message' => fake()->sentence(15),
            'status' => fake()->randomElement(['new', 'contacted', 'qualified', 'converted', 'lost']),
            'source' => fake()->randomElement(['website', 'chatbot', 'phone', 'other']),
            'utm_source' => fake()->optional()->randomElement(['google', 'facebook', 'instagram']),
            'utm_medium' => fake()->optional()->randomElement(['cpc', 'social', 'organic']),
            'utm_campaign' => fake()->optional()->word(),
            'contacted_at' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
            'assigned_to' => null,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
