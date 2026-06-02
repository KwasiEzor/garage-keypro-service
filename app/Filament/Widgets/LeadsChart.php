<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class LeadsChart extends ChartWidget
{
    protected ?string $heading = 'Leads Trend - Last 30 Days';

    protected int|string|array $columnSpan = 'two-thirds';

    #[\Override]
    protected function getData(): array
    {
        $data = Lead::query()
            ->where('created_at', '>=', now()->subDays(30))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'), 'status')
            ->groupBy('date', 'status')
            ->orderBy('date')
            ->get();

        $dates = collect();
        for ($i = 29; $i >= 0; $i--) {
            $dates->push(now()->subDays($i)->format('Y-m-d'));
        }

        $newLeads = $dates->map(fn (string $date): int => (int) $data->where('date', $date)->where('status', 'new')->sum('count'));
        $convertedLeads = $dates->map(fn (string $date): int => (int) $data->where('date', $date)->where('status', 'converted')->sum('count'));

        return [
            'datasets' => [
                [
                    'label' => 'New Leads',
                    'data' => $newLeads->toArray(),
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'fill' => 'start',
                ],
                [
                    'label' => 'Converted',
                    'data' => $convertedLeads->toArray(),
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'fill' => 'start',
                ],
            ],
            'labels' => $dates->map(fn (string $date): string => date('j M', strtotime((string) $date)))->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
