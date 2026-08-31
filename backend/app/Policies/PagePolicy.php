<?php

namespace App\Policies;

use App\Policies\Concerns\DeniesContentWrites;

class PagePolicy
{
    use DeniesContentWrites;
}
