import type { BusinessPillar, CustomerProblem, Course, PortfolioProject } from "./types";

export const BUSINESS_PILLARS: BusinessPillar[] = [
  {
    id: "tech-solutions",
    title: "Technology Solutions",
    shortDescription: "Integrated high-performance network, software, and physical computing infrastructures designed for enterprise growth.",
    detailedDescription: "In today's digital landscape, modern organizations require robust, secure, and unified systems. Syntax Technology designs, deploys, and manages international-standard IT infrastructures that eliminate operational friction.",
    iconName: "Cpu",
    colorTheme: {
      primary: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      accent: "blue"
    },
    services: [
      {
        name: "IT Infrastructure & Networking",
        description: "High-speed structured copper and fiber optic cabling, professional routing, switching, and robust WAN/LAN designs.",
        iconName: "Network",
        benefits: ["Zero network downtime", "Secure bandwidth partitioning", "Scalable for future offices"]
      },
      {
        name: "System Integration & Automation",
        description: "Unifying multi-vendor systems, hardware, cloud instances, and workflows into a single manageable ecosystem.",
        iconName: "Combine",
        benefits: ["Reduced administrative overhead", "Synchronized cross-departmental data", "Eliminate double-handling"]
      },
      {
        name: "Software Solutions",
        description: "Development, configuration, and implementation of business-specific management software and ERP extensions.",
        iconName: "Code2",
        benefits: ["Tailored work tools", "Automated routine reports", "Centralized user permissions"]
      },
      {
        name: "Computer Maintenance & Support",
        description: "SLA-driven physical hardware cleaning, operating system updates, anti-virus protocols, and proactive optimization.",
        iconName: "Wrench",
        benefits: ["Extended hardware lifespan", "Pre-empt failures before they disrupt", "24/7 dedicated Helpdesk SLA"]
      }
    ]
  },
  {
    id: "security-smart",
    title: "Security & Smart Systems",
    shortDescription: "Comprehensive commercial surveillance, access control, and biometrics to safeguard assets and audit operations.",
    detailedDescription: "Physical security is the bedrock of business continuity. We deploy smart biometrics, IP camera surveillance, and fleet GPS solutions that provide ultimate control, absolute safety, and accurate operational metrics.",
    iconName: "Shield",
    colorTheme: {
      primary: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      accent: "emerald"
    },
    services: [
      {
        name: "CCTV & Surveillance",
        description: "Multi-megapixel IP camera arrays, network video recorders (NVR), night-vision infrared sensors, and remote secure mobile feeds.",
        iconName: "Camera",
        benefits: ["Complete blind-spot coverage", "High-fidelity incident footage", "Instant mobile alerts"]
      },
      {
        name: "Biometric Attendance & Access Control",
        description: "Face recognition and fingerprint readers connected to magnetic locks, enabling exact electronic logs of employee movement.",
        iconName: "Fingerprint",
        benefits: ["Eliminated buddy punching", "Perfect automated payroll sync", "Restricted secure zones"]
      },
      {
        name: "GPS & Fleet Tracking",
        description: "Real-time location, speed, fuel consumption monitoring, and geofencing limits for cars, bikes, and logistics vehicles.",
        iconName: "MapPin",
        benefits: ["Reduced unauthorized vehicle use", "Enhanced asset recovery security", "Lowered operational fuel costs"]
      },
      {
        name: "Security System Integration",
        description: "Wiring fire alarms, motion detectors, smart biometrics, and security shutters into centralized, easily managed emergency panels.",
        iconName: "Layers",
        benefits: ["Instant automated alarm response", "Unified multi-hazard monitoring", "Audit trail of every single access event"]
      }
    ]
  },
  {
    id: "training",
    title: "Professional Training",
    shortDescription: "Practical, industry-aligned technical skill development in digital security, automation, and core systems.",
    detailedDescription: "Technology is only as effective as the professionals operating it. Syntax Technology provides high-impact, short-term certification courses for students, working professionals, and corporate cohorts.",
    iconName: "BookOpen",
    colorTheme: {
      primary: "text-purple-600 bg-purple-50 dark:bg-purple-950/30",
      bg: "bg-purple-50/50",
      border: "border-purple-100",
      accent: "purple"
    },
    services: [
      {
        name: "Short-Term Technology Training",
        description: "Hands-on classes tailored to practical application, minimizing theoretical bloat to maximize functional skill capture.",
        iconName: "Timer",
        benefits: ["Completed in weeks, not years", "Flexible morning/evening classes", "Direct practical lab access"]
      },
      {
        name: "Corporate Team Training",
        description: "On-site customized workshops upskilling operations staff in enterprise systems, cyber hygiene, and business automation.",
        iconName: "Users",
        benefits: ["Custom-curated for your software", "Increased internal troubleshooting capability", "Minimizes reliance on external IT calls"]
      },
      {
        name: "Professional Digital Skills",
        description: "Advanced learning in digital collaboration tools, remote work software, office management, and networking systems.",
        iconName: "GraduationCap",
        benefits: ["Enhanced employee productivity", "Confidence with complex software", "CV booster with practical certification"]
      }
    ]
  },
  {
    id: "business-support",
    title: "Business Support",
    shortDescription: "Corporate branding, premium large-format printing, custom signage, and hardware advertising materials.",
    detailedDescription: "Beyond software and networks, brands must have a strong physical presence. Syntax Technology offers state-of-the-art print and marketing materials that align corporate identity with technology capabilities.",
    iconName: "Briefcase",
    colorTheme: {
      primary: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
      bg: "bg-amber-50/50",
      border: "border-amber-100",
      accent: "amber"
    },
    services: [
      {
        name: "Printing & Branding",
        description: "High-resolution corporate collateral printing, including custom brochures, executive stationery, business cards, and catalogues.",
        iconName: "Printer",
        benefits: ["Vibrant, true-to-life color calibration", "Premium weight materials", "Professional-grade design layout"]
      },
      {
        name: "Advertising & Signage",
        description: "Indoor acrylic branding, outdoor weatherproof LED lightboxes, pull-up banners, and high-visibility roadside signage systems.",
        iconName: "Megaphone",
        benefits: ["Eye-catching commercial presentation", "Durable materials for extreme weather", "End-to-end installation and wiring"]
      },
      {
        name: "Business Technology Support",
        description: "Sourcing and procuring specialized printing, POS terminal setups, scanning machinery, and commercial barcode solutions.",
        iconName: "Laptop",
        benefits: ["Guaranteed vendor-authorized hardware", "Pre-configured and tested on-site", "Direct local warranty handling"]
      }
    ]
  }
];

