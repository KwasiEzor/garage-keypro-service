<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class LeadSourceChart extends ChartWidget
{
    protected ?string $heading = 'Leads by Source';

    protected int|string|array $columnSpan = 'one-third';

    #[\Override]
    protected function getData(): array
    {
        $data = Lead::query()
            ->select('source', DB::raw('count(*) as count'))
            ->groupBy('source')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Leads',
                    'data' => $data->pluck('count')->toArray(),
                    'backgroundColor' => [
                        '#0369A1',
                        '#0EA5E9',
                        '#38BDF8',
                        '#7DD3FC',
                        '#BAE6FD',
                    ],
                ],
            ],
            'labels' => $data->pluck('source')->map(fn ($source): string => ucfirst((string) $source))->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
