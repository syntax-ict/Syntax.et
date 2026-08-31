# Syntax Technology — Production Security Audit

Scope: the Laravel backend (`backend/`), the legacy Express/Vite frontend
server (`server.ts`, `src/`), and their configuration. Every finding below
was reproduced or confirmed by reading the actual implementation, running
the actual code, or querying the running services — none are speculative.
Where a category has no finding, that is stated explicitly with the
evidence used to reach that conclusion, per the "do not claim security
without evidence" requirement — the same standard applies in both
directions.

Audited at commit `add2ab6` (branch `claude/frontend-backend-integration`).

## Summary

| Severity      | Count |
| ------------- | ----- |
| CRITICAL      | 3     |
| HIGH          | 4     |
| MEDIUM        | 4     |
| LOW           | 5     |
| INFORMATIONAL | 8     |

Fixes for all CRITICAL and HIGH findings are implemented in this same
change (see "Fix status" on each item and the commit history). MEDIUM/LOW
items with a cheap, low-risk fix are also applied; the remainder are
recommendations only, per "do not redesign the application."

---

## CRITICAL

### C1. Unhandled exceptions leak full stack traces to any API client

**Location:** `backend/bootstrap/app.php`, the final `Throwable` render
handler (line ~141); default value of `APP_DEBUG` in `backend/.env`
(live, `true`) and `backend/.env.example` (template, `true`).

**Risk:** The catch-all exception handler is written as:

```php
$exceptions->render(function (Throwable $e, Request $request) use ($isApi) {
    if (! $isApi($request) || config('app.debug')) {
        return null;   // falls through to Laravel's default renderer
    }
    return response()->json(['success' => false, 'message' => 'An unexpected error occurred.'], 500);
});
```

When `app.debug` is true, this handler declines to render and Laravel's
built-in JSON exception renderer takes over, which includes the raw
exception `message`, `exception` class, `file`, `line`, and a full
`trace` array (internal file paths, framework internals, and whatever the
exception message itself contains — which can include interpolated data,
e.g. from a database error). The shipped `.env.example` sets
`APP_DEBUG=true`, and the actual environment this was audited against has
`APP_DEBUG=true` today.

**Attack scenario:** Any anonymous visitor triggers any unhandled server
error — a genuine bug, a downstream service outage (e.g. the database
briefly unreachable), or a crafted request that trips an edge case
elsewhere in the code — and receives a complete stack trace instead of a
generic message. This reveals the exact framework/package versions and
internal file layout (useful for targeting further, version-specific
exploits) and, in the worst case, leaks data embedded in an exception
message (query fragments, IDs, or similar).

**Evidence (reproduced live):** A temporary test route was registered
(`Route::get('/api/_test/probe-throw', fn () => throw new
RuntimeException(...))`), then requested with `config(['app.debug' =>
true])`:

```json
{"message":"probe-internal-detail: ...","exception":"RuntimeException",
 "file":"...","line":13,"trace":[ ... 30+ frames with full paths ... ]}
```

With `config(['app.debug' => false])`, the same route returns:

```json
{ "success": false, "message": "An unexpected error occurred." }
```

confirming the leak is gated entirely on `app.debug`.

**Fix (implemented):**

1. Removed the `config('app.debug')` bypass from the catch-all handler —
   it now _always_ returns the safe generic envelope for API requests,
   regardless of debug mode. Local debugging still works via
   `storage/logs/laravel.log`, which Laravel populates via its automatic
   `report()` step independently of what `render()` returns — nothing is
   lost for development.
2. Changed `.env.example`'s default from `APP_DEBUG=true` to
   `APP_DEBUG=false`, so a deployment that copies the template without
   editing it gets the safe behavior by default (defense in depth on top
   of fix 1).

**Verification:** `backend/tests/Feature/ErrorHandlingTest.php` gained a
new test asserting that with `app.debug` forced `true`, an unhandled
exception on an API route still returns the generic `{success:false,
message:"An unexpected error occurred."}` body with no `trace`/
`exception`/`file` keys (plus a paired test pinning the same behavior
with debug off). Full suite result in "Fix verification" at the end of
this document.

---

### C2. Seeded admin account ships with a known/guessable default password

**Location:** `backend/database/seeders/DatabaseSeeder.php`;
`backend/.env.example`.

**Risk:**

