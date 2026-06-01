<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Faq;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    /**
     * Display the homepage with featured services, brands, and testimonials.
     *
     * @return Response
     */
    public function home()
    {
        return Inertia::render('home', [
            'featuredServices' => Service::featured()->with('brands')->take(6)->get(),
            'featuredBrands' => Brand::featured()->take(12)->get(),
            'testimonials' => Testimonial::featured()->take(3)->get(),
        ]);
    }

    /**
     * Display all active services.
     *
     * @return Response
     */
    public function services()
    {
        return Inertia::render('services/index', [
            'services' => Service::active()->with('brands')->get(),
        ]);
    }

    /**
     * Display a single service with related services.
     *
     * @return Response
     */
    public function serviceShow(Service $service)
    {
        return Inertia::render('services/show', [
            'service' => $service->load('brands'),
            'relatedServices' => Service::active()->where('id', '!=', $service->id)->take(3)->get(),
        ]);
    }

    /**
     * Display all active brands with their services.
     *
     * @return Response
     */
    public function brands()
    {
        return Inertia::render('brands/index', [
            'brands' => Brand::active()->with('services')->get(),
        ]);
    }

    /**
     * Display FAQs grouped by category.
     *
     * @return Response
     */
    public function faq()
    {
        return Inertia::render('faq', [
            'faqs' => Faq::active()->get()->groupBy('category'),
        ]);
    }

    /**
     * Display the privacy policy page.
     *
     * @return Response
     */
    public function privacyPolicy()
    {
        return Inertia::render('legal/privacy-policy', [
            'content' => Setting::get('privacy_policy_content', 'Privacy Policy content not set yet.'),
        ]);
    }

    /**
     * Display the terms of service page.
     *
     * @return Response
     */
    public function termsOfService()
    {
        return Inertia::render('legal/terms-of-service', [
            'content' => Setting::get('terms_of_service_content', 'Terms of Service content not set yet.'),
        ]);
    }
}
