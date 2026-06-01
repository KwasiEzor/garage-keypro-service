<?php

declare(strict_types=1);

namespace App\Filament\Resources\Brands\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class BrandForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Brand Details')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                                TextInput::make('slug')
                                    ->required()
                                    ->unique('brands', 'slug', ignoreRecord: true),
                            ]),
                        FileUpload::make('logo_path')
                            ->label('Brand Logo')
                            ->image()
                            ->directory('brands')
                            ->columnSpanFull(),
                    ]),

                Section::make('Configuration')
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
