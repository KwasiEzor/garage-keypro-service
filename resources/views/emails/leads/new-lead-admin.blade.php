@component('emails.layouts.branded')

<p class="email-greeting">Nouveau Lead Reçu !</p>

<div class="email-content">
    <p>Une nouvelle demande de consultation a été soumise via le site web.</p>
</div>

<div class="info-box">
    <div class="info-box-title">📋 Informations du Lead</div>
    <table class="detail-table">
        <tr>
            <td>Nom</td>
            <td><strong>{{ $lead->name }}</strong></td>
        </tr>
        <tr>
            <td>Email</td>
            <td><a href="mailto:{{ $lead->email }}" style="color: {{ \App\Models\Setting::get('email_primary_color', '#4C8BF5') }};">{{ $lead->email }}</a></td>
        </tr>
        @if($lead->phone)
        <tr>
            <td>Téléphone</td>
            <td><a href="tel:{{ $lead->phone }}" style="color: {{ \App\Models\Setting::get('email_primary_color', '#4C8BF5') }};">{{ $lead->phone }}</a></td>
        </tr>
        @endif
        <tr>
            <td>Source</td>
            <td>{{ ucfirst($lead->source ?? 'website') }}</td>
        </tr>
        <tr>
            <td>Statut</td>
            <td><span style="background-color: #EBF8FF; color: #2C5282; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">{{ strtoupper($lead->status->value ?? 'new') }}</span></td>
        </tr>
    </table>
</div>

@if($lead->vehicle_make || $lead->vehicle_model || $lead->vehicle_year)
<div class="info-box" style="background-color: #F7FAFC; border-left-color: {{ \App\Models\Setting::get('email_accent_color', '#FF6700') }};">
    <div class="info-box-title" style="color: #2D3748;">🚗 Informations Véhicule</div>
    <div class="info-box-content" style="color: #4A5568; font-size: 16px; font-weight: 600;">
        {{ $lead->vehicle_make }} {{ $lead->vehicle_model }} {{ $lead->vehicle_year ? "({$lead->vehicle_year})" : '' }}
    </div>
</div>
@endif

@if($lead->service)
<div class="email-content">
    <p><strong>Service demandé:</strong> {{ $lead->service->name }}</p>
</div>
@endif

@if($lead->message)
<div class="email-content">
    <p><strong>Message du client:</strong></p>
    <div style="background-color: #F7FAFC; padding: 16px; border-radius: 8px; border-left: 3px solid {{ \App\Models\Setting::get('email_primary_color', '#4C8BF5') }};">
        <p style="margin: 0; color: #4A5568; font-style: italic;">"{{ $lead->message }}"</p>
    </div>
</div>
@endif

<div class="text-center">
    <a href="{{ url('/admin/leads/' . $lead->id) }}" class="button-primary">
        Gérer ce Lead
    </a>
</div>

<div class="email-content mt-20">
    <p class="text-muted text-center">
        Reçu le {{ now()->format('d/m/Y à H:i') }}
    </p>
</div>

@endcomponent
