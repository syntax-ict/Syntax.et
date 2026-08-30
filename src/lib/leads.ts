/**
 * Public write endpoints: consultation/quote/support requests, course
 * registrations, and the reference-based status lookup (architecture §6).
 * Replaces the old `/api/leads` endpoint entirely — see
 * docs/INTEGRATION_MATRIX.md for the field-by-field mapping.
 */
import { apiRequest } from "./apiClient";

export type InquiryType = "consultation" | "quote" | "support";
export type InquiryStatus =
  | "pending_review"
  | "in_contact"
  | "in_progress"
  | "resolved"
  | "completed";

export interface InquirySummary {
  reference: string;
  type: InquiryType;
  status: InquiryStatus;
  created_at: string;
}

export interface SubmitInquiryPayload {
  type: InquiryType;
  full_name: string;
  email: string;
  phone: string;
  organization?: string;
  details: string;
  subject?: string; // required for type "support"
  priority?: "low" | "medium" | "high" | "urgent";
  meta?: {
    problem_area?: string; // required for type "consultation"
    budget?: string;
    selected_services?: string[]; // required for type "quote" — real service slugs
    quantity?: number;
    timeline?: string;
    is_priority?: boolean;
  };
  /** Honeypot — must stay empty. Never render this field visibly. */
  website_url?: string;
}

export const submitInquiry = (payload: SubmitInquiryPayload) =>
  apiRequest<InquirySummary>("/api/inquiries", { method: "POST", body: payload });

export const lookupInquiry = (reference: string) =>
  apiRequest<InquirySummary>(`/api/inquiries/${encodeURIComponent(reference)}`);

export type RegistrationStatus = "pending" | "confirmed" | "waitlisted" | "cancelled" | "completed";

export interface CourseRegistrationSummary {
  id: number;
  status: RegistrationStatus;
  course: { title: string };
  created_at: string;
}

export interface SubmitCourseRegistrationPayload {
  course_id: number;
  full_name: string;
  email: string;
  phone: string;
  organization?: string;
  training_mode: "online" | "face_to_face" | "corporate";
  experience_level: string;
  goals: string;
  website_url?: string;
}

export const submitCourseRegistration = (payload: SubmitCourseRegistrationPayload) =>
  apiRequest<CourseRegistrationSummary>("/api/course-registrations", {
    method: "POST",
    body: payload,
  });
