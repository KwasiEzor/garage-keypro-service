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
