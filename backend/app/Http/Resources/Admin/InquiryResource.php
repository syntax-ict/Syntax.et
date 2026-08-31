<?php

namespace App\Http\Resources\Admin;

use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The staff-facing view of an inquiry — everything, unlike the public
 * resource which deliberately hides contact details and `meta`
 * (architecture §7).
 *
 * @mixin Inquiry
 */
class InquiryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'type' => $this->type,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'organization' => $this->organization,
            'subject' => $this->subject,
            'priority' => $this->priority,
            'status' => $this->status,
            'details' => $this->details,
            'meta' => $this->meta,
            'assignee' => $this->whenLoaded('assignee', fn () => $this->assignee ? [
                'id' => $this->assignee->id,
                'name' => $this->assignee->name,
            ] : null),
            'notes' => InquiryNoteResource::collection($this->whenLoaded('notes')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
