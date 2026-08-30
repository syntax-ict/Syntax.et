# Contributing

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Node.js `>= 20.19` is required; [`.nvmrc`](.nvmrc) pins Node 22. If you use `nvm`, run
`nvm use`.

## Before you push

```bash
npm run check   # typecheck + lint + format check
npm run build   # confirm both bundles still build
```

CI runs exactly these, plus a production-server smoke test, on every pull request. A
change that does not pass locally will not pass there.

## Conventions

**TypeScript**

- Strict mode is on across both projects, and `noUnusedLocals` / `noUnusedParameters` are
  enforced. Delete dead code rather than commenting it out.
- `@typescript-eslint/no-explicit-any` is an error. Model the real shape instead, or use
  `unknown` and narrow.
- `catch` binds `unknown`. Use `getErrorMessage(error, fallback)` from `src/lib/errors.ts`
  rather than reaching for `error.message`.
- Type-only imports must use `import type` (`verbatimModuleSyntax` is on); `npm run
lint:fix` will rewrite them for you.

**React**

- Components are function components typed with `React.FC` where props exist.
- Keep static data (option lists, lookup maps) at module scope so it is not rebuilt each
  render and does not churn hook dependency arrays.
- Files under `src/context/` are split deliberately: the context object, the provider, and
  the hook each live in their own module so Fast Refresh keeps working. Import
  `useLocalization` from `src/context/useLocalization`.

**Styling**

- Tailwind CSS 4 utility classes, configured through the Vite plugin. There is no
  `tailwind.config.js`; `src/index.css` is the single entry point.
- Every screen supports light and dark mode — pair each `bg-*`/`text-*` with its `dark:`
  variant.

**Formatting**

Prettier is the source of truth (see [`.prettierrc.json`](.prettierrc.json)). Run
`npm run format` before committing, or enable format-on-save with the recommended VS Code
extensions in [`.vscode/extensions.json`](.vscode/extensions.json).

## Adding a translation string

1. Add the key to the `TranslationDictionary` interface in `src/lib/localization.ts`.
2. Add the value to **all four** dictionaries (`en`, `am`, `om`, `ti`). A missing key
   falls back to English, and then to the key path itself — silently, so the typecheck is
   your only guard.
3. Read it with `t("your.dotted.key")`.

See [`docs/LOCALIZATION_GUIDE.md`](docs/LOCALIZATION_GUIDE.md) for the full architecture.

## Adding an API route

Routes live in `server.ts`. Keep the client's view of them in `src/lib/` (as
`payments.ts` does) rather than calling `fetch` directly from components, and keep request
and response types in `src/types.ts` when they describe domain objects.

## Pull requests

- Branch from `main`, one logical change per PR.
- Fill in [the PR template](.github/pull_request_template.md); include before/after
  screenshots for UI changes.
- Never commit `.env`, API keys, or real customer data. The seed records in `server.ts`
  are fictional and must stay that way.
