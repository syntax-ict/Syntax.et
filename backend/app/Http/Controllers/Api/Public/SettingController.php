<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Public settings are an explicit whitelist (architecture §5/§C), not
 * "every setting minus an admin-only flag" — a new internal-only setting
 * added later is private by default, not accidentally public.
 */
class SettingController extends Controller
{
    use ApiResponse;

    private const PUBLIC_KEYS = [
        'contact_phone',
        'contact_email',
        'office_address',
        'hero_badge_text',
    ];

    public function index(): JsonResponse
    {
        $settings = Setting::query()
            ->whereIn('key', self::PUBLIC_KEYS)
            ->get()
            ->mapWithKeys(fn (Setting $setting) => [$setting->key => $setting->castValue()]);

        return $this->ok($settings->all());
    }
}
