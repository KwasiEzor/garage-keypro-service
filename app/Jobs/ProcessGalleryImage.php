<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Spatie\ImageOptimizer\OptimizerChainFactory;

class ProcessGalleryImage implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $imagePath,
        public ?int $galleryItemId = null
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (! Storage::exists($this->imagePath)) {
            logger()->warning('Image not found for processing', ['path' => $this->imagePath]);

            return;
        }

        try {
            $fullPath = Storage::path($this->imagePath);
            OptimizerChainFactory::create()->optimize($fullPath);

            logger()->info('Image optimized successfully', [
                'path' => $this->imagePath,
                'gallery_item_id' => $this->galleryItemId,
            ]);
        } catch (\Exception $e) {
            logger()->error('Image optimization failed', [
                'path' => $this->imagePath,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
