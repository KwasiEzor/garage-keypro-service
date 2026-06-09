@component('emails.layouts.branded')

<p class="email-greeting">Hello {{ $appointment->customer_name }},</p>

<div class="email-content">
    <p>This is a friendly reminder about your upcoming appointment tomorrow.</p>
</div>

<div class="info-box">
    <div class="info-box-title">📅 Appointment Reminder</div>
    <table class="detail-table">
        <tr>
            <td>Service</td>
            <td><strong>{{ $appointment->service->name ?? 'N/A' }}</strong></td>
        </tr>
        <tr>
            <td>Date & Time</td>
            <td><strong>{{ $appointment->appointment_date->format('l, F j, Y') }} at {{ $appointment->appointment_date->format('g:i A') }}</strong></td>
        </tr>
        <tr>
            <td>Location</td>
            <td>{{ $appointment->location ?? 'Our Service Center' }}</td>
        </tr>
    </table>
</div>

<div class="text-center">
    <a href="{{ config('app.url') }}/appointments/{{ $appointment->uuid }}" class="button-primary">
        View Appointment
    </a>
</div>

<div class="email-divider"></div>

<div class="email-content">
    <p class="text-muted">
        If you need to reschedule or cancel, please let us know as soon as possible.
    </p>
</div>

@endcomponent
