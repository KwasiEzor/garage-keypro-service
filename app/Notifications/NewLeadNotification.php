<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewLeadNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Lead $lead
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = url('/admin/leads/'.$this->lead->id);

        return (new MailMessage)
            ->subject('Nouveau lead: '.$this->lead->name)
            ->greeting('Nouveau lead reçu!')
            ->line('Nom: '.$this->lead->name)
            ->line('Email: '.$this->lead->email)
            ->line('Téléphone: '.($this->lead->phone ?? 'Non fourni'))
            ->lineIf($this->lead->vehicle_make, 'Véhicule: '.$this->lead->vehicle_make.' '.$this->lead->vehicle_model.' '.$this->lead->vehicle_year)
            ->lineIf($this->lead->message, 'Message: '.$this->lead->message)
            ->action('Voir le lead', $url)
            ->line("Merci d'utiliser GarageKeyPro!");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'lead_id' => $this->lead->id,
            'lead_name' => $this->lead->name,
            'lead_email' => $this->lead->email,
            'lead_phone' => $this->lead->phone,
            'vehicle_info' => trim($this->lead->vehicle_make.' '.$this->lead->vehicle_model.' '.$this->lead->vehicle_year),
        ];
    }
}
