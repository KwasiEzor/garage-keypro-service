@component('emails.layouts.branded')

<p class="email-greeting">Bonjour {{ $lead->name }} !</p>

<div class="email-content">
    <p>Merci d'avoir contacté <strong>GarageKeyPro</strong>. Nous avons bien reçu votre demande de consultation technique.</p>

    <p>Un de nos experts examinera vos informations et vous contactera dans les plus brefs délais.</p>
</div>

<div class="info-box">
    <div class="info-box-title">Récapitulatif de votre demande</div>
    <table class="detail-table">
        <tr>
            <td>Nom</td>
            <td>{{ $lead->name }}</td>
        </tr>
        <tr>
            <td>Email</td>
            <td>{{ $lead->email }}</td>
        </tr>
        @if($lead->phone)
        <tr>
            <td>Téléphone</td>
            <td>{{ $lead->phone }}</td>
        </tr>
        @endif
        @if($lead->vehicle_make)
        <tr>
            <td>Véhicule</td>
            <td><strong>{{ $lead->vehicle_make }} {{ $lead->vehicle_model }} ({{ $lead->vehicle_year }})</strong></td>
        </tr>
        @endif
        @if($lead->service)
        <tr>
            <td>Service demandé</td>
            <td>{{ $lead->service->name }}</td>
        </tr>
        @endif
        @if($lead->message)
        <tr>
            <td>Votre message</td>
            <td>{{ $lead->message }}</td>
        </tr>
        @endif
    </table>
</div>

<div class="text-center">
    <a href="{{ url('/services') }}" class="button-primary">
        Découvrir nos services
    </a>
</div>

<div class="email-divider"></div>

<div class="email-content">
    <p><strong>Pourquoi choisir GarageKeyPro ?</strong></p>
    <ul>
        <li>Expertise technique de pointe</li>
        <li>Service rapide et professionnel</li>
        <li>Prix transparents et compétitifs</li>
        <li>Garantie sur tous nos services</li>
    </ul>

    <p class="text-muted mt-20">
        Si vous avez des questions urgentes, n'hésitez pas à nous contacter directement.
    </p>
</div>

@endcomponent
