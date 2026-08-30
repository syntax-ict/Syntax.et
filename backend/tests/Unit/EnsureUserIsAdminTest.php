<?php

namespace Tests\Unit;

use App\Http\Middleware\EnsureUserIsAdmin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class EnsureUserIsAdminTest extends TestCase
{
    use RefreshDatabase;

    private function passThrough(Request $request): \Closure
    {
        return fn ($req) => response()->json(['success' => true]);
    }

    public function test_admin_user_passes_through(): void
    {
        $request = Request::create('/api/admin/anything', 'GET');
        $request->setUserResolver(fn () => User::factory()->admin()->make());

        $response = (new EnsureUserIsAdmin)->handle($request, $this->passThrough($request));

        $this->assertSame(200, $response->getStatusCode());
    }

    public function test_staff_user_is_rejected_with_403(): void
    {
        $request = Request::create('/api/admin/anything', 'GET');
        $request->setUserResolver(fn () => User::factory()->staff()->make());

        $this->expectException(HttpException::class);
        $this->expectExceptionMessage('This action requires administrator privileges.');

        (new EnsureUserIsAdmin)->handle($request, $this->passThrough($request));
    }

    public function test_guest_is_rejected_with_403(): void
    {
        $request = Request::create('/api/admin/anything', 'GET');
        $request->setUserResolver(fn () => null);

        $this->expectException(HttpException::class);

        (new EnsureUserIsAdmin)->handle($request, $this->passThrough($request));
    }
}
