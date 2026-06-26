<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\PageView;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Support\Facades\DB;

class TopPagesWidget extends BaseWidget
{
    protected static ?string $heading = 'Top Pages (30 days)';

    protected static ?int $sort = 5;

    protected int|string|array $columnSpan = 2;

    protected static ?string $pollingInterval = '60s';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                PageView::query()
                    ->humans()
                    ->lastDays(30)
                    ->select('path', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT ip) as unique_visitors'), DB::raw('AVG(response_time_ms) as avg_response'))
                    ->groupBy('path')
                    ->orderByDesc('views')
                    ->limit(15)
            )
            ->columns([
                TextColumn::make('path')
                    ->label('Page')
                    ->searchable()
                    ->limit(60)
                    ->tooltip(fn ($record) => $record->path),

                TextColumn::make('views')
                    ->label('Views')
                    ->numeric()
                    ->sortable(),

                TextColumn::make('unique_visitors')
                    ->label('Unique')
                    ->numeric()
                    ->sortable(),

                TextColumn::make('avg_response')
                    ->label('Avg Response')
                    ->formatStateUsing(fn ($state) => number_format((float) $state, 0).'ms')
                    ->sortable(),
            ])
            ->paginated(false);
    }
}
