<?php

namespace App\Models;

use App\Models\Concerns\HasActiveScope;
use Database\Factories\CourseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A training course (architecture §4).
 *
 * @use HasFactory<CourseFactory>
 */
#[Fillable([
    'solution_category_id', 'slug', 'title', 'duration', 'level', 'mode', 'description',
    'syllabus', 'skills_gained', 'target_audience', 'requirements', 'modules',
    'schedule', 'location', 'price_amount', 'price_currency', 'capacity',
    'sort_order', 'is_active',
])]
class Course extends Model
{
    use HasActiveScope, HasFactory;

    protected function casts(): array
    {
        return [
            'syllabus' => 'array',
            'skills_gained' => 'array',
            'target_audience' => 'array',
            'requirements' => 'array',
            'modules' => 'array',
            'price_amount' => 'decimal:2',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(SolutionCategory::class, 'solution_category_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(CourseRegistration::class);
    }
}
