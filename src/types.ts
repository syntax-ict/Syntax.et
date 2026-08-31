export interface ServiceItem {
  name: string;
  description: string;
  iconName: string;
  benefits: string[];
}

export interface BusinessPillar {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  iconName: string;
  services: ServiceItem[];
  colorTheme: {
    primary: string;
    bg: string;
    border: string;
    accent: string;
  };
}

export interface CustomerProblem {
  id: string;
  targetUser: string;
  problem: string;
  impact: string;
  solution: string;
  pillarId: string;
}

export interface Course {
  id: string;
  title: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  mode: "Online training" | "Face-to-face training" | "Corporate training";
  description: string;
  syllabus: string[];
  skillsGained: string[];
  category?: string;
  targetAudience?: string[];
  schedule?: string;
  location?: string;
  requirements?: string[];
  price?: string;
  modules?: { title: string; topics: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  pillarId: string;
  clientType: "Government" | "Private Enterprise" | "Retail Hub" | "Corporate Office";
  description: string;
  results: string[];
  deliverables: string[];
  category?: string;
  industry?: string;
  challenge?: string;
  solutionDetail?: string;
  scopeOfImplementation?: string[];
  technologiesInvolved?: string[];
  images?: string[];
  outcome?: string;
}

export interface Lead {
  id: string;
  type: "consultation" | "quote" | "training" | "support";
  status: "Pending Review" | "In Contact" | "In Progress" | "Resolved" | "Completed";
  createdAt: string;
  data: any;
  notes?: string;
}

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