export const CUSTOMER_PROBLEMS: CustomerProblem[] = [
  {
    id: "prob-1",
    targetUser: "Government & Enterprise Leaders",
    problem: "Critical facilities struggle with blind spots, unmonitored entries, and fragmented security architectures.",
    impact: "Creates vulnerabilities, inventory shrinkage, and lack of accountability during crucial security incidents.",
    solution: "Syntax installs multi-megapixel, remotely viewable IP surveillance and biometric systems integrated into one secure local network.",
    pillarId: "security-smart"
  },
  {
    id: "prob-2",
    targetUser: "HR & Operations Managers",
    problem: "Manual attendance records, paper punch-cards, and spreadsheet-based tracking are prone to manipulation ('buddy punching') and manual entry errors.",
    impact: "Inflates payroll costs, wastes hours of HR time, and provides zero real-time insights into actual staff presence.",
    solution: "We deploy cloud-syncable biometric facial recognition and fingerprint access terminals that lock physical gates and feed directly to payroll engines.",
    pillarId: "security-smart"
  },
  {
    id: "prob-3",
    targetUser: "SMEs & Corporate Offices",
    problem: "Internal networks frequently drop, internet configurations fail, and computers crash without a dedicated IT officer on staff.",
    impact: "Halts sales, disrupts communication, causes data loss, and leaves staff stranded with tech bottlenecks.",
    solution: "Syntax provides dedicated, SLA-driven monthly computer maintenance, remote helpdesk assistance, and emergency on-site technician response.",
    pillarId: "tech-solutions"
  },
  {
    id: "prob-4",
    targetUser: "Growing Organizations",
    problem: "Using multiple disjointed software suites, outdated local hardware, and manual transfers that result in massive operational silos.",
    impact: "Slow customer delivery, high administrative error rates, and difficulty scaling up operations.",
    solution: "We execute customized system integrations and business automation routines that sync your hardware and software.",
    pillarId: "tech-solutions"
  },
  {
    id: "prob-5",
    targetUser: "Students, Job Seekers & Professionals",
    problem: "University courses provide heavy theoretical concepts but lack practical, hands-on configuration experience with modern workplace tech.",
    impact: "Graduates are uncompetitive in the job market, and current professionals struggle when assigned to modern biometric or IT deployment projects.",
    solution: "Our Technical Training center provides direct lab access to actual CCTV cameras, network routers, and biometric setups with professional guidance.",
    pillarId: "training"
  },
  {
    id: "prob-6",
    targetUser: "Corporate Marketing & Brands",
    problem: "Struggling with fragmented branding suppliers, low-quality printing, and generic signage that fails to present a premium image.",
    impact: "Diverts resources to multiple suppliers, resulting in inconsistent colors, delayed schedules, and diminished corporate credibility.",
    solution: "Syntax delivers end-to-end print, large-format sign, and hardware branding solutions, guaranteeing absolute consistency and visual premium.",
    pillarId: "business-support"
  }
];

