<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\PageView;
use Filament\Widgets\ChartWidget;

class TrafficSourcesChart extends ChartWidget
{
    protected ?string $heading = 'Traffic Sources (30 days)';

    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = 1;

    protected function getData(): array
    {
        // Categorise by referrer_domain: direct, search, social, referral
        $direct = PageView::humans()->lastDays(30)->whereNull('referrer')->count();

        $search = PageView::humans()->lastDays(30)
            ->where(function ($q): void {
                $q->where('referrer_domain', 'like', '%google%')
                    ->orWhere('referrer_domain', 'like', '%bing%')
                    ->orWhere('referrer_domain', 'like', '%yahoo%')
                    ->orWhere('referrer_domain', 'like', '%duckduckgo%')
                    ->orWhere('referrer_domain', 'like', '%baidu%')
                    ->orWhere('referrer_domain', 'like', '%yandex%');
            })->count();

        $social = PageView::humans()->lastDays(30)
            ->where(function ($q): void {
                $q->where('referrer_domain', 'like', '%facebook%')
                    ->orWhere('referrer_domain', 'like', '%instagram%')
                    ->orWhere('referrer_domain', 'like', '%twitter%')
                    ->orWhere('referrer_domain', 'like', '%linkedin%')
                    ->orWhere('referrer_domain', 'like', '%tiktok%')
                    ->orWhere('referrer_domain', 'like', '%youtube%');
            })->count();

        $utm = PageView::humans()->lastDays(30)->whereNotNull('utm_source')->count();

        $referral = PageView::humans()->lastDays(30)
            ->whereNotNull('referrer')
            ->where(function ($q): void {
                $q->whereNotIn('referrer_domain', [])
                    ->whereRaw("referrer_domain NOT LIKE '%google%'")
                    ->whereRaw("referrer_domain NOT LIKE '%bing%'")
                    ->whereRaw("referrer_domain NOT LIKE '%facebook%'")
                    ->whereRaw("referrer_domain NOT LIKE '%instagram%'")
                    ->whereRaw("referrer_domain NOT LIKE '%twitter%'")
                    ->whereRaw("referrer_domain NOT LIKE '%linkedin%'");
            })->count();

        return [
            'datasets' => [[
                'data' => [$direct, $search, $social, $utm, $referral],
                'backgroundColor' => ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#fc8181'],
                'hoverOffset' => 8,
            ]],
            'labels' => ['Direct', 'Search', 'Social', 'Campaign (UTM)', 'Referral'],
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => ['legend' => ['position' => 'bottom']],
        ];
    }
}
