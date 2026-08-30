import { useContext } from "react";
import { LocalizationContext } from "./localization-context";
import type { LocalizationContextType } from "./localization-context";

/** Access the active language, calendar, and formatting helpers. */
export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
};
