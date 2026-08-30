/**
 * Admin panel: Sanctum cookie authentication plus lead (inquiry)
 * management — the two things the old LeadPortal component already tried
 * to do, now backed by real auth instead of a client-side boolean
 * (architecture §7/§8/§9). Content management, contact-message handling,
 * and course-registration management exist on the backend but have no
 * frontend screen yet — see docs/INTEGRATION_MATRIX.md's scope decisions.
 */
import { apiRequest, apiRequestPaginated, ensureCsrfCookie } from "./apiClient";
import type { PaginatedResult } from "./apiClient";
import type { InquiryStatus, InquiryType } from "./leads";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff";
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export const login = async (email: string, password: string): Promise<AdminUser> => {
  await ensureCsrfCookie();
  return apiRequest<AdminUser>("/api/admin/login", { method: "POST", body: { email, password } });
};

export const logout = async (): Promise<void> => {
  await ensureCsrfCookie();
  await apiRequest<void>("/api/admin/logout", { method: "POST" });
};

export const me = () => apiRequest<AdminUser>("/api/admin/me");

export interface InquiryNote {
  id: number;
  body: string;
  author: { id: number; name: string } | null;
  created_at: string;
}

export interface AdminInquiry {
  id: number;
  reference: string;
  type: InquiryType;
  full_name: string;
  email: string;
  phone: string;
  organization: string | null;
  subject: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: InquiryStatus;
  details: string;
  meta: Record<string, unknown> | null;
  assignee: { id: number; name: string } | null;
  notes?: InquiryNote[];
  created_at: string;
  updated_at: string;
}

export interface InquiryFilters {
  type?: InquiryType;
  status?: InquiryStatus;
  assigned_to?: number;
  page?: number;
}

export const listInquiries = (
  filters: InquiryFilters = {},
): Promise<PaginatedResult<AdminInquiry>> => {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.assigned_to) params.set("assigned_to", String(filters.assigned_to));
  if (filters.page) params.set("page", String(filters.page));
  const qs = params.toString();

  return apiRequestPaginated<AdminInquiry>(`/api/admin/inquiries${qs ? `?${qs}` : ""}`);
};

export const getInquiry = (id: number) => apiRequest<AdminInquiry>(`/api/admin/inquiries/${id}`);

export const updateInquiry = async (
  id: number,
  changes: Partial<Pick<AdminInquiry, "status" | "priority">> & { assigned_to?: number | null },
): Promise<AdminInquiry> => {
  await ensureCsrfCookie();
  return apiRequest<AdminInquiry>(`/api/admin/inquiries/${id}`, {
    method: "PATCH",
    body: changes,
  });
};

export const addInquiryNote = async (id: number, body: string): Promise<InquiryNote> => {
  await ensureCsrfCookie();
  return apiRequest<InquiryNote>(`/api/admin/inquiries/${id}/notes`, {
    method: "POST",
    body: { body },
  });
};
