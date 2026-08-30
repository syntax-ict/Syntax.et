import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Layers, 
  Briefcase, 
  Tag, 
  Cpu, 
  CheckCircle, 
  ArrowRight,
  Wrench,
  Sun,
  Moon,
  Database
} from "lucide-react";
import { PORTFOLIO_PROJECTS } from "../data";
import { useLocalization } from "../context/useLocalization";

// Dynamic schematic components for custom interactive diagrams
const CCTVMapSchematic: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    { id: "cam-1", label: "Front Gate IP Camera", x: 60, y: 50, type: "camera" },
    { id: "cam-2", label: "Server Room CCTV", x: 280, y: 50, type: "camera" },
    { id: "gate-1", label: "Biometric Turnstile A", x: 120, y: 150, type: "biometric" },
    { id: "gate-2", label: "Biometric Turnstile B", x: 220, y: 150, type: "biometric" },
    { id: "nvr-node", label: "32-Ch NVR Server Stack", x: 170, y: 240, type: "server" }
  ];

  return (
    <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-black">Live Security Grid Topology</span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono">Click components to test signal</span>
      </div>

      <div className="relative h-64 bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center">
        {/* SVG Grid Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Signal paths to NVR */}
          <line x1="60" y1="50" x2="170" y2="240" stroke={activeNode === "cam-1" ? "#10b981" : "#1e293b"} strokeWidth={activeNode === "cam-1" ? "2" : "1.5"} strokeDasharray="4 2" />
          <line x1="280" y1="50" x2="170" y2="240" stroke={activeNode === "cam-2" ? "#10b981" : "#1e293b"} strokeWidth={activeNode === "cam-2" ? "2" : "1.5"} strokeDasharray="4 2" />
          <line x1="120" y1="150" x2="170" y2="240" stroke={activeNode === "gate-1" ? "#10b981" : "#1e293b"} strokeWidth={activeNode === "gate-1" ? "2" : "1.5"} />
          <line x1="220" y1="150" x2="170" y2="240" stroke={activeNode === "gate-2" ? "#10b981" : "#1e293b"} strokeWidth={activeNode === "gate-2" ? "2" : "1.5"} />
        </svg>

        {/* Nodes rendering */}
        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-lg border transition-all ${
                isActive 
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20" 
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Cpu className={`w-4 h-4 ${isActive ? "text-emerald-400 animate-bounce" : "text-slate-400"}`} />
                <span className="text-[8px] font-mono whitespace-nowrap font-bold">{node.id.toUpperCase()}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 min-h-[50px] flex items-center justify-center">
        {activeNode ? (
          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-white">
              {nodes.find(n => n.id === activeNode)?.label}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono">
              Status: SECURE & BULLPROOF • Signal Strength: 100% • PoE Active
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 italic text-center">
            Click on any system node above to inspect live signal & diagnostics
          </p>
        )}
      </div>
    </div>
  );
};

