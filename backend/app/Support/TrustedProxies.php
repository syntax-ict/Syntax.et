<?php

namespace App\Support;

/**
 * Parses the TRUSTED_PROXIES env var (security audit finding H4) into the
 * list bootstrap/app.php passes to $middleware->trustProxies(at: ...).
 * Pulled out of the bootstrap closure into its own class purely so the
 * parsing logic itself — not the framework wiring around it — has direct
 * test coverage.
 */
class TrustedProxies
{
    /**
     * @return list<string>
     */
    public static function parse(string $value): array
    {
        return array_values(array_filter(
            array_map('trim', explode(',', $value))
        ));
    }
}