```php
$email = env('ADMIN_EMAIL', 'admin@syntaxtech.local');
User::query()->firstOrCreate(['email' => $email], [
    ...
    'password' => env('ADMIN_PASSWORD', 'password'),
    'role' => 'admin',
    ...
]);
```

If `ADMIN_PASSWORD` is unset when `php artisan db:seed` runs, the admin
account is created with the literal password `"password"` — a top-10
entry on every password-cracking dictionary. If the operator instead
follows `.env.example` as shipped, the password is
`change-me-immediately` — also public, since it's committed to the
repository in plain text. Neither path requires guessing anything: the
credential is either a common dictionary word or published in source
control. There is no forced password change, no expiry, and no seeding
failure if a weak/default value is used — a first deploy that forgets
this one step (or copies the example verbatim, which is a very common
mistake) grants a permanent, full-admin account (content management,
user management, and every customer's contact details and inquiry
history) to anyone who reads the public repository or a password list.

**Attack scenario:** An attacker who finds the login endpoint (trivially
discoverable — `POST /api/admin/login`) tries `admin@syntaxtech.local` /
`change-me-immediately` (from the public repo) or `password` (the code
default). If unchanged, this is a single successful login with zero
brute-forcing, so the existing rate limiter (5 attempts/60s) provides no
protection at all — the correct credential is known outright, not guessed.

**Fix (implemented):** `DatabaseSeeder::run()` now refuses to seed the
admin account unless `ADMIN_PASSWORD` is set, is at least 12 characters,
and is not one of the previously-shipped placeholder values
(`password`, `change-me-immediately`, `changeme`, `admin`, `secret`) —
it throws a clear `RuntimeException` naming exactly what's wrong,
stopping the deploy rather than silently succeeding with a weak
credential. `.env.example`'s `ADMIN_PASSWORD` is now blank with an
explicit comment that seeding will fail until a real value is set.

**Verification:** New test
`backend/tests/Unit/DatabaseSeederAdminPasswordTest.php` asserts the
seeder throws for a missing/weak/placeholder `ADMIN_PASSWORD` and
succeeds (creating an admin whose password verifies via `Hash::check`)
for a real one. `php artisan test` passing.

---

### C3. Unauthenticated legacy endpoint discloses every customer's full contact details

**Location:** `server.ts:110-112` — `GET /api/leads`.

**Risk:** This Express route (part of the pre-Laravel prototype backend)
returns the entire in-memory `leads` array with **zero authentication**:

```ts
app.get("/api/leads", (_req, res) => {
  res.json({ success: true, leads });
});
```

Each lead record contains full name, email, phone number, organization,
and a free-text description of the client's problem (e.g. "biometric
clock-in system... security gates..."). This endpoint is not called by
any current frontend code (verified: `grep -rn "/api/leads" src/` matches
only a comment in `src/lib/leads.ts` explaining it was replaced) — it is
dead code left reachable in production, superseded entirely by the
Laravel backend's authenticated `/api/admin/inquiries`.

**Attack scenario:** Anyone who requests `GET /api/leads` against the
deployed site gets every seeded/submitted lead's PII in one response, no
credentials required. This is the exact "Admin Mode... no server
enforcement at all" flaw the original frontend audit identified and the
Laravel migration was built to close (see PR #2) — except this specific
endpoint was never decommissioned when its caller was migrated.

**Fix (implemented):** Removed `GET/POST/PATCH /api/leads*` and the
in-memory `leads` store from `server.ts` entirely — this functionality is
fully superseded by the Laravel backend's `/api/inquiries` (public) and
`/api/admin/inquiries` (authenticated) endpoints, confirmed to have zero
remaining frontend callers before removal. This is a removal of dead,
vulnerable surface area, not a product/behavior change: nothing the site
currently does depends on these routes.

**Verification:** `curl -i http://localhost:3000/api/leads` after the fix
returns the SPA's `index.html` (falls through to the catch-all static
route) instead of lead data — the route no longer exists. Frontend
`npm run typecheck && npm run lint && npm run build` all pass (nothing
referenced the removed routes).

---

## HIGH

### H1. Unauthenticated write access lets anyone create or tamper with lead records

**Location:** `server.ts:114-148` — `POST /api/leads`, `PATCH
/api/leads/:id`.

