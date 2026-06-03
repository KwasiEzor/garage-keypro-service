<?php

declare(strict_types=1);

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('invoice status is cast to enum', function (): void {
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Draft]);

    expect($invoice->status)->toBeInstanceOf(InvoiceStatus::class)
        ->and($invoice->status)->toBe(InvoiceStatus::Draft);
});

test('invoice status can be updated to sent', function (): void {
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Draft]);

    $invoice->update(['status' => InvoiceStatus::Sent]);

    expect($invoice->fresh()->status)->toBe(InvoiceStatus::Sent);
});

test('invoice status can be updated to paid', function (): void {
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Sent]);

    $invoice->update(['status' => InvoiceStatus::Paid]);

    expect($invoice->fresh()->status)->toBe(InvoiceStatus::Paid);
});

test('invoice status can be cancelled from draft', function (): void {
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Draft]);

    $invoice->update(['status' => InvoiceStatus::Cancelled]);

    expect($invoice->fresh()->status)->toBe(InvoiceStatus::Cancelled);
});

test('invoice status enum canBeEdited returns true for draft', function (): void {
    expect(InvoiceStatus::Draft->canBeEdited())->toBeTrue()
        ->and(InvoiceStatus::Sent->canBeEdited())->toBeFalse()
        ->and(InvoiceStatus::Paid->canBeEdited())->toBeFalse()
        ->and(InvoiceStatus::Cancelled->canBeEdited())->toBeFalse();
});

test('invoice status enum canBeSent returns true for draft only', function (): void {
    expect(InvoiceStatus::Draft->canBeSent())->toBeTrue()
        ->and(InvoiceStatus::Sent->canBeSent())->toBeFalse()
        ->and(InvoiceStatus::Paid->canBeSent())->toBeFalse()
        ->and(InvoiceStatus::Cancelled->canBeSent())->toBeFalse();
});

test('invoice status enum canBeCancelled returns true for draft and sent', function (): void {
    expect(InvoiceStatus::Draft->canBeCancelled())->toBeTrue()
        ->and(InvoiceStatus::Sent->canBeCancelled())->toBeTrue()
        ->and(InvoiceStatus::Paid->canBeCancelled())->toBeFalse()
        ->and(InvoiceStatus::Cancelled->canBeCancelled())->toBeFalse();
});

test('invoice number is auto-generated on creation', function (): void {
    $team = Team::factory()->create();
    $client = User::factory()->create();

    $invoice = Invoice::factory()->create([
        'team_id' => $team->id,
        'client_id' => $client->id,
        'number' => '', // Empty number triggers auto-generation
    ]);

    expect($invoice->number)->not->toBeEmpty()
        ->and($invoice->number)->toMatch('/INV-\d{4}-\d{4}/');
});

test('invoice number is not overwritten if already set', function (): void {
    $team = Team::factory()->create();
    $client = User::factory()->create();

    $invoice = Invoice::factory()->create([
        'team_id' => $team->id,
        'client_id' => $client->id,
        'number' => 'CUSTOM-123',
    ]);

    expect($invoice->number)->toBe('CUSTOM-123');
});

test('invoice totals are auto-calculated when items are added', function (): void {
    $invoice = Invoice::factory()->create([
        'subtotal' => 0,
        'tax_total' => 0,
        'total_amount' => 0,
    ]);

    InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 2,
        'unit_price' => 100,
    ]);

    $invoice->refresh();

    expect($invoice->subtotal)->toBe('200.00')
        ->and($invoice->total_amount)->toBe('200.00');
});

test('invoice totals are recalculated when items are updated', function (): void {
    $invoice = Invoice::factory()->create();

    $item = InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 100,
    ]);

    $invoice->refresh();
    $initialTotal = $invoice->total_amount;

    $item->update(['quantity' => 5]);
    $invoice->refresh();

    expect($invoice->total_amount)->not->toBe($initialTotal)
        ->and($invoice->subtotal)->toBe('500.00');
});

test('invoice totals are recalculated when items are deleted', function (): void {
    $invoice = Invoice::factory()->create();

    $item1 = InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 100,
    ]);

    $item2 = InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 50,
    ]);

    $invoice->refresh();
    expect($invoice->subtotal)->toBe('150.00');

    $item1->delete();
    $invoice->refresh();

    expect($invoice->subtotal)->toBe('50.00')
        ->and($invoice->total_amount)->toBe('50.00');
});

test('invoice item total_price is auto-calculated on save', function (): void {
    $invoice = Invoice::factory()->create();

    $item = InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 3,
        'unit_price' => 25.50,
        'total_price' => 0, // Should be auto-calculated
    ]);

    expect($item->total_price)->toBe('76.50');
});

test('invoice item tax_amount is auto-calculated when tax_rate is set', function (): void {
    $invoice = Invoice::factory()->create();

    $item = InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 100,
        'tax_rate' => 10,
        'tax_amount' => 0, // Should be auto-calculated
    ]);

    expect($item->tax_amount)->toBe('10.00');
});

test('overdue scope returns only sent invoices past due date', function (): void {
    // Create overdue invoice
    $overdue = Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'due_date' => now()->subDays(5),
    ]);

    // Create draft invoice (not overdue even if past due date)
    Invoice::factory()->create([
        'status' => InvoiceStatus::Draft,
        'due_date' => now()->subDays(5),
    ]);

    // Create sent invoice not yet due
    Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'due_date' => now()->addDays(5),
    ]);

    // Create paid invoice past due (should not be overdue)
    Invoice::factory()->create([
        'status' => InvoiceStatus::Paid,
        'due_date' => now()->subDays(5),
    ]);

    $overdueInvoices = Invoice::overdue()->get();

    expect($overdueInvoices)->toHaveCount(1)
        ->and($overdueInvoices->first()->id)->toBe($overdue->id);
});

test('dueSoon scope returns invoices due within specified days', function (): void {
    // Due in 3 days
    $dueSoon1 = Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'due_date' => now()->addDays(3),
    ]);

    // Due in 6 days
    $dueSoon2 = Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'due_date' => now()->addDays(6),
    ]);

    // Due in 10 days (outside default 7-day window)
    Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'due_date' => now()->addDays(10),
    ]);

    // Draft invoice due soon (should not count)
    Invoice::factory()->create([
        'status' => InvoiceStatus::Draft,
        'due_date' => now()->addDays(3),
    ]);

    $dueSoonInvoices = Invoice::dueSoon()->get();

    expect($dueSoonInvoices)->toHaveCount(2);
});

test('dueSoon scope accepts custom days parameter', function (): void {
    Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'due_date' => now()->addDays(12),
    ]);

    expect(Invoice::dueSoon(7)->count())->toBe(0)
        ->and(Invoice::dueSoon(14)->count())->toBe(1);
});
