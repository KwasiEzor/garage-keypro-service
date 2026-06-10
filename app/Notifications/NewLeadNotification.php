<?php

declare(strict_types=1);

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
        return (new MailMessage)
            ->subject('Nouveau Lead: '.$this->lead->name)
            ->view('emails.leads.new-lead-admin', [
                'lead' => $this->lead->load('service'),
            ]);
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
