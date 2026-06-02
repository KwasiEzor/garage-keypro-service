<?php

use function Pest\Laravel\get;

test('health check endpoint returns healthy status', function (): void {
    get('/health')
        ->assertOk()
        ->assertJson([
            'status' => 'healthy',
        ])
        ->assertJsonStructure([
            'status',
            'checks' => [
                'database',
                'cache',
                'storage',
            ],
            'timestamp',
        ]);
});

test('health check verifies database connection', function (): void {
    $response = get('/health')->json();

    expect($response['checks']['database'])->toBeTrue();
});

test('health check verifies cache connection', function (): void {
    $response = get('/health')->json();

    expect($response['checks']['cache'])->toBeTrue();
});

test('health check verifies storage is writable', function (): void {
    $response = get('/health')->json();

    expect($response['checks']['storage'])->toBeTrue();
});
