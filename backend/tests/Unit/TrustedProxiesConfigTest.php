<?php

namespace Tests\Unit;

use App\Support\TrustedProxies;
use Tests\TestCase;

/**
 * Security audit finding H4: without a trusted-proxy list, every rate
 * limiter in this app (all keyed on $request->ip()) collapses into one
 * shared bucket for every visitor behind any reverse proxy/load
 * balancer/CDN. This covers the TRUSTED_PROXIES env parsing that feeds
 * bootstrap/app.php's `$middleware->trustProxies(at: ...)` call.
 */
class TrustedProxiesConfigTest extends TestCase
{
    public function test_empty_value_yields_no_trusted_proxies(): void
    {
        $this->assertSame([], TrustedProxies::parse(''));
    }

    public function test_single_proxy(): void
    {
        $this->assertSame(['10.0.0.1'], TrustedProxies::parse('10.0.0.1'));
    }

    public function test_multiple_proxies_and_a_cidr_range(): void
    {
        $this->assertSame(
            ['10.0.0.1', '192.168.1.0/24'],
            TrustedProxies::parse('10.0.0.1,192.168.1.0/24'),
        );
    }

    public function test_surrounding_and_inner_whitespace_is_trimmed(): void
    {
        $this->assertSame(
            ['10.0.0.1', '10.0.0.2'],
            TrustedProxies::parse(' 10.0.0.1 , 10.0.0.2 '),
        );
    }

    public function test_stray_commas_do_not_produce_empty_entries(): void
    {
        $this->assertSame(['10.0.0.1'], TrustedProxies::parse('10.0.0.1,,'));
        $this->assertSame([], TrustedProxies::parse(','));
    }
}
