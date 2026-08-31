<?php

namespace App\Http\Resources\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Setting
 */
class SettingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'value' => $this->castValue(),
            'type' => $this->type,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
