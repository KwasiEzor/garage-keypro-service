<?php

use App\Filament\Pages\ManageSettings;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

test('admin can access user resource', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get('/admin/users')
        ->assertStatus(200);
});

test('admin can access settings page', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get('/admin/manage-settings')
        ->assertStatus(200);
});

test('admin can save settings', function () {
    $user = User::factory()->create();

    Livewire::actingAs($user)
        ->test(ManageSettings::class)
        ->set('data.site_name', 'My Awesome Site')
        ->set('data.support_email', 'support@example.com')
        ->call('save')
        ->assertHasNoFormErrors();

    expect(Setting::get('site_name'))->toBe('My Awesome Site');
    expect(Setting::get('support_email'))->toBe('support@example.com');
});
