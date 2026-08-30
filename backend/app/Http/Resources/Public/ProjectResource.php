<?php

namespace App\Http\Resources\Public;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Project
 */
class ProjectResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'client_type' => $this->client_type,
            'industry' => $this->industry,
            'description' => $this->description,
            'challenge' => $this->challenge,
            'solution_detail' => $this->solution_detail,
            'outcome' => $this->outcome,
            'scope_of_implementation' => $this->scope_of_implementation,
            'technologies_involved' => $this->technologies_involved,
            'deliverables' => $this->deliverables,
            'results' => $this->results,
            'is_featured' => $this->is_featured,
            // See ServiceResource for why this is one whenLoaded() around
            // the whole object rather than per-field.
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'slug' => $this->category->slug,
                'name' => $this->category->name,
            ] : null),
            'images' => ProjectImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