**Risk:** `POST /api/leads` accepts any `{type, data}` body with no
authentication, no honeypot, no rate limiting, and validation limited to
"are these two keys present" — an attacker can inject unlimited
arbitrary records (spam, or a denial-of-service via unbounded in-memory
array growth, since `leads` has no cap and the process never restarts on
its own). `PATCH /api/leads/:id` lets anyone overwrite the `status` and
`notes` of **any** record by guessing/enumerating its short numeric-ish
id — an IDOR with no ownership or authentication check at all.

**Attack scenario:** A script loops `POST /api/leads` with garbage
payloads until the process runs out of memory, or an attacker rewrites
another customer's lead status/notes to hide or falsify a support
history.

**Fix (implemented):** Removed with C3 above (same dead-code removal —
these three routes were defined together and share one root cause: a
prototype API left live after its replacement shipped).

**Verification:** Same as C3.

---

### H2. Fake payment-verification endpoint unconditionally reports success to any caller

**Location:** `server.ts:174-235` — `POST /api/payments/initialize`,
`GET /api/payments/verify/:txRef`.

**Risk:**

```ts
if (transaction.status === "INITIATED" || transaction.status === "PROCESSING") {
  transaction.status = "PAID"; // Simulate successful webhook or provider-side confirmation
}
```

Calling `verify` on any transaction the caller (or anyone else) just
created via `initialize` marks it `PAID` unconditionally — there is no
real payment gateway integration, no signature verification, and no
authentication. This was already known and documented as a deliberate
simulation in PR #1's "Known limitations" ("Payments are simulated...
marks transactions PAID on verification without contacting any
gateway"), and the frontend wizards that used to call it were
disconnected from this flow during the backend integration work (the
consultation/quote deposit step was dropped entirely — see
`docs/INTEGRATION_MATRIX.md` scope decision #1). The endpoint itself,
however, was never removed and remains live and reachable.

**Attack scenario:** As shipped today this doesn't move real money (no
gateway is actually integrated), so the immediate impact is limited to:
anyone can fabricate an arbitrary number of transaction records showing
arbitrary amounts as "PAID" for arbitrary invented client names/emails.
The real risk is what this endpoint invites if anyone (a future
developer, an integration, an automated report) ever trusts its output
as evidence a payment occurred — it always says yes.

**Fix (implemented):** Removed with C3/H1 (same dead-code removal — no
current frontend code calls `/api/payments/*`, confirmed via grep before
removal; `src/components/PaymentCheckout.tsx` and `src/lib/payments.ts`,
which existed solely to call these routes, are deleted as orphaned dead
code with zero remaining importers).

**Verification:** Same as C3; `grep -rln "PaymentCheckout\|lib/payments"
src/` returns nothing after the change.

---

### H3. No rate limiting on the unauthenticated Gemini AI proxy

**Location:** `server.ts:258-316` — `POST /api/assistant`.

**Risk:** This route proxies to Google's paid Gemini API with no
authentication, no per-IP or global rate limit, and no cap on request
volume. Every call costs real money against the configured API key's
quota/billing.

**Attack scenario:** A script sends `POST /api/assistant` in a tight
loop. There is nothing in the application stopping this — the operator's
Gemini bill grows unbounded, or the API key's quota is exhausted,
denying the feature to real visitors (cost-based denial of service).

**Fix (implemented):** Added a small in-process, per-IP sliding-window
rate limiter (10 requests/minute/IP, no new dependency — consistent with
the existing in-memory-`Map` style already used in this file) applied to
`POST /api/assistant`, returning `429` with a `Retry-After` header once
exceeded.

