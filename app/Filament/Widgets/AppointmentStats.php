<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AppointmentStats extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $today = Appointment::whereDate('start_at', today())
            ->whereNotIn('status', [AppointmentStatus::Cancelled, AppointmentStatus::NoShow])
            ->count();

        $thisWeek = Appointment::whereBetween('start_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->whereNotIn('status', [AppointmentStatus::Cancelled, AppointmentStatus::NoShow])
            ->count();

        $upcoming = Appointment::where('start_at', '>=', now())
            ->where('start_at', '<=', now()->addDays(7))
            ->whereNotIn('status', [AppointmentStatus::Cancelled, AppointmentStatus::NoShow])
            ->count();

        $completed = Appointment::where('status', AppointmentStatus::Completed)->count();
        $total = Appointment::whereNotIn('status', [AppointmentStatus::Cancelled, AppointmentStatus::NoShow])->count();
        $completionRate = $total > 0 ? round(($completed / $total) * 100, 1) : 0;

        return [
            Stat::make("Today's Appointments", $today)
                ->description('Scheduled for today')
                ->descriptionIcon('heroicon-m-calendar')
                ->color('info'),

            Stat::make('This Week', $thisWeek)
                ->description('Appointments this week')
                ->descriptionIcon('heroicon-m-calendar-days')
                ->color('success'),

            Stat::make('Next 7 Days', $upcoming)
                ->description('Upcoming appointments')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Completion Rate', $completionRate.'%')
                ->description($completed.' of '.$total.' completed')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color($completionRate >= 80 ? 'success' : 'warning'),
        ];
    }
}
