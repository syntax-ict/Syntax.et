<?php

namespace App\Models;

use Database\Factories\ProjectImageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @use HasFactory<ProjectImageFactory>
 */
#[Fillable(['project_id', 'disk_path', 'alt_text', 'sort_order'])]
class ProjectImage extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Resolves the stored disk path to a public URL. Never expose
     * `disk_path` itself in an API response (architecture §10).
     */
    public function url(): string
    {
        return Storage::disk('public')->url($this->disk_path);
    }
}
