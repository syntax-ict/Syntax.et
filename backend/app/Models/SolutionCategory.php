<?php

namespace App\Models;

use App\Models\Concerns\HasActiveScope;
use Database\Factories\SolutionCategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * One of the four core business pillars (architecture §2).
 *
 * @use HasFactory<SolutionCategoryFactory>
 */
#[Fillable([
    'slug', 'name', 'short_description', 'detailed_description', 'icon',
    'color_primary', 'color_bg', 'color_border', 'color_accent',
    'sort_order', 'is_active',
])]
class SolutionCategory extends Model
{
    use HasActiveScope, HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function customerProblems(): HasMany
    {
        return $this->hasMany(CustomerProblem::class);
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
