@component('emails.layouts.branded')

<p class="email-greeting">Appointment Confirmed!</p>

<div class="email-content">
    <p>Hello {{ $notifiable->name }},</p>
    <p>Your appointment with <strong>{{ $appointment->team->name }}</strong> has been successfully confirmed. We look forward to seeing you!</p>
    
    <div class="info-box">
        <div class="info-box-title">Important Note</div>
        <div class="info-box-content">
            Please arrive 5-10 minutes early. If you need to reschedule or cancel, please do so at least 24 hours in advance.
        </div>
    </div>
</div>

<table class="detail-table">
    <tr>
        <td>Service</td>
        <td>{{ $appointment->service->name }}</td>
    </tr>
    <tr>
        <td>Date</td>
        <td>{{ $appointment->start_at->format('l, F j, Y') }}</td>
    </tr>
    <tr>
        <td>Time</td>
        <td>{{ $appointment->start_at->format('g:i A') }} - {{ $appointment->end_at->format('g:i A') }}</td>
    </tr>
    <tr>
        <td>Location</td>
        <td>{{ $appointment->team->name }}</td>
    </tr>
    @if($appointment->notes)
    <tr>
        <td>Your Notes</td>
        <td>{{ $appointment->notes }}</td>
    </tr>
    @endif
</table>

<div class="text-center">
    <a href="{{ url('/my-appointments') }}" class="button-primary">Manage Appointment</a>
</div>

<div class="email-divider"></div>

<p class="text-muted text-center">
    A calendar invite (.ics) has been attached to this email for your convenience.
</p>

@endcomponent
