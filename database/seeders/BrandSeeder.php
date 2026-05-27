<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $carListPath = resource_path('js/lib/car-list.json');
        $carList = json_decode(file_get_contents($carListPath), true);

        $featuredBrands = ['Toyota', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Peugeot', 'Renault', 'Ford', 'Honda', 'Nissan', 'Hyundai', 'Kia'];

        $sortOrder = 1;
        foreach ($carList as $carData) {
            $brandName = $carData['brand'];

            Brand::create([
                'name' => $brandName,
                'slug' => Str::slug($brandName),
                'logo_path' => null,
                'is_featured' => in_array($brandName, $featuredBrands),
                'is_active' => true,
                'sort_order' => $sortOrder++,
            ]);
        }
    }
}