const NetworkTopologySchematic: React.FC = () => {
  const [activeFloor, setActiveFloor] = useState<number>(1);

  return (
    <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-black">Structured Cat6 Rack Routing</span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono">Multi-Floor Switch Isolation</span>
      </div>

      {/* Interactive Switch Ports */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono font-bold">Floor Select:</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((floor) => (
              <button
                key={floor}
                onClick={() => setActiveFloor(floor)}
                className={`px-3 py-1 text-[10px] font-bold rounded ${
                  activeFloor === floor 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-800 text-slate-400 hover:bg-slate-750"
                }`}
              >
                Floor {floor} (40 Endpoints)
              </button>
            ))}
          </div>
        </div>

        {/* Port Matrix Graphic */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <p className="text-[10px] font-mono text-slate-400">
            Active Layer 3 Rackmount Switch - Floor {activeFloor} Port Allocation:
          </p>
          <div className="grid grid-cols-12 gap-1.5">
            {Array.from({ length: 24 }).map((_, i) => {
              // Simulate active ports depending on floor
              const isActive = (i * activeFloor) % 3 !== 0;
              return (
                <div 
                  key={i} 
                  className={`aspect-square rounded border flex flex-col items-center justify-center p-1 transition-all ${
                    isActive 
                      ? "bg-emerald-950/50 border-emerald-500 text-emerald-400" 
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}
                  title={`Switch Port ${i + 1} - ${isActive ? "Gigabit Active" : "Unconnected"}`}
                >
                  <span className="text-[8px] font-mono">{i + 1}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-650"}`}></span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-emerald-500"></span>
              <span>Active VLAN Link (1000 Mbps)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-slate-600"></span>
              <span>Available / Reserve Uplink</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LightboxInteractiveSchematic: React.FC = () => {
  const [isNightMode, setIsNightMode] = useState<boolean>(true);

  return (
    <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-black">Twilight-Sensor Signage Control</span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono">Simulation</span>
      </div>

      <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
        <span className="text-[10px] text-slate-400 font-mono font-bold">Ambient Light Sensor Trigger:</span>
        <button
          onClick={() => setIsNightMode(!isNightMode)}
          className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition bg-slate-800 border border-slate-700 text-white hover:bg-slate-750"
        >
          {isNightMode ? (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span>Simulate Night (ON)</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Simulate Day (OFF)</span>
            </>
          )}
        </button>
      </div>

      {/* Storefront Sign Visualizer */}
      <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center transition-colors duration-500 bg-slate-900">
        {/* Sky Background Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isNightMode ? "bg-slate-950 opacity-95" : "bg-sky-100 opacity-95"}`}></div>

        {/* Storefront Layout */}
        <div className="relative z-10 text-center space-y-4 w-full px-6">
          <div className="border-b border-dashed border-slate-700/50 pb-2">
            <span className={`text-[9px] font-mono ${isNightMode ? "text-slate-400" : "text-slate-600"}`}>
              KIGALI COMMERCIAL DISTRICT SIGN BOARD
            </span>
          </div>

          <div 
            className={`py-3 px-8 rounded border transition-all duration-700 font-black text-lg tracking-widest uppercase ${
              isNightMode 
                ? "bg-slate-900 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/20 scale-102" 
                : "bg-slate-200 border-slate-300 text-slate-700"
            }`}
          >
            SYNTAX TECHNOLOGY
          </div>

          <div className="flex justify-center gap-4 text-[9px] font-mono">
            <span className={isNightMode ? "text-emerald-400" : "text-slate-500"}>
              LED STATUS: {isNightMode ? "ACTIVE BACKLIT" : "STANDBY"}
            </span>
            <span className={isNightMode ? "text-amber-400" : "text-slate-500"}>
              POWER SAVINGS: {isNightMode ? "HIGH EFFICIENCY" : "AUTO-DISABLED"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectPortfolioProps {
  onLaunchConsultation: () => void;
}

export const ProjectPortfolio: React.FC<ProjectPortfolioProps> = ({ onLaunchConsultation }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { t } = useLocalization();
  
  // Filtering States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSector, setSelectedSector] = useState<string>("All");

  // Fetch unique categories & sectors for drop-downs / selectors
  const categories = ["All", "Security & Intelligent Systems", "Enterprise IT Infrastructure", "Business Technology & Automation"];
  const sectors = ["All", "Government", "Private Enterprise", "Retail Hub"];

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return PORTFOLIO_PROJECTS.filter((proj) => {
      const matchCat = selectedCategory === "All" || proj.category === selectedCategory;
      const matchSec = selectedSector === "All" || proj.clientType === selectedSector;
      return matchCat && matchSec;
    });
  }, [selectedCategory, selectedSector]);

  // Selected Project Object
  const selectedProject = useMemo(() => {
    return PORTFOLIO_PROJECTS.find(p => p.id === selectedProjectId) || null;
  }, [selectedProjectId]);

  // Direct reset helper
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedSector("All");
  };

  return (
    <div className="space-y-12">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          /* =========================================================================
             OVERVIEW & FILTER GRID
             ========================================================================= */
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            {/* Header Section */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest block font-mono">
                Technical Evidence & Audit Logs
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {t("portfolio.heading")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("portfolio.subheading")}
              </p>
            </div>

            {/* Filter Hub Toolbar */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-50 dark:border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">Discovery Filter Engine</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filtering Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Filter by Business Pillar:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                          selectedCategory === cat
                            ? "bg-blue-600 text-white"
                            : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sector Filtering Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Filter by Client Sector:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {sectors.map((sec) => (
                      <button
                        key={sec}
                        onClick={() => setSelectedSector(sec)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                          selectedSector === sec
                            ? "bg-slate-900 text-white dark:bg-slate-800"
                            : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
                        }`}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filtering summary stats */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>
                  Showing {filteredProjects.length} of {PORTFOLIO_PROJECTS.length} verified deployments
                </span>
                {(selectedCategory !== "All" || selectedSector !== "All") && (
                  <span className="text-blue-500 font-bold">
                    Active Filters: {selectedCategory !== "All" ? `[Pillar: ${selectedCategory}]` : ""} {selectedSector !== "All" ? `[Sector: ${selectedSector}]` : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-900/40 transition group"
                >
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/30">
                        {project.category}
                      </span>
                      <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {project.clientType} Sector
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono font-semibold">
                        Industry: {project.industry || "General ICT Infrastructure"}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Quick highlights / deliverables */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Deliverable Highlights:</span>
                      <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {project.deliverables.slice(0, 2).map((del, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span className="truncate">{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Outcome Box */}
                    <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 rounded-xl p-3">
                      <span className="text-[8px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block font-mono mb-1">
                        Audited Result
                      </span>
                      <p className="text-[11px] text-slate-800 dark:text-slate-300 font-bold leading-tight">
                        ✓ {project.results[0]}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProjectId(project.id)}
                    className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="col-span-full py-16 text-center space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <Layers className="w-10 h-10 text-slate-400 mx-auto opacity-60" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    No verified deployment match these active filter settings.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Reset Filter Fields
                  </button>
                </div>
              )}
            </div>

            {/* Quick General CTA Footer Card */}
            <div className="p-8 bg-blue-50/20 dark:bg-blue-950/15 border border-blue-100/50 dark:border-blue-900/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 max-w-xl text-center md:text-left">
                <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Need customized hardware configuration?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our certified field technicians design specific custom blueprints matching high-level requirements. Speak to a live technical architect.
                </p>
              </div>
              <button
                onClick={onLaunchConsultation}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shrink-0 transition shadow-sm shadow-blue-500/20"
              >
                Inquire Consultation
              </button>
            </div>
          </motion.div>
        ) : (
          /* =========================================================================
             PROJECT DETAIL VIEW (CHALLENGE -> SOLUTION -> IMPLEMENTATION -> RESULT)
             ========================================================================= */
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Navigation back bar */}
            <button
              onClick={() => setSelectedProjectId(null)}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Case Studies Overview</span>
            </button>

            {/* Detailed Presentation Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              
              {/* Cover Header Banner */}
              <div className="p-6 sm:p-8 bg-slate-950 text-white border-b border-slate-800 relative">
                <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-500 font-bold uppercase">
                  Case ID: {selectedProject.id}
                </div>
                <div className="space-y-4 max-w-4xl">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                      {selectedProject.category}
                    </span>
                    <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedProject.clientType} Sector
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-white">
                    {selectedProject.title}
                  </h1>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-500 uppercase">Sector/Client Segment:</span>
                      <span className="text-slate-200 font-bold">{selectedProject.clientType} Field Deployment</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-500 uppercase">Industry:</span>
                      <span className="text-slate-200 font-bold">{selectedProject.industry || "Enterprise Architecture"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-500 uppercase">Primary Verification Status:</span>
                      <span className="text-emerald-400 font-bold">✓ 100% AUDITED PROOF</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Case Study Body Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
                
                {/* Structural Chronological Roadmap Steps */}
                <div className="lg:col-span-8 space-y-10">
                  
                  {/* STEP 1: CHALLENGE */}
                  <div className="space-y-4 relative pl-6 border-l-2 border-red-500/30">
                    {/* Floating step pill */}
                    <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-900 flex items-center justify-center font-black text-xs text-red-600 dark:text-red-400">
                      1
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-wider block font-mono">{t("portfolio.challenge")}</span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">The Operational Problem</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-normal">
                      {selectedProject.challenge || "Detail logs detailing the precise physical structural limits of the original degraded customer installation."}
                    </p>
                  </div>

                  {/* STEP 2: SOLUTION */}
                  <div className="space-y-4 relative pl-6 border-l-2 border-blue-500/30">
                    <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 flex items-center justify-center font-black text-xs text-blue-600 dark:text-blue-400">
                      2
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block font-mono">{t("portfolio.solution")}</span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">The Engineering Resolution</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                      {selectedProject.solutionDetail || selectedProject.description}
                    </p>
                  </div>

                  {/* STEP 3: IMPLEMENTATION SCOPE & DYNAMIC SCHEMATIC DIAGRAMS */}
                  <div className="space-y-6 relative pl-6 border-l-2 border-amber-500/30">
                    <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 flex items-center justify-center font-black text-xs text-amber-600 dark:text-amber-400">
                      3
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block font-mono">{t("portfolio.implementation")}</span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Scope of Work & Interactive Blueprint Map</h3>
                    </div>

                    {/* Step-by-Step Scope Bullets */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tactical Field Tasks Performed:</span>
                      <ul className="space-y-2 text-xs">
                        {selectedProject.scopeOfImplementation?.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                            <Wrench className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        )) || (
                          <li className="text-slate-500 italic">No specific task list configured. Standard site-survey & hardware deployment steps successfully completed.</li>
                        )}
                      </ul>
                    </div>

                    {/* DYNAMIC CASE-STUDY TECHNICAL IMAGE/DIAGRAM */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Technical Grid Diagram:</span>
                      {selectedProject.id === "proj-1" && <CCTVMapSchematic />}
                      {selectedProject.id === "proj-2" && <NetworkTopologySchematic />}
                      {selectedProject.id === "proj-3" && <LightboxInteractiveSchematic />}
                    </div>
                  </div>

                  {/* STEP 4: RESULTS & METRICS */}
                  <div className="space-y-4 relative pl-6">
                    <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center font-black text-xs text-emerald-600 dark:text-emerald-400">
                      4
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block font-mono">{t("portfolio.result")}</span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Operational Results achieved</h3>
                    </div>
                    <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 p-5 rounded-2xl space-y-3">
                      <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                        {selectedProject.outcome}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-100/30 dark:border-emerald-900/20">
                        {selectedProject.results.map((res, i) => (
                          <div key={i} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-500/20 text-center">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
                            <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">{res}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Sidebar Specifications */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Delivered physical systems */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-850/80 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">{t("portfolio.installedHardware")}</h4>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350">
                      {selectedProject.deliverables.map((del, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded bg-blue-500 shrink-0"></span>
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Systems & technologies involved list */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-850/80 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <Database className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">{t("portfolio.techInvolved")}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologiesInvolved?.map((tech, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      )) || (
                        <span className="text-[10px] text-slate-400 italic">No specific system parameters logged.</span>
                      )}
                    </div>
                  </div>

                  {/* Direct back control */}
                  <button
                    onClick={() => setSelectedProjectId(null)}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white text-xs font-bold rounded-xl uppercase tracking-wider transition"
                  >
                    ← {t("common.back")}
                  </button>

                </div>

              </div>

            </div>

            {/* HIGH CONVERSION CASE STUDY PANEL CTA */}
            <div className="bg-slate-950 text-white p-8 sm:p-10 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Soft decorative visual background accents */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-2 relative z-10 text-center md:text-left max-w-2xl">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block font-mono">
                  {t("portfolio.similarChallenge")}
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                  Request a Custom Technical Consultation
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Let Syntax field engineers plan, budget, and deploy your physical infrastructure project following global standards. Provide your parameters inside our wizard form to schedule a site survey.
                </p>
              </div>

              <div className="shrink-0 relative z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={onLaunchConsultation}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-500/20 text-center text-nowrap"
                >
                  {t("hero.ctaConsultation")}
                </button>
                <button
                  onClick={() => setSelectedProjectId(null)}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-850 transition text-center text-nowrap"
                >
                  {t("common.cancel")}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
