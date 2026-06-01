<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class LeadsOverview extends StatsOverviewWidget
{
    #[\Override]
    protected function getStats(): array
    {
        $newToday = Lead::whereDate('created_at', today())->where('status', 'new')->count();
        $totalMonth = Lead::whereMonth('created_at', now()->month)->count();
        $convertedMonth = Lead::whereMonth('created_at', now()->month)->where('status', 'converted')->count();
        $conversionRate = $totalMonth > 0 ? round(($convertedMonth / $totalMonth) * 100, 1) : 0;

        return [
            Stat::make('New Leads Today', $newToday)
                ->description('Pending contact')
                ->descriptionIcon('heroicon-m-sparkles')
                ->chart([2, 5, 3, 8, 4, 10, 6])
                ->color('success'),

            Stat::make('Monthly Volume', $totalMonth)
                ->description('Total service requests')
                ->descriptionIcon('heroicon-m-calendar-days')
                ->chart([10, 20, 15, 30, 25, 40, 35])
                ->color('info'),

            Stat::make('Conversion Rate', $conversionRate.'%')
                ->description('Converted vs Total')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([5, 10, 15, 12, 18, 20, 22])
                ->color($conversionRate > 20 ? 'success' : 'warning'),
        ];
    }
}
