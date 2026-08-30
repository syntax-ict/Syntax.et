<?php

namespace App\Models;

use Database\Factories\InquiryNoteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A staff follow-up note on an inquiry (architecture §D `LeadNote`) — an
 * append-only history, replacing the old frontend's single overwritable
 * `notes` string that lost every prior update.
 *
 * @use HasFactory<InquiryNoteFactory>
 */
#[Fillable(['inquiry_id', 'author_id', 'body'])]
class InquiryNote extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(Inquiry::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
