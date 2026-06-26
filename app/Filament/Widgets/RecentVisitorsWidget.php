<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\PageView;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentVisitorsWidget extends BaseWidget
{
    protected static ?string $heading = 'Recent Visitors';

    protected static ?int $sort = 6;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $pollingInterval = '30s';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                PageView::query()
                    ->with('user')
                    ->orderByDesc('visited_at')
                    ->limit(50)
            )
            ->columns([
                TextColumn::make('visited_at')
                    ->label('Time')
                    ->dateTime('M j, H:i:s')
                    ->sortable(),

                TextColumn::make('path')
                    ->label('Page')
                    ->limit(40)
                    ->tooltip(fn ($record) => $record->url),

                TextColumn::make('ip')
                    ->label('IP')
                    ->copyable()
                    ->copyMessage('IP copied'),

                TextColumn::make('device_type')
                    ->label('Device')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'desktop' => 'info',
                        'mobile' => 'danger',
                        'tablet' => 'success',
                        'bot' => 'gray',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn ($state) => ucfirst($state ?? 'Unknown')),

                TextColumn::make('browser')
                    ->label('Browser'),

                TextColumn::make('os')
                    ->label('OS'),

                TextColumn::make('referrer_domain')
                    ->label('Referrer')
                    ->limit(30)
                    ->placeholder('Direct')
                    ->tooltip(fn ($record) => $record->referrer),

                TextColumn::make('user.name')
                    ->label('User')
                    ->placeholder('Guest')
                    ->limit(20),

                TextColumn::make('response_time_ms')
                    ->label('Response')
                    ->formatStateUsing(fn ($state) => $state ? $state.'ms' : '—')
                    ->color(fn ($state) => match (true) {
                        $state === null => 'gray',
                        $state <= 300 => 'success',
                        $state <= 1000 => 'warning',
                        default => 'danger',
                    }),
            ])
            ->defaultSort('visited_at', 'desc')
            ->paginated([10, 25, 50]);
    }
}
