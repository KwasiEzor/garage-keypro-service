<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Support\Enums\IconPosition;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class LeadStats extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Leads', Lead::count())
                ->description('Total service requests')
                ->descriptionIcon('heroicon-m-user-group', IconPosition::Before)
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('info'),
            Stat::make('New Leads', Lead::where('status', 'new')->count())
                ->description('Awaiting contact')
                ->descriptionIcon('heroicon-m-sparkles', IconPosition::Before)
                ->chart([3, 5, 2, 8, 4, 10, 2])
                ->color('warning'),
            Stat::make('Converted Leads', Lead::where('status', 'converted')->count())
                ->description('Successful jobs')
                ->descriptionIcon('heroicon-m-check-badge', IconPosition::Before)
                ->chart([1, 2, 3, 2, 5, 8, 12])
                ->color('success'),
        ];
    }
}
