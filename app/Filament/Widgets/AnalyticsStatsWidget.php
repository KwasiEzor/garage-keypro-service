<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\PageView;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class AnalyticsStatsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected int|string|array $columnSpan = 'full';

    protected function getStats(): array
    {
        $todayViews = PageView::humans()->today()->count();
        $yesterdayViews = PageView::humans()->whereDate('visited_at', today()->subDay())->count();
        $viewsTrend = $this->percentChange($yesterdayViews, $todayViews);

        $uniqueToday = PageView::humans()->today()->distinct('ip')->count('ip');
        $uniqueYesterday = PageView::humans()->whereDate('visited_at', today()->subDay())->distinct('ip')->count('ip');
        $uniqueTrend = $this->percentChange($uniqueYesterday, $uniqueToday);

        $last30Days = PageView::humans()->lastDays(30)->count();
        $prev30Days = PageView::humans()
            ->where('visited_at', '>=', now()->subDays(60))
            ->where('visited_at', '<', now()->subDays(30))
            ->count();
        $monthTrend = $this->percentChange($prev30Days, $last30Days);

        $newUsersToday = User::whereDate('created_at', today())->count();
        $newUsersYesterday = User::whereDate('created_at', today()->subDay())->count();
        $usersTrend = $this->percentChange($newUsersYesterday, $newUsersToday);

        $avgResponseMs = (int) PageView::humans()->lastDays(7)->avg('response_time_ms');

        // Bounce rate: sessions with only 1 page view
        $bounceRate = $this->calculateBounceRate();

        return [
            Stat::make('Page Views Today', number_format($todayViews))
                ->description($this->trendLabel($viewsTrend, $yesterdayViews).' vs yesterday')
                ->descriptionIcon($viewsTrend >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->chart($this->last7DaysData())
                ->color($viewsTrend >= 0 ? 'success' : 'danger'),

            Stat::make('Unique Visitors Today', number_format($uniqueToday))
                ->description($this->trendLabel($uniqueTrend, $uniqueYesterday).' vs yesterday')
                ->descriptionIcon($uniqueTrend >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($uniqueTrend >= 0 ? 'success' : 'danger'),

            Stat::make('Views Last 30 Days', number_format($last30Days))
                ->description($this->trendLabel($monthTrend, $prev30Days).' vs previous 30d')
                ->descriptionIcon($monthTrend >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($monthTrend >= 0 ? 'success' : 'danger'),

            Stat::make('New Registrations Today', number_format($newUsersToday))
                ->description($this->trendLabel($usersTrend, $newUsersYesterday).' vs yesterday')
                ->descriptionIcon('heroicon-m-user-plus')
                ->color('info'),

            Stat::make('Bounce Rate (7d)', $bounceRate.'%')
                ->description('Sessions with single page view')
                ->descriptionIcon('heroicon-m-arrow-uturn-left')
                ->color($bounceRate <= 40 ? 'success' : ($bounceRate <= 65 ? 'warning' : 'danger')),

            Stat::make('Avg Response Time (7d)', $avgResponseMs.'ms')
                ->description('Server response time')
                ->descriptionIcon('heroicon-m-bolt')
                ->color($avgResponseMs <= 300 ? 'success' : ($avgResponseMs <= 800 ? 'warning' : 'danger')),
        ];
    }

    /** @return array<int, int> */
    private function last7DaysData(): array
    {
        $data = PageView::humans()
            ->lastDays(7)
            ->select(DB::raw('DATE(visited_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy(DB::raw('DATE(visited_at)'))
            ->orderBy('date')
            ->pluck('count', 'date');

        $result = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i)->toDateString();
            $result[] = $data[$date] ?? 0;
        }

        return $result;
    }

    private function calculateBounceRate(): float
    {
        $total = PageView::humans()
            ->lastDays(7)
            ->whereNotNull('session_id')
            ->select('session_id', DB::raw('COUNT(*) as views'))
            ->groupBy('session_id')
            ->get();

        if ($total->isEmpty()) {
            return 0.0;
        }

        $bounced = $total->where('views', 1)->count();

        return round(($bounced / $total->count()) * 100, 1);
    }

    private function percentChange(int $from, int $to): float
    {
        if ($from === 0) {
            return $to > 0 ? 100.0 : 0.0;
        }

        return round((($to - $from) / $from) * 100, 1);
    }

    private function trendLabel(float $pct, int $base): string
    {
        $sign = $pct >= 0 ? '+' : '';

        return "{$sign}{$pct}% ({$base})";
    }
}
