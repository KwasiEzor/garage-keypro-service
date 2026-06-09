<?php

declare(strict_types=1);

namespace App\Filament\Resources\Invoices\Schemas;

use App\Enums\InvoiceStatus;
use App\Models\Service;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class InvoiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Invoice Information')
                    ->icon(Heroicon::OutlinedDocumentText)
                    ->components([
                        Grid::make(1)
                            ->components([
                                Select::make('team_id')
                                    ->relationship('team', 'name')
                                    ->required()
                                    ->default(fn () => auth()->user()?->current_team_id),
                                Select::make('client_id')
                                    ->relationship('client', 'name')
                                    ->required()
                                    ->searchable()
                                    ->loadingMessage('Loading clients...'),
                                TextInput::make('number')
                                    ->label('Invoice Number')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->prefix('#'),
                                DatePicker::make('issue_date')
                                    ->label('Issued On')
                                    ->required()
                                    ->default(now())
                                    ->native(false),
                                DatePicker::make('due_date')
                                    ->label('Due Date')
                                    ->required()
                                    ->default(now()->addDays(14))
                                    ->native(false),
                                Select::make('status')
                                    ->options(InvoiceStatus::class)
                                    ->required()
                                    ->default(InvoiceStatus::Draft)
                                    ->selectablePlaceholder(false),
                            ]),
                    ]),

                Section::make('Line Items')
                    ->icon(Heroicon::OutlinedListBullet)
                    ->components([
                        Repeater::make('items')
                            ->relationship()
                            ->table([
                                TableColumn::make('Service')
                                    ->width('250px')
                                    ->markAsRequired(),
                                TableColumn::make('Description'),
                                TableColumn::make('Qty')
                                    ->width('100px')
                                    ->markAsRequired(),
                                TableColumn::make('Unit Price')
                                    ->width('150px')
                                    ->markAsRequired(),
                                TableColumn::make('Total')
                                    ->width('150px'),
                            ])
                            ->schema([
                                Select::make('service_id')
                                    ->relationship('service', 'name')
                                    ->searchable()
                                    ->live()
                                    ->afterStateUpdated(function (Set $set, ?string $state): void {
                                        if ($state) {
                                            $service = Service::find($state);
                                            if ($service) {
                                                $set('description', $service->name);
                                                $set('unit_price', $service->starting_price);
                                            }
                                        }
                                    })
                                    ->hiddenLabel(),
                                TextInput::make('description')
                                    ->required()
                                    ->hiddenLabel(),
                                TextInput::make('quantity')
                                    ->numeric()
                                    ->required()
                                    ->default(1)
                                    ->live()
                                    ->afterStateUpdated(fn (Set $set, Get $get) => self::updateItemTotal($set, $get))
                                    ->hiddenLabel(),
                                TextInput::make('unit_price')
                                    ->numeric()
                                    ->required()
                                    ->prefix('$')
                                    ->live()
                                    ->afterStateUpdated(fn (Set $set, Get $get) => self::updateItemTotal($set, $get))
                                    ->hiddenLabel(),
                                TextInput::make('total_price')
                                    ->numeric()
                                    ->readOnly()
                                    ->prefix('$')
                                    ->required()
                                    ->hiddenLabel(),
                            ])
                            ->live()
                            ->afterStateUpdated(fn (Set $set, Get $get) => self::updateInvoiceTotals($set, $get))
                            ->columnSpanFull()
                            ->addActionLabel('Add Item'),
                    ]),

                Section::make('Summary & Notes')
                    ->icon(Heroicon::OutlinedCalculator)
                    ->components([
                        Grid::make(1)
                            ->components([
                                TextInput::make('subtotal')
                                    ->numeric()
                                    ->readOnly()
                                    ->prefix('$')
                                    ->extraInputAttributes(['class' => 'text-right font-semibold']),
                                TextInput::make('tax_total')
                                    ->label('Tax')
                                    ->numeric()
                                    ->prefix('$')
                                    ->live()
                                    ->afterStateUpdated(fn (Set $set, Get $get) => self::updateInvoiceTotals($set, $get))
                                    ->extraInputAttributes(['class' => 'text-right']),
                                TextInput::make('total_amount')
                                    ->label('Grand Total')
                                    ->numeric()
                                    ->readOnly()
                                    ->prefix('$')
                                    ->extraInputAttributes(['class' => 'text-right text-lg font-bold text-primary-600 dark:text-primary-400']),
                                Select::make('currency')
                                    ->options([
                                        'USD' => 'USD',
                                        'EUR' => 'EUR',
                                        'GBP' => 'GBP',
                                    ])
                                    ->required()
                                    ->default('USD')
                                    ->extraInputAttributes(['class' => 'text-right']),
                                Textarea::make('notes')
                                    ->rows(3)
                                    ->placeholder('Enter any additional information or payment instructions...'),
                            ]),
                    ]),
            ]);
    }

    public static function updateItemTotal(Set $set, Get $get): void
    {
        $quantity = (float) ($get('quantity') ?? 0);
        $unitPrice = (float) ($get('unit_price') ?? 0);
        $set('total_price', number_format($quantity * $unitPrice, 2, '.', ''));
    }

    public static function updateInvoiceTotals(Set $set, Get $get): void
    {
        $items = collect($get('items') ?? []);
        $subtotal = $items->reduce(fn (float $carry, array $item): float => $carry + (float) ($item['total_price'] ?? 0), 0.0);

        $set('subtotal', number_format($subtotal, 2, '.', ''));
        $set('total_amount', number_format($subtotal + (float) ($get('tax_total') ?? 0), 2, '.', ''));
    }
}
