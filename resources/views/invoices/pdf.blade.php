<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; color: #333; }
        .header { margin-bottom: 30px; }
        .invoice-title { font-size: 24px; font-weight: bold; }
        .company-info { margin-bottom: 20px; }
        .client-info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f5f5f5; text-align: left; padding: 10px; border-bottom: 2px solid #ddd; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .totals { text-align: right; }
        .totals-row { margin-bottom: 5px; }
        .total-amount { font-size: 18px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <div class="invoice-title">INVOICE</div>
        <div>#{{ $invoice->number }}</div>
    </div>

    <div class="company-info">
        <strong>{{ $invoice->team->name }}</strong><br>
        {{-- Add more team details here if available --}}
    </div>

    <div class="client-info">
        <strong>Bill To:</strong><br>
        {{ $invoice->client->name }}<br>
        {{ $invoice->client->email }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td>{{ number_format($item->quantity, 2) }}</td>
                    <td>{{ number_format($item->unit_price, 2) }} {{ $invoice->currency }}</td>
                    <td>{{ number_format($item->total_price, 2) }} {{ $invoice->currency }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div class="totals-row">Subtotal: {{ number_format($invoice->subtotal, 2) }} {{ $invoice->currency }}</div>
        @if($invoice->tax_total > 0)
            <div class="totals-row">Tax: {{ number_format($invoice->tax_total, 2) }} {{ $invoice->currency }}</div>
        @endif
        <div class="totals-row total-amount">Total: {{ number_format($invoice->total_amount, 2) }} {{ $invoice->currency }}</div>
    </div>

    @if($invoice->notes)
        <div style="margin-top: 30px;">
            <strong>Notes:</strong><br>
            {!! nl2br(e($invoice->notes)) !!}
        </div>
    @endif
</body>
</html>
