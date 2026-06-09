<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LeadSubmissionConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Lead $lead)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Confirmation de votre demande - GarageKeyPro')
            ->greeting('Bonjour '.$this->lead->name.' !')
            ->line('Nous avons bien reçu votre demande de consultation technique.')
            ->line('Un de nos experts examinera vos informations et vous contactera dans les plus brefs délais.')
            ->line('Voici un récapitulatif de votre demande :')
            ->lineIf($this->lead->vehicle_make, '**Véhicule :** '.$this->lead->vehicle_make.' '.$this->lead->vehicle_model.' ('.$this->lead->vehicle_year.')')
            ->lineIf($this->lead->service_id, '**Service :** '.$this->lead->service?->name)
            ->lineIf($this->lead->message, '**Message :** '.$this->lead->message)
            ->line('Merci de votre confiance.')
            ->action('Découvrir nos services', url('/services'))
            ->line("L'équipe GarageKeyPro");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'lead_id' => $this->lead->id,
            'status' => $this->lead->status,
        ];
    }
}
