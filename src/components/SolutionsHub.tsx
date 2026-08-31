import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Award,
  HelpCircle as QuestionIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { listSolutionCategories, listProjects, getService, formatClientType } from "../lib/content";
import { useFetch } from "../hooks/useFetch";
import { IconResolver } from "./IconResolver";
import { useLocalization } from "../context/useLocalization";

interface SolutionsHubProps {
  onLaunchWizard: (type: "consultation" | "quote" | "training" | "support") => void;
  onNavigateToTab: (tabId: string) => void;
  initialSolutionId?: string | null;
  onBackToHome?: () => void;
}

export const SolutionsHub: React.FC<SolutionsHubProps> = ({
  onLaunchWizard,
  initialSolutionId = null,
  onBackToHome,
}) => {
  // "Solution id" here is a service slug — real backend services carry
  // their own slug directly, so no id-guessing is needed the way the old
  // mock-only mappedSolutionId hack in App.tsx used to require.
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSolutionId);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const { t } = useLocalization();

  const categoriesState = useFetch(listSolutionCategories, []);
  const projectsState = useFetch(listProjects, []);
  const serviceState = useFetch(
    () => (selectedSlug ? getService(selectedSlug) : Promise.resolve(null)),
    [selectedSlug],
  );

  // Sync if initialSolutionId prop changes
  useEffect(() => {
    if (initialSolutionId) {
      setSelectedSlug(initialSolutionId);
      const el = document.getElementById("solutions-hub-container");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [initialSolutionId]);

  const handleSelectSolution = (slug: string) => {
    setSelectedSlug(slug);
    setExpandedFaqIndex(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToOverview = () => {
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Every service across every category, each carrying its parent
  // category's slug/name/color — the public services list omits the
  // category relation on nested reads, so it's attached here instead.
  const allServices =
    categoriesState.status === "success"
      ? categoriesState.data.flatMap((category) =>
          (category.services ?? []).map((svc) => ({
            ...svc,
            categorySlug: category.slug,
            categoryName: category.name,
            categoryColor: category.color_theme,
          })),
        )
      : [];

  const filteredSolutions =
    activeFilter === "all"
      ? allServices
      : allServices.filter((svc) => svc.categorySlug === activeFilter);

  const activeSolution = serviceState.status === "success" ? serviceState.data : null;

  const activeCategory =
    categoriesState.status === "success"
      ? categoriesState.data.find((c) => c.slug === activeSolution?.category?.slug)
      : undefined;

  const relatedServices = (activeCategory?.services ?? []).filter(
    (svc) => svc.slug !== selectedSlug,
  );

  const relatedProjects =
    projectsState.status === "success" && activeSolution?.category
      ? projectsState.data
          .filter((p) => p.category?.slug === activeSolution.category?.slug)
          .slice(0, 3)
      : [];

  return (
    <div id="solutions-hub-container" className="space-y-10">
      {/* 1. SOLUTIONS OVERVIEW PAGE VIEW */}
      {!selectedSlug ? (
        <div className="space-y-12 animate-fade-in">
          {onBackToHome && (
            <div className="flex justify-start max-w-3xl mx-auto -mb-6">
              <button
                onClick={onBackToHome}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage Overview
              </button>
            </div>
          )}

          {/* Intro Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block font-mono">
              Systems Integration Blueprint
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
              {t("solutions.heading")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t("solutions.subheading")}
            </p>

            {/* Structured Category Filters */}
            {categoriesState.status === "success" && (
              <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                    activeFilter === "all"
                      ? "bg-slate-900 text-white dark:bg-slate-800"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-950 dark:border dark:border-slate-800 dark:text-slate-400"
                  }`}
                >
                  All Solutions ({allServices.length})
                </button>
                {categoriesState.data.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => setActiveFilter(category.slug)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                      activeFilter === category.slug
                        ? "bg-slate-900 text-white dark:bg-slate-800"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-950 dark:border dark:border-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {category.name} ({category.services?.length ?? 0})
                  </button>
                ))}
              </div>
            )}
          </div>

          {categoriesState.status === "loading" && (
            <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
              Loading solutions…
            </div>
          )}

          {categoriesState.status === "error" && (
            <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-center space-y-1">
              <p className="text-xs font-bold text-red-600 dark:text-red-400">
                Couldn't load our solutions catalog.
              </p>
              <p className="text-[11px] text-red-500/80 dark:text-red-400/70">
                {categoriesState.error.message}
              </p>
            </div>
          )}

          {categoriesState.status === "success" && filteredSolutions.length === 0 && (
            <div className="py-16 text-center text-xs text-slate-400">
              No solutions are published in this category yet.
            </div>
          )}

          {/* Solutions Card Grid */}
          {categoriesState.status === "success" && filteredSolutions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSolutions.map((sol) => (
                <div
                  key={sol.slug}
                  id={`sol-card-${sol.slug}`}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all group shadow-xs"
                >
                  <div className="space-y-5">
                    {/* Card Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${sol.categoryColor.primary} shrink-0`}>
                          <IconResolver name={sol.icon} className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white leading-tight uppercase tracking-tight">
                            {sol.name}
                          </h3>
                          <span className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                            {sol.categoryName}
                          </span>
                        </div>
                      </div>

                      <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 px-2 py-0.5 rounded-md">
                        Syntax Capable
                      </span>
                    </div>

                    {/* Short Intro */}
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic">
                      &ldquo;{sol.short_description}&rdquo;
                    </p>

                    {/* Benefits Preview */}
                    {sol.benefits.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                        {sol.benefits.slice(0, 2).map((benefit, idx) => (
                          <div
                            key={idx}
                            className="flex gap-2 items-center text-xs text-slate-700 dark:text-slate-300"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {sol.slug}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onLaunchWizard("consultation")}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] uppercase tracking-wider rounded-lg transition text-nowrap"
                      >
                        {t("solutions.requestConsult")}
                      </button>
                      <button
                        onClick={() => handleSelectSolution(sol.slug)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition shadow-sm flex items-center gap-1 text-nowrap"
                      >
                        <span>{t("solutions.specifications")}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Informative Banner */}
          <div className="p-6 bg-slate-900 text-slate-350 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Need an expert technical audit of your physical site?
              </h4>
              <p className="text-[11px] text-slate-400">
                Our field engineers travel to any facility to map camera lenses, structured network
                racks, and biometric lock doors.
              </p>
            </div>
            <button
              onClick={() => onLaunchWizard("consultation")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition shrink-0"
            >
              Request Engineering Site Visit
            </button>
          </div>
        </div>
      ) : (
        /* 2. INDIVIDUAL SOLUTION PAGE TEMPLATE VIEW */
        <div className="space-y-12 animate-fade-in">
          {/* Reusable Template Back Header Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
            <button
              onClick={handleBackToOverview}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("common.back")}</span>
            </button>

            {allServices.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">Quick Navigate:</span>
                <select
                  value={selectedSlug || ""}
                  onChange={(e) => handleSelectSolution(e.target.value)}
                  className="px-2.5 py-1 text-xs font-bold border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {allServices.map((sol) => (
                    <option key={sol.slug} value={sol.slug}>
                      {sol.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {serviceState.status === "loading" && (
            <div className="py-16 text-center text-xs text-slate-400 animate-pulse flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading solution specifications…
            </div>
          )}

          {serviceState.status === "error" && (
            <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-center space-y-1 flex flex-col items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p className="text-xs font-bold text-red-600 dark:text-red-400">
                Couldn't load this solution.
              </p>
              <p className="text-[11px] text-red-500/80 dark:text-red-400/70">
                {serviceState.error.message}
              </p>
            </div>
          )}

          {activeSolution && (
            <>
              {/* Dynamic Hero Area */}
              <section className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white relative overflow-hidden border border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-15"></div>

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-5">
                    <div className="flex items-center gap-2">
                      {activeSolution.category && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-widest font-mono">
                          {activeSolution.category.name}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-450 font-semibold">
                        • 8Y Field Certified
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-white">
                      {activeSolution.name}
                    </h1>

                    <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                      {activeSolution.short_description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => onLaunchWizard("consultation")}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-blue-500/10 text-nowrap"
                      >
                        {t("solutions.requestConsult")}
                      </button>
                      <button
                        onClick={() => onLaunchWizard("quote")}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 font-bold text-xs uppercase tracking-wider rounded-xl transition text-nowrap"
                      >
                        {t("solutions.requestQuote")}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-center">
                    <div className="p-8 rounded-full border border-slate-800/80 bg-slate-850/60 text-blue-400 animate-pulse">
                      <IconResolver name={activeSolution.icon} className="w-20 h-20" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Methodology */}
              <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 sm:p-8 space-y-4">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block font-mono">
                  Syntax Technology Integration
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight">
                  Our System Methodology
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                  {activeSolution.description}
                </p>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-850 flex items-start gap-3">
                  <Award className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Every installation follows strict technical procedures. Cables are fully
                    cataloged, nodes labeled, IP addresses documented, and physical testing verified
                    using professional network mapping equipment before handover.
                  </p>
                </div>
              </section>

              {/* Key Benefits Card Grid */}
              {activeSolution.benefits.length > 0 && (
                <section className="space-y-6">
                  <div className="text-center max-w-2xl mx-auto space-y-1">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
                      Quantifiable Advantages
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                      {t("solutions.benefits")}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {activeSolution.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/40 dark:text-blue-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-slate-950 dark:text-white leading-tight">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Relevant Projects Section — real projects in the same
                  category, replacing the old mock's hand-picked id list */}
              {relatedProjects.length > 0 && (
                <section className="space-y-6">
                  <div className="space-y-1 text-center max-w-2xl mx-auto">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block font-mono">
                      Proven Field Deployments
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {t("solutions.relevantProjects")}
                    </h3>
                  </div>

                  <div className="max-w-3xl mx-auto space-y-4">
                    {relatedProjects.map((project) => (
                      <div
                        key={project.slug}
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col md:flex-row gap-6 items-start"
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                              {formatClientType(project.client_type)} Sector
                            </span>
                          </div>
                          <h4 className="text-base font-extrabold text-slate-950 dark:text-white">
                            {project.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                            {project.description}
                          </p>

                          <div className="space-y-1 pt-1.5">
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Installed Systems:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {project.deliverables.map((del, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300"
                                >
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                                  <span>{del}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-72 shrink-0 p-4 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl space-y-2">
                          <span className="block text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                            Audited Operational Results:
                          </span>
                          <ul className="space-y-1 text-xs">
                            {project.results.map((res, idx) => (
                              <li
                                key={idx}
                                className="text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                              >
                                ✓ {res}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQ Accordion Grid */}
              {activeSolution.faqs && activeSolution.faqs.length > 0 && (
                <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block font-mono">
                      Direct Answers
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                      {t("solutions.faq")}
                    </h3>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {activeSolution.faqs.map((item, index) => {
                      const isExpanded = expandedFaqIndex === index;
                      return (
                        <div
                          key={index}
                          className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden transition-all bg-slate-50/50 dark:bg-slate-950/40"
                        >
                          <button
                            onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                            className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-950 dark:text-white transition hover:bg-slate-50 dark:hover:bg-slate-900"
                          >
                            <span className="flex items-center gap-2">
                              <QuestionIcon className="w-4 h-4 text-blue-500 shrink-0" />
                              {item.question}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-5 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850 animate-slide-down">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Related Solutions — other services in the same category,
                  replacing the old mock's hand-picked relatedSolutions list */}
              {relatedServices.length > 0 && (
                <section className="space-y-4 max-w-2xl mx-auto">
                  <span className="block text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Related Capabilities
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {relatedServices.map((related) => (
                      <button
                        key={related.slug}
                        onClick={() => handleSelectSolution(related.slug)}
                        className="px-3.5 py-2 text-[10px] font-bold border border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-750 bg-white dark:bg-slate-900 text-slate-750 dark:text-slate-350 rounded-xl transition flex items-center gap-1.5"
                      >
                        <IconResolver name={related.icon} className="w-3.5 h-3.5 text-blue-500" />
                        <span>{related.name}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Conversion CTA Component */}
              <section className="p-8 sm:p-10 bg-slate-900 text-white rounded-3xl border border-slate-800 relative overflow-hidden text-center max-w-4xl mx-auto space-y-6">
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>

                <div className="relative max-w-xl mx-auto space-y-3">
                  <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block font-mono">
                    Convert Outage to Performance
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                    Ready to Implement {activeSolution.name}?
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Connect with our certified field engineers. We will inspect your premises,
                    calculate node capacity, and draft a formal stamped proposal.
                  </p>
                </div>

                <div className="relative flex flex-wrap justify-center items-center gap-3">
                  <button
                    onClick={() => onLaunchWizard("consultation")}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-blue-500/10 text-nowrap"
                  >
                    {t("solutions.requestConsult")}
                  </button>
                  <button
                    onClick={() => onLaunchWizard("quote")}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 font-bold text-xs uppercase tracking-wider rounded-xl transition text-nowrap"
                  >
                    {t("solutions.requestQuote")}
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
};
