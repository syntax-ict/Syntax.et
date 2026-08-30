<?php

namespace App\Policies\Concerns;

use App\Models\User;

/**
 * Shared authorization for the content models (categories, services, FAQs,
 * customer problems, courses, projects, pages): staff can read everything
 * (including inactive/unpublished records, since they're the ones deciding
 * whether to publish them), but every write is admin-only (architecture
 * §9). `Gate::before` in AppServiceProvider already grants an admin
 * everything, so these methods only ever run for a "staff" user — they
 * exist to say what staff is additionally allowed to do, and for content,
 * that's read-only.
 */
trait DeniesContentWrites
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user): bool
    {
        return false;
    }

    public function delete(User $user): bool
    {
        return false;
    }
}
