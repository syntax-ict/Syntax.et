<?php

namespace App\Models;

use Database\Factories\InquiryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * A consultation, quote, or support request (architecture §6/§7/§9). The
 * three share one table because they share one staff workflow (status,
 * assignment); type-specific extras live in `meta`.
 *
 * @use HasFactory<InquiryFactory>
 */
#[Fillable([
    'reference', 'type', 'full_name', 'email', 'phone', 'organization',
    'subject', 'priority', 'status', 'details', 'meta', 'assigned_to',
])]
class Inquiry extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['meta' => 'array'];
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Server-generated reference, e.g. `ST-CONS-7F3A9K`. Never accepted
     * from the client (architecture §6/§7/§9).
     */
    public static function generateReference(string $type): string
    {
        $prefix = match ($type) {
            'consultation' => 'CONS',
            'quote' => 'QUOTE',
            'support' => 'SUPP',
            default => 'GEN',
        };

        return sprintf('ST-%s-%s', $prefix, Str::upper(Str::random(6)));
    }
}
