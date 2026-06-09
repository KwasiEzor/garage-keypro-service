<?php

declare(strict_types=1);

namespace App\Filament\Resources\Appointments\Schemas;

use App\Enums\AppointmentStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class AppointmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Appointment Details')
                    ->description('Customer and service information')
                    ->icon('heroicon-o-calendar')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Select::make('user_id')
                                    ->label('Customer')
                                    ->relationship('user', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                                Select::make('team_id')
                                    ->label('Location')
                                    ->relationship('team', 'name')
                                    ->searchable()
                                    ->required(),
                                Select::make('service_id')
                                    ->label('Service')
                                    ->relationship('service', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                            ]),
                    ]),

                Section::make('Schedule')
                    ->description('Date and time information')
                    ->icon('heroicon-o-clock')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                DateTimePicker::make('start_at')
                                    ->label('Start Time')
                                    ->native(false)
                                    ->required(),
                                DateTimePicker::make('end_at')
                                    ->label('End Time')
                                    ->native(false)
                                    ->required(),
                                Select::make('status')
                                    ->options(AppointmentStatus::class)
                                    ->default('confirmed')
                                    ->required(),
                            ]),
                    ]),

                Section::make('Additional Information')
                    ->description('Notes and cancellation details')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        Textarea::make('notes')
                            ->label('Appointment Notes')
                            ->rows(3)
                            ->columnSpanFull(),
                        Textarea::make('cancellation_reason')
                            ->label('Cancellation Reason')
                            ->rows(2)
                            ->visible(fn ($get) => in_array($get('status'), ['cancelled', 'no_show']))
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
            ]);
    }
}
