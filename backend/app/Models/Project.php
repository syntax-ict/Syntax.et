<?php

namespace App\Models;

use App\Models\Concerns\HasActiveScope;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A portfolio case study (architecture §3).
 *
 * @use HasFactory<ProjectFactory>
 */
#[Fillable([
    'solution_category_id', 'slug', 'title', 'client_type', 'industry', 'description',
    'challenge', 'solution_detail', 'outcome', 'scope_of_implementation',
    'technologies_involved', 'deliverables', 'results', 'is_featured',
    'sort_order', 'is_active',
])]
class Project extends Model
{
    use HasActiveScope, HasFactory;

    protected function casts(): array
    {
        return [
            'scope_of_implementation' => 'array',
            'technologies_involved' => 'array',
            'deliverables' => 'array',
            'results' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(SolutionCategory::class, 'solution_category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('sort_order');
    }
}
