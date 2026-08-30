import React, { useState, useEffect } from "react";
import type { Language, CalendarType } from "../lib/localization";
import {
  DICTIONARIES,
  formatCurrency as formatCurr,
  formatNumber as formatNum,
  formatLocalizedDate as formatDate,
} from "../lib/localization";
import { LocalizationContext } from "./localization-context";

/** A translation dictionary is an arbitrarily nested tree of string leaves. */
type TranslationNode = string | { [key: string]: TranslationNode };

const DICTIONARY_TREE = DICTIONARIES as unknown as Record<Language, TranslationNode>;

/** Walks a dotted key path (e.g. `form.successTitle`) and returns the string leaf. */
function resolvePath(root: TranslationNode | undefined, parts: string[]): string | undefined {
  let current = root;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("syntax_lang");
    return (saved as Language) || "en";
  });

  const [calendar, setCalendarState] = useState<CalendarType>(() => {
    const saved = localStorage.getItem("syntax_calendar");
    return (saved as CalendarType) || "gregorian";
  });

  useEffect(() => {
    localStorage.setItem("syntax_lang", language);
    // Dynamically set HTML lang attribute for screen readers & localization crawlers
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
  }, [language]);

  useEffect(() => {
    localStorage.setItem("syntax_calendar", calendar);
  }, [calendar]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCalendar = (cal: CalendarType) => {
    setCalendarState(cal);
  };

  // Resolves nested keys like 'nav.solutions', falling back to English when a
  // regional dictionary is missing the key, and finally to the key path itself.
  const t = (path: string, variables?: Record<string, string | number>): string => {
    const parts = path.split(".");
    const translated =
      resolvePath(DICTIONARY_TREE[language], parts) ?? resolvePath(DICTIONARY_TREE.en, parts);

    if (translated === undefined) {
      return path;
    }

    if (!variables) {
      return translated;
    }

    // Replace variables in format {variable_name}
    return Object.entries(variables).reduce(
      (acc, [key, val]) => acc.replace(new RegExp(`{${key}}`, "g"), String(val)),
      translated,
    );
  };

  const formatCurrency = (amount: number): string => {
    return formatCurr(amount, language);
  };

  const formatNumber = (num: number): string => {
    return formatNum(num, language);
  };

  const formatLocalizedDate = (date: Date | string): string => {
    return formatDate(date, calendar, language);
  };

  return (
    <LocalizationContext.Provider
      value={{
        language,
        calendar,
        setLanguage,
        setCalendar,
        t,
        formatCurrency,
        formatNumber,
        formatLocalizedDate,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};
