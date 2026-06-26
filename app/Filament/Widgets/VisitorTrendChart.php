<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\PageView;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\ChartWidget\Concerns\HasFiltersSchema;
use Illuminate\Support\Facades\DB;

class VisitorTrendChart extends ChartWidget
{
    use HasFiltersSchema;

    protected ?string $heading = 'Visitor Trend';

    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 2;

    public function filtersSchema(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('period')
                ->options(['7' => 'Last 7 days', '30' => 'Last 30 days', '90' => 'Last 90 days'])
                ->default('30'),
        ]);
    }

    protected function getData(): array
    {
        $days = (int) ($this->filters['period'] ?? 30);

        $rows = PageView::humans()
            ->where('visited_at', '>=', now()->subDays($days))
            ->select(DB::raw('DATE(visited_at) as date'), DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT ip) as unique_visitors'))
            ->groupBy(DB::raw('DATE(visited_at)'))
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $labels = $viewData = $uniqueData = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = today()->subDays($i)->toDateString();
            $labels[] = today()->subDays($i)->format('M j');
            $row = $rows[$date] ?? null;
            $viewData[] = $row?->views ?? 0;
            $uniqueData[] = $row?->unique_visitors ?? 0;
        }

        return [
            'datasets' => [
                ['label' => 'Page Views', 'data' => $viewData, 'borderColor' => '#e53e3e', 'backgroundColor' => 'rgba(229,62,62,0.08)', 'fill' => true, 'tension' => 0.4, 'pointRadius' => 3],
                ['label' => 'Unique Visitors', 'data' => $uniqueData, 'borderColor' => '#3182ce', 'backgroundColor' => 'rgba(49,130,206,0.08)', 'fill' => true, 'tension' => 0.4, 'pointRadius' => 3],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => ['legend' => ['display' => true, 'position' => 'top'], 'tooltip' => ['mode' => 'index', 'intersect' => false]],
            'scales' => ['y' => ['beginAtZero' => true, 'ticks' => ['precision' => 0]]],
            'interaction' => ['mode' => 'nearest', 'axis' => 'x', 'intersect' => false],
        ];
    }
}
