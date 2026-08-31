<?php

namespace App\Http\Resources\Public;

use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The public-facing view of an inquiry: creation confirmation and the
 * status-lookup endpoint. Deliberately minimal — no contact details, no
 * `meta`, no assignment — those are staff-only (architecture §6/§7).
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
            'reference' => $this->reference,
            'type' => $this->type,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
