# Frontend ↔ Backend Integration Matrix

Written before any integration code changed, per the review process for this work.
Covers: frontend API service layer, backend routes, request/response formats,
validation responses, and authentication requirements.

## 1. Base mismatch

| | Old (frontend assumed) | New (Laravel backend) |
|---|---|---|
| Base | same-origin relative `/api/*`, served by Express | separate origin, `VITE_API_BASE_URL` (default `http://localhost:8000`) |
| Envelope | `{success, leads}` / `{success, lead}` / ad hoc per route | `{success, data}` always; errors `{success:false, message, errors?}` |
| Auth | none — "Admin Mode" is a client-side boolean | Sanctum cookie session; every `/api/admin/*` route requires login + a Policy |
| CSRF | none | required on every state-changing admin request |

## 2. Endpoint-by-endpoint

| Frontend component | Old call | New endpoint | Request shape change | Response shape change | Auth |
|---|---|---|---|---|---|
| `App.tsx` pillar cards | `BUSINESS_PILLARS` (mock) | `GET /api/solution-categories` | — | flatter; services carry a real `solution_category_id` instead of being nested free text | none |
| `App.tsx` customer problems | `CUSTOMER_PROBLEMS` (mock) | `GET /api/customer-problems` | — | `solution` → `solution_text`; `pillarId` → `category.slug` | none |
| `SolutionsHub.tsx` | `SOLUTIONS_DATA` (mock) | `GET /api/services`, `GET /api/services/{slug}` | — | leaner schema: no `problemStatement`, `whoItIsFor`, `keyBenefits`, `implementationProcess`, `relatedSolutions`, `relevantProjectIds`. Has `short_description`, `description`, `benefits[]`, `faqs[]`. | none |
| `ProjectPortfolio.tsx` | `PORTFOLIO_PROJECTS` (mock) | `GET /api/projects`, `GET /api/projects/{slug}` | — | added `category.name` (additive resource field, no schema change) alongside existing `category.slug` so the category filter keeps working | none |
| `TrainingAcademy.tsx` catalog | `COURSES` (mock) | `GET /api/courses`, `GET /api/courses/{slug}` | — | `price` string → `price.amount`/`price.currency`; `id` string → numeric id (needed as registration FK) | none |
| `Wizards.tsx` Consultation/Quote/Support | `POST /api/leads {type,data}` | `POST /api/inquiries {type, full_name, email, phone, organization, details, subject?, meta?}` | field renames; `meta.selected_services` must be real service slugs; **payment-deposit step dropped, no backend endpoint** | server-generated `reference` replaces the client-invented ticket number | none |
| `Wizards.tsx` TrainingRegistration | `POST /api/leads {type:"training"}` | `POST /api/course-registrations {course_id,...}` | needs numeric `course_id`, not a title string | different resource | none |
| `TrainingAcademy.tsx` inline registration | same | same | same | same | none |
| `TrainingAcademy.tsx` corporate form | `POST /api/leads {type:"training",corporate:true}` | **no matching type** → mapped to `POST /api/inquiries {type:"consultation", meta.problem_area:"Professional Training"}` | reuses the wizard's own existing "Professional Training" problem-area option | inquiry resource | none |
| `LeadPortal.tsx` client tracker | `GET /api/leads` (returned **everyone's** leads) | **removed** — no public list-all endpoint exists by design | replaced by single-reference lookup, `GET /api/inquiries/{reference}` | reference/type/status/created_at only | none, scoped to one ticket |
| `LeadPortal.tsx` admin mode | client-side boolean, no auth | `POST /api/admin/login`, `GET/PATCH /api/admin/inquiries`, `POST /api/admin/inquiries/{id}/notes` | needs a real login form (didn't exist) | full detail + notes + assignee | Sanctum session |
| *(no current UI)* | — | `contact_messages`, admin content CRUD, course-registration/contact-message admin views | out of scope — nothing to connect | — | admin |

## 3. Validation/error shapes

| Case | Backend | Frontend must show |
|---|---|---|
| 422 | `{errors:{field:[msgs]}}` | per-field messages |
| 401 | generic message | redirect to admin login |
| 403 | generic message | explicit "not allowed" |
| 404 | generic message | "not found" state |
| 429 | generic message | rate-limit message |
| 409 | generic message | admin content forms only |
| network failure | — | distinct from validation errors |

## Scope decisions

1. Payments dropped from the integrated wizards — no backend endpoint exists (deliberately deferred in Phase 3).
2. AI Assistant stays on the old Express server — never in backend scope.
3. `contact_messages` and full admin content-management screens have no existing frontend UI — not built here (would be new feature work, not integration).
4. `ProjectResource` gained one additive field (`category.name`) — no schema/migration change.
5. SolutionsHub's detail view drops sections the backend has no data for, replacing hand-picked cross-references with real relational equivalents where one exists (e.g. "related projects" → other projects in the same category).
