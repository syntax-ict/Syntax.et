<?php

namespace App\Policies;

use App\Models\User;

/**
 * Staff can view, update status/assignment, and add notes on any inquiry;
 * only admin can delete (architecture §7). `Gate::before` grants admin
 * everything, so `delete()` returning false here only ever denies staff.
 */
class InquiryPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user): bool
    {
        return true;
    }

    public function update(User $user): bool
    {
        return true;
    }

    public function addNote(User $user): bool
    {
        return true;
    }

    public function delete(User $user): bool
    {
        return false;
    }
}
