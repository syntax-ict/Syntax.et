<?php

namespace App\Models;

use Database\Factories\PageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A static CMS page (About, Privacy, Terms) — architecture §10/domain #10.
 *
 * @use HasFactory<PageFactory>
 */
#[Fillable(['slug', 'title', 'body', 'meta_title', 'meta_description', 'is_published', 'updated_by'])]
class Page extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['is_published' => 'boolean'];
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
