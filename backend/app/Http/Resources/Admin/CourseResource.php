<?php

namespace App\Http\Resources\Admin;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Course
 */
class CourseResource extends JsonResource
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
            'duration' => $this->duration,
            'level' => $this->level,
            'mode' => $this->mode,
            'description' => $this->description,
            'syllabus' => $this->syllabus,
            'skills_gained' => $this->skills_gained,
            'target_audience' => $this->target_audience,
            'requirements' => $this->requirements,
            'modules' => $this->modules,
            'schedule' => $this->schedule,
            'location' => $this->location,
            'price_amount' => $this->price_amount,
            'price_currency' => $this->price_currency,
            'capacity' => $this->capacity,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
