<?php

namespace App\Policies;

use App\Policies\Concerns\DeniesContentWrites;

class ProjectPolicy
{
    use DeniesContentWrites;
}
