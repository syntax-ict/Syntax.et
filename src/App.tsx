import { useState } from "react";
import {
  Cpu,
  Shield,
  BookOpen,
  Briefcase,
  Network,
  Combine,
  Code2,
  Wrench,
  Camera,
  Fingerprint,
  MapPin,
  Layers,
  Timer,
  Users,
  GraduationCap,
  Printer,
  Megaphone,
  Laptop,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Phone,
  Mail,
  Award,
  Check,
  Settings,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  BarChart2,
  Building,
  HardDrive,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  listSolutionCategories,
  listCustomerProblems,
  listProjects,
  formatClientType,
} from "./lib/content";
import { useFetch } from "./hooks/useFetch";
import { Header } from "./components/Header";
import { AIAssistant } from "./components/AIAssistant";
import { LeadPortal } from "./components/LeadPortal";
import { InteractiveHelp } from "./components/InteractiveHelp";
import {
  ConsultationWizard,
  QuoteWizard,
  TrainingRegistration,
  SupportWizard,
} from "./components/Wizards";
import { SolutionsHub } from "./components/SolutionsHub";
import { TrainingAcademy } from "./components/TrainingAcademy";
import { ProjectPortfolio } from "./components/ProjectPortfolio";

// Helper component to render dynamic icons safely
const IconResolver = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
  const icons: Record<string, LucideIcon> = {
    Cpu,
    Shield,
    BookOpen,
    Briefcase,
    Network,
    Combine,
    Code2,
    Wrench,
    Camera,
    Fingerprint,
    MapPin,
    Layers,
    Timer,
    Users,
    GraduationCap,
    Printer,
    Megaphone,
    Laptop,
    HelpCircle,
  };
  const IconComponent = icons[name] || HelpCircle;
  return <IconComponent className={className} />;
};

