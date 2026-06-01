<?php

declare(strict_types=1);

namespace App\Filament\Resources\Testimonials\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Customer Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('customer_name')
                                    ->required()
                                    ->maxLength(255),
                                TextInput::make('customer_location')
                                    ->maxLength(255),
                            ]),
                        TextInput::make('vehicle_info')
                            ->placeholder('e.g. BMW M3 2022')
                            ->maxLength(255),
                        FileUpload::make('avatar_path')
                            ->label('Customer Avatar')
                            ->image()
                            ->directory('testimonials')
                            ->columnSpanFull(),
                    ]),

                Section::make('Testimonial Content')
                    ->schema([
                        Select::make('rating')
                            ->options([
                                5 => '5 Stars - Excellent',
                                4 => '4 Stars - Good',
                                3 => '3 Stars - Average',
                                2 => '2 Stars - Poor',
                                1 => '1 Star - Terrible',
                            ])
                            ->required()
                            ->native(false)
                            ->default(5),
                        Textarea::make('content')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                Section::make('Configuration')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                DatePicker::make('service_date'),
                                Toggle::make('is_featured')
                                    ->required(),
                                Toggle::make('is_active')
                                    ->required()
                                    ->default(true),
                            ]),
                    ]),
            ]);
    }
}
