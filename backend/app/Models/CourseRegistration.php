<?php

namespace App\Models;

use Database\Factories\CourseRegistrationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A student's enrollment request for a course (architecture §5) — its own
 * table because its shape and lifecycle (enrolled → confirmed/waitlisted →
 * completed) genuinely differ from the Inquiry ticket workflow.
 *
 * @use HasFactory<CourseRegistrationFactory>
 */
#[Fillable(['course_id', 'full_name', 'email', 'phone', 'organization', 'training_mode', 'experience_level', 'goals', 'status'])]
class CourseRegistration extends Model
{
    use HasFactory;

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
