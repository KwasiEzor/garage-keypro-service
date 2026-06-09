<?php

declare(strict_types=1);

namespace App\Filament\Resources\Leads\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Enums\TextSize;

class LeadInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(1)
                    ->schema([
                        Section::make([
                            Section::make('Customer Information')
                                ->description('Primary contact details for this lead.')
                                ->icon('heroicon-m-user')
                                ->columns(1)
                                ->schema([
                                    TextEntry::make('name')
                                        ->weight(FontWeight::Bold)
                                        ->size(TextSize::Large)
                                        ->icon('heroicon-m-user-circle'),
                                    TextEntry::make('email')
                                        ->label('Email address')
                                        ->icon('heroicon-m-envelope')
                                        ->copyable(),
                                    TextEntry::make('phone')
                                        ->icon('heroicon-m-phone')
                                        ->placeholder('-')
                                        ->copyable(),
                                ]),

                            Section::make('Vehicle Details')
                                ->description('Details of the vehicle requiring service.')
                                ->icon('heroicon-m-truck')
                                ->columns(1)
                                ->schema([
                                    TextEntry::make('vehicle_make')
                                        ->label('Make')
                                        ->placeholder('-')
                                        ->badge()
                                        ->color('gray'),
                                    TextEntry::make('vehicle_model')
                                        ->label('Model')
                                        ->placeholder('-')
                                        ->badge()
                                        ->color('gray'),
                                    TextEntry::make('vehicle_year')
                                        ->label('Year')
                                        ->placeholder('-')
                                        ->badge()
                                        ->color('gray'),
                                ]),

                            Section::make('Inquiry Details')
                                ->icon('heroicon-m-chat-bubble-bottom-center-text')
                                ->columns(1)
                                ->schema([
                                    TextEntry::make('service.name')
                                        ->label('Requested Service')
                                        ->placeholder('-')
                                        ->badge()
                                        ->color('primary'),
                                    TextEntry::make('message')
                                        ->label('Customer Message')
                                        ->placeholder('-')
                                        ->prose(),
                                ]),

                            Section::make('Notes')
                                ->icon('heroicon-m-pencil-square')
                                ->collapsed()
                                ->schema([
                                    TextEntry::make('notes')
                                        ->label('')
                                        ->placeholder('No internal notes yet.')
                                        ->prose(),
                                ]),
                        ]),

                        Section::make([
                            Section::make('Status & Assignment')
                                ->columns(1)
                                ->schema([
                                    TextEntry::make('status')
                                        ->badge()
                                        ->color(fn (string $state): string => match ($state) {
                                            'new' => 'info',
                                            'contacted' => 'warning',
                                            'qualified' => 'success',
                                            'converted' => 'success',
                                            'lost' => 'danger',
                                            default => 'gray',
                                        })
                                        ->icon(fn (string $state): string => match ($state) {
                                            'new' => 'heroicon-m-sparkles',
                                            'contacted' => 'heroicon-m-chat-bubble-left-right',
                                            'qualified' => 'heroicon-m-check-badge',
                                            'converted' => 'heroicon-m-currency-dollar',
                                            'lost' => 'heroicon-m-x-circle',
                                            default => 'heroicon-m-question-mark-circle',
                                        }),
                                    TextEntry::make('assignedUser.name')
                                        ->label('Assigned To')
                                        ->placeholder('Unassigned')
                                        ->icon('heroicon-m-user-plus'),
                                    TextEntry::make('contacted_at')
                                        ->label('Last Contact')
                                        ->dateTime()
                                        ->placeholder('Never contacted')
                                        ->since(),
                                ]),

                            Section::make('Marketing Source')
                                ->columns(1)
                                ->schema([
                                    TextEntry::make('source')
                                        ->badge()
                                        ->color('gray'),
                                    TextEntry::make('utm_source')
                                        ->label('UTM Source')
                                        ->placeholder('-'),
                                    TextEntry::make('utm_medium')
                                        ->label('UTM Medium')
                                        ->placeholder('-'),
                                    TextEntry::make('utm_campaign')
                                        ->label('UTM Campaign')
                                        ->placeholder('-'),
                                ]),

                            Section::make('Metadata')
                                ->columns(1)
                                ->collapsed()
                                ->schema([
                                    TextEntry::make('created_at')
                                        ->dateTime()
                                        ->label('Received At')
                                        ->size(TextSize::Small),
                                    TextEntry::make('updated_at')
                                        ->dateTime()
                                        ->label('Last Activity')
                                        ->size(TextSize::Small),
                                ]),
                        ]),
                    ]),
            ]);
    }
}
