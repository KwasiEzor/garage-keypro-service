<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startAt = fake()->dateTimeBetween('now', '+30 days')->setTime(
            fake()->numberBetween(9, 17),
            fake()->randomElement([0, 15, 30, 45])
        );

        $service = Service::factory()->create();
        $endAt = (clone $startAt)->modify("+{$service->estimated_duration} minutes");

        $makes = ['Mercedes-Benz', 'BMW', 'Audi', 'Porsche', 'Volkswagen', 'Toyota', 'Honda', 'Lexus', 'Tesla', 'Peugeot', 'Renault'];
        $models = ['S-Class', 'E-Class', 'C-Class', '3 Series', '5 Series', 'X5', 'A4', 'A6', 'Q5', '911', 'Cayenne', 'Golf', 'Passat', 'Camry', 'Accord', 'Model S', '508', 'Megane'];
        $colors = ['Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green'];

        return [
            'team_id' => Team::factory(),
            'user_id' => User::factory(),
            'service_id' => $service->id,
            'start_at' => $startAt,
            'end_at' => $endAt,
            'status' => fake()->randomElement([
                AppointmentStatus::Confirmed->value,
                AppointmentStatus::Pending->value,
                AppointmentStatus::Completed->value,
            ]),
            'notes' => fake()->optional()->sentence(),
            'vehicle_make' => fake()->randomElement($makes),
            'vehicle_model' => fake()->randomElement($models),
            'vehicle_year' => (string) fake()->numberBetween(2015, 2024),
            'vehicle_vin' => strtoupper(fake()->bothify('??#############')),
            'vehicle_license_plate' => strtoupper(fake()->bothify('??-###-??')),
            'vehicle_color' => fake()->randomElement($colors),
            'vehicle_notes' => fake()->optional(0.3)->sentence(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::Confirmed->value,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::Cancelled->value,
            'cancellation_reason' => fake()->sentence(),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::Completed->value,
            'start_at' => fake()->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }
}
