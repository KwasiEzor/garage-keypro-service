<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LogoDownloaderSeeder extends Seeder
{
    public function run(): void
    {
        $carList = json_decode(file_get_contents(resource_path('js/lib/car-list.json')), true);
        $brandsToFind = array_column($carList, 'brand');

        $downloaded = [];
        $baseUrl = 'https://www.stickpng.com/cat/icons-logos-emojis/car-logos?page=';

        for ($page = 1; $page <= 14; $page++) {
            $this->command->info("Processing page $page...");
            $html = @file_get_contents($baseUrl.$page);
            if (! $html) {
                continue;
            }

            preg_match_all('/<div class=item><a class="image pattern" href=[^>]+><img src=([^ ]+) alt="([^"]+)">/', $html, $matches, PREG_SET_ORDER);

            foreach ($matches as $match) {
                $thumbUrl = $match[1];
                $logoName = $match[2];

                $cleanName = preg_replace('/ logo$/i', '', $logoName);
                $cleanName = trim($cleanName);

                $matchedBrand = null;
                foreach ($brandsToFind as $brandName) {
                    if (stripos($cleanName, $brandName) !== false || stripos($brandName, $cleanName) !== false) {
                        $matchedBrand = $brandName;
                        break;
                    }
                }

                if ($matchedBrand && ! isset($downloaded[$matchedBrand])) {
                    $imageUrl = str_replace('/thumbs/', '/images/', $thumbUrl);
                    $extension = pathinfo($imageUrl, PATHINFO_EXTENSION) ?: 'png';
                    $filename = Str::slug($matchedBrand).'.'.$extension;
                    $savePath = public_path('images/brands/'.$filename);

                    $this->command->info("Downloading $matchedBrand logo...");
                    $imageContent = @file_get_contents($imageUrl);
                    if ($imageContent) {
                        if (! is_dir(dirname($savePath))) {
                            mkdir(dirname($savePath), 0755, true);
                        }
                        file_put_contents($savePath, $imageContent);
                        $downloaded[$matchedBrand] = '/images/brands/'.$filename;

                        $brand = Brand::where('name', $matchedBrand)->first();
                        if ($brand) {
                            $brand->update(['logo_path' => '/images/brands/'.$filename]);
                        }
                    }
                }
            }
        }

        $this->command->info('Downloaded '.count($downloaded).' logos.');
    }
}