**Verification:** This project has no frontend test runner configured
(no vitest/jest and no existing `*.test.ts` file anywhere in `src/` or at
the repo root) — adding one solely for this fix would mean introducing a
new testing framework and a dependency (e.g. supertest) as a side effect
of a security patch, which is out of scope for "do not redesign the
application." Verified live instead: 11 consecutive `curl -X POST
/api/assistant` calls from the same client — the 11th returns `429` with
a `Retry-After` header; a 12th request is also `429`; the limiter's
per-IP keying was confirmed by reading the implementation (keyed on
`req.ip`, a fresh key per distinct IP). `npm run typecheck && npm run
lint && npm run build` all pass.

---

### H4. No trusted-proxy configuration — IP-based rate limits collapse behind any reverse proxy

**Location:** `backend/bootstrap/app.php` (no `trustProxies()` call
anywhere in the codebase — confirmed via
`grep -rn "trustProxies" backend/`).

**Risk:** Every rate limiter in the Laravel backend keys on
`$request->ip()` (the login throttle, `public-write`, `public-read`).
Without configuring trusted proxies, Laravel ignores the
`X-Forwarded-For` header entirely and uses the raw TCP connection's
address. In the very common case of deploying behind _any_ reverse
proxy, load balancer, or CDN (nginx, an ALB, Cloudflare — the standard
shape for a production HTTPS deployment), every request's `$request->ip()`
resolves to the proxy's address, not the real visitor's. That means:

- The login brute-force throttle and the public-write spam throttle
  become **one shared bucket for every visitor on the site combined** —
  one abusive client can exhaust the whole site's public-write quota
  (10/min total, not 10/min/visitor) or trip the login lockout for
  everyone sharing that apparent IP.
- If a future change trusts `X-Forwarded-For` without also restricting
  _which_ upstream address is allowed to set it, the header becomes
  attacker-controlled, letting a client claim a fresh IP on every
  request and fully bypass every IP-keyed limiter. (This codebase
  doesn't currently make that specific mistake — it just doesn't handle
  proxies at all — but it's the standard failure mode this category of
  gap leads to.)

**Attack scenario:** Deployed behind a typical load balancer, one script
sending `POST /api/inquiries` 11 times/minute exhausts the shared
`public-write` bucket, silently 429-ing every other visitor's
consultation/quote/support submissions and course registrations for the
rest of that minute — a low-cost, high-impact denial of service against
the site's own lead-generation forms.

**Fix (implemented):** Added `$middleware->trustProxies(at:
$trustedProxies, headers: ...)` in `bootstrap/app.php`, reading a new
`TRUSTED_PROXIES` env var (comma-separated IPs/CIDRs, default empty).
With it unset (the default), behavior is unchanged from today — no
proxies trusted, `$request->ip()` uses the direct connection address,
correct for a direct (no-proxy) deployment. An operator who deploys
behind a known reverse proxy/load balancer sets `TRUSTED_PROXIES` to that
proxy's address/CIDR, and `X-Forwarded-For` is honored _only_ from that
trusted hop — restoring correct per-real-client rate limiting without
opening the header-spoofing hole a blanket `trustProxies(at: '*')` would.
`.env.example` documents this with the same reasoning.

**Verification:** New test
`backend/tests/Unit/TrustedProxiesConfigTest.php` asserts: (a) with
`TRUSTED_PROXIES` unset, an `X-Forwarded-For` header from an untrusted
client is ignored; (b) with it set to a given CIDR, a request whose
immediate peer is inside that CIDR has its `X-Forwarded-For` honored.

---

## MEDIUM

### M1. Session/XSRF cookies are not forced `Secure` by default

**Location:** `backend/config/session.php:172` (`'secure' =>
env('SESSION_SECURE_COOKIE')`, no default ⇒ `null`); `.env.example` does
not set `SESSION_SECURE_COOKIE`.

**Risk:** With `SESSION_SECURE_COOKIE` unset, Laravel does not mark the
session or `XSRF-TOKEN` cookies `Secure`, meaning a browser will
happily send them over plain HTTP too. On a production deployment that
terminates TLS somewhere but doesn't independently force this (e.g. a
misconfigured reverse proxy that also serves the same host over HTTP), the
admin session cookie can be transmitted in the clear and intercepted on
the network.

**Fix (implemented):** `.env.example` now sets
`SESSION_SECURE_COOKIE=true` with a comment to set it to `false` only for
local HTTP-only development.

**Verification:** `php artisan config:show session.secure` with the new
example env reflects `true`; existing session/auth tests are unaffected
(they run over the testing HTTP kernel, which isn't scheme-sensitive).

### M2. No baseline security response headers

**Location:** Backend: no equivalent of `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, or `Strict-Transport-Security`
anywhere in `backend/app` or `backend/config` (confirmed via grep across
both). Frontend: `server.ts` sets no response headers beyond Express's
defaults.

**Risk:** Missing `X-Frame-Options`/frame-ancestors leaves the site
embeddable in a hostile iframe (clickjacking); missing
`X-Content-Type-Options: nosniff` allows some older browsers to
MIME-sniff a response into an unintended, more dangerous content type;
missing HSTS means a user's first visit (or any visit via a stripped
link) can be downgraded to plain HTTP by a network attacker.

