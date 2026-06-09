@component('emails.layouts.branded')

<p class="email-greeting">Hello {{ $appointment->customer_name }},</p>

<div class="email-content">
    <p>Your appointment has been successfully rescheduled to a new date and time.</p>
</div>

<div class="info-box">
    <div class="info-box-title">Updated Appointment Details</div>
    <table class="detail-table">
        <tr>
            <td>Service</td>
            <td><strong>{{ $appointment->service->name ?? 'N/A' }}</strong></td>
        </tr>
        <tr>
            <td>New Date & Time</td>
            <td><strong>{{ $appointment->appointment_date->format('l, F j, Y') }} at {{ $appointment->appointment_date->format('g:i A') }}</strong></td>
        </tr>
        @if($oldDate ?? null)
        <tr>
            <td>Previous Date</td>
            <td style="text-decoration: line-through; color: #A0AEC0;">{{ $oldDate->format('l, F j, Y') }} at {{ $oldDate->format('g:i A') }}</td>
        </tr>
        @endif
        <tr>
            <td>Duration</td>
            <td>{{ $appointment->duration ?? '60' }} minutes</td>
        </tr>
        <tr>
            <td>Location</td>
            <td>{{ $appointment->location ?? 'Our Service Center' }}</td>
        </tr>
    </table>
</div>

<div class="text-center">
    <a href="{{ config('app.url') }}/appointments/{{ $appointment->uuid }}" class="button-primary">
        View Updated Appointment
    </a>
</div>

<div class="email-content mt-20">
    <p class="text-muted">
        You will receive a reminder email 24 hours before your appointment.
    </p>
</div>

@endcomponent
