<?php

namespace App\Policies;

use App\Policies\Concerns\DeniesContentWrites;

class CoursePolicy
{
    use DeniesContentWrites;
}
