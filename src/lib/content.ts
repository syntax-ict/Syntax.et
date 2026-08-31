/**
 * Public read-only content endpoints (architecture §5). Types here match
 * the backend's actual resource shape, not the old mock data's — see
 * docs/INTEGRATION_MATRIX.md for exactly what's missing compared to the
 * old SOLUTIONS_DATA/PORTFOLIO_PROJECTS/COURSES mocks and why.
 */
import { apiRequest } from "./apiClient";

export interface CategoryRef {
  slug: string;
  name: string;
}

export interface ColorTheme {
  primary: string;
  bg: string;
  border: string;
  accent: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  name: string;
  short_description: string;
  description: string;
  icon: string;
  benefits: string[];
  is_featured: boolean;
  category?: CategoryRef;
  faqs?: ServiceFaq[];
}

export interface SolutionCategory {
  slug: string;
  name: string;
  short_description: string;
  detailed_description: string;
  icon: string;
  color_theme: ColorTheme;
  services?: Service[];
}

export interface CustomerProblem {
  id: number;
  target_user: string;
  problem: string;
  impact: string;
  solution: string;
  category?: { slug: string };
}

export interface CoursePrice {
  amount: string | null;
  currency: string;
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced" | "all_levels";
  mode: "online" | "face_to_face" | "corporate";
  description: string;
  syllabus: string[];
  skills_gained: string[];
  target_audience: string[] | null;
  requirements: string[] | null;
  modules: { title: string; topics: string[] }[] | null;
  schedule: string | null;
  location: string | null;
  price: CoursePrice;
  category?: CategoryRef | null;
}

export interface ProjectImage {
  url: string;
  alt_text: string;
}

export interface Project {
  slug: string;
  title: string;
  client_type: "government" | "private_enterprise" | "retail_hub" | "corporate_office";
  industry: string | null;
  description: string;
  challenge: string | null;
  solution_detail: string | null;
  outcome: string | null;
  scope_of_implementation: string[] | null;
  technologies_involved: string[] | null;
  deliverables: string[];
  results: string[];
  is_featured: boolean;
  category?: CategoryRef | null;
  images?: ProjectImage[];
}

export const listSolutionCategories = () =>
  apiRequest<SolutionCategory[]>("/api/solution-categories");

export const getSolutionCategory = (slug: string) =>
  apiRequest<SolutionCategory>(`/api/solution-categories/${encodeURIComponent(slug)}`);

export const listServices = () => apiRequest<Service[]>("/api/services");

export const getService = (slug: string) =>
  apiRequest<Service>(`/api/services/${encodeURIComponent(slug)}`);

export const listCustomerProblems = () => apiRequest<CustomerProblem[]>("/api/customer-problems");

export const listCourses = () => apiRequest<Course[]>("/api/courses");

export const getCourse = (slug: string) =>
  apiRequest<Course>(`/api/courses/${encodeURIComponent(slug)}`);

export const listProjects = () => apiRequest<Project[]>("/api/projects");

export const getProject = (slug: string) =>
  apiRequest<Project>(`/api/projects/${encodeURIComponent(slug)}`);

const COURSE_LEVEL_LABELS: Record<Course["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all_levels: "All Levels",
};

/** "all_levels" -> "All Levels", for display and for the level filter's values. */
export const formatCourseLevel = (value: Course["level"]): string =>
  COURSE_LEVEL_LABELS[value] ?? value;

const COURSE_MODE_LABELS: Record<Course["mode"], string> = {
  online: "Online training",
  face_to_face: "Face-to-face training",
  corporate: "Corporate training",
};

/** "face_to_face" -> "Face-to-face training", for display and delivery badges. */
export const formatCourseMode = (value: Course["mode"]): string =>
  COURSE_MODE_LABELS[value] ?? value;

/** {amount:"350.00",currency:"ETB"} -> "ETB 350.00"; null amount -> fallback. */
export const formatCoursePrice = (price: CoursePrice, fallback = "Custom Quote"): string =>
  price.amount ? `${price.currency} ${price.amount}` : fallback;

const CLIENT_TYPE_LABELS: Record<Project["client_type"], string> = {
  government: "Government",
  private_enterprise: "Private Enterprise",
  retail_hub: "Retail Hub",
  corporate_office: "Corporate Office",
};

/** "private_enterprise" -> "Private Enterprise", for display only. */
export const formatClientType = (value: Project["client_type"]): string =>
  CLIENT_TYPE_LABELS[value] ?? value;
