import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, Search, Award, Clock, MapPin, Calendar, Users, 
  CheckCircle2, ArrowLeft, Building2, Sparkles, Shield, GraduationCap, TrendingUp, Send, Check, Briefcase, 
  Wifi, Cpu, AlertCircle, HelpCircle, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocalization } from "../context/useLocalization";
import { getErrorMessage } from "../lib/errors";
import type { Course } from "../types";
import { COURSES } from "../data";

interface TrainingAcademyProps {
  initialCourseTitle?: string;
  onLaunchWizard: (type: "consultation" | "quote" | "training" | "support") => void;
  onPreselectCourse: (courseTitle: string) => void;
}

export const TrainingAcademy: React.FC<TrainingAcademyProps> = ({
  initialCourseTitle = "",
  onLaunchWizard,
  onPreselectCourse
}) => {
  const { t } = useLocalization();
  // Navigation views: "overview" | "detail" | "corporate" | "register"
  const [currentView, setCurrentView] = useState<"overview" | "detail" | "corporate" | "register">("overview");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  // Registration states
  const [registeringCourseId, setRegisteringCourseId] = useState<string>("");
  const [submittingReg, setSubmittingReg] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");
  const [regFormData, setRegFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    courseTitle: "",
    trainingType: "Face-to-face training",
    experience: "Beginner (No technical background)",
    goals: ""
  });

  // Corporate request state
  const [submittingCorp, setSubmittingCorp] = useState(false);
  const [corpSuccess, setCorpSuccess] = useState(false);
  const [corpError, setCorpError] = useState("");
  const [corpFormData, setCorpFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    cohortSize: "5-10 participants",
    preferredTimeline: "Within 30 days",
    courseInterest: "CCTV Surveillance Design & Biometric Integration",
    customSpecs: "",
    locationPreference: "On-site at our premises"
  });

  // Initial deep link / preselection handling
  useEffect(() => {
    if (initialCourseTitle) {
      const match = COURSES.find(c => c.title.toLowerCase().includes(initialCourseTitle.toLowerCase()));
      if (match) {
        setSelectedCourseId(match.id);
        setCurrentView("detail");
        setRegisteringCourseId(match.id);
        setRegFormData(prev => ({ ...prev, courseTitle: match.title, trainingType: match.mode }));
      }
    }
  }, [initialCourseTitle]);

  // Available categories extracted from data
  const categories = useMemo(() => {
    const list = new Set<string>();
    COURSES.forEach(c => {
      if (c.category) list.add(c.category);
    });
    return ["all", ...Array.from(list)];
  }, []);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.skillsGained.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      const matchesMode = selectedMode === "all" || course.mode === selectedMode;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesMode && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedMode, selectedLevel]);

  // Selected Course Object
  const selectedCourse = useMemo(() => {
    return COURSES.find(c => c.id === selectedCourseId) || null;
  }, [selectedCourseId]);

  // Handle viewing a course
  const handleViewCourseDetail = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView("detail");
    const courseObj = COURSES.find(c => c.id === courseId);
    if (courseObj) {
      setRegisteringCourseId(courseObj.id);
      setRegFormData(prev => ({
        ...prev,
        courseTitle: courseObj.title,
        trainingType: courseObj.mode
      }));
    }
    // Scroll to section start
    const container = document.getElementById("training-academy-root");
    if (container) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle direct enrollment navigation
  const handleInitiateEnrollment = (course: Course) => {
    setRegisteringCourseId(course.id);
    setRegFormData(prev => ({
      ...prev,
      courseTitle: course.title,
      trainingType: course.mode
    }));
    setRegSuccess(false);
    setRegError("");
    setCurrentView("register");
    
    // Scroll to section start
    const container = document.getElementById("training-academy-root");
    if (container) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Submit Student Registration Form
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReg(true);
    setRegError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "training",
          data: {
            ...regFormData,
            submissionDate: new Date().toISOString(),
            selectedCourseId: registeringCourseId
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setRegSuccess(true);
        // Sync with primary App.tsx wizard callback when successful
        onPreselectCourse(regFormData.courseTitle);
      } else {
        throw new Error(result.error || "Failed to submit course registration.");
      }
    } catch (err) {
      setRegError(getErrorMessage(err, "Something went wrong registering for the training."));
    } finally {
      setSubmittingReg(false);
    }
  };

  // Submit Corporate Training Form
  const handleCorporateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCorp(true);
    setCorpError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "training",
          data: {
            ...corpFormData,
            corporate: true,
            submissionDate: new Date().toISOString()
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setCorpSuccess(true);
      } else {
        throw new Error(result.error || "Failed to submit corporate request.");
      }
    } catch (err) {
      setCorpError(getErrorMessage(err, "Something went wrong registering corporate interest."));
    } finally {
      setSubmittingCorp(false);
    }
  };

  // Helper for delivery indicators
  const getDeliveryBadge = (mode: string) => {
    switch (mode) {
      case "Face-to-face training":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Physical Lab Suite (Kigali)
          </span>
        );
      case "Online training":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
            <Wifi className="w-3 h-3" />
            Online / Hybrid Simulator
          </span>
        );
      case "Corporate training":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900">
            <Building2 className="w-3 h-3" />
            Corporate Cohort (On-Premise)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="training-academy-root" className="space-y-12">
      
      {/* 1. Header Banner & Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block font-mono">Hands-on Academy Hub</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {t("training.heading")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mt-1">
            {t("training.subheading")}
          </p>
        </div>
        
        {/* Navigation Tabs for Hub */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl self-start md:self-center">
          <button
            onClick={() => { setCurrentView("overview"); setSelectedCourseId(null); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              currentView === "overview" || currentView === "detail"
                ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => { setCurrentView("corporate"); setSelectedCourseId(null); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              currentView === "corporate"
                ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Corporate Solutions
          </button>
          <button
            onClick={() => { setCurrentView("register"); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              currentView === "register"
                ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Enroll Online
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW A: OVERVIEW PAGE & COURSE LISTINGS */}
        {currentView === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Value Propositions Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-900/30 rounded-2xl flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Physical Hardware Labs</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Configure actual optical fiber switches, CCTV networks, and Suprema biometric locks.</p>
                </div>
              </div>

              <div className="p-5 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">8Y Verified Instructors</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Courses designed and led by active deployment engineers with international security badges.</p>
                </div>
              </div>

              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Accredited Credentials</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Syntax Technology certificates are recognized across corporate security and telecom contractors.</p>
                </div>
              </div>

              <div className="p-5 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/30 rounded-2xl flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">Direct Career Routing</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">High-performing graduates are directly routed to Syntax deployment sub-contracting pools.</p>
                </div>
              </div>
            </div>

            {/* Advanced Discovery & Filter Engine */}
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses by topic, syllabus module or skill..."
                    className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  {/* Category Filter */}
                  <div className="space-y-1 w-full sm:w-auto">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full sm:w-auto px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.filter(c => c !== "all").map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mode Filter */}
                  <div className="space-y-1 w-full sm:w-auto">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Delivery Mode</span>
                    <select
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      className="w-full sm:w-auto px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Modes</option>
                      <option value="Face-to-face training">Face-to-Face Labs</option>
                      <option value="Online training">Online & Simulator</option>
                      <option value="Corporate training">Corporate On-Demand</option>
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div className="space-y-1 w-full sm:w-auto">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Skill Level</span>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full sm:w-auto px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Quick info feedback */}
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Showing <strong className="text-slate-900 dark:text-white">{filteredCourses.length}</strong> available courses</span>
                {(searchQuery || selectedCategory !== "all" || selectedMode !== "all" || selectedLevel !== "all") && (
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedMode("all"); setSelectedLevel("all"); }}
                    className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id}
                  className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition duration-350 relative overflow-hidden group"
                >
                  <div className="space-y-4">
                    
                    {/* Delivery Indicators & Top Bar */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                        {course.level}
                      </span>
                      {getDeliveryBadge(course.mode)}
                    </div>

                    {/* Category Label */}
                    <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase tracking-wider">{course.category || "General Technology"}</span>

                    {/* Course Title */}
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                      {course.title}
                    </h3>

                    {/* Quick overview */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Metadata strip */}
                    <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-slate-100 dark:border-slate-900 text-xs">
                      <div className="space-y-0.5">
                        <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">Duration</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.duration}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">Investment</span>
                        <span className="font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-purple-500" /> {course.price || "Custom Quote"}
                        </span>
                      </div>
                    </div>

                    {/* High-impact sample modules */}
                    <div className="space-y-1.5 pt-1">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Practical Skills Gained:</span>
                      <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {course.skillsGained.slice(0, 3).map((skill, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  <div className="pt-6 grid grid-cols-2 gap-3 mt-6 border-t border-slate-50 dark:border-slate-900">
                    <button
                      onClick={() => handleViewCourseDetail(course.id)}
                      className="w-full py-2.5 bg-slate-550 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-250 font-bold text-[10px] uppercase tracking-wider rounded-xl transition text-center"
                    >
                      View Specs
                    </button>
                    <button
                      onClick={() => handleInitiateEnrollment(course)}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition text-center shadow-md shadow-purple-500/10"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Zero results placeholder */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl max-w-xl mx-auto space-y-4">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">No Matching Courses Found</h4>
                  <p className="text-xs text-slate-500">We couldn't find any courses matching your search query or filter combination.</p>
                </div>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedMode("all"); setSelectedLevel("all"); }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
                >
                  Reset Filter Parameters
                </button>
              </div>
            )}

            {/* Bottom Section - Corporate CTA Card */}
            <div className="p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
              <div className="relative space-y-3 max-w-xl">
                <span className="inline-flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                  <Building2 className="w-3 h-3" /> Dedicated Corporate SLA Training
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Need custom-designed group cohorts for your technical teams?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We custom configure curricula specifically around your deployed workplace assets. We deliver direct hands-on testing tools, structured laboratory kits, and on-premises instruction for 5+ staff members.
                </p>
              </div>
              
              <div className="relative shrink-0 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setCurrentView("corporate")}
                  className="px-5 py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition shadow-lg"
                >
                  Request Corporate Training
                </button>
                <button
                  onClick={() => onLaunchWizard("consultation")}
                  className="px-5 py-3 bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-700 transition"
                >
                  Consult an Advisor
                </button>
              </div>
            </div>

          </motion.div>
        )}

        {/* VIEW B: COURSE DETAIL PAGE */}
        {currentView === "detail" && selectedCourse && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            {/* Back Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setCurrentView("overview"); setSelectedCourseId(null); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 px-3.5 py-2 rounded-xl transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Course Discovery
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-400">Course Reference: {selectedCourse.id}</span>
            </div>

            {/* Course Hero Layout (High Fidelity) */}
            <div className="p-6 sm:p-10 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
              
              <div className="relative max-w-4xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono uppercase tracking-wider">
                    {selectedCourse.category || "General"}
                  </span>
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono uppercase tracking-wider">
                    {selectedCourse.level}
                  </span>
                  {getDeliveryBadge(selectedCourse.mode)}
                </div>

                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
                  {selectedCourse.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {selectedCourse.description}
                </p>

                {/* Top quick-meta bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs max-w-3xl">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">Academy Duration</span>
                    <span className="font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-purple-400 shrink-0" /> {selectedCourse.duration}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">Investment (Fee)</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" /> {selectedCourse.price || "Contact for pricing"}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">Upcoming Intake Schedule</span>
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-4 h-4 text-amber-400 shrink-0" /> {selectedCourse.schedule || "Register to view custom schedules"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Conversion Buttons inside Hero */}
              <div className="relative pt-4 flex flex-wrap gap-3 border-t border-slate-800">
                <button
                  onClick={() => handleInitiateEnrollment(selectedCourse)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-purple-500/20"
                >
                  Enroll / Register Interest
                </button>
                {selectedCourse.mode === "Corporate training" || selectedCourse.price?.includes("Custom") ? (
                  <button
                    onClick={() => setCurrentView("corporate")}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    Request Corporate Training
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCorpFormData(prev => ({ ...prev, courseInterest: selectedCourse.title }));
                      setCurrentView("corporate");
                    }}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    Request Group Discount
                  </button>
                )}
              </div>
            </div>

            {/* Spec Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Columns: Core Syllabus and Course modules */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Target Audience */}
                <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" /> Target Audience (Who Is This For?)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {selectedCourse.targetAudience?.map((aud, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{aud}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Structured Syllabus & Practical Content */}
                <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-500" /> Course Content & Lab Modules
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-md uppercase">Lab-centric</span>
                  </div>

                  {selectedCourse.modules ? (
                    <div className="space-y-4">
                      {selectedCourse.modules.map((mod, idx) => (
                        <div key={idx} className="border border-slate-100 dark:border-slate-850 rounded-xl overflow-hidden">
                          <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{mod.title}</span>
                            <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 font-bold">Lab Phase {idx + 1}</span>
                          </div>
                          <ul className="p-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-450 bg-white dark:bg-slate-950">
                            {mod.topics.map((topic, tidx) => (
                              <li key={tidx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                                <span className="leading-relaxed">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedCourse.syllabus.map((syl, idx) => (
                        <div key={idx} className="p-3 bg-slate-550/20 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-850 flex items-start gap-3">
                          <span className="w-5 h-5 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">{idx + 1}</span>
                          <span className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed mt-0.5">{syl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Physical Location, Requirements, Pricing, and CTAs */}
              <div className="space-y-8">
                
                {/* Delivery details card */}
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Logistical Specifications</h4>
                  
                  <div className="space-y-4 text-xs">
                    
                    {/* Location detail */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-lg mt-0.5 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white">Physical Labs / Venue</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-1">
                          {selectedCourse.location || "Online via remote virtual server desktop access"}
                        </p>
                      </div>
                    </div>

                    {/* Delivery schedule */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg mt-0.5 shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white">Timings & Schedule</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-1">
                          {selectedCourse.schedule || "Tailored group intervals available"}
                        </p>
                      </div>
                    </div>

                    {/* Practical Prerequisites */}
                    <div className="flex items-start gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg mt-0.5 shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white">Required Prior Specs</span>
                        <ul className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 space-y-1 list-disc pl-4">
                          {selectedCourse.requirements?.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Skills Gained Section */}
                <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Career Resume Skills Gained
                  </h4>
                  <div className="space-y-2">
                    {selectedCourse.skillsGained.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Instant registration Trigger */}
                <div className="p-6 bg-purple-600 text-white rounded-2xl text-center space-y-4">
                  <GraduationCap className="w-10 h-10 mx-auto opacity-90" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-tight">Reserve Seat Instantly</h4>
                    <p className="text-[11px] text-purple-100">Only 12 seats per lab cohort to guarantee dedicated instructor-to-student workspace access.</p>
                  </div>
                  <button
                    onClick={() => handleInitiateEnrollment(selectedCourse)}
                    className="w-full py-2.5 bg-white text-purple-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition shadow-md"
                  >
                    Start Online Application
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom Form Integration directly on page to reduce steps */}
            <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 max-w-4xl mx-auto">
              <div className="text-center space-y-1.5">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold uppercase tracking-wider">Quick Application Form</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Register Interest / Apply for {selectedCourse.title}</h3>
                <p className="text-xs text-slate-500 max-w-xl mx-auto">Complete this simple intake form to register your details. An advisor will contact you with fee invoices and lab schedules.</p>
              </div>

              {regSuccess ? (
                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-center rounded-2xl max-w-lg mx-auto space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Admission Request Submitted!</h4>
                    <p className="text-xs text-slate-500 mt-1">We have queued your training application into our student registry system. Please check your inbox shortly for curriculum details and lab credentials.</p>
                  </div>
                  <button
                    onClick={() => setRegSuccess(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 max-w-3xl mx-auto">
                  {regError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/35 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {regError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={regFormData.name}
                        onChange={(e) => setRegFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. John Doe"
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Organization / Employer (Optional)</label>
                      <input
                        type="text"
                        value={regFormData.organization}
                        onChange={(e) => setRegFormData(p => ({ ...p, organization: e.target.value }))}
                        placeholder="e.g. Self or Corporate Ltd"
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={regFormData.email}
                        onChange={(e) => setRegFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Active Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={regFormData.phone}
                        onChange={(e) => setRegFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="e.g. +250 788 123 456"
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Training Mode *</label>
                      <select
                        value={regFormData.trainingType}
                        onChange={(e) => setRegFormData(p => ({ ...p, trainingType: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Face-to-face training">Face-to-Face Physical Labs</option>
                        <option value="Online training">Online Simulators & Hybrid</option>
                        <option value="Corporate training">Corporate Team Cohort</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Current Tech Experience *</label>
                      <select
                        value={regFormData.experience}
                        onChange={(e) => setRegFormData(p => ({ ...p, experience: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Beginner (No technical background)">Beginner (No technical background)</option>
                        <option value="Intermediate (Some IT or security experience)">Intermediate (Some IT or security experience)</option>
                        <option value="Advanced (Working network technician/installer)">Advanced (Working network technician/installer)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Specific Career or Business Goals</label>
                    <textarea
                      value={regFormData.goals}
                      onChange={(e) => setRegFormData(p => ({ ...p, goals: e.target.value }))}
                      rows={3}
                      placeholder="e.g. Looking to design secure CCTV loops for private clients / Upgrading organization staff skills..."
                      className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReg}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/15"
                  >
                    {submittingReg ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Loggin Registry System...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Enroll / Register Interest
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </motion.div>
        )}

        {/* VIEW C: CORPORATE TRAINING PAGE */}
        {currentView === "corporate" && (
          <motion.div
            key="corporate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Corporate Value Proposition Hero */}
            <div className="p-8 sm:p-12 bg-slate-900 text-white rounded-3xl border border-slate-800 relative overflow-hidden space-y-6">
              <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
              
              <div className="relative max-w-4xl space-y-4">
                <span className="inline-flex items-center gap-1.5 text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-widest">
                  <Building2 className="w-3.5 h-3.5" /> Corporate Capability Upgrade
                </span>
                
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight">
                  Tailor-Made Corporate Training Cohorts
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Synchronize your internal workforce with physical security setups, modern networking configurations, and IT optimization policies. Syntax Technology delivers practical, instructor-guided bootcamps custom aligned with your enterprise hardware footprint.
                </p>

                {/* Corporate Stats strip */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs max-w-2xl">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">Custom Curriculum</span>
                    <span className="font-bold text-slate-100 flex items-center gap-1 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> 100% Customized
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">Flexible Delivery</span>
                    <span className="font-bold text-slate-100 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" /> On-site / Off-site
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">Group Costing</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Up to 35% Savings
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Corporate Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Lab Simulators</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We don't rely on slides. We ship real IP surveillance cameras, network terminal routers, and biometric door locking assemblies straight to your premises for live configuration labs.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Adaptive Flexible Hours</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Minimize company operational interruptions. We orchestrate early morning modules, weekend bootcamps, or sequential evening cohorts that synchronize with standard employee shift schedules.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Post-Academy Field SLA</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every corporate program includes a 3-month ongoing support bridge. Instructors provide direct diagnostic audits on-premise to ensure employees successfully deploy their knowledge on active projects.
                </p>
              </div>
            </div>

            {/* Corporate Custom Request Intake Form */}
            <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 max-w-4xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold uppercase tracking-wider">Enterprise Ingestion</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Request Corporate Group Training</h3>
                <p className="text-xs text-slate-500 max-w-xl mx-auto">Complete this checklist specification. A corporate director from Syntax will evaluate your organizational goals and issue a formal stamped PDF proposal within 24 hours.</p>
              </div>

              {corpSuccess ? (
                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-center rounded-2xl max-w-lg mx-auto space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Corporate Query Logged!</h4>
                    <p className="text-xs text-slate-500 mt-1">Your corporate upskilling parameters have been routed to our corporate accounts division. A program coordinator will call you shortly to define curriculum specs.</p>
                  </div>
                  <button
                    onClick={() => setCorpSuccess(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCorporateSubmit} className="space-y-4 max-w-3xl mx-auto">
                  {corpError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/35 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {corpError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Company / Organization *</label>
                      <input
                        type="text"
                        required
                        value={corpFormData.company}
                        onChange={(e) => setCorpFormData(p => ({ ...p, company: e.target.value }))}
                        placeholder="e.g. Rwanda Telecom / private firm"
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Your Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={corpFormData.name}
                        onChange={(e) => setCorpFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Sarah Kasingye"
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Corporate Business Email *</label>
                      <input
                        type="email"
                        required
                        value={corpFormData.email}
                        onChange={(e) => setCorpFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="s.kasingye@firm.com"
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Direct Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={corpFormData.phone}
                        onChange={(e) => setCorpFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+250 788 444 555"
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Estimated Cohort Student Count</label>
                      <select
                        value={corpFormData.cohortSize}
                        onChange={(e) => setCorpFormData(p => ({ ...p, cohortSize: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="1-4 participants">1-4 participants</option>
                        <option value="5-10 participants">5-10 participants (Recommended for dedicated hardware kits)</option>
                        <option value="11-20 participants">11-20 participants</option>
                        <option value="20+ participants">20+ participants (Multi-session bootcamps)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Preferred Location</label>
                      <select
                        value={corpFormData.locationPreference}
                        onChange={(e) => setCorpFormData(p => ({ ...p, locationPreference: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="On-site at our premises">On-site at our corporate premises</option>
                        <option value="At Syntax Training Center">At Syntax Executive Training Labs</option>
                        <option value="Fully Virtual Remote Labs">Fully Virtual (Online with hardware simulators)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Select Main Course Template</label>
                      <select
                        value={corpFormData.courseInterest}
                        onChange={(e) => setCorpFormData(p => ({ ...p, courseInterest: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {COURSES.map((c, i) => (
                          <option key={i} value={c.title}>{c.title}</option>
                        ))}
                        <option value="Custom multi-disciplinary security & IT specs">Custom multi-disciplinary security & IT specs</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Requested Start Date</label>
                      <select
                        value={corpFormData.preferredTimeline}
                        onChange={(e) => setCorpFormData(p => ({ ...p, preferredTimeline: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Immediate (Within 14 days)">Immediate (Within 14 days)</option>
                        <option value="Within 30 days">Within 30 days</option>
                        <option value="Next quarter (Planning ahead)">Next quarter (Planning ahead)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Tailor-Made Requests & System Details</label>
                    <textarea
                      value={corpFormData.customSpecs}
                      onChange={(e) => setCorpFormData(p => ({ ...p, customSpecs: e.target.value }))}
                      rows={4}
                      placeholder="e.g. Please customize CCTV modules to cover Suprema biometric readers connected to magnetic locks on double glass doors. Note: we use Hikvision cameras in our network..."
                      className="w-full px-3 py-2 text-xs border border-slate-250 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingCorp}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-850 dark:bg-purple-650 dark:hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {submittingCorp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Loggin Enterprise Intake...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-emerald-450" /> Submit Corporate Cohort Query
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