export const COURSES: Course[] = [
  {
    id: "course-1",
    title: "CCTV Surveillance Design & Biometric Integration",
    duration: "4 Weeks (Short-Term)",
    level: "Intermediate",
    mode: "Face-to-face training",
    category: "Security & Intelligent Systems",
    description: "A highly practical masterclass covering the planning, wiring, networking, and commissioning of commercial IP surveillance networks and biometric authentication terminals.",
    targetAudience: [
      "Security Supervisors & Managers",
      "IT Administrators & Systems Integrators",
      "Field Technicians & Cabling Installers",
      "Graduates seeking hands-on industry skills"
    ],
    requirements: [
      "Basic computer literacy (mouse, keyboard, files)",
      "A personal laptop (Windows 10/11 or macOS with virtualization capability)",
      "No prior networking experience required (we start from scratch!)"
    ],
    schedule: "Mondays & Wednesdays (09:00 - 13:00) or Saturday Bootcamps (08:30 - 16:30)",
    location: "Syntax Training Labs, Block B, 2nd Floor, Kigali ICT Innovation Suite",
    price: "$299 (Includes physical equipment kit & lab manuals)",
    syllabus: [
      "Introduction to IP Cameras, Lenses, and Focal Lengths",
      "Network Switch design (PoE vs non-PoE, Cat6 structured cabling)",
      "NVR Configuration, Storage Calculation, and Motion-detection zones",
      "Biometric Terminal integration, Wiegand wiring, and electromagnetic lock triggers",
      "Central software setup for multi-device attendance tracking"
    ],
    skillsGained: [
      "Professional cabling and terminating",
      "Configuring network switches and IP subnets",
      "Troubleshooting signal loss and hard drive arrays",
      "Programming user access schedules on magnetic locks"
    ],
    modules: [
      {
        title: "Module 1: Lens Optics & Camera Placement Planning",
        topics: [
          "Understanding Focal Length (2.8mm, 4mm, 6mm) and Field of View",
          "Calculations for pixel density (DORI: Detect, Observe, Recognize, Identify)",
          "Evaluating lighting conditions (IR illumination, WDR, low-light performance)"
        ]
      },
      {
        title: "Module 2: Structured Cabling & Networking Essentials",
        topics: [
          "Cat6 UTP/STP cable crimping & RJ45 terminal testing",
          "Designing Power over Ethernet (PoE) budgets for multiple cameras",
          "IP addressing, subnets, and VLAN setup for CCTV isolation"
        ]
      },
      {
        title: "Module 3: NVR Hardware Configuration & Storage Architectures",
        topics: [
          "Hard drive calculations (H.264 vs H.265 smart compression efficiency)",
          "Configuring motion-triggered alerts and privacy masking",
          "Remote stream optimization for mobile devices and control rooms"
        ]
      },
      {
        title: "Module 4: Biometrics & Access Control Wiring",
        topics: [
          "Understanding Wiegand signaling protocols and power connections",
          "Wiring Fail-Safe and Fail-Secure locks with magnetic overrides",
          "Integrating door exit buttons, fire triggers, and biometric terminals"
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "Enterprise Networking & Security Foundations",
    duration: "6 Weeks (Short-Term)",
    level: "All Levels",
    mode: "Online training",
    category: "Enterprise IT Infrastructure",
    description: "Learn how to build, secure, and maintain computer networks for modern businesses, following global industry standards.",
    targetAudience: [
      "Aspiring Network Administrators",
      "IT Helpdesk Support Staff",
      "Systems Architects & Operations Leads",
      "Small Business Owners seeking in-house technical capability"
    ],
    requirements: [
      "Comfortable with fundamental operating system concepts",
      "High-speed internet connection for practical simulation exercises",
      "A laptop with at least 8GB RAM (required for running virtual lab topologies)"
    ],
    schedule: "Tuesdays & Thursdays (18:00 - 20:30 CAT) - Evening Cohorts",
    location: "Virtual Interactive Lab Classroom (Access to physical switches via remote tunneling)",
    price: "$349 (Includes simulator licenses, cloud credits, and certificate)",
    syllabus: [
      "The OSI Model, IP Addressing, and Subnetting",
      "Router & Switch Configuration (LAN setup and secure routing)",
      "Wi-Fi Network optimization and commercial Access Point zoning",
      "Firewall basics, VPN setup, and cyber hygiene controls",
      "Network monitoring tools and troubleshooting protocols"
    ],
    skillsGained: [
      "Designing multi-room office LAN architectures",
      "Configuring secure guest networks",
      "Mitigating wireless interference",
      "Utilizing Wireshark for diagnostic checks"
    ],
    modules: [
      {
        title: "Module 1: Network Standards & IP Topology Setup",
        topics: [
          "The 7-Layer OSI model explained through real-world packet travel",
          "IPv4 Subnetting schemes (VLSM) to prevent IP exhaustion",
          "Network topology documentation and planning with Cisco Packet Tracer"
        ]
      },
      {
        title: "Module 2: Routing Protocols & Active VLAN Segregation",
        topics: [
          "Static routing, OSPF configurations, and gateway redundancy",
          "Setting up virtual LANs (VLANs) to segregate accounts, HR, and guest traffic",
          "Inter-VLAN routing using Layer 3 switches (Router-on-a-Stick)"
        ]
      },
      {
        title: "Module 3: Wireless Optimization & Access Point Zoning",
        topics: [
          "Wi-Fi RF channels, overlapping issues, and interference diagnostics",
          "Configuring multi-AP networks with single SSID roaming controls",
          "Enterprise authentication (WPA2/WPA3 enterprise, captive portals)"
        ]
      },
      {
        title: "Module 4: Practical Perimeter Security & VPN Setups",
        topics: [
          "Setting up access control lists (ACLs) to filter malicious packets",
          "Configuring secure remote-access VPN tunnels for work-from-home staff",
          "Network scanning, threat detection, and mitigation of rogue DHCP servers"
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: "Office Technology & Business Automation",
    duration: "3 Weeks (Short-Term)",
    level: "Beginner",
    mode: "Corporate training",
    category: "Business Technology & Automation",
    description: "Designed for corporate cohorts looking to fully master modern business tech support, printer networks, scanning pipelines, and basic automation scripts.",
    targetAudience: [
      "Office Administrators & Operations Managers",
      "Corporate Teams seeking upskilling",
      "Customer Support professionals",
      "Administrative Assistants & Executives"
    ],
    requirements: [
      "Basic use of office applications (Word, Excel, Email)",
      "A personal or work laptop running Windows 10/11 or macOS",
      "No programming or technical coding background needed"
    ],
    schedule: "Custom schedules tailored to corporate client operational hours (On-demand)",
    location: "Delivered on-site at client premises OR at Syntax Executive Training Center",
    price: "Custom quotation based on corporate cohort size (Contact Support)",
    syllabus: [
      "Shared Network Printer Setup and Barcode scanner integration",
      "Cloud backup systems (Drive/OneDrive) and data redundancy habits",
      "Troubleshooting computer slowdowns, malware, and browser errors",
      "Introduction to workflow automation tools",
      "Essential operating system security hygiene"
    ],
    skillsGained: [
      "Resolving common driver and spooler problems",
      "Deploying secure cloud workflows",
      "Preventing corporate phishing and malware entries",
      "Saves up to 5 hours of manual office tasks per week"
    ],
    modules: [
      {
        title: "Module 1: Workplace Hardware Network Orchestration",
        topics: [
          "Adding and configuring shared office network printers (IP printing)",
          "Setting up secure Scan-to-Email and Scan-to-Folder (SMB) profiles",
          "Deploying and testing handheld barcode & RFID inventory scanners"
        ]
      },
      {
        title: "Module 2: Cloud Redundancy & Corporate Document Syncing",
        topics: [
          "Implementing auto-sync rules with Google Workspace and MS OneDrive",
          "Document version history control and collaborative folder structures",
          "Recovering lost files and preventing accidental deletion overhead"
        ]
      },
      {
        title: "Module 3: Level 1 Tech Troubleshooting & System Optimizations",
        topics: [
          "Clearing print queues, dealing with driver crashes and spooler errors",
          "Detecting malware symptoms, browser hijacks, and managing startup lists",
          "Hardware health diagnostics (checking SSD wear, thermal throttling, RAM usage)"
        ]
      },
      {
        title: "Module 4: Business Process Automation with Low-Code Tools",
        topics: [
          "Creating automatic email responses triggered by web forms (Zapier/Make)",
          "Building automated digital intake systems with Excel & Google Sheets sync",
          "Best practices for digital data security and password management"
        ]
      }
    ]
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "proj-1",
    title: "Integrated IP Surveillance & Biometric Gates Setup",
    pillarId: "security-smart",
    clientType: "Government",
    description: "Syntax designed and deployed a comprehensive biometric entry gate and multi-channel CCTV security system for a high-security administrative facility.",
    category: "Security & Intelligent Systems",
    industry: "Public Sector Administration",
    challenge: "A high-security administrative facility required restricted, auditable access across 8 external entry points and main distribution hubs to prevent tailgating and log unauthorized entries. Existing physical security lacked unified digital tracking, leading to manual paper guest books and severe visual monitoring bottlenecks.",
    solutionDetail: "Syntax designed and deployed a comprehensive biometric entry gate and multi-channel CCTV security system. This involved integrating Suprema biometric terminal readers with dual-lane active optical turnstiles, establishing a secure localized local area network (VLAN) for the security grid, and creating a dedicated master security monitor room.",
    scopeOfImplementation: [
      "Conducted site assessment for camera placement and angle optimization across all 8 perimeter entries.",
      "Installed and configured 24 Full-HD weather-sealed night-vision IP CCTV cameras with active motion tracking.",
      "Wired Supratech Biometric terminal systems to electromagnetic lock gates and dual turnstile systems.",
      "Terminated structured Cat6 cables back to a central server cabinet housing PoE switches and NVR units.",
      "Configured a centralized, multi-display security monitoring room with dedicated operator training."
    ],
    technologiesInvolved: [
      "Supratech Fingerprint & Access Terminals",
      "Hikvision Full-HD Varifocal IP Cameras",
      "Gigabit PoE+ Layer 2 Managed Switches",
      "32-Channel Network Video Recorder (NVR) with 16TB SAS RAID Storage",
      "Dual-Lane Automatic Hydraulic Turnstiles",
      "Shielded Cat6 STP Cabling & Dedicated Fire Alarm Relays"
    ],
    images: ["/assets/portfolio/cctv_setup.svg"],
    results: [
      "Audited 100% of employee entry/exit timestamps",
      "Zero unauthorized access incidents reported post-launch",
      "Secured 8 external entry points and main distribution hubs"
    ],
    deliverables: [
      "24 Full-HD Night-Vision IP CCTV cameras",
      "Supratech Biometric terminal systems wired to dual turnstiles",
      "Central secure security monitor room configuration"
    ],
    outcome: "A fully digitized audit trail of all personnel movements. The facility successfully digitized 100% of employee entry/exit timestamps, eliminated unauthorized tailgating incidents entirely, and secured 8 external entry points with continuous, real-time video surveillance recorded securely."
  },
  {
    id: "proj-2",
    title: "Corporate LAN Overhaul & Monthly Preventive Support SLA",
    pillarId: "tech-solutions",
    clientType: "Private Enterprise",
    description: "Overhauled a degraded, slow-speed cabling system for an enterprise office occupying 3 floors, moving them to unified structured Cat6 networks with redundant active backups.",
    category: "Enterprise IT Infrastructure",
    industry: "Private Enterprise / Corporate Office",
    challenge: "An enterprise office occupying 3 floors suffered from frequent network drops, localized IP conflicts, slow file transfer speeds capping at 10Mbps, and messy unlabelled network patch cables. The lack of standard rack management and network segregation led to daily operational downtime.",
    solutionDetail: "Syntax performed a full structured cabling overhaul. We removed legacy wiring, installed premium 42U server cabinets, laid 120 custom-terminated Cat6 runs, and deployed managed gigabit switches to segregate HR, accounts, and guest networks via VLANs. We secured their operations with an ongoing Monthly Preventive Support SLA.",
    scopeOfImplementation: [
      "Conducted cable audits and tracing of existing unstructured paths across three office floors.",
      "Installed heavy-duty ceiling cable trays and wall-mount conduits to prevent physical wire stress.",
      "Ran and terminated 120 custom Cat6 data outlets across desks, printers, and access points.",
      "Assembled a central 42U Server cabinet with managed active cooling, clean patch panels, and 1.5kVA Online UPS backups.",
      "Configured and verified VLAN segregation and DHCP failover scopes.",
      "Integrated a localized ticketing portal for our proactive preventive maintenance support SLA."
    ],
    technologiesInvolved: [
      "Category 6 UTP Pure Copper Cabling",
      "Managed 24-Port Gigabit Layer 3 Switches",
      "Dual-WAN Load Balancing Router",
      "1.5kVA Rackmount Uninterruptible Power Supply (UPS)",
      "42U Equipment Server Cabinets with active fans",
      "Fluke Network Cable Analyzer for certified dB loss testing"
    ],
    images: ["/assets/portfolio/networking_setup.svg"],
    results: [
      "Restored network speeds from 10Mbps to full Gigabit capability",
      "Eliminated internet dropouts and routing conflicts entirely",
      "Provided 100% operational uptime via our ongoing monthly computer maintenance contract"
    ],
    deliverables: [
      "120 structured data endpoints custom terminated",
      "Premium rackmount switches, patch panels, and server cabinets",
      "Ongoing monthly on-site SLA testing and helpdesk integration"
    ],
    outcome: "Restored network speeds from 10Mbps to full Gigabit capability across all 3 floors, eliminating internet dropouts. Provided 100% operational uptime through our ongoing monthly computer maintenance contract and certified structured layouts."
  },
  {
    id: "proj-3",
    title: "Exterior LED Lightboxes & Corporate Acrylic Branding Layout",
    pillarId: "business-support",
    clientType: "Retail Hub",
    description: "Created high-visibility brand presence for a busy commercial showroom. This project synchronized their physical advertising presence with corporate design aesthetics.",
    category: "Business Technology & Automation",
    industry: "Retail & Commercial Hub",
    challenge: "A busy commercial showroom required a prominent visual brand presence that could survive harsh weather conditions while keeping energy costs efficient. Their interior brand assets lacked consistency, undermining customer perception in a competitive retail district.",
    solutionDetail: "Syntax designed, fabricated, and installed custom exterior LED backlit lightboxes and interior premium laser-cut acrylic corporate signboards. The system uses high-efficiency Samsung LED modules paired with twilight sensors, alongside highly durable rustproof aluminum framing designed to survive Kigali's tropical rainy seasons.",
    scopeOfImplementation: [
      "Analyzed the storefront structural dimensions and local daylight intensities.",
      "Fabricated an 8-meter heavy-gauge aluminum exterior frame with weatherproof seals.",
      "Mounted high-efficiency IP67 Samsung LED backlight modules with automatic photo-sensor switches.",
      "Precision laser-cut 10mm premium acrylic logo pieces for the internal lobby main feature wall.",
      "Installed branded directional acrylic plaques, frosted glass safety signs, and customized pull-up exhibition banners."
    ],
    technologiesInvolved: [
      "Samsung IP67 High-Lumen LED Modules",
      "Weatherproof Twilight Photo-Sensors & MeanWell Power Transformers",
      "Rustproof Powder-Coated Aluminum Framing & Polycarbonate Diffuser Sheets",
      "Laser-Cut Acrylic sheets (10mm depth) with dual-pigment corporate coloring",
      "Premium vinyl film overlays for directional glass signage"
    ],
    images: ["/assets/portfolio/branding_setup.svg"],
    results: [
      "Increased walk-in visitor traffic by approximately 35%",
      "Consistent color profiling matching corporate RGB vectors",
      "Highly durable weatherproof installation surviving heavy season rains"
    ],
    deliverables: [
      "8-meter weatherproof LED-lit storefront signboard",
      "Internal premium laser-cut acrylic logo wall",
      "Branded directional signs and pull-up banners"
    ],
    outcome: "Significantly increased walk-in visitor traffic by approximately 35% through enhanced brand visibility. Maintained consistent corporate color matching across all lightboxes and interior walls, with high-durability seals surviving severe weather conditions without water ingress."
  }
];
