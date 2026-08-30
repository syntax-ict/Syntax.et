<?php

namespace App\Http\Resources\Admin;

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
            'id' => $this->id,
            'solution_category_id' => $this->solution_category_id,
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
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'images' => ProjectImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
