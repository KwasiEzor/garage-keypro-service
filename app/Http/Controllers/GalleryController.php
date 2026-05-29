<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $categories = ['All', 'Diagnostics', 'Key Programming', 'Unit Mobility', 'Performance'];
        $currentCategory = $request->query('category', 'All');

        return Inertia::render('gallery/index', [
            'items' => Inertia::scroll(function () use ($currentCategory) {
                $query = GalleryItem::query()
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->orderBy('created_at', 'desc');

                if ($currentCategory !== 'All') {
                    $query->where('category', $currentCategory);
                }

                return $query->paginate(12);
            }),
            'categories' => $categories,
            'currentCategory' => $currentCategory,
        ]);
    }
}
