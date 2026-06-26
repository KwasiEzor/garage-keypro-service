<?php

declare(strict_types=1);

namespace App\Filament\Pages;

use App\Filament\Widgets\AnalyticsStatsWidget;
use App\Filament\Widgets\DeviceBreakdownChart;
use App\Filament\Widgets\RecentVisitorsWidget;
use App\Filament\Widgets\TopPagesWidget;
use App\Filament\Widgets\TrafficSourcesChart;
use App\Filament\Widgets\VisitorTrendChart;
use Filament\Pages\Page;

class Analytics extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chart-bar';

    protected static string|\UnitEnum|null $navigationGroup = 'Administration';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Analytics';

    protected static ?string $title = 'Website Analytics';

    protected string $view = 'filament.pages.analytics';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasRole(['admin', 'manager']) ?? false;
    }

    public function getWidgets(): array
    {
        return [
            AnalyticsStatsWidget::class,
            VisitorTrendChart::class,
            DeviceBreakdownChart::class,
            TrafficSourcesChart::class,
            TopPagesWidget::class,
            RecentVisitorsWidget::class,
        ];
    }

    public function getColumns(): int|string|array
    {
        return 3;
    }
}
