<?php

use function Pest\Laravel\get;

test('can load homepage', function (): void {
    get('/')
        ->assertOk();
});

test('can load services page', function (): void {
    get('/services')
        ->assertOk();
});

test('can load gallery page', function (): void {
    get('/gallery')
        ->assertOk();
});

test('can load brands page', function (): void {
    get('/brands')
        ->assertOk();
});

test('can load faq page', function (): void {
    get('/faq')
        ->assertOk();
});

test('can load privacy policy', function (): void {
    get('/privacy-policy')
        ->assertOk();
});

test('can load terms of service', function (): void {
    get('/terms-of-service')
        ->assertOk();
});
