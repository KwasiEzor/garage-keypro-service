<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'team_id' => Team::factory(),
            'client_id' => User::factory(),
            'number' => 'INV-'.$this->faker->unique()->numberBetween(1000, 9999),
            'issue_date' => now(),
            'due_date' => now()->addDays(14),
            'status' => $this->faker->randomElement(['draft', 'sent', 'paid', 'cancelled']),
            'subtotal' => 0,
            'tax_total' => 0,
            'total_amount' => 0,
            'currency' => 'USD',
            'notes' => $this->faker->sentence(),
        ];
    }
}