export default function App() {
  const [activeTab, setActiveTab] = useState("solutions");
  const [activeWizard, setActiveWizard] = useState<
    "consultation" | "quote" | "training" | "support" | null
  >(null);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);
  const [viewSolutionsHub, setViewSolutionsHub] = useState(false);
  const [preselectedCourse, setPreselectedCourse] = useState("");
  const [lastReference, setLastReference] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  // Homepage content — fetched once on mount regardless of active tab, since
  // switching back to "solutions"/"problems" shouldn't re-trigger a request.
  const categoriesState = useFetch(listSolutionCategories, []);
  const projectsState = useFetch(listProjects, []);
  const customerProblemsState = useFetch(listCustomerProblems, []);

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Popup Notification for Leads feedback */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 flex items-start gap-3 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Database Action Synchronized
            </h5>
            <p className="text-xs text-slate-300 mt-1">{notificationMsg}</p>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold">
              Loaded in Inquiry Tracker tab
            </p>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tabId) => {
          setActiveTab(tabId);
          if (tabId === "solutions") {
            setSelectedSolutionId(null);
            setViewSolutionsHub(false);
          }
        }}
        onRequestConsultation={() => setActiveWizard("consultation")}
      />

      {/* Main Core Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Wizard Container Section if active */}
        {activeWizard && (
          <section
            id="wizard-portal"
            className="p-1.5 rounded-2xl bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 animate-fade-in relative"
          >
            <button
              onClick={() => setActiveWizard(null)}
              className="absolute top-4 right-4 z-10 px-3 py-1 bg-slate-900 text-white dark:bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-850 transition"
              title="Close Wizard"
            >
              Cancel Forms ✕
            </button>
            {activeWizard === "consultation" && (
              <ConsultationWizard
                onSuccess={(inquiry) => {
                  triggerNotification(
                    `Logged Consultation Request — Reference ${inquiry.reference}`,
                  );
                  setLastReference(inquiry.reference);
                  setActiveTab("tracker");
                }}
                onClose={() => setActiveWizard(null)}
              />
            )}
            {activeWizard === "quote" && (
              <QuoteWizard
                onSuccess={(inquiry) => {
                  triggerNotification(`Logged Estimate Quotation — Reference ${inquiry.reference}`);
                  setLastReference(inquiry.reference);
                  setActiveTab("tracker");
                }}
                onClose={() => setActiveWizard(null)}
              />
            )}
            {activeWizard === "training" && (
              <TrainingRegistration
                preselectedCourse={preselectedCourse}
                onSuccess={(registration) => {
                  triggerNotification(
                    `Registered for ${registration.course.title} — Registration #${registration.id}`,
                  );
                  setActiveTab("tracker");
                }}
                onClose={() => setActiveWizard(null)}
              />
            )}
            {activeWizard === "support" && (
              <SupportWizard
                onSuccess={(inquiry) => {
                  triggerNotification(`Logged Technical Support SLA ticket ${inquiry.reference}`);
                  setLastReference(inquiry.reference);
                  setActiveTab("tracker");
                }}
                onClose={() => setActiveWizard(null)}
              />
            )}
          </section>
        )}

        {/* Tab content view router */}
        <section id="tab-outlet" className="space-y-12 animate-fade-in">
          {/* SOLUTIONS / BUSINESS HOME TAB (Contains full premium homepage layout or detailed solutions hub) */}
          {activeTab === "solutions" &&
            (viewSolutionsHub || selectedSolutionId !== null ? (
              <SolutionsHub
                initialSolutionId={selectedSolutionId}
                onLaunchWizard={setActiveWizard}
                onNavigateToTab={(tabId) => {
                  setActiveTab(tabId);
                  setSelectedSolutionId(null);
                  setViewSolutionsHub(false);
                }}
                onBackToHome={() => {
                  setSelectedSolutionId(null);
                  setViewSolutionsHub(false);
                }}
              />
            ) : (
              <div className="space-y-16">
                {/* 2. Hero Section */}
                <section
                  id="hero-brand"
                  className="relative p-6 sm:p-12 rounded-3xl bg-slate-900 text-white overflow-hidden border border-slate-800 shadow-xl"
                >
                  {/* Subtle tech grid backdrop pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-15"></div>

                  <div className="relative max-w-4xl space-y-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5" />
                      <span>8 Years of High-Integrity Technical Delivery</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase">
                      Integrated Security, IT Infrastructure &{" "}
                      <span className="text-blue-400">Professional Academies</span>
                    </h1>

                    <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                      Syntax Technology builds robust, certified ICT and biometric ecosystems for
                      public administrations, growing B2B enterprises, and retail hubs. We align our
                      eight years of experience with your organization's physical and digital
                      security requirements.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveWizard("consultation")}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-blue-600/20"
                      >
                        Request a Consultation
                      </button>
                      <button
                        onClick={() => setViewSolutionsHub(true)}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-750 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                      >
                        Explore Solutions
                      </button>
                      <button
                        onClick={() => setActiveTab("assistant")}
                        className="px-6 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Consult Syntax AI
                      </button>
                    </div>
                  </div>
                </section>

                {/* 3. Trust and Experience Section (No fake stats) */}
                <section
                  id="trust-experience"
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 sm:p-8"
                >
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
                    <div className="pt-4 lg:pt-0">
                      <span className="block text-3xl font-black text-slate-950 dark:text-white leading-none">
                        8 Years
                      </span>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1.5">
                        Active Field Operations
                      </span>
                    </div>
                    <div className="pt-4 lg:pt-0">
                      <span className="block text-3xl font-black text-blue-600 dark:text-blue-400 leading-none">
                        100%
                      </span>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1.5">
                        Audited Project Timestamps
                      </span>
                    </div>
                    <div className="pt-4 lg:pt-0">
                      <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                        Certified
                      </span>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1.5">
                        Cabling & Hardware Engineers
                      </span>
                    </div>
                    <div className="pt-4 lg:pt-0">
                      <span className="block text-3xl font-black text-purple-600 dark:text-purple-400 leading-none">
                        Lab-Only
                      </span>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1.5">
                        Practical Course Syllabus
                      </span>
                    </div>
                  </div>
                </section>

                {/* 4. Interactive Solution Diagnostic Section */}
                <InteractiveHelp
                  onLaunchWizard={setActiveWizard}
                  onNavigateToTab={setActiveTab}
                  onPreselectCourse={setPreselectedCourse}
                  onSelectSolution={(id) => {
                    setSelectedSolutionId(id);
                    setViewSolutionsHub(true);
                  }}
                />

                {/* 5. Four Core Business Pillars */}
                <section id="core-business-pillars" className="space-y-8 scroll-mt-20">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
                      Syntax Portfolio
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      Our Four Business Pillars
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      We deliver complete end-to-end integration, uniting cabling, surveillance
                      devices, practical training, and physical brand promotion.
                    </p>
                  </div>

                  {categoriesState.status === "loading" && (
                    <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                      Loading business pillars…
                    </div>
                  )}

                  {categoriesState.status === "error" && (
                    <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-center space-y-1">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">
                        Couldn't load our business pillars.
                      </p>
                      <p className="text-[11px] text-red-500/80 dark:text-red-400/70">
                        {categoriesState.error.message}
                      </p>
                    </div>
                  )}

                  {categoriesState.status === "success" && categoriesState.data.length === 0 && (
                    <div className="py-12 text-center text-xs text-slate-400">
                      No business pillars are published yet.
                    </div>
                  )}

                  {categoriesState.status === "success" && categoriesState.data.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {categoriesState.data.map((category) => (
                        <div
                          key={category.slug}
                          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-800 transition"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2.5 rounded-xl ${category.color_theme.primary} shrink-0`}
                              >
                                <IconResolver name={category.icon} className="w-6 h-6" />
                              </div>
                              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                                {category.name}
                              </h3>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed italic">
                              {category.short_description}
                            </p>

                            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                              {category.detailed_description}
                            </p>

                            {/* Sub-services breakdown list */}
                            {category.services && category.services.length > 0 && (
                              <div className="space-y-3 pt-2">
                                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  Services Included:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {category.services.map((svc) => (
                                    <div
                                      key={svc.slug}
                                      onClick={() => {
                                        setSelectedSolutionId(svc.slug);
                                        setViewSolutionsHub(true);
                                      }}
                                      className="p-3 rounded-xl border space-y-1 transition bg-slate-50/90 hover:bg-slate-100 dark:bg-slate-950/40 dark:hover:bg-slate-900/60 cursor-pointer border-slate-150 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                                    >
                                      <div className="flex items-center justify-between gap-1.5">
                                        <span className="block text-xs font-bold text-slate-900 dark:text-white">
                                          {svc.name}
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                      </div>
                                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                                        {svc.short_description}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-[10px] text-slate-400 font-mono">
                              Pillar ID: {category.slug}
                            </span>
                            <div className="flex gap-2">
                              {category.slug === "professional-training" ? (
                                <button
                                  onClick={() => {
                                    setActiveTab("training");
                                  }}
                                  className="px-4 py-2 text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 rounded-lg hover:bg-purple-200 transition"
                                >
                                  Browse Courses
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveWizard("quote");
                                  }}
                                  className="px-4 py-2 text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition"
                                >
                                  Get Quote Estimate
                                </button>
                              )}
                              <button
                                onClick={() => setActiveWizard("consultation")}
                                className="px-4 py-2 text-xs font-bold bg-slate-900 text-white dark:bg-slate-800 rounded-lg hover:bg-slate-800 transition"
                              >
                                Consultation Request
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* 6. Featured Solutions (Outcome Focus) */}
                <section id="outcome-focus" className="space-y-8">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block font-mono">
                      Measurable Impact
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      Outcome-Driven Installations
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      We measure success based on active operational security and system stability,
                      not simply physical device delivery.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/30">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Active Audit Control
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Replacing unmonitored entry ways with unified biometric locks ensures 100%
                          attendance audit trails and blocks access to sensitive server rooms.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/30">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Zero-Friction WAN Speeds
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Re-routing degraded cables and deploying smart rack routing switches
                          overhauls corporate internet networks from constant dropping to seamless
                          gigabit performance.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/30">
                        <BarChart2 className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Practical Engineering Skill
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Technical students gain employment directly by terminating real copper
                          cabling and programming commercial NVR systems inside physical labs.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 7. Industries Served */}
                <section
                  id="industries-served"
                  className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-8 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
                  <div className="relative max-w-2xl space-y-2">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block font-mono">
                      Corporate Deployment
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                      Sectors Relying on Syntax
                    </h3>
                    <p className="text-xs text-slate-300">
                      We adapt our system cabling designs and security integrations to meet the
                      rigid compliance mandates of multiple target sectors.
                    </p>
                  </div>

                  <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="p-4 bg-slate-800/40 border border-slate-750 rounded-xl space-y-2">
                      <Building className="w-5 h-5 text-blue-400" />
                      <span className="block text-xs font-bold">Government Facilities</span>
                      <span className="block text-[10px] text-slate-400">
                        Secure entry zones, public sector administrative buildings.
                      </span>
                    </div>
                    <div className="p-4 bg-slate-800/40 border border-slate-750 rounded-xl space-y-2">
                      <Users className="w-5 h-5 text-emerald-400" />
                      <span className="block text-xs font-bold">HR & Enterprise Teams</span>
                      <span className="block text-[10px] text-slate-400">
                        Automated employee biometric scheduling & payroll clock logs.
                      </span>
                    </div>
                    <div className="p-4 bg-slate-800/40 border border-slate-750 rounded-xl space-y-2">
                      <HardDrive className="w-5 h-5 text-purple-400" />
                      <span className="block text-xs font-bold">IT Infrastructure Units</span>
                      <span className="block text-[10px] text-slate-400">
                        Structured data centers, server cabinets, fiber trunk terminations.
                      </span>
                    </div>
                    <div className="p-4 bg-slate-800/40 border border-slate-750 rounded-xl space-y-2">
                      <Smartphone className="w-5 h-5 text-amber-400" />
                      <span className="block text-xs font-bold">Retail & Showrooms</span>
                      <span className="block text-[10px] text-slate-400">
                        LED storefront signs, weatherproof outdoor advertising, and signboards.
                      </span>
                    </div>
                  </div>
                </section>

                {/* 8. Why Choose Syntax Technology */}
                <section
                  id="why-choose-syntax"
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-6 sm:p-10"
                >
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block font-mono">
                      Our Operational Ethos
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                      Uncompromising Technical Standards
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Unlike suppliers who simply ship boxes, Syntax Technology operates with
                      complete vertical integration. Our field engineers perform the physical
                      routing, cable labeling, device mounting, and central system configurations.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveWizard("consultation")}
                        className="px-5 py-2.5 bg-slate-900 text-white dark:bg-slate-850 hover:bg-slate-800 font-bold text-xs uppercase tracking-wider rounded-lg transition"
                      >
                        Book Technical Evaluation
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-8">
                    <div className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 dark:bg-blue-950/20">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                          Unified Deployments
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                          One contractor handles cabling, biometrics, software, and signage without
                          finger-pointing.
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 dark:bg-emerald-950/20">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                          Maintenance Response SLA
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                          Ongoing monthly support with pre-agreed technicians on site in cases of
                          signal loss.
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 dark:bg-purple-950/20">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                          Fully Documented Projects
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                          Every single switch, IP subnet, and cable termination point is cataloged
                          in hand-over manuals.
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 9. Featured Projects / Case Studies */}
                <section id="homepage-case-studies" className="space-y-8">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block font-mono">
                      Proven Deployments
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      Verified Case Histories
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Review Syntax Technology's historical field installations and validated client
                      outcomes across diverse sectors.
                    </p>
                  </div>

                  {projectsState.status === "loading" && (
                    <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                      Loading case histories…
                    </div>
                  )}

                  {projectsState.status === "error" && (
                    <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-center space-y-1">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">
                        Couldn't load our case histories.
                      </p>
                      <p className="text-[11px] text-red-500/80 dark:text-red-400/70">
                        {projectsState.error.message}
                      </p>
                    </div>
                  )}

                  {projectsState.status === "success" && projectsState.data.length === 0 && (
                    <div className="py-12 text-center text-xs text-slate-400">
                      No featured case histories are published yet.
                    </div>
                  )}

                  {projectsState.status === "success" && projectsState.data.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {projectsState.data.map((project) => (
                        <div
                          key={project.slug}
                          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-750 transition"
                        >
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {formatClientType(project.client_type)} Sector
                              </span>
                              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                                {project.title}
                              </h3>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                              {project.description}
                            </p>

                            {/* Delivered hardware / software array */}
                            <div className="space-y-2">
                              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                Installed Systems:
                              </span>
                              <div className="space-y-1.5">
                                {project.deliverables.map((del, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                                  >
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                                    <span>{del}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Audited metrics/results */}
                            <div className="p-3 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl space-y-1">
                              <span className="block text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                Audited Results:
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

                          <button
                            onClick={() => setActiveWizard("consultation")}
                            className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition"
                          >
                            Request Similar Deployment
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* 10. Bottom Strong Conversion CTA */}
                <section
                  id="strong-conversion-banner"
                  className="p-8 sm:p-12 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto space-y-6"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
                  <div className="relative max-w-2xl mx-auto space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                      Ready to Safeguard and Optimize Your Infrastructure?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Whether you need a full structured network overhaul, biometric gates, or
                      practical student lab training, Syntax Technology delivers certified, 8-year
                      field-proven solutions.
                    </p>
                  </div>

                  <div className="relative flex flex-wrap justify-center items-center gap-4">
                    <button
                      onClick={() => setActiveWizard("consultation")}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                    >
                      Schedule Direct Consultation
                    </button>
                    <button
                      onClick={() => setActiveWizard("quote")}
                      className="px-6 py-3 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-750 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                    >
                      Request Dynamic Hardware Quote
                    </button>
                  </div>
                </section>
              </div>
            ))}

          {/* CUSTOMER PROBLEMS DRILL-DOWN TAB */}
          {activeTab === "problems" && (
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
                  Diagnostic Hub
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Customer Problems We Resolve
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We address organizational bottlenecks before we construct systems. Explore our
                  standard resolution plans.
                </p>
              </div>

              {/* Problems Grid Layout */}
              {customerProblemsState.status === "loading" && (
                <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                  Loading customer problems…
                </div>
              )}

              {customerProblemsState.status === "error" && (
                <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-center space-y-1">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    Couldn't load our customer problems.
                  </p>
                  <p className="text-[11px] text-red-500/80 dark:text-red-400/70">
                    {customerProblemsState.error.message}
                  </p>
                </div>
              )}

              {customerProblemsState.status === "success" &&
                customerProblemsState.data.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No customer problems are published yet.
                  </div>
                )}

              {customerProblemsState.status === "success" &&
                customerProblemsState.data.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customerProblemsState.data.map((prob) => (
                      <div
                        key={prob.id}
                        className="bg-white dark:bg-slate-900 border-l-4 border-l-blue-600 border border-slate-100 dark:border-slate-800 p-6 rounded-r-xl space-y-4 shadow-xs"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                            {prob.target_user}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {prob.problem}
                          </h3>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="p-3 bg-red-50/50 dark:bg-red-950/20 rounded border border-red-100/50 dark:border-red-900/30 text-red-600 dark:text-red-450 space-y-1">
                            <span className="font-bold uppercase tracking-wider text-[9px] block">
                              Operational Impact:
                            </span>
                            <p className="leading-relaxed">{prob.impact}</p>
                          </div>

                          <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 rounded border border-emerald-100/30 dark:border-emerald-900/30 text-slate-600 dark:text-slate-350 space-y-1">
                            <span className="font-bold uppercase tracking-wider text-[9px] text-emerald-600 dark:text-emerald-400 block font-mono">
                              Syntax Integrated Solution:
                            </span>
                            <p className="leading-relaxed">{prob.solution}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Problem ID: {prob.id}
                          </span>
                          <button
                            onClick={() => {
                              setActiveWizard("consultation");
                            }}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            Resolve with Syntax <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* PROFESSIONAL TRAINING TAB */}
          {activeTab === "training" && (
            <TrainingAcademy
              initialCourseTitle={preselectedCourse}
              onLaunchWizard={setActiveWizard}
              onPreselectCourse={setPreselectedCourse}
            />
          )}

          {/* PROJECT PORTFOLIO TAB */}
          {activeTab === "portfolio" && (
            <ProjectPortfolio onLaunchConsultation={() => setActiveWizard("consultation")} />
          )}

          {/* AI ASSISTANT TAB */}
          {activeTab === "assistant" && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block font-mono">
                  Gemini-Powered
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Syntax AI Advisor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Formulate a customized technical blueprint. Speak in natural language about your
                  hardware, networking, or signboarding requests.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <AIAssistant />
              </div>
            </div>
          )}

          {/* LEAD TRACKER TAB */}
          {activeTab === "tracker" && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block font-mono">
                  Operational Sync
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Interactive Ticket & Lead Tracker
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Observe real-time lead and maintenance ticket ingestion. Simulate technician
                  dispatches or status shifts in Admin Mode.
                </p>
              </div>

              <div className="max-w-5xl mx-auto">
                <LeadPortal lastReference={lastReference} />
              </div>
            </div>
          )}
        </section>

        {/* Technical Support SLA Outage Dispatcher Card */}
        <section
          id="sla-support-footer"
          className="p-6 sm:p-8 bg-orange-50/30 dark:bg-orange-950/10 border border-orange-100/50 dark:border-orange-900/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Active SLA Support Outage Dispatcher
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
              Are you an existing SLA contract partner with an offline biometric reader, security
              signal loss, or routing failure? Log a high-priority ticket directly in the dispatcher
              dashboard. Active support technicians deploy immediately based on contract severity
              protocols.
            </p>
          </div>
          <button
            onClick={() => setActiveWizard("support")}
            className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shrink-0 transition shadow-sm shadow-orange-500/15"
          >
            File Emergency SLA Ticket
          </button>
        </section>
      </main>

      {/* Main Global Footer */}
      <footer
        id="global-footer"
        className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 mt-16 text-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="block text-sm font-black tracking-tight text-white uppercase">
              Syntax Technology
            </span>
            <p className="text-[11px] leading-relaxed">
              Integrated technology infrastructure, smart biometric surveillance systems, corporate
              training academies, and advanced printing business support.
            </p>
            <p className="text-[10px] text-slate-500">8 Years of Professional Integrity.</p>
          </div>
          <div className="space-y-3">
            <span className="block font-bold text-white uppercase text-[11px]">Primary CTAs</span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveWizard("consultation")}
                  className="hover:underline text-[11px] text-left"
                >
                  Request a Consultation (Core)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveWizard("quote")}
                  className="hover:underline text-[11px] text-left"
                >
                  Request a Quote (Estimate)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("training");
                  }}
                  className="hover:underline text-[11px] text-left"
                >
                  Browse Practical Academies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveWizard("support")}
                  className="hover:underline text-[11px] text-left"
                >
                  Request Technical Support
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="block font-bold text-white uppercase text-[11px]">
              Business Solutions
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("solutions");
                  }}
                  className="hover:underline text-left"
                >
                  IT Infrastructure & Networking
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("solutions");
                  }}
                  className="hover:underline text-left"
                >
                  CCTV Security & Biometrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("solutions");
                  }}
                  className="hover:underline text-left"
                >
                  Short-Term Technical Training
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("solutions");
                  }}
                  className="hover:underline text-left"
                >
                  Large-Format Branding & Print
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="block font-bold text-white uppercase text-[11px]">Office Contact</span>
            <div className="space-y-2 font-mono text-[11px]">
              <p className="flex items-center gap-1.5 font-bold text-slate-200">
                <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>+250 788 123 456</span>
              </p>
              <p className="flex items-center gap-1.5 font-bold text-slate-200">
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>info@syntaxtech.com</span>
              </p>
              <p className="text-[10px] text-slate-500">Main Boulevard Office Block, Suite 4B</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © 2026 Syntax Technology. All Rights Reserved. Designed to International Quality
            Standards.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("tracker")}
              className="hover:underline flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Diagnostic Portal</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
