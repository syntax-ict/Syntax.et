import React, { useState, useRef, useEffect } from "react";
import { Languages, ChevronDown, Check } from "lucide-react";
import { useLocalization } from "../context/useLocalization";
import type { Language } from "../lib/localization";

const LANGUAGES: { code: Language; label: string; nativeName: string }[] = [
  { code: "en", label: "English", nativeName: "English (EN)" },
  { code: "am", label: "Amharic", nativeName: "አማርኛ (አማ)" },
  { code: "om", label: "Afaan Oromo", nativeName: "Afaan Oromoo (OM)" },
  { code: "ti", label: "Tigrinya", nativeName: "ትግርኛ (ትግ)" },
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentLang = LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0];

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync active index with current selection when opened
  useEffect(() => {
    if (isOpen) {
      const idx = LANGUAGES.findIndex((lang) => lang.code === language);
      setActiveIndex(idx >= 0 ? idx : 0);
    } else {
      setActiveIndex(-1);
    }
  }, [isOpen, language]);

  // Handle focus when activeIndex changes
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex, isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % LANGUAGES.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + LANGUAGES.length) % LANGUAGES.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < LANGUAGES.length) {
          handleSelect(LANGUAGES[activeIndex].code);
        }
        break;
      case "Tab":
        // Allow default tab behavior to move focus, but close the dropdown
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="relative inline-block text-left"
      id="language-selector-wrapper"
    >
      <button
        ref={triggerRef}
        type="button"
        id="language-selector-trigger"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select Language. Current is ${currentLang.label}`}
        className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-slate-800 text-slate-100 hover:bg-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition"
      >
        <Languages className="w-3.5 h-3.5 text-slate-300" />
        <span className="uppercase">
          {currentLang.nativeName.split(" ")[1] || currentLang.nativeName}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          aria-activedescendant={
            activeIndex >= 0 ? `lang-option-${LANGUAGES[activeIndex].code}` : undefined
          }
          className="absolute right-0 mt-1.5 w-48 origin-top-right rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-[100] py-1 animate-fade-in"
        >
          {LANGUAGES.map((lang, index) => {
            const isSelected = language === lang.code;
            const isFocused = activeIndex === index;

            return (
              <button
                key={lang.code}
                id={`lang-option-${lang.code}`}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang.code)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full flex items-center justify-between text-left px-3 py-2 text-xs transition-colors rounded-none first:rounded-t-md last:rounded-b-md ${
                  isSelected
                    ? "bg-slate-50 dark:bg-slate-850/50 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-700 dark:text-slate-300"
                } ${
                  isFocused
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    : ""
                }`}
              >
                <span>{lang.nativeName}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
