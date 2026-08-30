<?php

namespace App\Http\Resources\Public;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Service
 */
class ServiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'icon' => $this->icon,
            'benefits' => $this->benefits,
            'is_featured' => $this->is_featured,
            // The whole object is wrapped in one whenLoaded() so it either
            // resolves in full or is omitted entirely — never a partial,
            // empty-looking object when the relation wasn't eager-loaded.
            'category' => $this->whenLoaded('category', fn () => [
                'slug' => $this->category->slug,
                'name' => $this->category->name,
            ]),
            'faqs' => ServiceFaqResource::collection($this->whenLoaded('faqs')),
        ];
    }
}
