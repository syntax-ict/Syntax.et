<?php

namespace App\Http\Resources\Admin;

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
            'id' => $this->id,
            // Resolved URL only — `disk_path` never leaves the server, even
            // to staff (architecture §10).
            'url' => $this->url(),
            'alt_text' => $this->alt_text,
            'sort_order' => $this->sort_order,
        ];
    }
}
