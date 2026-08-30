<?php

namespace App\Models;

use Database\Factories\SettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A site-wide key/value setting (contact phone, email, hero badge text,
 * etc.) — architecture §10/domain #10. Single source of truth that
 * directly fixes the frontend audit's finding that the header and footer
 * showed two different phone numbers because each was hard-coded
 * separately in the old React components.
 *
 * @use HasFactory<SettingFactory>
 */
#[Fillable(['key', 'value', 'type', 'updated_by'])]
class Setting extends Model
{
    use HasFactory;

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Casts `value` according to its declared `type` column, since a plain
     * text column can't be usefully cast statically per-row.
     */
    public function castValue(): string|bool|array|null
    {
        return match ($this->type) {
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode((string) $this->value, true),
            default => $this->value,
        };
    }
}
