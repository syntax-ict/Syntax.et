# Syntax Technology - Internationalization (i18n) & Localization Architecture

This document outlines the robust, accessible, and high-performance translation and calendar localization framework developed for the **Syntax Technology** enterprise platform.

---

## 1. Architectural Highlights

The localization engine is designed as a modular, client-side, single-source-of-truth system that decouples corporate copy, regional parameters, and time systems from reusable interactive UI components.

- **Unified React Context Pattern**: Implements a centralized state provider managing active language, calendar systems, formatting protocols, and state persistence with `localStorage`.
- **Zero Page Disruption**: Allows dynamic hot-swapping of languages and calendar systems without force-reloading or state clearing.
- **Strict Accessibility (A11y)**: Combines standard ARIA specifications with custom keyboard-navigable overlays.
- **Canonical Data Integrity**: All system events and ticket timestamps remain stored in strict, authoritative UTC/ISO formats. The presentation layer performs on-the-fly parsing based on active localization choices.

---

## 2. Core Components & Subsystems

```
                                  [ App Entry ]
                                        │
                           ┌────────────▼────────────┐
                           │  LocalizationProvider   │
                           └──────┬──────────┬───────┘
                                  │          │
                 ┌────────────────▼─┐      ┌─▼────────────────┐
                 │ LanguageSelector │      │ CalendarSelector │
                 └──────────────────┘      └──────────────────┘
```

### A. Locale & Preference Provider (`LocalizationContext.tsx`)

Located at `/src/context/LocalizationContext.tsx`. This provider supplies variables and formatting utilities throughout the component tree.

- **State Management**: Persists options (`syntax_lang` and `syntax_calendar`) across sessions in `localStorage`.
- **Dynamic Crawler Sync**: Synchronizes the document's native language tags (`document.documentElement.lang`) dynamically for SEO scanners and screen readers.
- **Hierarchical Translation Engine (`t`)**: Resolves nested dictionary path strings (e.g., `solutions.problem` or `form.successTitle`).
- **Eng-Fallback Safety**: If a translation is missing or incomplete in a regional dialect, it gracefully falls back to the canonical English string.

### B. Keyboard-Navigable Language Selector (`LanguageSelector.tsx`)

Located at `/src/components/LanguageSelector.tsx`. This dropdown conforms to modern accessible interactive patterns:

- **ARIA Integration**: Utilizes explicit `aria-haspopup`, `aria-expanded`, and `aria-activedescendant` tags coupled with proper `role="listbox"` and `role="option"` elements.
- **Custom Keyboard Navigation Event Bus**:
  - `ArrowDown` & `ArrowUp`: Cycles through available options.
  - `Enter` & `Space`: Selects active language.
  - `Escape` & `Tab`: Closes the overlay safely.
- **Mobile Optimized**: Expanded hit targets (>44px height) prevent touch collision on portable displays.

### C. Reusable Calendar Selector (`CalendarSelector.tsx`)

Located at `/src/components/CalendarSelector.tsx`.

- **Hot Toggling**: Lets users switch between the standard Gregorian and native Ethiopian calendar systems with a single press.
- **Interactive Previews**: Displays real-time calculations of today's date in both styles to guide user expectations.

---

## 3. Formatting Utilities

All formatting utilities accept raw, canonical numbers, currencies, or dates and translate them dynamically based on user choices.

### A. Date Localization & Ethiopian Calendar Conversion

Located at `/src/lib/localization.ts` and `/src/utils/ethiopianCalendar.ts`.
The conversion algorithms map Julian days and leap cycles accurately, aligning Ethiopian calendar boundaries (including the 13th month, **Pagumen**) with Gregorian solar frames:

```typescript
// Sample Usage in Reusable Components
import { useLocalization } from "../context/LocalizationContext";

const { formatLocalizedDate } = useLocalization();

// Input: Standard JS Date Object (Canonical Date Data)
const ticketCreated = new Date("2026-08-30T12:00:00Z");

// Outputs:
// 1. Gregorian (EN): "Aug 30, 2026"
// 2. Ethiopian (AM): "ነሐሴ 24, 2018 🇪🇹"
return <span>{formatLocalizedDate(ticketCreated)}</span>;
```

### B. Currency & Numeric Layouts

Located at `/src/lib/localization.ts`.
Provides exact regional currency prefixing, symbol conversion, and locale decimal rules based on the user's interface setup:

```typescript
const { formatCurrency, formatNumber } = useLocalization();

// Numeric display based on current language rules (e.g. 10,250 vs 10 250)
const workstations = formatNumber(10250);

// Currency representation using East African parameters:
// English: "ብር 1,500.00" or "ETB 1,500.00"
// Amharic: "ብር 1,500.00"
const costEstimate = formatCurrency(1500);
```

---

## 4. Reusable Form & Validation Messages

All validation scripts, confirmation messages, and empty-state notifications are centralized inside the dictionaries to avoid hardcoding text inside input fields:

| Translation Path          | English (EN)                                   | Amharic (AM)                          | Afaan Oromo (OM)                                           | Tigrinya (TI)                            |
| :------------------------ | :--------------------------------------------- | :------------------------------------ | :--------------------------------------------------------- | :--------------------------------------- |
| `form.validationRequired` | "This field is required."                      | "ይህ ክፍል መሞላት አለበት።"                   | "Bakki kun dirqama guutamuu qaba."                         | "እዚ ቦታ እዚ ክምላእ ኣለዎ።"                     |
| `form.validationEmail`    | "Please enter a valid business email."         | "እባክዎ ትክክለኛ የስራ ኢሜይል ያስገቡ።"           | "Maaloo imeelii daldalaa sirrii ta'e galchaa."             | "በጃኹም ትክክለኛ ናይ ስራሕ ኢሜይል የእትዉ።"           |
| `form.validationPhone`    | "Please enter a valid phone number (+251...)." | "እባክዎ ትክክለኛ የስልክ ቁጥር ያስገቡ (+251...)።" | "Maaloo lakkoofsa bilbilaa sirrii ta'e galchaa (+251...)." | "በጃኹም ትክክለኛ ናይ ቴሌፎን ቁጽሪ የእትዉ (+251...)።" |
| `form.successTitle`       | "Form Submitted Successfully!"                 | "ቅጹ በተሳካ ሁኔታ ተልኳል!"                   | "Unkaan Milkiin Ergameera!"                                | "ቅጺ ብዓወት ተላኢኹ ኣሎ!"                       |

---

## 5. QA & Human Translation Review

> [!WARNING]
> To preserve corporate integrity and professional vocabulary across technical datasheets, machine-translated blocks of advanced IT syllabus items or specific network topologies are marked for review.

### Translation Quality Flags

Any terms requiring localized technical verification by regional field engineers are designated with trailing review comment markers or checked against the main **Syntax Technology Regional Glossaries**.
For future additions of technical specs, please refer to `/src/lib/localization.ts` dictionary mappings to expand standard keys rather than typing literal strings directly in the views.
