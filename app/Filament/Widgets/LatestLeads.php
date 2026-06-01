<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Leads\LeadResource;
use App\Models\Lead;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestLeads extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    #[\Override]
    public function table(Table $table): Table
    {
        return $table
            ->query(
                Lead::query()->latest()->limit(5)
            )
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('service.name')
                    ->label('Service')
                    ->icon('heroicon-m-wrench-screwdriver'),
                TextColumn::make('phone')
                    ->icon('heroicon-m-phone'),
                TextColumn::make('vehicle_make')
                    ->label('Vehicle')
                    ->formatStateUsing(fn ($record): string => sprintf('%s %s %s', $record->vehicle_year, $record->vehicle_make, $record->vehicle_model))
                    ->color('gray'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'new' => 'warning',
                        'contacted' => 'info',
                        'converted' => 'success',
                        'lost' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime()
                    ->sortable(),
            ])
            ->actions([
                Action::make('view')
                    ->url(fn (Lead $record): string => LeadResource::getUrl('view', ['record' => $record]))
                    ->icon('heroicon-m-eye')
                    ->button(),
            ]);
    }
}
