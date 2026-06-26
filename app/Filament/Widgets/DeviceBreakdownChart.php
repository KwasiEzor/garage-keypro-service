<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\PageView;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class DeviceBreakdownChart extends ChartWidget
{
    protected ?string $heading = 'Devices (30 days)';

    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 1;

    protected function getData(): array
    {
        $rows = PageView::humans()
            ->lastDays(30)
            ->select('device_type', DB::raw('COUNT(*) as count'))
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get();

        $colors = [
            'desktop' => '#3182ce',
            'mobile' => '#e53e3e',
            'tablet' => '#38a169',
            'bot' => '#718096',
        ];

        return [
            'datasets' => [[
                'data' => $rows->pluck('count')->toArray(),
                'backgroundColor' => $rows->map(fn ($r) => $colors[$r->device_type] ?? '#a0aec0')->toArray(),
                'hoverOffset' => 8,
            ]],
            'labels' => $rows->map(fn ($r) => ucfirst($r->device_type ?? 'Unknown'))->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => ['legend' => ['position' => 'bottom']],
            'cutout' => '65%',
        ];
    }
}
