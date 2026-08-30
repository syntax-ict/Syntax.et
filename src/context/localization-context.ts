import { createContext } from "react";
import type { CalendarType, Language } from "../lib/localization";

export interface LocalizationContextType {
  language: Language;
  calendar: CalendarType;
  setLanguage: (lang: Language) => void;
  setCalendar: (cal: CalendarType) => void;
  t: (path: string, variables?: Record<string, string | number>) => string;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  formatLocalizedDate: (date: Date | string) => string;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);
