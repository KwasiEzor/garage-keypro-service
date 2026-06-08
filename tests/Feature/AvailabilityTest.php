<?php

use App\Models\Service;
use App\Models\Team;

test('availability endpoint returns data', function () {
    $service = Service::where('is_active', true)->first();
    $team = Team::first();

    if (! $service || ! $team) {
        $this->markTestSkipped('No service or team available');
    }

    $response = $this->get("/appointments/availability?team_id={$team->id}&service_id={$service->id}&month=2026-06");

    $response->assertOk();
    $response->assertJsonStructure([
        'availability',
    ]);

    $data = $response->json();
    dump([
        'availability_count' => count($data['availability'] ?? []),
        'sample_dates' => array_slice(array_keys($data['availability'] ?? []), 0, 5),
    ]);
});
