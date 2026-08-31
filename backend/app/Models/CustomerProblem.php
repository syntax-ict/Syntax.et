<?php

namespace App\Models;

use App\Models\Concerns\HasActiveScope;
use Database\Factories\CustomerProblemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Diagnostic Hub content: maps a customer-facing problem statement to a
 * solution category (architecture supporting table for domain §2).
 *
 * @use HasFactory<CustomerProblemFactory>
 */
#[Fillable(['solution_category_id', 'target_user', 'problem', 'impact', 'solution_text', 'sort_order', 'is_active'])]
class CustomerProblem extends Model
{
    use HasActiveScope, HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(SolutionCategory::class, 'solution_category_id');
    }
}
