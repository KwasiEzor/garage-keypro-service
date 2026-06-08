<?php

namespace App\Console\Commands;

use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ConfigureBusinessHours extends Command
{
    protected $signature = 'appointments:configure-hours {team_id? : Team ID to configure}';

    protected $description = 'Configure business hours for appointment bookings';

    public function handle(): int
    {
        $this->info('=== CONFIGURE BUSINESS HOURS ===');
        $this->newLine();

        // Get team
        $teamId = $this->argument('team_id');

        if ($teamId) {
            $team = Team::find($teamId);
        } else {
            $team = Team::where('is_personal', false)->first();
        }

        if (! $team) {
            $this->error('❌ Team not found');

            return 1;
        }

        $this->info("Team: {$team->name} (ID: {$team->id})");
        $this->newLine();

        // Delete existing schedules
        $existingCount = $team->schedules()->count();
        if ($existingCount > 0) {
            $team->schedules()->delete();
            $this->info("✓ Cleared {$existingCount} existing schedule(s)");
        }

        // Create a recurring weekly schedule
        $schedule = $team->schedules()->create([
            'name' => 'Business Hours',
            'description' => 'Regular business operating hours',
            'schedule_type' => 'availability', // IMPORTANT: Must be 'availability' for getBookableSlots()
            'start_date' => Carbon::today(),
            'end_date' => null, // Ongoing
            'is_recurring' => true,
            'frequency' => 'weekly',
            'frequency_config' => [
                'days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], // Day names, not numbers
            ],
            'is_active' => true,
        ]);

        $this->info("✓ Created recurring schedule (ID: {$schedule->id})");
        $this->info("  Name: {$schedule->name}");
        $this->info('  Frequency: Weekly (Mon-Fri)');
        $this->info("  Start: {$schedule->start_date->format('Y-m-d')}");
        $this->newLine();

        // Create schedule periods for the next 90 days
        $this->info('Creating schedule periods for next 90 days...');

        $startDate = Carbon::today();
        $endDate = Carbon::today()->addDays(90);
        $current = $startDate->copy();
        $periodsCreated = 0;

        $bar = $this->output->createProgressBar(90);
        $bar->start();

        while ($current <= $endDate) {
            // Only create periods for Monday-Friday (1-5)
            if ($current->dayOfWeek >= 1 && $current->dayOfWeek <= 5) {
                $schedule->periods()->create([
                    'date' => $current->format('Y-m-d'),
                    'start_time' => '09:00:00',
                    'end_time' => '17:00:00',
                    'is_available' => true,
                ]);
                $periodsCreated++;
            }

            $current->addDay();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✓ Created {$periodsCreated} schedule periods");
        $this->newLine();

        // Summary
        $this->info('=== CONFIGURATION COMPLETE ===');
        $this->newLine();
        $this->info('Business Hours:');
        $this->info('  Monday-Friday: 09:00 - 17:00');
        $this->info('  Saturday-Sunday: Closed');
        $this->info('  Duration: Next 90 days');
        $this->newLine();

        $this->info('Next steps:');
        $this->info('  1. Run: php artisan test:appointment-flow');
        $this->info('  2. Visit: https://garage-keypro-service.test/appointments');
        $this->info('  3. Select a service and book an appointment');
        $this->newLine();

        return 0;
    }
}
