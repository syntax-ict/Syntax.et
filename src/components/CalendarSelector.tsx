import React from "react";
import { useLocalization } from "../context/useLocalization";

export const CalendarSelector: React.FC = () => {
  const { calendar, setCalendar, formatLocalizedDate } = useLocalization();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, type: "gregorian" | "ethiopian") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCalendar(type);
    }
  };

  const todayStr = formatLocalizedDate(new Date());

  return (
    <div 
      id="calendar-selector-container" 
      className="flex items-center gap-1 bg-slate-800 dark:bg-slate-900 rounded-md p-0.5"
    >
      <button
        type="button"
        onClick={() => setCalendar("gregorian")}
        onKeyDown={(e) => handleKeyDown(e, "gregorian")}
        aria-pressed={calendar === "gregorian"}
        aria-label="Use Gregorian Calendar"
        title="Gregorian Calendar"
        className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all focus:outline-none focus:ring-1 focus:ring-blue-400 ${
          calendar === "gregorian"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Gregorian
      </button>
      <button
        type="button"
        onClick={() => setCalendar("ethiopian")}
        onKeyDown={(e) => handleKeyDown(e, "ethiopian")}
        aria-pressed={calendar === "ethiopian"}
        aria-label="Use Ethiopian Calendar"
        title={`Ethiopian Calendar. Today: ${todayStr}`}
        className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-blue-400 ${
          calendar === "ethiopian"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <span>🇪🇹</span>
        <span>Ethiopian</span>
      </button>
    </div>
  );
};
