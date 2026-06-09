@component('emails.layouts.branded')

<p class="email-greeting">Hello {{ $appointment->customer_name }},</p>

<div class="email-content">
    <p>Your appointment has been cancelled as requested.</p>
</div>

<div class="info-box">
    <div class="info-box-title">Cancelled Appointment</div>
    <table class="detail-table">
        <tr>
            <td>Service</td>
            <td>{{ $appointment->service->name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td>Original Date & Time</td>
            <td>{{ $appointment->appointment_date->format('l, F j, Y') }} at {{ $appointment->appointment_date->format('g:i A') }}</td>
        </tr>
        @if($cancellationReason ?? null)
        <tr>
            <td>Reason</td>
            <td>{{ $cancellationReason }}</td>
        </tr>
        @endif
    </table>
</div>

<div class="email-content">
    <p>We're sorry we couldn't serve you this time. If you'd like to schedule a new appointment, we're here to help!</p>
</div>

<div class="text-center">
    <a href="{{ config('app.url') }}/book" class="button-primary">
        Book New Appointment
    </a>
</div>

@endcomponent
