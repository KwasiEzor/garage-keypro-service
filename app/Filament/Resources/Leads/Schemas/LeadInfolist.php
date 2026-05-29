<?php

namespace App\Filament\Resources\Leads\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class LeadInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('name'),
                TextEntry::make('email')
                    ->label('Email address'),
                TextEntry::make('phone')
                    ->placeholder('-'),
                TextEntry::make('vehicle_make')
                    ->placeholder('-'),
                TextEntry::make('vehicle_model')
                    ->placeholder('-'),
                TextEntry::make('vehicle_year')
                    ->placeholder('-'),
                TextEntry::make('service_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('message')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status'),
                TextEntry::make('source'),
                TextEntry::make('utm_source')
                    ->placeholder('-'),
                TextEntry::make('utm_medium')
                    ->placeholder('-'),
                TextEntry::make('utm_campaign')
                    ->placeholder('-'),
                TextEntry::make('contacted_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('assigned_to')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
