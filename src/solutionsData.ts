import {
  Shield,
  Fingerprint,
  Key,
  MapPin,
  HardDrive,
  Network,
  Wrench,
  Combine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SolutionStep {
  title: string;
  description: string;
}

export interface SolutionFAQ {
  question: string;
  answer: string;
}

export interface SolutionDetail {
  id: string;
  title: string;
  shortDescription: string;
  iconName: string;
  icon: LucideIcon;
  colorTheme: {
    primary: string;
    bg: string;
    border: string;
    accent: string;
    glow: string;
  };
  problemStatement: {
    problem: string;
    impact: string;
  };
  solutionExplanation: string;
  whoItIsFor: string[];
  keyBenefits: {
    title: string;
    description: string;
  }[];
  implementationProcess: SolutionStep[];
  relatedSolutions: string[]; // Solution IDs
  relevantProjectIds: string[]; // Portfolio project IDs
  faq: SolutionFAQ[];
}

export const SOLUTIONS_DATA: SolutionDetail[] = [
  {
    id: "cctv-surveillance",
    title: "CCTV and Surveillance",
    shortDescription:
      "Complete commercial megapixel IP camera networks providing high-fidelity incident video capturing and perimeter safety.",
    iconName: "Shield",
    icon: Shield,
    colorTheme: {
      primary: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
      bg: "bg-blue-50/40",
      border: "border-blue-100 dark:border-blue-900/30",
      accent: "blue",
      glow: "shadow-blue-500/5",
    },
    problemStatement: {
      problem:
        "Commercial facilities, logistics warehouses, and public offices suffer from unmonitored entries, blind spots, and untraceable security incidents.",
      impact:
        "Creates vulnerabilities leading to inventory shrinkage, immediate financial loss, insurance claim rejections, and zero forensic accountability.",
    },
    solutionExplanation:
      "Syntax Technology deploys fully integrated IP CCTV networks utilizing high-definition megapixel cameras, Power-over-Ethernet (PoE) switches, and professional Network Video Recorders (NVR). Our installations are optimized for low-light recording, perimeter cross-line triggers, and secure live remote feeds encrypted for mobile and desktop systems.",
    whoItIsFor: [
      "Commercial Warehouses and Distribution Hubs",
      "Retail Showrooms and Multi-floor Buildings",
      "Government Administrative Complexes",
      "High-Traffic Transit Stations and Parking Yards",
    ],
    keyBenefits: [
      {
        title: "100% Perimeter Visual Control",
        description:
          "Eliminate visual blind spots with strategically planned focal angles tailored to entrance points and perimeter boundaries.",
      },
      {
        title: "Ultra-High Definition Footage",
        description:
          "Capture clear face profiles and license plate numbers with 4MP to 4K resolution sensors operating with true WDR (Wide Dynamic Range).",
      },
      {
        title: "Smart Proactive Analytics",
        description:
          "Configure dynamic motion-detection thresholds, perimeter line-crossing alarms, and instant push notification feeds.",
      },
      {
        title: "Secure Encrypted Remote Feed",
        description:
          "Authorized managers can securely review active and historical playback from any internet connection using military-grade AES-256 mobile apps.",
      },
    ],
    implementationProcess: [
      {
        title: "Phase 1: Angle Mapping & Assessment",
        description:
          "We audit the site layout, measuring distances, light sources, and crucial risk zones to select appropriate lens sizes (e.g. 2.8mm wide angle vs 4mm narrow focal lenses).",
      },
      {
        title: "Phase 2: Structured PoE Cable Routing",
        description:
          "Deploy heavy-duty outdoor-rated copper Cat6 cables wrapped in protective conduits from camera mount points to the central server rack.",
      },
      {
        title: "Phase 3: Hardware Mounting & Alignment",
        description:
          "Securely mount weatherproof IP67 dome and bullet cameras. Fine-tune angles during night conditions to verify infrared illuminator ranges.",
      },
      {
        title: "Phase 4: NVR Configuration & Compression",
        description:
          "Program storage compression protocols (e.g. H.265+) to preserve recording histories, setup redundant hard-disk arrays, and establish user group hierarchies.",
      },
      {
        title: "Phase 5: Performance Audit & Training",
        description:
          "Deliver a physical hand-over manual with precise IP subnet addresses, password controls, and provide complete operating tutorials to corporate security teams.",
      },
    ],
    relatedSolutions: ["access-control", "software-integration"],
    relevantProjectIds: ["proj-1"],
    faq: [
      {
        question: "How long can we record before the storage overwrites itself?",
        answer:
          "Standard installations are configured to retain full-motion high-resolution video for 30 days. We calculate exact hard-disk capacity (TB) based on camera count, frame rate, and compression codecs to meet your specific timeline requirement.",
      },
      {
        question: "What happens to the cameras during heavy rainfall or power outages?",
        answer:
          "Our camera housings carry IP67 weatherproof ratings, ensuring complete fluid protection in seasonal downpours. To handle power drops, we connect the entire PoE network to specialized uninterruptible power supplies (UPS) located inside the server rack, enabling uninterrupted recording during temporary blackouts.",
      },
      {
        question: "Is there an ongoing monthly cost to use the mobile application?",
        answer:
          "No. The remote viewing client software and official manufacturer mobile applications are 100% free with no monthly licensing or subscription costs. Data only travels over your secure localized internet bandwidth.",
      },
    ],
  },
  {
    id: "biometric-attendance",
    title: "Biometric Attendance",
    shortDescription:
      "Facial and fingerprint recognition terminals designed to eliminate manual payroll fraud and buddy punching.",
    iconName: "Fingerprint",
    icon: Fingerprint,
    colorTheme: {
      primary: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
      bg: "bg-emerald-50/40",
      border: "border-emerald-100 dark:border-emerald-900/30",
      accent: "emerald",
      glow: "shadow-emerald-500/5",
    },
    problemStatement: {
      problem:
        "Traditional paper sign-in books, plastic swipe-cards, and spreadsheet logs are highly vulnerable to manipulation, lost cards, and direct employee 'buddy punching'.",
      impact:
        "Leaks up to 12% of payroll budgets on unworked hours, introduces high human transcription errors, and wastes dozens of HR labor hours calculating manual logs.",
    },
    solutionExplanation:
      "Syntax Biometric Attendance integrates high-speed optical fingerprint scanners and contactless 3D facial recognition terminal networks. These hardware endpoints communicate directly with local database engines or secure HR cloud instances, instantly capturing precise millisecond timestamps that translate into automated, payroll-ready reports.",
    whoItIsFor: [
      "Medium to Large Corporate Offices",
      "Factory Floors and Assembly Plants",
      "Multi-branch Retail Operations",
      "Schools, Universities, and Government Departments",
    ],
    keyBenefits: [
      {
        title: "Eradicate Buddy Punching Completely",
        description:
          "Because biometric templates represent unique biological prints, it is mathematically impossible for one employee to clock in for another.",
      },
      {
        title: "Automated Instant Payroll Exports",
        description:
          "Generate complete daily, weekly, or monthly attendance spreadsheets in CSV, Excel, or database formats with one click.",
      },
      {
        title: "Contactless High-Speed Verification",
        description:
          "Deploy 3D facial terminals that authenticate staff in less than 0.3 seconds from a distance, preventing entry bottlenecks.",
      },
      {
        title: "Unified Multi-site Sync",
        description:
          "Centralize employee schedules across multiple geographic branches into a single centralized administrative control panel.",
      },
    ],
    implementationProcess: [
      {
        title: "Phase 1: Traffic & Endpoint Assessment",
        description:
          "Determine appropriate terminal capacity based on active headcount to avoid entry queues, selecting optical vs. facial readers.",
      },
      {
        title: "Phase 2: Network Wiring & Terminal Mounts",
        description:
          "Route dedicated, concealed network cables to selected points, mount physical terminal backplates, and apply backup power loops.",
      },
      {
        title: "Phase 3: Database & Software Integration",
        description:
          "Install server-side management software, configure network IP schemes, and synchronize target databases.",
      },
      {
        title: "Phase 4: Employee Biometric Enrollment",
        description:
          "Help HR personnel register staff profiles, mapping fingerprint and facial templates under clean lighting for absolute accuracy.",
      },
      {
        title: "Phase 5: Stamped Reporting Audit",
        description:
          "Conduct trial runs to verify that clock-in records are compiling into formatted CSV payroll sheets without discrepancies.",
      },
    ],
    relatedSolutions: ["access-control", "software-integration"],
    relevantProjectIds: ["proj-1"],
    faq: [
      {
        question: "Are employee fingerprint images stored on the device?",
        answer:
          "No. For absolute security and compliance, our biometric readers do not store actual photos or image files of fingerprints or faces. They convert unique biological nodes into an encrypted mathematical hash. This hash cannot be reverse-engineered back into a fingerprint or facial image.",
      },
      {
        question: "Can these terminals operate if our office internet goes down?",
        answer:
          "Yes. All our biometric hardware units feature robust internal flash memory capable of saving up to 100,000 log events offline. When the network is restored, the terminal automatically pushes the saved records to the central server database.",
      },
      {
        question: "Can we set specific time grace periods for late arrivals?",
        answer:
          "Yes. The management software is highly customizable. You can configure precise shifts, grace periods (e.g., 5-minute late tolerance), half-day calculations, and specify custom national holiday schedules.",
      },
    ],
  },
  {
    id: "access-control",
    title: "Access Control",
    shortDescription:
      "Heavy-duty electromagnetic locks and RFID reader barriers to restrict entry to sensitive server rooms and corporate areas.",
    iconName: "Key",
    icon: Key,
    colorTheme: {
      primary: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
      bg: "bg-amber-50/40",
      border: "border-amber-100 dark:border-amber-900/30",
      accent: "amber",
      glow: "shadow-amber-500/5",
    },
    problemStatement: {
      problem:
        "Traditional metal keys are easily copied, lost, or kept by former staff, making it impossible to audit who entered key archives, server rooms, or warehouse stores.",
      impact:
        "Creates extreme liabilities, corporate espionage opportunities, physical theft of assets, and directly breaches technical security compliance guidelines.",
    },
    solutionExplanation:
      "We implement robust physical security boundaries utilizing high-holding-force electromagnetic locks (600lbs to 1200lbs), electronic drop bolts, smart card readers, and biometric door controllers. Every single lock event is compiled in a localized server database, allowing you to control who can enter specific rooms, during which hours, and instantly disable credentials.",
    whoItIsFor: [
      "Enterprise Server and Data Centers",
      "Executive Headquarters and Archive Vaults",
      "Financial and Banking Facilities",
      "Research Laboratories and Secure Storage",
    ],
    keyBenefits: [
      {
        title: "Instant Credential Revocation",
        description:
          "If an employee leaves the company, easily delete their access card or fingerprint in the software in seconds, making lost keys obsolete.",
      },
      {
        title: "Comprehensive Digital Footprint Audit",
        description:
          "Know exactly who entered the server room or archive file vault, down to the precise millisecond they scanned their card.",
      },
      {
        title: "Multi-Tier Departmental Zoning",
        description:
          "Partition access rights so that accounting staff can enter only their offices, while IT personnel retain access to engineering blocks.",
      },
      {
        title: "Fail-Safe Fire Alarm Release",
        description:
          "Connect physical power relays to existing fire alarm panels to automatically release locks during emergency evacuations.",
      },
    ],
    implementationProcess: [
      {
        title: "Phase 1: Door Structural Inspection",
        description:
          "Audit door frames (glass, wooden, metal, or fire doors) to select appropriate locking mechanisms (electromagnetic vs. electronic drop-bolts).",
      },
      {
        title: "Phase 2: Power and Relay Wiring",
        description:
          "Install centralized 12V lock power boxes equipped with robust backup batteries and link them to structural door frames.",
      },
      {
        title: "Phase 3: Controller & Reader Installation",
        description:
          "Mount physical card/fingerprint readers outside door perimeters and install secure exit request buttons inside.",
      },
      {
        title: "Phase 4: Emergency Fire Integration",
        description:
          "Wire dedicated hardware break-glass buttons and configure fire control panels to trigger complete fail-safe de-energization.",
      },
      {
        title: "Phase 5: Credentials & Group Configuration",
        description:
          "Load active user profiles, structure departmental access groups, configure shifts, and verify lock response.",
      },
    ],
    relatedSolutions: ["biometric-attendance", "cctv-surveillance"],
    relevantProjectIds: ["proj-1"],
    faq: [
      {
        question: "What happens during a complete power outage? Are we locked in?",
        answer:
          "Safety is our absolute priority. We utilize Fail-Safe locks for general exit routes. In a power drop, the locks automatically disengage. Furthermore, our systems are wired with local backup battery cells providing 8+ hours of standard operation, and include physical emergency 'break-glass' switches on every exit point.",
      },
      {
        question: "Can we use RFID cards, PIN codes, and fingerprints on the same door?",
        answer:
          "Yes. Our controllers support multi-factor authentication modes. You can configure doors to require card-only, PIN-only, or require high-security dual verification (both Fingerprint AND RFID card) to open specific server room zones.",
      },
      {
        question: "How many doors can your central controller system manage?",
        answer:
          "Our network architecture is fully modular. We install controllers managing 1, 2, or 4 doors per node, which can be connected indefinitely to manage hundreds of doors across a campus under a single unified dashboard.",
      },
    ],
  },
  {
    id: "gps-fleet-tracking",
    title: "GPS and Fleet Tracking",
    shortDescription:
      "Sub-meter commercial GPS tracking arrays with remote ignition engine-kill relays and fuel consumption metrics.",
    iconName: "MapPin",
    icon: MapPin,
    colorTheme: {
      primary: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30",
      bg: "bg-purple-50/40",
      border: "border-purple-100 dark:border-purple-900/30",
      accent: "purple",
      glow: "shadow-purple-500/5",
    },
    problemStatement: {
      problem:
        "Company logistics, corporate shuttles, and sales vehicles operate without route visibility, enabling driver detours, excessive idling, fuel theft, and vehicle abuse.",
      impact:
        "Drives massive operating fuel budgets, accelerates vehicle mechanical wear, delays client shipments, and leaves assets vulnerable to complete theft.",
    },
    solutionExplanation:
      "Syntax GPS & Fleet Tracking installs industrial-grade, highly concealed GPS tracker units deep within vehicle wiring harnesses. These trackers feed instantaneous speed, route, idling, and geographical coordinates to a secure, cloud-enabled fleet portal. Managers can set geofencing boundaries, review historical paths, and trigger remote engine-shutdown relays in cases of unauthorized movement.",
    whoItIsFor: [
      "Logistics, Freight, and Haulage Firms",
      "Corporate Pool Vehicle Divisions",
      "Shuttle, Bus, and Employee Transport Providers",
      "Equipment Rental Companies and Delivery Fleets",
    ],
    keyBenefits: [
      {
        title: "Real-Time GPS Map Auditing",
        description:
          "View the exact sub-meter position, speed, and heading of every vehicle in your fleet updated every 10 seconds.",
      },
      {
        title: "Remote Ignition Shutdown Relays",
        description:
          "In the event of theft, send an encrypted SMS or portal command to safely shut off the fuel pump and disable engine starting.",
      },
      {
        title: "Geofencing Boundary Safeguards",
        description:
          "Map precise virtual borders around warehouses or client zones, and receive instant alerts if a vehicle departs.",
      },
      {
        title: "Reduce Fleet Fuel Consumption",
        description:
          "Identify and eliminate excessive engine idling, route deviations, and unauthorized private vehicle use.",
      },
    ],
    implementationProcess: [
      {
        title: "Phase 1: Vehicle Electrical Verification",
        description:
          "Audit target vehicle types (trucks, bikes, or machinery) to identify secure 12V-24V power configurations and starter wire looms.",
      },
      {
        title: "Phase 2: Hardware Concealment & Wiring",
        description:
          "Surgically solder the tracking node inside the vehicle's interior dashboard structure, shielding it from physical interference.",
      },
      {
        title: "Phase 3: Relay & Fuel Sensor Integration",
        description:
          "Wire the micro-relays into the vehicle's starter circuit to enable the engine-kill feature, and calibrate fuel level metrics.",
      },
      {
        title: "Phase 4: Portal & Mobile App Onboarding",
        description:
          "Register the fleet SIM numbers on our secure monitoring server and configure user notifications for the fleet manager.",
      },
      {
        title: "Phase 5: Live Ignition Calibration",
        description:
          "Execute field ignition checks and geofence alarms to confirm tracking coordinates match the central map perfectly.",
      },
    ],
    relatedSolutions: ["software-integration", "technical-support"],
    relevantProjectIds: ["proj-3"],
    faq: [
      {
        question: "Will the GPS tracking unit drain my vehicle's starter battery?",
        answer:
          "No. The tracking hardware features intelligent power management. When the vehicle's ignition is turned off, the GPS node enters a deep sleep mode, waking up only if it detects movement or a status query, preventing battery drain.",
      },
      {
        question: "How does the remote engine-kill feature operate? Is it safe while driving?",
        answer:
          "Safety is our priority. The ignition relay is engineered to prevent sudden shutdowns at high speed, which would be dangerous. The system executes the engine disablement sequence only when the vehicle has slowed down or stopped, blocking future engine starting.",
      },
      {
        question: "How long is our fleet's historical trip history saved?",
        answer:
          "The secure tracking server stores complete detailed trip histories, speed graphs, idling locations, and mileage statistics for a full 90 days.",
      },
    ],
  },
  {
    id: "it-infrastructure",
    title: "IT Infrastructure",
    shortDescription:
      "Complete enterprise server cabinets, cable racks, UPS backup systems, and high-performance local NAS storage installations.",
    iconName: "HardDrive",
    icon: HardDrive,
    colorTheme: {
      primary: "text-blue-700 dark:text-blue-350 bg-blue-50/55 dark:bg-blue-950/30",
      bg: "bg-blue-50/40",
      border: "border-blue-150 dark:border-blue-900/30",
      accent: "blue",
      glow: "shadow-blue-500/5",
    },
    problemStatement: {
      problem:
        "Tangled patch cables, dusty servers sitting on desks, lack of power backups, and disjointed storage drives cause slow performance and hardware failures.",
      impact:
        "Results in catastrophic hardware overheating, sudden file loss during electrical drops, and days of downtime attempting to locate damaged cables.",
    },
    solutionExplanation:
      "We design and install resilient corporate IT server rooms and data hubs. Our engineers deploy premium lockable server cabinets, structured patch panels, robust Rackmount Uninterruptible Power Supplies (UPS), and high-capacity Network Attached Storage (NAS). We organize, label, and catalog your hardware to guarantee dust-free thermal environments and absolute operational resilience.",
    whoItIsFor: [
      "Growing Corporate Offices and Headquarters",
      "Financial and Accounting Firm Offices",
      "Schools, Academic Campuses, and Laboratories",
      "Hospitals and Administrative Service Hubs",
    ],
    keyBenefits: [
      {
        title: "Extended Hardware Lifespan",
        description:
          "By housing servers in clean, thermally-managed lockable cabinets, we protect expensive processors from static dust and thermal throttling.",
      },
      {
        title: "Zero-Downtime Power Safeguards",
        description:
          "Rackmount UPS batteries absorb voltage spikes and supply reliable active power during structural electricity drops.",
      },
      {
        title: "Streamlined Rapid Diagnostics",
        description:
          "Every single cable, switch port, and patch panel terminal is professionally labeled and indexed for instant troubleshooting.",
      },
      {
        title: "Centralized Local Data NAS Backups",
        description:
          "Configure centralized file storage systems utilizing physical RAID disk parity to preserve documents even if a drive crashes.",
      },
    ],
    implementationProcess: [
      {
        title: "Phase 1: Thermal & Load Planning",
        description:
          "Calculate total wattage requirements of your switches, routers, and NAS to select correct UPS sizing and cabinet cooling layouts.",
      },
      {
        title: "Phase 2: Structured Rack Architecture",
        description:
          "Assemble and bolt down the server cabinets, allocating rack units (RU) for switches, patch panels, power strips, and cooling fans.",
      },
      {
        title: "Phase 3: Patch Panel Cable Terminations",
        description:
          "Route internal Cat6 cable looms directly into the back of patch panels, punch them down neatly, and label each node systematically.",
      },
      {
        title: "Phase 4: Power Distribution and NAS Config",
        description:
          "Connect UPS power lines, configure RAID disk arrays on local NAS drives, and map central shared file directories.",
      },
      {
        title: "Phase 5: Load Tests & Documentation",
        description:
          "Conduct electrical draw tests and deliver a complete operational binder outlining every cable route and subnet.",
      },
    ],
    relatedSolutions: ["networking", "technical-support"],
    relevantProjectIds: ["proj-2"],
    faq: [
      {
        question: "What is RAID storage and why is it safer than normal hard drives?",
        answer:
          "Network Attached Storage (NAS) uses RAID (Redundant Array of Independent Disks) configuration. If you have four drives inside a NAS, RAID divides data so that if any single hard disk suffers mechanical failure, your files remain completely intact. You simply swap the broken disk with a new one without losing a single kilobyte.",
      },
      {
        question: "How long can your UPS systems power our office server room?",
        answer:
          "The backup duration depends on your equipment's total power consumption. We configure standard UPS arrays to provide 30 to 60 minutes of operational power during an outage, which is ample time for automatic safe shutdowns or to bridge the gap until secondary backup generator units start up.",
      },
      {
        question: "Do you tidy up existing messy server rooms?",
        answer:
          "Yes, we specialize in server room overhauls and restructuring. We label, trace, and replace tangled 'spaghetti cabling' with color-coded patch cords and managed pathways, restoring professional airflow and organization to your racks.",
      },
    ],
  },
  {
    id: "networking",
    title: "Networking",
    shortDescription:
      "High-speed Cat6 structured cabling, fiber optic backbone links, managed enterprise switches, and VLAN routing.",
    iconName: "Network",
    icon: Network,
    colorTheme: {
      primary: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
      bg: "bg-blue-50/40",
      border: "border-blue-100 dark:border-blue-900/30",
      accent: "blue",
      glow: "shadow-blue-500/5",
    },
    problemStatement: {
      problem:
        "Degraded network cables, unstable retail Wi-Fi networks, constant IP address conflicts, and slow file access disrupt daily operational tasks.",
      impact:
        "Causes dropped video calls, sluggish database access, compromises corporate assets on unsecure routers, and stops sales transactions entirely.",
    },
    solutionExplanation:
      "Syntax Technology specializes in structured Gigabit network cabling (Cat6/Cat6A) and fiber optic installations. We configure intelligent managed switches, partition secure virtual networks (VLANs) to separate staff computers from visitor guest lines, and deploy high-performance Wi-Fi access points to deliver flawless wireless speeds throughout your physical building.",
    whoItIsFor: [
      "Corporate Enterprise Offices on Multiple Floors",
      "Financial Institutions and Bank Branches",
      "Busy Retail Showrooms and Hospitality Venues",
      "Industrial Parks, Warehouses, and Corporate Sites",
    ],
    keyBenefits: [
      {
        title: "Flawless Gigabit Network Speeds",
        description:
          "Structured Cat6 copper cabling guarantees continuous Gigabit throughput with zero signal attenuation or frame loss.",
      },
      {
        title: "VLAN Security Partitioning",
        description:
          "Isolate accounting databases and critical servers from visitor Wi-Fi to shield corporate assets from potential breaches.",
      },
      {
        title: "Seamless High-Density Wi-Fi Coverage",
        description:
          "Deploy commercial-grade wireless access points supporting dynamic roaming, so users stay connected as they move between floors.",
      },
      {
        title: "Dual WAN Failover Redundancy",
        description:
          "Configure core router systems with primary and secondary fiber lines, automatically switching in milliseconds if one provider drops.",
      },
    ],
    implementationProcess: [
      {
        title: "Phase 1: Wireless & Trunk Audit",
        description:
          "Map out the building's physical structure to find the shortest cable paths, avoiding high-voltage electrical lines to prevent signal interference.",
      },
      {
        title: "Phase 2: Structured Cable Routing",
        description:
          "Install protective trunking and route premium copper Cat6 cables from individual office desks back to patch panels.",
      },
      {
        title: "Phase 3: Terminations and Fluke Testing",
        description:
          "Terminate Cat6 RJ45 points, punch them down, and execute rigorous digital cable continuity tests to verify full speed.",
      },
      {
        title: "Phase 4: Switch Routing & VLAN Config",
        description:
          "Configure the managed switches, establish subnets, setup VLANs, and assign static IPs for corporate hardware.",
      },
      {
        title: "Phase 5: Wi-Fi Optimization & Launch",
        description:
          "Mount physical access points, tune signal frequencies to mitigate channel interference, and secure the wireless keys.",
      },
    ],
    relatedSolutions: ["it-infrastructure", "technical-support"],
    relevantProjectIds: ["proj-2"],
    faq: [
      {
        question: "Why should we choose structured cabling instead of only relying on Wi-Fi?",
        answer:
          "While Wi-Fi is highly convenient for mobile devices, it remains vulnerable to signal blockage from concrete walls, wireless interference, and bandwidth drops. Structured copper Cat6 cabling delivers dedicated, uninterrupted Gigabit speed to every desk. It is the absolute prerequisite for stable VoIP phones, IP surveillance, and secure server access.",
      },
      {
        question: "Can your team splice and terminate fiber optic cables?",
        answer:
          "Yes. Our cabled network engineers are fully trained and equipped with fiber fusion splicers. We terminate fiber optic lines to connect distant buildings or link major floor distribution racks back to the main server room.",
      },
      {
        question: "What is dual-WAN failover?",
        answer:
          "Dual-WAN failover connects two separate internet lines (e.g. Fiber from Provider A and a backup line from Provider B) to one router. If Provider A suffers a physical fiber line cut, our smart router automatically transfers all office traffic to Provider B in less than 2 seconds, preventing business disruption.",
      },
    ],
  },
  {
    id: "technical-support",
    title: "Technical Support",
    shortDescription:
      "Proactive preventative maintenance, SLA-driven computer cleanup, anti-virus audits, and helpdesk ticketing dispatch.",
    iconName: "Wrench",
    icon: Wrench,
    colorTheme: {
      primary: "text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20",
      bg: "bg-emerald-50/40",
      border: "border-emerald-100 dark:border-emerald-900/30",
      accent: "emerald",
      glow: "shadow-emerald-500/5",
    },
    problemStatement: {
      problem:
        "Workstations run slowly, security patches are ignored, and random hardware failures occur without a dedicated IT specialist on payroll.",
      impact:
        "Drains staff productivity, exposes critical files to ransomware entry vectors, and results in expensive, emergency tech consulting fees.",
    },
    solutionExplanation:
      "Syntax Tech Support delivers SLA-driven preventative maintenance and diagnostic service agreements. We execute regular on-site hardware inspections, remove dust, monitor hard-drive lifespans, update operating systems, configure cloud backup habits, and maintain a dedicated remote ticketing helpdesk to resolve minor glitches instantly.",
    whoItIsFor: [
      "Small-to-Medium Private Enterprises (SMEs)",
      "Legal, Accounting, and Medical Office Clinics",
      "Corporate Teams requiring guaranteed uptime SLAs",
      "Organizations operating without a dedicated IT Officer",
    ],
    keyBenefits: [
      {
        title: "Extended Workstation Lifespan",
        description:
          "Regular physical maintenance, heat-sink cleaning, and thermal grease checks prevent processors from overheating and failing.",
      },
      {
        title: "SLA-Guaranteed Response Times",
        description:
          "Our SLA contracts specify quick response times, dispatching a physical engineer directly to your office when critical failures occur.",
      },
      {
        title: "Proactive Cyber Hygiene",
        description:
          "We install centralized anti-virus software, automate software security patches, and audit firewall configurations regularly.",
      },
      {
        title: "Peace of Mind Helpdesk Access",
        description:
          "Employees can log support tickets directly or call our dispatch queue to receive swift remote helpdesk assistance.",
      },
    ],
    implementationProcess: [
      {
        title: "Phase 1: IT Asset & Baseline Audit",
        description:
          "We document every computer model, serial number, operating system version, and disk health rating in your office.",
      },
      {
        title: "Phase 2: Remote Management Setup",
        description:
          "Install secure remote-support tools onto client workstations, enabling our engineers to resolve bugs with authorization.",
      },
      {
        title: "Phase 3: Threat Mitigation & Cleaning",
        description:
          "Perform physical deep-cleaning of computer components, remove malware, update browsers, and configure standard system backups.",
      },
      {
        title: "Phase 4: SLA Agreement Onboarding",
        description:
          "Agree on service timelines, emergency dispatch rules, allocate ticket account logins, and establish priority guidelines.",
      },
      {
        title: "Phase 5: Ongoing Monthly Support Cycles",
        description:
          "Conduct monthly on-site checkups, pre-empting storage disk failures, and providing diagnostic status reports to managers.",
      },
    ],
    relatedSolutions: ["it-infrastructure", "networking"],
    relevantProjectIds: ["proj-2"],
    faq: [
      {
        question: "Does your support SLA cover physical hardware cleanings?",
        answer:
          "Yes. Our standard support agreements include physical, on-site hardware maintenance. We open computer towers, blow out static dust, clean fan bearings, and replace thermal paste to prevent critical overheating failures.",
      },
      {
        question: "What is your typical response time when we file a ticket?",
        answer:
          "We offer tiered SLA terms. Critical issues (such as office-wide network or server outages) are responded to within 2 hours. Normal workstation bugs are addressed within 4 to 8 hours, and minor adjustments within 24 hours.",
      },
      {
        question: "Can we buy ad-hoc support hours without an annual SLA contract?",
        answer:
          "Yes. While we strongly recommend monthly preventive SLAs to pre-empt security issues, we offer ad-hoc technical troubleshooting billed on a flat hourly rate for offices needing temporary support.",
      },
    ],
  },
  {
    id: "software-system-integration",
    title: "Software and System Integration",
    shortDescription:
      "Unifying biometric databases, corporate intranets, and external workflow APIs to reduce manual data double-entry.",
    iconName: "Combine",
    icon: Combine,
    colorTheme: {
      primary: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20",
      bg: "bg-amber-50/40",
      border: "border-amber-100 dark:border-amber-900/30",
      accent: "amber",
      glow: "shadow-amber-500/5",
    },
    problemStatement: {
      problem:
        "Staff copy-paste client details across disconnected systems, HR manually types attendance logs from standalone biometrics into payroll systems, and departments work in isolated information silos.",
      impact:
        "Wastes hours of administrative labor, triggers high typing errors, delays billing cycles, and prevents management from reviewing unified, accurate business records.",
    },
    solutionExplanation:
      "Syntax Software & System Integration connects separate hardware databases, local business databases, and cloud ERP systems. We build robust middleware pipelines, create custom database mirrors, and integrate APIs (Application Programming Interfaces) to automate administrative workflows and establish a single source of truth for your business.",
    whoItIsFor: [
      "Companies using multiple software systems in parallel",
      "HR divisions looking to bridge biometric terminals with payroll",
      "Logistics firms wanting vehicle tracks pushed to customer apps",
      "SMEs seeking automated back-office operations",
    ],
    keyBenefits: [
      {
        title: "Eradicate Manual Data Double-Entry",
        description:
          "Save hours of daily office labor by allowing systems to securely transfer records automatically without human intervention.",
      },
      {
        title: "Single Source of Truth",
        description:
          "Maintain absolute data consistency so that employee records, inventory status, and billing details match across all portals.",
      },
      {
        title: "Real-Time Operational Alerts",
        description:
          "Configure system integrations to trigger automated emails, SMS, or Telegram alerts when specific security or log events occur.",
      },
      {
        title: "Robust Customized Reports",
        description:
          "Compile and present unified operational statistics drawn from multiple database engines onto a single visual dashboard.",
      },
    ],
    implementationProcess: [
      {
        title: "Phase 1: DB Schema & Endpoint Review",
        description:
          "Audit current software databases, analyze schema tables, and verify available manufacturer APIs or SQL connection options.",
      },
      {
        title: "Phase 2: Data Flow Mapping",
        description:
          "Construct the structural logic plan, detailing how records will sync, and establish conflict resolution rules.",
      },
      {
        title: "Phase 3: Integration Development",
        description:
          "Surgically write the secure middleware connectors, API scripts, and database mirror pipelines in our staging lab.",
      },
      {
        title: "Phase 4: Sync Testing & Data Integrity Check",
        description:
          "Execute thorough simulation routines, verifying that network interruptions or invalid fields are managed without data loss.",
      },
      {
        title: "Phase 5: Production Launch & Monitoring",
        description:
          "Deploy the integrated system, secure SQL access permissions, and hand over the API configuration keys and documentation.",
      },
    ],
    relatedSolutions: ["biometric-attendance", "access-control"],
    relevantProjectIds: ["proj-1"],
    faq: [
      {
        question: "Can you connect old, legacy database software with modern web portals?",
        answer:
          "Yes. We design and deploy custom middleware connectors. These connectors are lightweight local services that safely query and push data from legacy database files (such as local MS Access, old SQL Server or Postgres tables) to modern cloud environments securely.",
      },
      {
        question: "How secure is the integrated data transfer process?",
        answer:
          "We apply rigorous industry-standard safety practices. All data transferred between systems is fully encrypted using TLS/HTTPS pathways, API access tokens are rotated, database permissions are locked to specific subnets, and we build thorough audit logs tracking every event.",
      },
      {
        question: "What happens if our office internet drops during a sync cycle?",
        answer:
          "Our middleware features safe queue management. If a sync cycle fails due to a network drop, the systems safely cache the pending data records locally, resuming transmission automatically when the network recovers without duplicating or losing data.",
      },
    ],
  },
];

export const getSolutionById = (id: string): SolutionDetail | undefined => {
  return SOLUTIONS_DATA.find((s) => s.id === id);
};
