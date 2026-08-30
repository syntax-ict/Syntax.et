<?php

namespace App\Models;

use Database\Factories\ContactMessageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * A simple "contact us" message (architecture §8) — no ticket workflow,
 * just an inbox: read/unread and an optional responded-at timestamp.
 *
 * @use HasFactory<ContactMessageFactory>
 */
#[Fillable(['full_name', 'email', 'phone', 'subject', 'message', 'is_read', 'responded_at'])]
class ContactMessage extends Model
{
    use HasFactory;

    // This table only tracks `created_at` (architecture §1) — a contact
    // message isn't "updated", it's read or responded to.
    const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'responded_at' => 'datetime',
        ];
    }
}