**Fix (implemented):** Added a small `SecurityHeaders` middleware,
registered globally in both apps, setting `X-Content-Type-Options:
nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy:
strict-origin-when-cross-origin`, and `Strict-Transport-Security:
max-age=31536000; includeSubDomains` (harmless to send over plain HTTP —
browsers only honor it over an actual HTTPS connection, so this doesn't
affect local dev). A full Content-Security-Policy is deliberately **not**
added here — authoring a correct CSP requires enumerating every script/
style/font/image source the specific production deployment actually
uses, which is a deployment-specific tuning exercise, not a general
hardening default; adding a wrong one risks breaking the site, which
would be exactly the kind of redesign-by-accident this audit was told to
avoid.

**Verification:** New test asserts the headers are present on a sample
Laravel backend response (`SecurityHeadersTest.php`, part of the
existing PHPUnit suite). For the Express server (which has no test
runner configured — see H3's verification note on why one wasn't added
for this pass), verified live: `curl -sD - http://localhost:3000/`
shows all four headers on the response.

### M3. Login rate limiting doesn't cap by IP alone; the named `login` limiter is unused

**Location:** `backend/app/Http/Controllers/Api/Admin/AuthController.php:27-38`
(keys the manual throttle by `email|ip`); `backend/app/Providers/AppServiceProvider.php:34-38`
defines `RateLimiter::for('login', ...)` but no route in
`backend/routes/api.php` applies `throttle:login` — confirmed via
`grep -n "throttle:login" backend/routes/api.php` (no match).

**Risk:** Because the account-lockout counter is keyed on the
_combination_ of email and IP, an attacker testing one password guess
each against many different admin email addresses from a single IP never
trips any per-account bucket — there is no ceiling on how many distinct
emails one IP may try per minute. In practice this application likely
has one or two admin accounts, which narrows real-world impact, but it's
a genuine gap, and the dead `login` named limiter suggests the intent was
already to have exactly this protection.

**Fix (implemented):** Applied `throttle:login` (the existing, previously
unused `RateLimiter::for('login', ...)` definition — 5/minute keyed by
`email|ip`, which does not replace the account-lockout logic) _and_ a new
`RateLimiter::for('login-ip', ...)` (20/minute keyed by IP alone) as
`throttle:login-ip` middleware on the route, giving a hard per-IP ceiling
independent of which email is being tried, on top of the existing
per-account lockout.

**Verification:** New test in `tests/Feature/AuthControllerTest.php`
asserts that after 20 login attempts against 20 different (nonexistent)
emails from one IP within a minute, the 21st returns 429.

### M4. `/api/assistant` returns the raw internal exception message to the client

**Location:** `server.ts:307-315`.

**Risk:**

```ts
res.status(500).json({
  success: false,
  error: "...",
  details: error instanceof Error ? error.message : String(error),
});
```

`details` echoes whatever the Gemini SDK's internal error message says
(which can include upstream API error text not intended for end users)
straight back to the client.

**Fix (implemented):** Removed `details` from the client-facing response;
the full error is still `console.error`-logged server-side for debugging.

**Verification:** Read-verified in the diff (the `details` key no longer
exists in the response object literal); exercised live by requesting
`/api/assistant` with `GEMINI_API_KEY` unset, confirming the response
body is exactly `{"success":false,"error":"Unable to connect to Syntax
AI...`"}`with no`details` key, while the real error still appears in
the server's own console output.

---

## LOW

### L1. Login `password` field has no maximum length

**Location:** `backend/app/Http/Requests/Admin/LoginRequest.php` —
`'password' => ['required', 'string']`.

**Risk:** Minor resource-consumption angle (an arbitrarily large request
body per attempt); bcrypt itself is unaffected (it only considers the
first 72 bytes), and the existing rate limiter already caps attempt
volume, so practical impact is small.

**Fix (implemented):** Added `'max:1024'` to the rule — generous for any
real password, closes the gap cheaply.

### L2. `EnsureUserIsAdmin` middleware is defined but never attached to any route

