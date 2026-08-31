<?php

namespace App\Models;

use App\Models\Concerns\HasActiveScope;
use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A service datasheet under a solution category (architecture §1). This
 * merges what was previously two separate concepts on the frontend — a
 * short "service" list item and a standalone "solution" detail page — into
 * one entity with a category foreign key.
 *
 * @use HasFactory<ServiceFactory>
 */
#[Fillable([
    'solution_category_id', 'slug', 'name', 'short_description', 'description',
    'icon', 'benefits', 'is_featured', 'sort_order', 'is_active',
])]
class Service extends Model
{
    use HasActiveScope, HasFactory;

    protected function casts(): array
    {
        return [
            'benefits' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(SolutionCategory::class, 'solution_category_id');
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(ServiceFaq::class)->orderBy('sort_order');
    }
}
