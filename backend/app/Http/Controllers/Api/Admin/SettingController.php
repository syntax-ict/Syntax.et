<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Http\Resources\Admin\SettingResource;
use App\Models\Setting;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Website CMS content: site-wide settings (architecture §10/domain #10) —
 * the single source of truth this application uses instead of the old
 * frontend's hard-coded, and inconsistent, header/footer contact details
 * (the audit found two different phone numbers, with two different
 * country codes, because each was typed separately into two components).
 */
class SettingController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Setting::class);

        return $this->ok(SettingResource::collection(Setting::query()->orderBy('key')->get()));
    }

    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        foreach ($request->validated('settings') as $item) {
            $type = $item['type'] ?? 'string';
            $value = match ($type) {
                'json' => json_encode($item['value'] ?? null),
                'boolean' => ($item['value'] ?? false) ? '1' : '0',
                default => (string) ($item['value'] ?? ''),
            };

            Setting::query()->updateOrCreate(
                ['key' => $item['key']],
                ['value' => $value, 'type' => $type, 'updated_by' => $request->user()->id],
            );
        }

        return $this->ok(SettingResource::collection(Setting::query()->orderBy('key')->get()));
    }
}
