<div align="center">
<p><strong>Syntax Technology — Backend</strong></p>
</div>

Laravel API backend for the Syntax Technology business website, implementing the
approved architecture (see the project's architecture document). PHP/Laravel + MySQL
or MariaDB, no queues/Redis/WebSockets beyond what the architecture calls for.

## Requirements

- PHP 8.3+
- Composer
- MySQL 8+ or MariaDB 10.6+

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
# edit .env: DB_* to point at your MySQL/MariaDB instance,
# ADMIN_EMAIL/ADMIN_PASSWORD for the first admin account
php artisan migrate
php artisan db:seed
```

## Development

```bash
php artisan serve            # http://localhost:8000
php artisan test             # PHPUnit
./vendor/bin/pint            # code style (fix)
./vendor/bin/pint --test     # code style (check only)
```

## Status

All 5 implementation phases from the approved architecture are complete (119 tests
passing):

- **Phase 1 — Foundation**: project scaffold, MySQL/MariaDB connection, Sanctum SPA
  cookie authentication (`/api/admin/login`, `/logout`, `/me`), the `admin`/`staff`
  role split with an `EnsureUserIsAdmin` middleware and a `Gate::before` admin bypass,
  login rate limiting, and the app-wide JSON error envelope (`bootstrap/app.php`).
- **Phase 2 — Content read models**: solution categories, services (+ FAQs), customer
  problems, courses, and projects (+ images), each with a public read-only API.
- **Phase 3 — Public forms**: consultation/quote/support requests (`inquiries`), course
  registrations, and contact messages, each with per-type validation and a
  privacy-scoped public status lookup.
- **Phase 4 — Hardening**: rate limiting on every public route, a honeypot on the three
  public write forms, a dedicated `security` log channel, a 409 response for
  unique-constraint violations, and file-validation rules for project photo uploads.
- **Phase 5 — Admin**: full CRUD for content (categories/services/FAQs/customer-problems/
  courses/projects/project images/pages/settings), lead management (inquiries with
  staff notes and assignment), support management (contact messages), course
  registration management, and admin-only user management — all under
  `/api/admin/*`, authenticated via Sanctum and authorized per-resource via Policies.

See `routes/api.php` for the full route list and the architecture document for the
schema, relationships, and the reasoning behind each design decision.

### Known gaps, called out explicitly rather than silently built around

- **No payment/transaction endpoints.** Building a fake gateway would repeat the exact
  anti-pattern the frontend audit flagged; real integration needs merchant credentials
  this session doesn't have. A quote request today is a structured request for a
  human-prepared quote — there is no server-computed cost estimate, since the approved
  `services` schema doesn't carry pricing.
- **No SPA-serving wiring.** `routes/web.php` returns a placeholder JSON response; the
  architecture's same-origin assumption (Laravel serving the built React SPA from
  `public/build`) is not yet wired up.
- **No outbound email/SMS.** Nothing in this backend sends notifications yet — the
  public forms' promises of "we'll email you" describe UI copy inherited from the old
  frontend, not something this API currently does.
