<?php

namespace App\Http\Resources\Public;

use App\Models\ProjectImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ProjectImage
 */
class ProjectImageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Resolved URL only — `disk_path` never leaves the server
            // (architecture §10).
            'url' => $this->url(),
            'alt_text' => $this->alt_text,
        ];
    }
}
