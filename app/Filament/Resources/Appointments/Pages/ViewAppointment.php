<?php

declare(strict_types=1);

namespace App\Filament\Resources\Appointments\Pages;

use App\Enums\AppointmentStatus;
use App\Filament\Resources\Appointments\AppointmentResource;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Pages\ViewRecord;

class ViewAppointment extends ViewRecord
{
    protected static string $resource = AppointmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),

            Action::make('complete')
                ->label('Mark as Completed')
                ->color('success')
                ->icon('heroicon-o-check-circle')
                ->visible(fn (): bool => $this->getRecord()->status->canBeCompleted())
                ->requiresConfirmation()
                ->action(fn () => $this->getRecord()->update(['status' => AppointmentStatus::Completed]))
                ->after(fn () => $this->notify('success', 'Appointment marked as completed.')),

            Action::make('cancel')
                ->label('Cancel Appointment')
                ->color('danger')
                ->icon('heroicon-o-x-circle')
                ->visible(fn (): bool => $this->getRecord()->status->canBeCancelled())
                ->form([
                    Textarea::make('cancellation_reason')
                        ->label('Reason for cancellation')
                        ->required(),
                ])
                ->action(function (array $data) {
                    $this->getRecord()->update([
                        'status' => AppointmentStatus::Cancelled,
                        'cancellation_reason' => $data['cancellation_reason'],
                    ]);
                })
                ->after(fn () => $this->notify('danger', 'Appointment has been cancelled.')),
        ];
    }
}
