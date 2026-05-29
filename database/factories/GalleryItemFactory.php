<?php

namespace Database\Factories;

use App\Models\GalleryItem;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GalleryItem>
 */
class GalleryItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Diagnostics', 'Key Programming', 'Unit Mobility', 'Performance'];
        $title = $this->faker->words(3, true);
        
        // Collection of valid automotive-related Unsplash photo IDs
        $photoIds = [
            '1533473359331-0135ef1b58bf', // car
            '1492144534655-ae79c964c9d7', // car
            '1503376780353-7e6692767b70', // car
            '1542281286-9e0a16bb7366', // car
            '1552519507-da3b142c6e3d', // car
            '1580273916550-e323be2ae537', // car
            '1555212697-194d092e3b8f', // engine
            '1562141983-c304d6f51abb', // tech
            '1549317661-bd32c8ce0db2', // interior
            '1550751827-4bd374c3f58b', // diagnostic
            '1557597774-9d2739f85a76', // lock
            '1486262715619-67b85e0b08d3', // mechanic
        ];
        
        $photoId = $this->faker->randomElement($photoIds);
        
        return [
            'title' => $title,
            'slug' => \Illuminate\Support\Str::slug($title),
            'description' => $this->faker->paragraph(),
            'image_path' => "https://images.unsplash.com/photo-{$photoId}?auto=format&fit=crop&q=80&w=1200",
            'category' => $this->faker->randomElement($categories),
            'is_featured' => $this->faker->boolean(20),
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(0, 100),
        ];
    }
}
