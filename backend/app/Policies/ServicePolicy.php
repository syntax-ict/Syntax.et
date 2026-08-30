<?php

namespace App\Policies;

use App\Policies\Concerns\DeniesContentWrites;

class ServicePolicy
{
    use DeniesContentWrites;
}
