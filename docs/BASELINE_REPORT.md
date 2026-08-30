# Syntax Technology — Phase 0 Application Baseline Report

**Timestamp**: 2026-08-30 (Local system time)  
**Author Account**: syntaxict101@gmail.com  
**Repository Branch**: `baseline` (Local checkout freeze)  
**Build Status**: Success (All linters passing clean)

---

## 1. Directory & File Manifest

The frozen codebase contains the following structure:

- **Root Configuration**:
  - `package.json` (Express server scripts, Gemini SDK v2.4.0, Tailwind v4.1.14, React 19, Vite 6, tsx dev server)
  - `server.ts` (Authoritative backend routes, Gemini interaction endpoint, payment integration)
  - `vite.config.ts` (Vite client bundling config)
  - `tsconfig.json` (Strict type safety guidelines)
  - `LOCALIZATION_GUIDE.md` (Detailed i18n & Ethiopian date integration docs)
- **Client-Side Source (`/src/`)**:
  - `main.tsx` (App entry)
  - `App.tsx` (Core tab router, main dashboard, CTA panels, global notifications)
  - `data.ts` (Authoritative structures for Pillars, Course Syllabi, and Case Studies)
  - `solutionsData.ts` (In-depth modular specs for core security and print systems)
  - `types.ts` (Global TypeScript interfaces for Leads, Payments, and Courses)
  - `index.css` (Tailwind import layer)
- **Client Components (`/src/components/`)**:
  - `Header.tsx` (Language/Calendar selectors, quick-actions navigation bar)
  - `LanguageSelector.tsx` (Keyboard-navigable listbox with strict ARIA spec attributes)
  - `CalendarSelector.tsx` (Hot-swapping interface displaying Ethiopian vs Gregorian calendars)
  - `SolutionsHub.tsx` (Full datasheet directory with step-by-step custom estimators)
  - `InteractiveHelp.tsx` (Troubleshooting assistant routing users directly to matching services)
  - `TrainingAcademy.tsx` (Lab syllabus viewer, enrollment selectors, curriculum info)
  - `ProjectPortfolio.tsx` (Verified case histories showcasing real physical deployments)
  - `Wizards.tsx` (Central repository for multi-step consultation, quotation, and support forms)
  - `AIAssistant.tsx` (Markdown-supported conversational AI window using server-side Gemini endpoints)
  - `LeadPortal.tsx` (Interactive inquiry tracking dashboard displaying live inputs)
  - `PaymentCheckout.tsx` (Localized invoice and secure digital receipt checkout flow)
- **Utilities (`/src/utils/` & `/src/lib/`)**:
  - `ethiopianCalendar.ts` (Julian day algorithm converting solar dates to Ethiopian year/months)
  - `localization.ts` (Dictionaries mapping Amharic, Afaan Oromo, Tigrinya, and English)
  - `payments.ts` (Authoritative payment configuration guidelines)

---

## 2. Page & Router Architecture

The application runs as an Express + Vite full-stack Single Page Application (SPA). Content is navigated using a robust state-driven tab router:

1. **Solutions Home (`activeTab === "solutions"`)**
   - Multi-column, modern brand layout.
   - Includes structural sections: Brand Hero, Operational Trust Indicators, Interactive Diagnostic helper, Custom Pillar cards (IT, Security, Training, Support), Outcome highlights, Industries served, and Case studies.
2. **Diagnostic Hub (`activeTab === "problems"`)**
   - Maps organizational bottlenecks to precise resolution scopes.
   - Connects customer pains (unregistered entries, network latency, dead zones) directly to custom installers.
3. **Training Academy (`activeTab === "training"`)**
   - Practical, laboratory-centric curriculum display.
   - Interactive course selectors linking to enrollment registry forms.
4. **Project Portfolio (`activeTab === "portfolio"`)**
   - Showcases verified corporate installations with specific hardware lines and real results.
5. **Syntax AI Advisor (`activeTab === "assistant"`)**
   - Context-aware conversational AI. Users discuss network overhauls or camera designs in plain natural language.
6. **Inquiry & Ticket Tracker (`activeTab === "tracker"`)**
   - Central dashboard showing incoming consult requests, dynamic quote details, and live maintenance tickets.
   - Supports changing ticket status and entering administrator notes in real-time.

---

## 3. Form & User Interaction Flow

Four distinct modal wizards (`/src/components/Wizards.tsx`) process incoming inquiries:

- **Consultation Request Wizard (`ConsultationWizard`)**: Collects organization, contact details, target project areas, and budgets.
- **Hardware Quote Estimate Wizard (`QuoteWizard`)**: Allows users to configure CCTV, Biometric, or Structured Cabling variables and displays immediate localized estimates.
- **Training Registry Form (`TrainingRegistration`)**: Collects course selections, attendee experience levels, and learning channels.
- **Emergency SLA Outage Ticket (`SupportWizard`)**: High-priority alert form collecting outage details, channel IDs, and device serials.

---

## 4. Auth & Authoritative Backend APIs

The Node.js Express backend (`server.ts`) handles critical operations securely, keeping API keys protected from the browser environment:

- `GET /api/leads`: Reads the in-memory array of lead tracking records.
- `POST /api/leads`: Appends a new user-submitted ticket and returns a simulated ID.
- `PATCH /api/leads/:id`: Modifies a lead record's progress status or adds administrator comments.
- `POST /api/payments/initialize`: Receives pricing parameters and registers authoritative pending transactions.
- `GET /api/payments/verify/:txRef`: Verifies purchase status for invoices.
- `POST /api/assistant`: Securely relays user messages to `gemini-3.7-flash` utilizing a robust corporate persona instruction block.

---

## 5. Mobile & Desktop Assessment

- **Responsive Layouts**: Fully responsive using Tailwind grid/flex containers. Text constraints set (`max-w-4xl`) to secure premium typographic readability.
- **Touch Targets**: Dropdowns, selectors, and CTA buttons are designed with clear touch padding (>44px height) to satisfy mobile finger tap boundaries.
- **Dual Calendar Sync**: Gregorian dates are cleanly converted into the Ethiopian solar frame across all components, updating in real-time when preferences are toggled in the header.

---

## 6. Verification & Build Integrity

- **Local Baseline Branch**: Created `baseline` pointing to the exact freeze state of the working application.
- **Typescript Compilation**: Ran `tsc --noEmit` yielding zero compilation or configuration conflicts.
- **Build Bundler Pipeline**: Runs Vite build outputs followed by backend esbuild packaging, outputting a highly optimized, fully bundled CJS production executable (`dist/server.cjs`).
