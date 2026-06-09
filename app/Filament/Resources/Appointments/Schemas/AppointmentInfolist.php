<?php

declare(strict_types=1);

namespace App\Filament\Resources\Appointments\Schemas;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\FontWeight;

class AppointmentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->columnSpanFull()
                    ->components([
                        Grid::make(3)
                            ->components([
                                TextEntry::make('status')
                                    ->badge()
                                    ->weight(FontWeight::Bold),
                                TextEntry::make('service.name')
                                    ->label('Service')
                                    ->icon('heroicon-o-wrench-screwdriver')
                                    ->weight(FontWeight::Bold)
                                    ->color('primary'),
                                TextEntry::make('team.name')
                                    ->label('Team')
                                    ->icon('heroicon-o-building-office-2'),
                            ]),
                    ]),

                Grid::make(3)
                    ->columnSpanFull()
                    ->components([
                        Section::make('Schedule')
                            ->columnSpanFull()
                            ->icon('heroicon-o-calendar-days')
                            ->components([
                                Grid::make(2)
                                    ->components([
                                        TextEntry::make('start_at')
                                            ->label('Start Time')
                                            ->dateTime('M j, Y H:i')
                                            ->icon('heroicon-o-clock')
                                            ->color('gray'),
                                        TextEntry::make('end_at')
                                            ->label('End Time')
                                            ->dateTime('M j, Y H:i')
                                            ->icon('heroicon-o-clock')
                                            ->color('gray'),
                                    ]),
                                TextEntry::make('notes')
                                    ->label('Notes')
                                    ->icon('heroicon-o-document-text')
                                    ->placeholder('No notes provided')
                                    ->columnSpanFull(),
                            ]),

                        Section::make('Client Information')
                            ->columnSpanFull()
                            ->icon('heroicon-o-user')
                            ->components([
                                TextEntry::make('user.name')
                                    ->label('Name')
                                    ->weight(FontWeight::Medium),
                                TextEntry::make('user.email')
                                    ->label('Email')
                                    ->icon('heroicon-o-envelope')
                                    ->copyable()
                                    ->color('gray'),
                            ]),
                    ]),

                Section::make('Cancellation Details')
                    ->columnSpanFull()
                    ->icon('heroicon-o-x-circle')
                    ->visible(fn (Appointment $record): bool => $record->status === AppointmentStatus::Cancelled)
                    ->components([
                        TextEntry::make('cancellation_reason')
                            ->label('Reason')
                            ->placeholder('No reason provided')
                            ->columnSpanFull(),
                    ]),

                Section::make('Metadata')
                    ->columnSpanFull()
                    ->collapsed()
                    ->icon('heroicon-o-information-circle')
                    ->components([
                        Grid::make(3)
                            ->components([
                                TextEntry::make('created_at')
                                    ->label('Created')
                                    ->dateTime()
                                    ->color('gray'),
                                TextEntry::make('updated_at')
                                    ->label('Last Updated')
                                    ->dateTime()
                                    ->color('gray'),
                                TextEntry::make('deleted_at')
                                    ->label('Deleted')
                                    ->dateTime()
                                    ->color('danger')
                                    ->visible(fn (Appointment $record): bool => $record->trashed()),
                            ]),
                    ]),
            ]);
    }
}
