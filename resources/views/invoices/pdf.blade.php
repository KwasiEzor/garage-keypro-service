<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->number }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syncopate:wght@400;700&display=swap');

        :root {
            --primary: #DC2626; /* Racing Red */
            --secondary: #0F172A; /* Luxury Navy/Black */
            --text-main: #1E293B;
            --text-muted: #64748B;
            --bg-light: #F8FAFC;
            --border: #E2E8F0;
        }

        body {
            font-family: 'Outfit', sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: var(--text-main);
            margin: 0;
            padding: 0;
        }

        .container {
            padding: 40px;
        }

        .header {
            margin-bottom: 50px;
            border-bottom: 4px solid var(--secondary);
            padding-bottom: 20px;
        }

        .header-content {
            display: table;
            width: 100%;
        }

        .header-left {
            display: table-cell;
            vertical-align: bottom;
        }

        .header-right {
            display: table-cell;
            text-align: right;
            vertical-align: bottom;
        }

        .brand-name {
            font-family: 'Syncopate', sans-serif;
            font-size: 18pt;
            font-weight: 700;
            color: var(--secondary);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0;
        }

        .brand-accent {
            color: var(--primary);
        }

        .invoice-label {
            font-family: 'Syncopate', sans-serif;
            font-size: 24pt;
            font-weight: 700;
            color: var(--secondary);
            margin: 0;
            line-height: 1;
        }

        .invoice-number {
            font-size: 12pt;
            color: var(--text-muted);
            margin-top: 5px;
        }

        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 40px;
        }

        .info-column {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .info-label {
            font-family: 'Syncopate', sans-serif;
            font-size: 8pt;
            font-weight: 700;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .info-value {
            font-size: 11pt;
            color: var(--text-main);
        }

        .info-subvalue {
            font-size: 10pt;
            color: var(--text-muted);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th {
            font-family: 'Syncopate', sans-serif;
            font-size: 8pt;
            font-weight: 700;
            background-color: var(--secondary);
            color: white;
            text-align: left;
            padding: 12px 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid var(--border);
        }

        .item-description {
            font-weight: 500;
            color: var(--secondary);
        }

        .item-qty, .item-price, .item-total {
            text-align: right;
        }

        .totals-container {
            float: right;
            width: 300px;
        }

        .total-row {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }

        .total-label {
            display: table-cell;
            text-align: right;
            padding-right: 20px;
            color: var(--text-muted);
            font-size: 10pt;
        }

        .total-value {
            display: table-cell;
            text-align: right;
            font-weight: 600;
            width: 120px;
        }

        .total-grand {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid var(--secondary);
        }

        .total-grand .total-label {
            font-family: 'Syncopate', sans-serif;
            font-size: 10pt;
            font-weight: 700;
            color: var(--secondary);
            text-transform: uppercase;
        }

        .total-grand .total-value {
            font-size: 16pt;
            color: var(--primary);
        }

        .notes {
            margin-top: 60px;
            clear: both;
            padding: 20px;
            background-color: var(--bg-light);
            border-left: 4px solid var(--primary);
        }

        .notes-title {
            font-family: 'Syncopate', sans-serif;
            font-size: 8pt;
            font-weight: 700;
            color: var(--secondary);
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .footer {
            position: fixed;
            bottom: 40px;
            left: 40px;
            right: 40px;
            text-align: center;
            font-size: 9pt;
            color: var(--text-muted);
            border-top: 1px solid var(--border);
            padding-top: 20px;
        }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .badge-paid { background-color: #DEF7EC; color: #03543F; }
        .badge-sent { background-color: #FEF3C7; color: #92400E; }
        .badge-draft { background-color: #F3F4F6; color: #374151; }
        .badge-overdue { background-color: #FDE8E8; color: #9B1C1C; }
    </style>
</head>
@php
    use App\Models\Setting;
    $companyName = Setting::get('invoice_company_name', $invoice->team->name);
    $companyAddress = Setting::get('invoice_company_address');
    $companyPhone = Setting::get('invoice_company_phone');
    $companyEmail = Setting::get('invoice_company_email');
    $taxId = Setting::get('invoice_tax_id');
    $footerNote = Setting::get('invoice_footer_notes', "Thank you for choosing {$companyName}. Professional care for your vehicle.");
@endphp
<body>
    <div class="container">
        <div class="header">
            <div class="header-content">
                <div class="header-left">
                    <h1 class="brand-name">{{ str_replace(' ', '', $companyName) }}<span class="brand-accent">.</span></h1>
                    @if($companyAddress)
                        <div class="info-subvalue" style="margin-top: 5px; white-space: pre-line;">{!! e($companyAddress) !!}</div>
                    @endif
                    @if($companyPhone || $companyEmail)
                        <div class="info-subvalue">
                            @if($companyPhone) {{ $companyPhone }} @endif
                            @if($companyPhone && $companyEmail) | @endif
                            @if($companyEmail) {{ $companyEmail }} @endif
                        </div>
                    @endif
                    @if($taxId)
                        <div class="info-subvalue">Tax ID: {{ $taxId }}</div>
                    @endif
                </div>
                <div class="header-right">
                    <div class="invoice-label">INVOICE</div>
                    <div class="invoice-number">#{{ $invoice->number }}</div>
                </div>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-column">
                <div class="info-label">Issued To</div>
                <div class="info-value"><strong>{{ $invoice->client->name }}</strong></div>
                <div class="info-subvalue">{{ $invoice->client->email }}</div>
            </div>
            <div class="info-column" style="text-align: right;">
                <div class="info-label">Invoice Details</div>
                <div class="info-value"><strong>Issued:</strong> {{ $invoice->issue_date->format('M d, Y') }}</div>
                <div class="info-value"><strong>Due:</strong> {{ $invoice->due_date->format('M d, Y') }}</div>
                @php
                    $statusClass = match($invoice->status->value) {
                        'paid' => 'badge-paid',
                        'sent' => 'badge-sent',
                        'draft' => 'badge-draft',
                        default => 'badge-overdue',
                    };
                @endphp
                <div class="badge {{ $statusClass }}">{{ $invoice->status->getLabel() }}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                    <tr>
                        <td class="item-description">{{ $item->description }}</td>
                        <td class="item-qty">{{ number_format($item->quantity, 0) }}</td>
                        <td class="item-price">{{ number_format($item->unit_price, 2) }} {{ $invoice->currency }}</td>
                        <td class="item-total">{{ number_format($item->total_price, 2) }} {{ $invoice->currency }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals-container">
            <div class="total-row">
                <div class="total-label">Subtotal</div>
                <div class="total-value">{{ number_format($invoice->subtotal, 2) }} {{ $invoice->currency }}</div>
            </div>
            @if($invoice->tax_total > 0)
                <div class="total-row">
                    <div class="total-label">Tax ({{ number_format($invoice->tax_rate, 0) }}%)</div>
                    <div class="total-value">{{ number_format($invoice->tax_total, 2) }} {{ $invoice->currency }}</div>
                </div>
            @endif
            <div class="total-row total-grand">
                <div class="total-label">Total Amount</div>
                <div class="total-value">{{ number_format($invoice->total_amount, 2) }} {{ $invoice->currency }}</div>
            </div>
            @if($invoice->amount_paid > 0)
                <div class="total-row">
                    <div class="total-label">Amount Paid</div>
                    <div class="total-value">- {{ number_format($invoice->amount_paid, 2) }} {{ $invoice->currency }}</div>
                </div>
                <div class="total-row" style="margin-top: 5px; border-top: 1px solid var(--border); padding-top: 5px;">
                    <div class="total-label" style="font-weight: 700; color: var(--secondary);">Balance Due</div>
                    <div class="total-value" style="font-weight: 700; color: var(--secondary);">{{ number_format($invoice->total_amount - $invoice->amount_paid, 2) }} {{ $invoice->currency }}</div>
                </div>
            @endif
        </div>

        @if($invoice->notes)
            <div class="notes">
                <div class="notes-title">Additional Notes</div>
                <div class="info-value" style="font-size: 10pt; color: var(--text-muted);">{!! nl2br(e($invoice->notes)) !!}</div>
            </div>
        @endif

        <div class="footer">
            <div>{{ $footerNote }}</div>
            <div style="margin-top: 5px;">{{ config('app.url') }}</div>
        </div>
    </div>
</body>
</html>
