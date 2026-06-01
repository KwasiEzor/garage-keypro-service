<?php

declare(strict_types=1);

namespace App\Filament\Resources\Leads\Schemas;

use App\Models\Brand;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class LeadForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Customer Information')
                    ->description('Details about the customer who submitted the lead.')
                    ->icon('heroicon-o-user')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->maxLength(255),
                                TextInput::make('email')
                                    ->label('Email address')
                                    ->email()
                                    ->required()
                                    ->maxLength(255),
                                TextInput::make('phone')
                                    ->tel()
                                    ->maxLength(255),
                            ]),
                    ]),

                Section::make('Vehicle Details')
                    ->description('Information about the vehicle related to the service request.')
                    ->icon('heroicon-o-truck')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Select::make('vehicle_make')
                                    ->label('Brand')
                                    ->options(Brand::active()->pluck('name', 'name'))
                                    ->searchable()
                                    ->createOptionForm([
                                        TextInput::make('name')
                                            ->required()
                                            ->unique('brands', 'name'),
                                    ])
                                    ->createOptionUsing(function (array $data): string {
                                        return Brand::create([
                                            'name' => $data['name'],
                                            'slug' => Str::slug($data['name']),
                                            'is_active' => true,
                                        ])->name;
                                    }),
                                TextInput::make('vehicle_model')
                                    ->maxLength(255),
                                TextInput::make('vehicle_year')
                                    ->numeric()
                                    ->minValue(1900)
                                    ->maxValue(date('Y') + 1),
                            ]),
                    ]),

                Section::make('Service & Status')
                    ->description('Operational details for this lead.')
                    ->icon('heroicon-o-cog')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Select::make('service_id')
                                    ->relationship('service', 'name')
                                    ->searchable()
                                    ->preload(),
                                Select::make('status')
                                    ->options([
                                        'new' => 'New',
                                        'contacted' => 'Contacted',
                                        'qualified' => 'Qualified',
                                        'lost' => 'Lost',
                                        'converted' => 'Converted',
                                    ])
                                    ->required()
                                    ->native(false)
                                    ->default('new'),
                                Select::make('assigned_to')
                                    ->relationship('assignedUser', 'name')
                                    ->searchable()
                                    ->preload(),
                                DateTimePicker::make('contacted_at'),
                            ]),
                    ]),

                Section::make('Message & Internal Notes')
                    ->schema([
                        Textarea::make('message')
                            ->label('Customer Message')
                            ->rows(3)
                            ->columnSpanFull(),
                        Textarea::make('notes')
                            ->label('Internal Notes')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                Section::make('Marketing Information')
                    ->description('Source and tracking details.')
                    ->icon('heroicon-o-megaphone')
                    ->collapsed()
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('source')
                                    ->required()
                                    ->default('website')
                                    ->readOnly(),
                                TextInput::make('utm_source'),
                                TextInput::make('utm_medium'),
                                TextInput::make('utm_campaign'),
                            ]),
                    ]),
            ]);
    }
}
