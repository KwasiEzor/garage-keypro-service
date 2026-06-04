<?php

namespace App\Filament\Resources\Appointments\Pages;

use App\Enums\AppointmentStatus;
use App\Filament\Resources\Appointments\AppointmentResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ViewAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditAppointment extends EditRecord
{
    protected static string $resource = AppointmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('mark_completed')
                ->label('Mark Completed')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn ($record) => $record->status === AppointmentStatus::Confirmed)
                ->action(function ($record) {
                    $record->update(['status' => AppointmentStatus::Completed]);
                    Notification::make()
                        ->title('Appointment marked as completed')
                        ->success()
                        ->send();
                }),

            Action::make('mark_no_show')
                ->label('Mark No Show')
                ->icon('heroicon-o-x-circle')
                ->color('warning')
                ->requiresConfirmation()
                ->visible(fn ($record) => $record->status === AppointmentStatus::Confirmed)
                ->action(function ($record) {
                    $record->update(['status' => AppointmentStatus::NoShow]);
                    Notification::make()
                        ->title('Appointment marked as no-show')
                        ->warning()
                        ->send();
                }),

            ViewAction::make(),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
