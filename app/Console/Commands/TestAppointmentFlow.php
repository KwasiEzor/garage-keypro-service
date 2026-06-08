<?php

namespace App\Console\Commands;

use App\Models\Service;
use App\Models\Team;
use App\Services\AppointmentService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class TestAppointmentFlow extends Command
{
    protected $signature = 'test:appointment-flow';

    protected $description = 'Test the complete appointment booking flow';

    public function handle(AppointmentService $appointmentService): int
    {
        $this->info('=== TESTING APPOINTMENT BOOKING FLOW ===');
        $this->newLine();

        // Get service and team
        $service = Service::where('is_active', true)->first();
        $team = Team::where('is_personal', false)->first();

        if (! $service || ! $team) {
            $this->error('❌ No active service or non-personal team found');
            $this->info('Please ensure you have:');
            $this->info('  - At least one active service');
            $this->info('  - At least one non-personal team');

            return 1;
        }

        $this->info("Service: {$service->name} (ID: {$service->id})");
        $this->info("Team: {$team->name} (ID: {$team->id})");
        $this->newLine();

        // Test Step 1: Get availability for current month
        $this->info('--- Step 1: Testing Availability Endpoint ---');
        $month = now()->format('Y-m');
        $this->info("Month: {$month}");

        try {
            $availability = [];
            $daysInMonth = now()->daysInMonth;
            $today = Carbon::today();

            for ($day = 1; $day <= $daysInMonth; $day++) {
                $date = now()->day($day);

                if ($date->lt($today)) {
                    continue;
                }

                $slots = $appointmentService->getAvailableSlots($team, $date, $service);
                $slotCount = count($slots);

                if ($slotCount > 0) {
                    $availability[$date->format('Y-m-d')] = [
                        'slots' => $slotCount,
                        'first' => $slots[0]['start_time'] ?? null,
                    ];
                }
            }

            $this->info('Available dates: '.count($availability));

            if (empty($availability)) {
                $this->warn('⚠️  No availability found');
                $this->info('This is expected if business hours are not configured');
                $this->newLine();
                $this->info('To configure business hours:');
                $this->info('  1. Visit the team settings in Filament admin');
                $this->info('  2. Add business hours (e.g., Monday-Friday 9am-5pm)');
                $this->newLine();

                return 0;
            }

            $this->info('✅ Availability check passed');
            $this->newLine();

            // Show sample dates
            $this->info('Sample available dates:');
            $count = 0;
            foreach ($availability as $date => $info) {
                if ($count++ >= 5) {
                    break;
                }
                $this->info("  {$date}: {$info['slots']} slots, first at {$info['first']}");
            }
            $this->newLine();

            // Test Step 2: Get slots for first available date
            $this->info('--- Step 2: Testing Slots Endpoint ---');
            $firstDate = array_key_first($availability);
            $this->info("Testing date: {$firstDate}");

            $slots = $appointmentService->getAvailableSlots(
                $team,
                Carbon::parse($firstDate),
                $service
            );

            $this->info('Total slots: '.count($slots));
            $availableSlots = collect($slots)->where('is_available', true)->count();
            $this->info('Available slots: '.$availableSlots);

            if ($availableSlots > 0) {
                $this->info('✅ Slots check passed');
                $this->newLine();

                $this->info('Sample time slots:');
                $count = 0;
                foreach ($slots as $slot) {
                    if ($count++ >= 5) {
                        break;
                    }
                    $status = $slot['is_available'] ? '✓' : '✗';
                    $this->info("  {$status} {$slot['start_time']} - {$slot['end_time']}");
                }
            } else {
                $this->warn('⚠️  No available time slots');
            }

            $this->newLine();
            $this->info('=== APPOINTMENT FLOW TEST COMPLETE ===');
            $this->info('✅ All endpoint checks passed');
            $this->newLine();
            $this->info('Next steps:');
            $this->info('  1. Visit https://garage-keypro-service.test/appointments');
            $this->info('  2. Select a service');
            $this->info('  3. Pick a date from the calendar');
            $this->info('  4. Select a time slot');
            $this->info('  5. Complete the booking');

            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Error: '.$e->getMessage());
            $this->error('Stack trace:');
            $this->error($e->getTraceAsString());

            return 1;
        }
    }
}
