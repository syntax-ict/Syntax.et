# Syntax Technology — Official Business Website

The public website and client portal for **Syntax Technology**, covering integrated IT
infrastructure, security and smart systems, professional training, and business support
services across East Africa.

The app is a single-page React front end served by an Express back end. The same Node
process serves the API and, in development, proxies through Vite in middleware mode — so
there is one command, one port, and no CORS configuration to maintain.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [API reference](#api-reference)
- [Localization](#localization)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)
- [Further documentation](#further-documentation)

---

## Tech stack

| Layer         | Technology                                        |
| ------------- | ------------------------------------------------- |
| UI            | React 19, TypeScript 5.8 (strict), Tailwind CSS 4 |
| Icons/motion  | lucide-react, motion                              |
| Build         | Vite 6 (client), esbuild (server bundle)          |
| Server        | Express 4 on Node.js 22                           |
| AI            | Google Gemini via `@google/genai` (server-side)   |
| Quality gates | TypeScript project references, ESLint 9, Prettier |

## Getting started

**Prerequisites:** Node.js `>= 20.19` (the repo pins Node 22 in [`.nvmrc`](.nvmrc)) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    then set GEMINI_API_KEY if you want the AI Advisor to work

# 3. Start the dev server (API + Vite HMR on one port)
npm run dev
```

The app is served at <http://localhost:3000>.

The AI Advisor is the only feature that requires a key. Without `GEMINI_API_KEY` the rest
of the site — solutions, training, portfolio, wizards, lead tracker, and the payment
simulation — works normally, and the assistant surfaces a fallback message pointing
visitors at the consultation forms.

## Available scripts

| Script                  | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `npm run dev`           | Express + Vite dev server with HMR, restarting on server changes    |
| `npm run build`         | Build the client bundle and the bundled server (`dist/`)            |
| `npm start`             | Run the production build (`NODE_ENV=production node dist/server.cjs`) |
| `npm run typecheck`     | `tsc --build` across both TypeScript projects                      |
| `npm run lint`          | ESLint, failing on any warning                                     |
| `npm run lint:fix`      | ESLint with autofix                                                |
| `npm run format`        | Prettier write                                                     |
| `npm run format:check`  | Prettier check (used in CI)                                        |
| `npm run check`         | Typecheck + lint + format check — run this before pushing          |
| `npm run clean`         | Remove `dist/` and TypeScript build info                           |

## Environment variables

All variables are optional except where noted. See [`.env.example`](.env.example).

| Variable         | Required | Default                 | Description                                             |
| ---------------- | -------- | ----------------------- | ------------------------------------------------------- |
| `GEMINI_API_KEY` | For AI   | —                       | Google Gemini key used by `POST /api/assistant`          |
| `APP_URL`        | No       | `http://localhost:3000` | Public URL, for self-referential links                   |
| `PORT`           | No       | `3000`                  | HTTP port                                                |
| `HOST`           | No       | `0.0.0.0`               | Bind address                                             |
| `NODE_ENV`       | No       | `development`           | `production` serves `dist/` statically instead of Vite   |
| `DISABLE_HMR`    | No       | `false`                 | `true` disables Vite HMR and file watching               |

`.env` is git-ignored. Never commit real keys.

## Project structure

```
.
├── server.ts                  # Express API + Vite middleware / static hosting
├── index.html                 # SPA shell
├── vite.config.ts             # Client build, Tailwind plugin, `@` → src alias
├── Dockerfile                 # Multi-stage production image
├── docs/                      # Architecture and localization documentation
└── src/
    ├── main.tsx               # React entry, mounts LocalizationProvider
    ├── App.tsx                # Tab router, CTA panels, global notifications
    ├── types.ts               # Shared domain types (Lead, Course, Portfolio…)
    ├── data.ts                # Business pillars, courses, case studies
    ├── solutionsData.ts       # Solution datasheets and estimator specs
    ├── index.css              # Tailwind entry
    ├── components/            # Screens and UI (wizards, portal, academy…)
    ├── context/
    │   ├── localization-context.ts   # Context object and its type
    │   ├── LocalizationContext.tsx   # Provider (language, calendar, `t`)
    │   └── useLocalization.ts        # Consumer hook
    ├── lib/
    │   ├── localization.ts    # Translation dictionaries and formatters
    │   ├── payments.ts        # Payment abstraction over the server API
    │   └── errors.ts          # `getErrorMessage` for type-safe catch blocks
    └── utils/
        └── ethiopianCalendar.ts  # Gregorian ↔ Ethiopian date conversion
```

The `@` path alias resolves to `src/` in both Vite and TypeScript.

## API reference

All routes are served by `server.ts` under `/api`.

| Method  | Route                        | Description                                      |
| ------- | ---------------------------- | ------------------------------------------------ |
| `GET`   | `/api/health`                | Liveness probe, uptime, and Gemini configuration |
| `GET`   | `/api/leads`                 | List all leads and support tickets               |
| `POST`  | `/api/leads`                 | Create a lead (`{ type, data }`)                 |
| `PATCH` | `/api/leads/:id`             | Update a lead's `status` and/or `notes`          |
| `POST`  | `/api/payments/initialize`   | Open a transaction, returns a checkout URL       |
| `GET`   | `/api/payments/verify/:txRef`| Server-side authoritative status check           |
| `POST`  | `/api/assistant`             | Gemini-backed consultant (`{ messages }`)        |

## Localization

The site ships English, Amharic, Afaan Oromo, and Tigrinya, plus a Gregorian ↔ Ethiopian
calendar switch. Both preferences persist in `localStorage` and hot-swap without a reload;
timestamps are always stored in UTC/ISO and localized only at render time.

Consume translations through the hook, never the context directly:

```tsx
import { useLocalization } from "../context/useLocalization";

const { t, formatCurrency, formatLocalizedDate } = useLocalization();
```

Full architecture notes are in [`docs/LOCALIZATION_GUIDE.md`](docs/LOCALIZATION_GUIDE.md).

## Deployment

**Node**

```bash
npm ci
npm run build
NODE_ENV=production npm start
```

`npm run build` emits the client bundle to `dist/assets/` and the bundled server to
`dist/server.cjs`. In production the server hosts `dist/` statically with an SPA fallback,
so runtime dependencies are the only `node_modules` needed.

**Docker**

```bash
docker build -t syntax-et .
docker run --rm -p 3000:3000 --env-file .env syntax-et
```

The image is multi-stage, runs as the non-root `node` user, and health-checks
`/api/health`.

## Known limitations

These are deliberate properties of the current build, not defects — read them before
taking the app to production:

- **Leads and transactions are in-memory.** `server.ts` stores them in module-level
  arrays seeded with sample records, so all data resets on restart and does not survive
  more than one server instance. A database is required before real customer use.
- **Payments are simulated.** `/api/payments/*` models the Chapa / Telebirr / CBE Birr
  flow and marks transactions `PAID` on verification without contacting any gateway. No
  card data is collected or stored. Real gateway credentials and webhook verification must
  be wired in before taking payments.
- **The API is unauthenticated.** Any caller can read and mutate leads, including the
  ticket tracker. Add authentication before exposing the deployment publicly.
- **The Gemini model id in `server.ts` is not pinned to a verified model.** Confirm the
  model name against current Google AI documentation for your key before relying on the
  AI Advisor.

## Further documentation

- [`docs/BASELINE_REPORT.md`](docs/BASELINE_REPORT.md) — page and component inventory
- [`docs/LOCALIZATION_GUIDE.md`](docs/LOCALIZATION_GUIDE.md) — i18n and calendar architecture
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — workflow, conventions, and review checklist
