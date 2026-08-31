import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Language, 
  CalendarType, 
  TranslationDictionary, 
  DICTIONARIES, 
  formatCurrency as formatCurr, 
  formatNumber as formatNum, 
  formatLocalizedDate as formatDate 
} from "../lib/localization";

interface LocalizationContextType {
  language: Language;
  calendar: CalendarType;
  setLanguage: (lang: Language) => void;
  setCalendar: (cal: CalendarType) => void;
  t: (path: string, variables?: Record<string, string | number>) => string;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  formatLocalizedDate: (date: Date | string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

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

  // Helper function to resolve nested keys like 'nav.solutions' from dictionaries
  const t = (path: string, variables?: Record<string, string | number>): string => {
    const dict = DICTIONARIES[language] as any;
    const parts = path.split(".");
    
    let current = dict;
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        // Fallback to English dictionary if key is missing in active translation
        let fallback = DICTIONARIES["en"] as any;
        for (const fPart of parts) {
          if (fallback && typeof fallback === "object" && fPart in fallback) {
            fallback = fallback[fPart];
          } else {
            return path; // Return key path as final fallback
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== "string") {
      return path;
    }

    // Replace variables in format {variable_name}
    let translated = current;
    if (variables) {
      Object.entries(variables).forEach(([key, val]) => {
        translated = translated.replace(new RegExp(`{${key}}`, "g"), String(val));
      });
    }

    return translated;
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

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
};
