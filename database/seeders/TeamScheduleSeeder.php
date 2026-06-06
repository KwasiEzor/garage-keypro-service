<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Services\AppointmentService;
use Illuminate\Database\Seeder;

class TeamScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(AppointmentService $appointmentService): void
    {
        Team::all()->each(function (Team $team) use ($appointmentService) {
            $appointmentService->setupDefaultAvailability($team);
        });
    }
}
