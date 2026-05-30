<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Faq;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        return Inertia::render('home', [
            'featuredServices' => Service::featured()->with('brands')->take(6)->get(),
            'featuredBrands' => Brand::featured()->take(12)->get(),
            'testimonials' => Testimonial::featured()->take(3)->get(),
        ]);
    }

    public function services()
    {
        return Inertia::render('services/index', [
            'services' => Service::active()->with('brands')->get(),
        ]);
    }

    public function serviceShow(Service $service)
    {
        return Inertia::render('services/show', [
            'service' => $service->load('brands'),
            'relatedServices' => Service::active()->where('id', '!=', $service->id)->take(3)->get(),
        ]);
    }

    public function brands()
    {
        return Inertia::render('brands/index', [
            'brands' => Brand::active()->with('services')->get(),
        ]);
    }

    public function faq()
    {
        return Inertia::render('faq', [
            'faqs' => Faq::active()->get()->groupBy('category'),
        ]);
    }

    public function privacyPolicy()
    {
        return Inertia::render('legal/privacy-policy', [
            'content' => Setting::get('privacy_policy_content', 'Privacy Policy content not set yet.'),
        ]);
    }

    public function termsOfService()
    {
        return Inertia::render('legal/terms-of-service', [
            'content' => Setting::get('terms_of_service_content', 'Terms of Service content not set yet.'),
        ]);
    }
}
