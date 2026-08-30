<?php

namespace App\Policies;

use App\Policies\Concerns\DeniesContentWrites;

class CustomerProblemPolicy
{
    use DeniesContentWrites;
}
