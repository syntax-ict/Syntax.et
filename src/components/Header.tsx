import React, { useState } from "react";
import { Terminal, Menu, X, PhoneCall } from "lucide-react";
import { useLocalization } from "../context/useLocalization";
import { LanguageSelector } from "./LanguageSelector";
import { CalendarSelector } from "./CalendarSelector";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRequestConsultation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onRequestConsultation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLocalization();

  const menuItems = [
    { id: "solutions", label: t("nav.solutions") },
    { id: "training", label: t("nav.training") },
    { id: "portfolio", label: t("nav.portfolio") },
    { id: "assistant", label: t("nav.aiConsultant") },
    { id: "tracker", label: t("nav.tickets") }
  ];

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 transition-all shadow-sm">
      {/* Top Localization bar */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t("hero.badge")}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Calendar Preference Selector */}
            <CalendarSelector />

            {/* Language Selector Desktop */}
            <div className="border-l border-slate-800 pl-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div 
            onClick={() => { setActiveTab("solutions"); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-base transition-all group-hover:bg-blue-600">
              <Terminal className="w-5 h-5 text-emerald-400 group-hover:text-white" />
            </div>
            <div>
              <span className="block text-sm font-black tracking-tight text-slate-950 dark:text-white uppercase">
                Syntax Technology
              </span>
              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest leading-none">
                {t("hero.experience")}
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {menuItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-slate-800"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a 
              href="tel:+251911234567" 
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>+251 911 234567</span>
            </a>
            <button
              onClick={onRequestConsultation}
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm shadow-blue-500/10 uppercase tracking-wider text-nowrap"
            >
              {t("hero.ctaConsultation")}
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onRequestConsultation}
              className="px-3 py-1.5 text-[10px] font-bold bg-blue-600 text-white rounded-md uppercase"
            >
              {t("common.submit")}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-950 bg-white dark:bg-slate-950 px-4 py-3 space-y-3 shadow-lg">
          {/* Quick Lang Switcher & Calendar Selector inside mobile drawer */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Language
            </span>
            <LanguageSelector />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Calendar system
            </span>
            <CalendarSelector />
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-slate-800"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-2.5">
            <a 
              href="tel:+251911234567"
              className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>+251 911 234567</span>
            </a>
            <button
              onClick={() => {
                onRequestConsultation();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg text-center uppercase tracking-wider"
            >
              {t("hero.ctaConsultation")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
