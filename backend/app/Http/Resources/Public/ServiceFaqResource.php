<?php

namespace App\Http\Resources\Public;

use App\Models\ServiceFaq;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ServiceFaq
 */
class ServiceFaqResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'question' => $this->question,
            'answer' => $this->answer,
        ];
    }
}
