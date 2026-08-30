<?php

namespace App\Http\Resources\Admin;

use App\Models\CourseRegistration;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CourseRegistration
 */
class CourseRegistrationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'organization' => $this->organization,
            'training_mode' => $this->training_mode,
            'experience_level' => $this->experience_level,
            'goals' => $this->goals,
            'status' => $this->status,
            'course' => $this->whenLoaded('course', fn () => [
                'id' => $this->course->id,
                'slug' => $this->course->slug,
                'title' => $this->course->title,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
