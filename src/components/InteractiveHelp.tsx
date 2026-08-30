import React, { useState } from "react";
import { Shield, Fingerprint, Cpu, BookOpen, Briefcase, CheckCircle, ArrowRight } from "lucide-react";

interface InteractiveHelpProps {
  onLaunchWizard: (type: "consultation" | "quote" | "training" | "support") => void;
  onNavigateToTab: (tabId: string) => void;
  onPreselectCourse: (courseTitle: string) => void;
  onSelectSolution?: (id: string) => void;
}

export const InteractiveHelp: React.FC<InteractiveHelpProps> = ({ 
  onLaunchWizard, 
  onNavigateToTab,
  onPreselectCourse,
  onSelectSolution
}) => {
  const [activeCategory, setActiveCategory] = useState<
    "security" | "attendance" | "it" | "skills" | "branding"
  >("security");

  const categories = [
    {
      id: "security" as const,
      icon: Shield,
      label: "Secure My Organization",
      description: "IP CCTV, commercial surveillance, and unified physical access logs.",
      color: "border-blue-500 text-blue-600 dark:text-blue-400"
    },
    {
      id: "attendance" as const,
      icon: Fingerprint,
      label: "Manage Workforce",
      description: "Eliminate payroll buddy punching with biometric terminals.",
      color: "border-emerald-500 text-emerald-600 dark:text-emerald-400"
    },
    {
      id: "it" as const,
      icon: Cpu,
      label: "Improve Technology",
      description: "Structured cabling, office LAN overhauls, and SLA support.",
      color: "border-blue-600 text-blue-600 dark:text-blue-400"
    },
    {
      id: "skills" as const,
      icon: BookOpen,
      label: "Improve Skills",
      description: "Practical certification academies with hands-on labs.",
      color: "border-purple-500 text-purple-600 dark:text-purple-400"
    },
    {
      id: "branding" as const,
      icon: Briefcase,
      label: "Promote My Business",
      description: "LED lightboxes, internal signs, and premium business print.",
      color: "border-amber-500 text-amber-600 dark:text-amber-400"
    }
  ];

  const recommendations = {
    security: {
      recommendedSystems: "Syntax Mega-Pixel IP Camera Array & Network Video Recorders (NVR)",
      timeframe: "3 - 7 Business Days Deployment",
      benefit: "Provides 100% video surveillance coverage of internal and perimeter zones with night-vision, automated motion alerts, and secure mobile feeds.",
      auditedFact: "Proven survival rate in heavy seasonal rains and high-fidelity incident video capturing.",
      ctaType: "quote" as const,
      ctaLabel: "Configure Security Camera Quote",
      relatedPillar: "security-smart"
    },
    attendance: {
      recommendedSystems: "Unified Face Recognition and Optical Fingerprint Access Gates",
      timeframe: "2 - 4 Business Days Deployment",
      benefit: "Eliminates employee time fraud and 'buddy punching'. Automatically aggregates clock-in data into a single CSV or database export for HR payroll engines.",
      auditedFact: "Saves medium enterprises up to 15% on manual payroll processing leakage.",
      ctaType: "consultation" as const,
      ctaLabel: "Schedule Biometric Consultation",
      relatedPillar: "security-smart"
    },
    it: {
      recommendedSystems: "Structured Cat6 Office Cabling, Switch Rackmounts, and Router Configurations",
      timeframe: "5 - 12 Business Days Overhaul",
      benefit: "Replaces slow, dropping network feeds with Gigabit capability. Provides secure WAN partitioning, professional rack management, and server cabinets.",
      auditedFact: "Backed by monthly preventive hardware maintenance and emergency on-site SLAs.",
      ctaType: "consultation" as const,
      ctaLabel: "Request Network Assessment",
      relatedPillar: "tech-solutions"
    },
    skills: {
      recommendedSystems: "CCTV Surveillance Design or Enterprise Networking Lab Academies",
      timeframe: "3 - 6 Weeks Hands-on Certification",
      benefit: "Direct physical lab training. You terminate real Cat6 cables, mount real IP cameras, and program magnetic locks—minimizing theory to maximize capability.",
      auditedFact: "Completed during flexible evening or morning shifts for busy cohorts.",
      ctaType: "training" as const,
      ctaLabel: "Open Training Academy Seats",
      courseName: "CCTV Surveillance Design & Biometric Integration",
      relatedPillar: "training"
    },
    branding: {
      recommendedSystems: "Storefront Weatherproof LED Lightboxes & Acrylic Logo Signage",
      timeframe: "4 - 8 Business Days Production",
      benefit: "Presents a premium physical presence for corporate headquarters or busy retail showrooms. Designed and constructed using durable commercial-grade materials.",
      auditedFact: "Color profiling matches absolute CMYK corporate vectors perfectly.",
      ctaType: "quote" as const,
      ctaLabel: "Get Signage & Printing Estimates",
      relatedPillar: "business-support"
    }
  };

  const currentRec = recommendations[activeCategory];

  const handleAction = () => {
    if (currentRec.ctaType === "training" && currentRec.courseName) {
      onPreselectCourse(currentRec.courseName);
      onLaunchWizard("training");
    } else {
      onLaunchWizard(currentRec.ctaType);
    }
  };

  return (
    <div id="interactive-diagnostic-panel" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
      
      <div className="space-y-2">
        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">Interactive Diagnostic Tool</span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">What do you need help with today?</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
          Select your organizational goal below. Our digital architect will instantly recommend the exact physical system configuration and conversion route.
        </p>
      </div>

      {/* Categories Horizontal Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-3.5 text-left border rounded-xl transition flex flex-col justify-between h-28 ${
                isSelected
                  ? `bg-slate-900 border-slate-900 text-white dark:bg-slate-800 dark:border-slate-800`
                  : "bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-950/40 dark:hover:bg-slate-900/60 border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? "text-blue-400" : "text-slate-500"}`} />
              <div className="space-y-0.5 mt-2">
                <span className="block text-xs font-bold leading-tight">{cat.label}</span>
                <span className="block text-[9px] text-slate-400 leading-snug line-clamp-1">{cat.description}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Unified Recommendation Panel */}
      <div className="p-5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/20 uppercase tracking-wide">
              Syntax Proposed Solution
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ⚡ Deployment: {currentRec.timeframe}
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-slate-950 dark:text-white leading-snug">
              {currentRec.recommendedSystems}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
              {currentRec.benefit}
            </p>
          </div>

          <div className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400/90 font-semibold bg-emerald-50/20 dark:bg-emerald-950/10 p-3 rounded-lg border border-emerald-100/30 dark:border-emerald-900/20">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span>
              <strong className="uppercase text-[9px] tracking-wide block text-emerald-800 dark:text-emerald-400">Real-World Audit Proof:</strong>
              {currentRec.auditedFact}
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 lg:border-l lg:border-slate-200/50 lg:dark:border-slate-800/50 lg:pl-6 space-y-3.5 flex flex-col justify-center">
          <button
            onClick={handleAction}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition shadow-sm shadow-blue-500/10 flex items-center justify-center gap-1.5"
          >
            <span>{currentRec.ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (activeCategory === "security" && onSelectSolution) {
                onSelectSolution("cctv-surveillance");
              } else if (activeCategory === "attendance" && onSelectSolution) {
                onSelectSolution("biometric-attendance");
              } else if (activeCategory === "it" && onSelectSolution) {
                onSelectSolution("networking");
              } else {
                onNavigateToTab(currentRec.relatedPillar === "training" ? "training" : "solutions");
              }
            }}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-xl transition"
          >
            View Technical Specs
          </button>
        </div>

      </div>

    </div>
  );
};
