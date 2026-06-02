<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

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

        // TODO: Implement actual image processing
        // - Optimize image (compress, resize)
        // - Generate thumbnails
        // - Generate WebP versions

        logger()->info('Image processing queued', [
            'path' => $this->imagePath,
            'gallery_item_id' => $this->galleryItemId,
        ]);
    }
}
