<?php

use App\Enums\Role;
use App\Models\Lead;
use App\Models\Service;
use App\Models\User;
use App\Notifications\LeadSubmissionConfirmation;
use App\Notifications\NewLeadNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\assertDatabaseHas;

uses(RefreshDatabase::class);

test('user can submit lead form with valid data', function (): void {
    Notification::fake();
    $service = Service::factory()->create();
    $admin = User::factory()->create(['role' => Role::Admin]);

    $this->post(route('leads.store'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'service_id' => $service->id,
    ])->assertRedirect();

    assertDatabaseHas('leads', [
        'email' => 'john@example.com',
        'status' => 'new',
        'source' => 'website',
    ]);

    $lead = Lead::where('email', 'john@example.com')->first();

    Notification::assertSentTo($lead, LeadSubmissionConfirmation::class);
    Notification::assertSentTo($admin, NewLeadNotification::class);
});

test('lead submission requires valid email', function (): void {
    $this->post(route('leads.store'), [
        'name' => 'John Doe',
        'email' => 'invalid',
    ])->assertSessionHasErrors('email');
});

test('lead submission requires name', function (): void {
    $this->post(route('leads.store'), [
        'email' => 'john@example.com',
    ])->assertSessionHasErrors('name');
});

test('lead can include vehicle information', function (): void {
    $this->post(route('leads.store'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'vehicle_make' => 'Toyota',
        'vehicle_model' => 'Camry',
        'vehicle_year' => '2020',
        'message' => 'Need key programming',
    ])->assertRedirect();

    assertDatabaseHas('leads', [
        'email' => 'john@example.com',
        'vehicle_make' => 'Toyota',
        'vehicle_model' => 'Camry',
        'vehicle_year' => '2020',
    ]);
});
