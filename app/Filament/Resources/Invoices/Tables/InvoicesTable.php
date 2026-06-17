<?php

declare(strict_types=1);

namespace App\Filament\Resources\Invoices\Tables;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Support\InvoiceService;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class InvoicesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('number')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('team.name')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('client.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('issue_date')
                    ->date()
                    ->sortable(),
                TextColumn::make('due_date')
                    ->date()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->searchable(),
                TextColumn::make('total_amount')
                    ->money(fn (Invoice $record) => $record->currency)
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(InvoiceStatus::class),
                TrashedFilter::make(),
            ])
            ->recordActions([
                Action::make('sendEmail')
                    ->label('Send by Email')
                    ->icon('heroicon-o-envelope')
                    ->color('info')
                    ->requiresConfirmation()
                    ->hidden(fn (Invoice $record): bool => $record->status === InvoiceStatus::Paid || $record->status === InvoiceStatus::Cancelled)
                    ->action(function (Invoice $record, InvoiceService $service) {
                        $service->markAsSent($record);
                    }),
                Action::make('markAsPaid')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->hidden(fn (Invoice $record): bool => $record->status === InvoiceStatus::Paid || $record->status === InvoiceStatus::Cancelled)
                    ->action(function (Invoice $record, InvoiceService $service) {
                        $service->markAsPaid($record, 'Manual');
                    }),
                ViewAction::make()
                    ->url(fn (Invoice $record): string => route('invoices.show', $record->uuid))
                    ->openUrlInNewTab(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
