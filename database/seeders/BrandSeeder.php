<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    /** @var array<string, string> brand name → Clearbit logo CDN URL */
    private array $logoMap = [
        'Alfa Romeo' => 'https://logo.clearbit.com/alfaromeo.com',
        'Audi' => 'https://logo.clearbit.com/audi.com',
        'BMW' => 'https://logo.clearbit.com/bmw.com',
        'Chevrolet' => 'https://logo.clearbit.com/chevrolet.com',
        'Chrysler' => 'https://logo.clearbit.com/chrysler.com',
        'Citroën' => 'https://logo.clearbit.com/citroen.com',
        'Dacia' => 'https://logo.clearbit.com/dacia.com',
        'Dodge' => 'https://logo.clearbit.com/dodge.com',
        'Fiat' => 'https://logo.clearbit.com/fiat.com',
        'Ford' => 'https://logo.clearbit.com/ford.com',
        'Honda' => 'https://logo.clearbit.com/honda.com',
        'Hyundai' => 'https://logo.clearbit.com/hyundai.com',
        'Infiniti' => 'https://logo.clearbit.com/infiniti.com',
        'Jaguar' => 'https://logo.clearbit.com/jaguar.com',
        'Jeep' => 'https://logo.clearbit.com/jeep.com',
        'Kia' => 'https://logo.clearbit.com/kia.com',
        'Land Rover' => 'https://logo.clearbit.com/landrover.com',
        'Lexus' => 'https://logo.clearbit.com/lexus.com',
        'Mazda' => 'https://logo.clearbit.com/mazda.com',
        'Mercedes-Benz' => 'https://logo.clearbit.com/mercedes-benz.com',
        'Mitsubishi' => 'https://logo.clearbit.com/mitsubishi-motors.com',
        'Nissan' => 'https://logo.clearbit.com/nissan.com',
        'Opel' => 'https://logo.clearbit.com/opel.com',
        'Peugeot' => 'https://logo.clearbit.com/peugeot.com',
        'Porsche' => 'https://logo.clearbit.com/porsche.com',
        'Renault' => 'https://logo.clearbit.com/renault.com',
        'Saab' => 'https://logo.clearbit.com/saab.com',
        'Seat' => 'https://logo.clearbit.com/seat.com',
        'Subaru' => 'https://logo.clearbit.com/subaru.com',
        'Suzuki' => 'https://logo.clearbit.com/suzuki.com',
        'Toyota' => 'https://logo.clearbit.com/toyota.com',
        'Volkswagen' => 'https://logo.clearbit.com/volkswagen.com',
        'Volvo' => 'https://logo.clearbit.com/volvocars.com',
        'Škoda' => 'https://logo.clearbit.com/skoda-auto.com',
    ];

    public function run(): void
    {
        $carListPath = resource_path('js/lib/car-list.json');
        $carList = json_decode(file_get_contents($carListPath), true);

        $featuredBrands = [
            'Toyota', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi',
            'Peugeot', 'Renault', 'Ford', 'Honda', 'Nissan', 'Hyundai', 'Kia',
        ];

        $sortOrder = 1;
        foreach ($carList as $carData) {
            $brandName = $carData['brand'];

            Brand::updateOrCreate(
                ['slug' => Str::slug($brandName)],
                [
                    'name' => $brandName,
                    'logo_path' => $this->logoMap[$brandName] ?? null,
                    'is_featured' => in_array($brandName, $featuredBrands),
                    'is_active' => true,
                    'sort_order' => $sortOrder++,
                ]
            );
        }
    }
}