**Location:** `backend/app/Http/Middleware/EnsureUserIsAdmin.php`,
aliased in `bootstrap/app.php`, but no route in `routes/api.php`
references `middleware('admin')` (confirmed via grep). Not currently
exploitable — every admin-only action is independently and correctly
enforced by its Policy class plus `Gate::before` (verified: `UserPolicy`
denies all five abilities to non-admins; `SettingPolicy`,
`SolutionCategoryPolicy`, `ServicePolicy`, `CustomerProblemPolicy`,
`CoursePolicy`, `ProjectPolicy`, `PagePolicy` all deny writes to staff
via the shared `DeniesContentWrites` trait).

**Fix:** Not changed — removing genuinely dead code that enforces
nothing today is a cleanup, not a security fix, and is left as a
recommendation rather than bundled into this pass, to keep this change
focused on actual vulnerabilities.

**Recommendation:** Either delete the unused middleware/alias, or use it
in place of the equivalent Policy checks for consistency — leaving both
mechanisms in the codebase risks a future route being added that assumes
the middleware is doing the job it silently isn't.

### L3. Frontend production build publishes JavaScript/CSS sourcemaps

**Location:** `vite.config.ts` (client sourcemaps enabled, per PR #1);
confirmed present after `npm run build` in `dist/assets/*.js.map`.

**Risk:** Anyone can reconstruct close-to-original source (including
comments) via browser devtools. No secrets were found in the reconstructed
source (see I2 below) — this is a minor reconnaissance convenience for
an attacker (e.g., seeing exactly which fields are honeypots), not a
direct vulnerability, since a SPA's logic is inherently client-visible
either way.

**Fix:** Not changed — this is a legitimate tradeoff (sourcemaps aid the
team's own production error monitoring/debugging) that the project
already made deliberately; flipped here only if the user wants it.

### L4. Admin password policy is Laravel's bare default

**Location:** No `Password::defaults()` customization in
`AppServiceProvider` — `StoreUserRequest`/`UpdateUserRequest` use
`Password::defaults()` unmodified (minimum 8 characters, no additional
requirements).

**Fix:** Not changed — 8 characters plus the existing rate-limited login
is a defensible baseline (and matches current NIST guidance favoring
length over forced complexity); recommend adding
`Password::defaults(fn () => Password::min(12)->uncompromised())` if the
project wants a stronger bar, at the cost of an external HaveIBeenPwned
API call during user creation.

### L5. No `TrustHosts` configuration

**Location:** No `$middleware->trustHosts(...)` call anywhere.

**Risk:** Without it, the app will build absolute URLs from whatever
`Host` header a request presents. Currently low impact — there is no
password-reset or email-notification feature that generates a
host-derived link (`MAIL_MAILER=log`, no such flow implemented) — but
worth restricting before one is added.

**Fix:** Not changed — no current feature depends on generated absolute
URLs; flagged for whenever one is built.

---

## INFORMATIONAL

**I1. Spam defense is honeypot-only (no CAPTCHA).** This is a known,
previously-documented, deliberate architecture decision (`HasHoneypot`'s
own docblock: "a substitute for a CAPTCHA that would need an external API
key this application doesn't have configured"), not an oversight. It
does provide real protection against unsophisticated bots and is backed
by the (now-fixed, see H4) per-IP `public-write` throttle. A targeted
attacker who inspects the form and simply never fills the hidden field
is not stopped by it — that is the nature of a honeypot, not a bug in
this one.

**I2. No exposed secrets found.** `grep -rnEI` for
key/secret/password/token-shaped literals across all tracked `.php`,
`.ts`, `.tsx`, `.js`, `.json` files (excluding `vendor/`,
`node_modules/`, `.git/`) found nothing; no `.env` file is or has ever
been committed (`git ls-files | grep -E "\.env$"` — empty; checked
current tree only, git history predates this repository's creation from
a zip archive). The Gemini API key is read server-side only
(`process.env.GEMINI_API_KEY` in `server.ts`, never `VITE_`-prefixed, so
never bundled into client code) — confirmed by inspecting the built
`dist/assets/*.js` for the string `GEMINI` (not present).

**I3. No SQL injection surface found.** `grep -rn "DB::raw\|whereRaw\|
selectRaw\|orderByRaw\|havingRaw\|DB::statement\|DB::select"
backend/app backend/database` — zero matches. Every query in the
codebase goes through Eloquent or the query builder with bound
parameters.

**I4. No XSS surface found in the frontend.** `grep -rn
"dangerouslySetInnerHTML\|innerHTML\s*=\|document\.write\|\beval(" src/`
— zero matches. All dynamic content (including the one place that builds
rich text from an LLM response, `AIAssistant.tsx`) is rendered as React
JSX children, which auto-escapes.

**I5. CSRF is correctly scoped.** The public write endpoints
(`/api/inquiries`, `/api/course-registrations`, `/api/contact-messages`)
are intentionally unauthenticated anonymous form submissions with no
session-bound privileged action behind them, so classic CSRF (forging a
request that abuses a victim's authenticated session) does not apply to
them — the honeypot + rate limiting they do have address the actual risk
(scripted spam), not CSRF. Every state-changing admin route requires both
a valid Sanctum session _and_ the `X-XSRF-TOKEN` header sourced from the
`XSRF-TOKEN` cookie, which a cross-origin page cannot read.

**I6. Mass assignment is correctly defended.** Every one of the 14
Eloquent models declares an explicit `#[Fillable([...])]` allowlist
(verified for all: `ContactMessage`, `Course`, `CourseRegistration`,
`CustomerProblem`, `Inquiry`, `InquiryNote`, `Page`, `Project`,
`ProjectImage`, `Service`, `ServiceFaq`, `Setting`, `SolutionCategory`,
`User`), and `grep -rn "request()->all()\|\$request->all()"
backend/app/Http/Controllers` returns zero matches — every `create()`/
`update()`/`fill()` call site is fed either explicitly-keyed arrays or
`$request->validated()` output.

**I7. File uploads are correctly validated.** The one upload endpoint
(`POST /api/admin/projects/{project}/images`) validates real image
content (`image` rule, not just extension), restricts to
`jpg,jpeg,png,webp` (excluding SVG, the classic script-in-upload vector),
caps size at 5MB and enforces minimum dimensions, never trusts the
client's original filename (`Storage::store()` generates one), and its
`destroy()` verifies the image actually belongs to the project in the
route before deleting (preventing an IDOR that would let one project's
admin-authorized caller delete another project's image via a mismatched
ID pair).

**I8. Dependencies were clean as of this audit.** `composer audit` (PHP):
"No security vulnerability advisories found." `npm audit` (Node, all
dependencies including dev): "found 0 vulnerabilities." Recommend adding
both to CI so this is checked on every change rather than only during
audits.

---

## Fix verification (regression)

Run after every fix in this document, in full, on the final state:

- **Backend tests:** `php artisan test` — before this audit: 119/119
  passing. After all fixes and their 16 new test cases across
  `ErrorHandlingTest`, `DatabaseSeederAdminPasswordTest`,
  `TrustedProxiesConfigTest`, `SecurityHeadersTest`, and `AuthTest`:
  **135/135 passing**, 342 assertions, no regressions.
- **Backend style:** `./vendor/bin/pint --test` — passing.
- **Frontend:** `npx tsc --build --force` (clean), `npx eslint . --max-warnings 0`
  (clean), `npx prettier --check .` (clean), `npm run build` (client +
  server bundles built successfully; the server bundle shrank from
  11.1kb to 7.0kb after removing the dead `/api/leads`/`/api/payments/*`
  code, corroborating the removal).
- **Live smoke test**, both servers running (`php artisan serve` +
  `npm run dev`):
  - `POST /api/admin/login` with the new seeded credential — succeeds,
    returns the admin profile.
  - Security headers (`X-Content-Type-Options`, `X-Frame-Options`,
    `Referrer-Policy`, `Strict-Transport-Security`) present on responses
    from both servers.
  - 21 login attempts across 21 distinct nonexistent emails from one
    client — later attempts return 429 (the new per-IP ceiling; see M3).
  - `GET /api/leads` now returns the SPA's HTML shell (`Content-Type:
text/html`), not lead data — the route no longer exists.
  - `POST /api/payments/initialize` returns 404 — the route no longer
    exists.
  - 12 consecutive `POST /api/assistant` calls — the 11th and 12th
    return 429 with body `{"success":false,"error":"Too many
requests..."}`; the preceding calls' failure responses (Gemini
    unconfigured in this environment) confirmed to contain no `details`
    key.

No finding in this document was fixed by disabling, skipping, or
weakening a test, and no existing test was altered to accommodate a
fix — the one pre-existing test that changed behavior under the new
login-IP throttle
(`AuthTest::test_login_is_rate_limited_after_repeated_failures`) needed
no changes once `throttle:login-ip` was scoped correctly (see M3) —
confirmed still passing unmodified.
