@component('emails.layouts.branded')

<p class="email-greeting">Payment Received!</p>

<div class="email-content">
    <p>Hello,</p>
    <p>Thank you for your payment. This email is your official receipt for <strong>Invoice #{{ $invoice->number }}</strong>.</p>
</div>

<div class="info-box" style="text-align: center; background-color: #F0FFF4; border-left-color: #48BB78;">
    <div class="info-box-title" style="color: #2F855A;">Amount Paid</div>
    <div class="info-box-content" style="color: #2F855A; font-size: 28px; font-weight: 700;">
        ${{ number_format($invoice->total_amount, 2) }} {{ $invoice->currency }}
    </div>
</div>

<table class="detail-table">
    <tr>
        <td>Invoice Number</td>
        <td>#{{ $invoice->number }}</td>
    </tr>
    <tr>
        <td>Payment Date</td>
        <td>{{ now()->format('M j, Y') }}</td>
    </tr>
    @if($paymentMethod)
    <tr>
        <td>Payment Method</td>
        <td>{{ $paymentMethod }}</td>
    </tr>
    @endif
    <tr>
        <td>Status</td>
        <td><span style="color: #48BB78; font-weight: 600;">PAID</span></td>
    </tr>
</table>

<div class="text-center">
    <a href="{{ route('invoices.show', $invoice->uuid) }}" class="button-primary">View Full Receipt</a>
</div>

<p class="text-muted text-center mt-20">
    A PDF version of your invoice is attached for your records.
</p>

@endcomponent
