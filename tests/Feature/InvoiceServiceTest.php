<?php

declare(strict_types=1);

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Team;
use App\Support\InvoiceService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('generates unique invoice numbers for same team', function (): void {
    $service = app(InvoiceService::class);
    $team = Team::factory()->create();

    // Create first invoice with a number
    $invoice1 = Invoice::factory()->create([
        'team_id' => $team->id,
        'number' => 'INV-2026-0001',
    ]);

    // Generate number for second invoice
    $invoice2 = Invoice::factory()->make(['team_id' => $team->id]);
    $number2 = $service->generateInvoiceNumber($invoice2);

    expect($number2)->toBe('INV-'.now()->year.'-0002')
        ->and($number2)->toMatch('/INV-\d{4}-\d{4}/');
});

test('generates invoice numbers in sequential order', function (): void {
    $service = app(InvoiceService::class);
    $team = Team::factory()->create();

    $numbers = [];
    for ($i = 0; $i < 5; $i++) {
        $invoice = Invoice::factory()->make(['team_id' => $team->id]);
        $number = $service->generateInvoiceNumber($invoice);

        // Save this invoice so next one increments
        Invoice::factory()->create(['team_id' => $team->id, 'number' => $number]);
        $numbers[] = $number;
    }

    // Extract sequence numbers and verify they increment
    $sequences = array_map(fn ($num) => (int) substr($num, -4), $numbers);
    expect($sequences)->toBe([1, 2, 3, 4, 5]);
});

test('generates different invoice numbers for different teams', function (): void {
    $service = app(InvoiceService::class);
    $team1 = Team::factory()->create();
    $team2 = Team::factory()->create();

    $invoice1 = Invoice::factory()->make(['team_id' => $team1->id]);
    $invoice2 = Invoice::factory()->make(['team_id' => $team2->id]);

    $number1 = $service->generateInvoiceNumber($invoice1);
    $number2 = $service->generateInvoiceNumber($invoice2);

    // Both should start at 0001 for their respective teams
    expect($number1)->toEndWith('-0001')
        ->and($number2)->toEndWith('-0001');
});

test('calculateItemTotal returns correct product of quantity and price', function (): void {
    $service = app(InvoiceService::class);

    $total1 = $service->calculateItemTotal(2.5, 100.00);
    expect($total1)->toBe(250.00);

    $total2 = $service->calculateItemTotal(1, 99.99);
    expect($total2)->toBe(99.99);

    $total3 = $service->calculateItemTotal(10, 5.5);
    expect($total3)->toBe(55.0);
});

test('calculateItemTotal rounds to 2 decimal places', function (): void {
    $service = app(InvoiceService::class);

    $total = $service->calculateItemTotal(3, 10.336);
    expect($total)->toBe(31.01);
});

test('recalculateInvoice updates subtotal and total correctly', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create([
        'subtotal' => 0,
        'tax_total' => 0,
        'total_amount' => 0,
    ]);

    InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 2,
        'unit_price' => 50,
        'total_price' => 100, // Will be recalculated
    ]);

    InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 75,
        'total_price' => 75, // Will be recalculated
    ]);

    $service->recalculateInvoice($invoice);
    $invoice->refresh();

    expect($invoice->subtotal)->toBe('175.00')
        ->and($invoice->total_amount)->toBe('175.00')
        ->and($invoice->tax_total)->toBe('0.00');
});

test('recalculateInvoice handles invoice-level tax rate', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create([
        'tax_rate' => 10.00,
        'subtotal' => 0,
        'tax_total' => 0,
        'total_amount' => 0,
    ]);

    InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 100,
        'total_price' => 100,
        'tax_rate' => null, // No per-item tax, use invoice tax
    ]);

    $service->recalculateInvoice($invoice);
    $invoice->refresh();

    expect($invoice->subtotal)->toBe('100.00')
        ->and($invoice->tax_total)->toBe('10.00')
        ->and($invoice->total_amount)->toBe('110.00');
});

test('recalculateInvoice handles per-item tax rates', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create([
        'tax_rate' => 10.00, // Invoice default
        'subtotal' => 0,
        'tax_total' => 0,
        'total_amount' => 0,
    ]);

    // Item with custom tax rate
    InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 100,
        'total_price' => 100,
        'tax_rate' => 20.00, // Override invoice tax
        'tax_amount' => 20.00,
    ]);

    // Item using invoice tax rate
    InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 100,
        'total_price' => 100,
        'tax_rate' => null, // Use invoice tax
        'tax_amount' => 0,
    ]);

    $service->recalculateInvoice($invoice);
    $invoice->refresh();

    expect($invoice->subtotal)->toBe('200.00')
        ->and($invoice->tax_total)->toBe('30.00') // 20 + 10
        ->and($invoice->total_amount)->toBe('230.00');
});

test('recalculateInvoice handles zero tax', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create([
        'tax_rate' => 0,
        'subtotal' => 0,
        'tax_total' => 0,
        'total_amount' => 0,
    ]);

    InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 100,
        'total_price' => 100,
    ]);

    $service->recalculateInvoice($invoice);
    $invoice->refresh();

    expect($invoice->subtotal)->toBe('100.00')
        ->and($invoice->tax_total)->toBe('0.00')
        ->and($invoice->total_amount)->toBe('100.00');
});

test('recalculateInvoice handles empty invoice', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create([
        'subtotal' => 999,
        'tax_total' => 999,
        'total_amount' => 999,
    ]);

    // No items

    $service->recalculateInvoice($invoice);
    $invoice->refresh();

    expect($invoice->subtotal)->toBe('0.00')
        ->and($invoice->tax_total)->toBe('0.00')
        ->and($invoice->total_amount)->toBe('0.00');
});
