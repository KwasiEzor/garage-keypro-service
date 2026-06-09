@component('emails.layouts.branded')

<p class="email-greeting">Hello {{ $appointment->customer_name }},</p>

<div class="email-content">
    <p>Your appointment has been successfully confirmed! We're looking forward to serving you.</p>
</div>

<div class="info-box">
    <div class="info-box-title">Appointment Details</div>
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
            <td>Duration</td>
            <td>{{ $appointment->duration ?? '60' }} minutes</td>
        </tr>
        <tr>
            <td>Location</td>
            <td>{{ $appointment->location ?? 'Our Service Center' }}</td>
        </tr>
        @if($appointment->vehicle_info)
        <tr>
            <td>Vehicle</td>
            <td>{{ $appointment->vehicle_info }}</td>
        </tr>
        @endif
        @if($appointment->notes)
        <tr>
            <td>Notes</td>
            <td>{{ $appointment->notes }}</td>
        </tr>
        @endif
    </table>
</div>

@if($appointment->price)
<div class="email-content">
    <p><strong>Estimated Price:</strong> ${{ number_format($appointment->price, 2) }}</p>
</div>
@endif

<div class="text-center">
    <a href="{{ config('app.url') }}/appointments/{{ $appointment->uuid }}" class="button-primary">
        View Appointment Details
    </a>
</div>

<div class="email-divider"></div>

<div class="email-content">
    <p><strong>What to bring:</strong></p>
    <ul>
        <li>Vehicle registration documents</li>
        <li>Photo ID</li>
        <li>Any existing keys or key fobs</li>
    </ul>

    <p class="text-muted mt-20">
        Need to reschedule? You can manage your appointment using the link above or contact us directly.
    </p>
</div>

@endcomponent
