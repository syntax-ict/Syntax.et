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

Implemented so far — see the architecture document for the full plan:

- **Phase 1 — Foundation**: project scaffold, MySQL/MariaDB connection, Sanctum SPA
  cookie authentication (`/api/admin/login`, `/logout`, `/me`), the `admin`/`staff`
  role split with an `EnsureUserIsAdmin` middleware and a `Gate::before` admin bypass,
  login rate limiting, and the app-wide JSON error envelope (`bootstrap/app.php`).

Everything else (service categories, services, projects, courses, public inquiry
forms, admin content/lead/support management) follows in later phases.
