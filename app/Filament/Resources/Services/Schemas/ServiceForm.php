<?php

declare(strict_types=1);

namespace App\Filament\Resources\Services\Schemas;

use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('General Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                                TextInput::make('slug')
                                    ->required()
                                    ->unique('services', 'slug', ignoreRecord: true),
                            ]),
                        Textarea::make('description')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),
                        Textarea::make('long_description')
                            ->rows(6)
                            ->columnSpanFull(),
                    ]),

                Section::make('Pricing & Logistics')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('starting_price')
                                    ->numeric()
                                    ->prefix('$')
                                    ->step(0.01),
                                TextInput::make('estimated_duration')
                                    ->label('Estimated Duration (minutes)')
                                    ->numeric()
                                    ->suffix('min'),
                                TextInput::make('icon')
                                    ->label('Lucide Icon Name')
                                    ->helperText('e.g. key, truck, shield'),
                            ]),
                    ]),

                Section::make('Relationships')
                    ->description('Associate brands with this service.')
                    ->schema([
                        Select::make('brands')
                            ->relationship('brands', 'name')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->columnSpanFull(),
                    ]),

                Section::make('Visibility & Order')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Toggle::make('is_featured')
                                    ->required(),
                                Toggle::make('is_active')
                                    ->required()
                                    ->default(true),
                                TextInput::make('sort_order')
                                    ->required()
                                    ->numeric()
                                    ->default(0),
                            ]),
                    ]),
            ]);
    }
}
