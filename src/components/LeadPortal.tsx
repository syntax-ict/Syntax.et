import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Search,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Clock,
  AlertCircle,
  Loader2,
  LogOut,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { useLocalization } from "../context/useLocalization";
import { ApiError, describeApiError } from "../lib/apiClient";
import { lookupInquiry } from "../lib/leads";
import type { InquirySummary, InquiryStatus, InquiryType } from "../lib/leads";
import {
  login,
  logout,
  me,
  listInquiries,
  getInquiry,
  updateInquiry,
  addInquiryNote,
} from "../lib/admin";
import type { AdminUser, AdminInquiry, InquiryNote } from "../lib/admin";
import { useFetch } from "../hooks/useFetch";

interface LeadPortalProps {
  /** The reference of the ticket just submitted, if any — prefills and
   * auto-runs the "Track My Ticket" lookup so a visitor immediately sees
   * the status of what they just filed. */
  lastReference: string | null;
}

const STATUS_LABELS: Record<InquiryStatus, string> = {
  pending_review: "Pending Review",
  in_contact: "In Contact",
  in_progress: "In Progress",
  resolved: "Resolved",
  completed: "Completed",
};

const STATUS_STYLES: Record<InquiryStatus, string> = {
  pending_review:
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
  in_contact:
    "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
  in_progress:
    "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30",
  resolved:
    "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
  completed:
    "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
};

const TYPE_LABELS: Record<InquiryType, string> = {
  consultation: "Consultation",
  quote: "Price Estimate",
  support: "Support SLA Ticket",
};

const TYPE_STYLES: Record<InquiryType, string> = {
  consultation: "bg-blue-100/75 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300",
  quote: "bg-emerald-100/75 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300",
  support: "bg-orange-100/75 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300",
};

const PRIORITY_LABELS: Record<AdminInquiry["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

type TrackState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: InquirySummary }
  | { status: "error"; error: ApiError };

type DetailState =
  | { status: "loading" }
  | { status: "success"; data: AdminInquiry }
  | { status: "error"; error: ApiError };

const toApiError = (err: unknown, fallback: string): ApiError =>
  err instanceof ApiError ? err : new ApiError(describeApiError(err, fallback), "server");

export const LeadPortal: React.FC<LeadPortalProps> = ({ lastReference }) => {
  const { formatLocalizedDate } = useLocalization();
  const [mode, setMode] = useState<"track" | "admin">("track");

  // ---- Track My Ticket (public, reference-scoped lookup) ----
  const [trackReference, setTrackReference] = useState(lastReference || "");
  const [trackState, setTrackState] = useState<TrackState>({ status: "idle" });

  const runLookup = async (reference: string) => {
    if (!reference.trim()) return;
    setTrackState({ status: "loading" });
    try {
      const data = await lookupInquiry(reference.trim());
      setTrackState({ status: "success", data });
    } catch (err) {
      setTrackState({ status: "error", error: toApiError(err, "Something went wrong.") });
    }
  };

  useEffect(() => {
    if (lastReference) {
      setTrackReference(lastReference);
      void runLookup(lastReference);
      setMode("track");
    }
  }, [lastReference]);

  // ---- Admin session ----
  const [adminUser, setAdminUser] = useState<AdminUser | null | undefined>(undefined);
  useEffect(() => {
    me()
      .then(setAdminUser)
      .catch(() => setAdminUser(null));
  }, []);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const user = await login(loginEmail, loginPassword);
      setAdminUser(user);
      setLoginPassword("");
    } catch (err) {
      setLoginError(describeApiError(err, "Login failed. Check your credentials."));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Clear the local session state regardless — the cookie is either
      // already gone or the server is unreachable, neither of which
      // should trap the admin in a logged-in-looking screen.
    }
    setAdminUser(null);
  };

  // ---- Admin: inquiry list ----
  const [filterType, setFilterType] = useState<InquiryType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailState, setDetailState] = useState<Record<number, DetailState>>({});
  const [editStatus, setEditStatus] = useState<InquiryStatus | "">("");
  const [editPriority, setEditPriority] = useState<AdminInquiry["priority"] | "">("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const inquiriesState = useFetch(
    () =>
      listInquiries({
        type: filterType === "all" ? undefined : filterType,
        status: filterStatus === "all" ? undefined : filterStatus,
        page,
      }),
    [adminUser, filterType, filterStatus, page, refreshKey],
  );

  const loadDetail = (id: number) => {
    setDetailState((prev) => ({ ...prev, [id]: { status: "loading" } }));
    getInquiry(id)
      .then((data) => {
        setDetailState((prev) => ({ ...prev, [id]: { status: "success", data } }));
        setEditStatus(data.status);
        setEditPriority(data.priority);
      })
      .catch((err) => {
        setDetailState((prev) => ({
          ...prev,
          [id]: { status: "error", error: toApiError(err, "Failed to load ticket detail.") },
        }));
      });
  };

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setEditError("");
    setNoteBody("");
    if (!detailState[id] || detailState[id].status === "error") {
      loadDetail(id);
    } else if (detailState[id].status === "success") {
      const data = (detailState[id] as { status: "success"; data: AdminInquiry }).data;
      setEditStatus(data.status);
      setEditPriority(data.priority);
    }
  };

  const handleSaveStatus = async (id: number) => {
    if (!editStatus || !editPriority) return;
    setSavingEdit(true);
    setEditError("");
    try {
      const updated = await updateInquiry(id, { status: editStatus, priority: editPriority });
      setDetailState((prev) => ({ ...prev, [id]: { status: "success", data: updated } }));
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setEditError(describeApiError(err, "Failed to update ticket."));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleAddNote = async (id: number) => {
    if (!noteBody.trim()) return;
    setSavingNote(true);
    setEditError("");
    try {
      const note: InquiryNote = await addInquiryNote(id, noteBody.trim());
      setDetailState((prev) => {
        const current = prev[id];
        if (current?.status !== "success") return prev;
        return {
          ...prev,
          [id]: {
            status: "success",
            data: { ...current.data, notes: [...(current.data.notes ?? []), note] },
          },
        };
      });
      setNoteBody("");
    } catch (err) {
      setEditError(describeApiError(err, "Failed to add note."));
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div id="lead-portal-main" className="space-y-6">
      {/* Mode switcher */}
      <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5 text-xs font-semibold w-fit">
        <button
          onClick={() => setMode("track")}
          className={`px-3 py-1.5 rounded-md transition ${mode === "track" ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400"}`}
        >
          Track My Ticket
        </button>
        <button
          onClick={() => setMode("admin")}
          className={`px-3 py-1.5 rounded-md transition flex items-center gap-1 ${mode === "admin" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Syntax Portal (Admin)
        </button>
      </div>

      {mode === "track" ? (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-lg text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold">Client Support Tracking</span>: Enter the reference code you
            received when you submitted a consultation, quote, or support request to check its
            current status.
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void runLookup(trackReference);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={trackReference}
                onChange={(e) => setTrackReference(e.target.value)}
                placeholder="e.g. ST-CONS-AB12CD"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={trackState.status === "loading"}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {trackState.status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Look Up
            </button>
          </form>

          {trackState.status === "error" && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                {trackState.error.kind === "not_found"
                  ? "No ticket found with that reference. Double-check the code and try again."
                  : trackState.error.message}
              </span>
            </div>
          )}

          {trackState.status === "success" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_STYLES[trackState.data.type]}`}
                >
                  {TYPE_LABELS[trackState.data.type]}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {trackState.data.reference}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[trackState.data.status]}`}
                >
                  {STATUS_LABELS[trackState.data.status]}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  Submitted {formatLocalizedDate(trackState.data.created_at)}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : adminUser === undefined ? (
        <div className="text-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Checking session…</p>
        </div>
      ) : adminUser === null ? (
        <form
          onSubmit={handleLogin}
          className="max-w-sm mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Lock className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wide">Admin Sign In</h3>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loginLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Admin toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Signed in as{" "}
              <span className="font-bold text-slate-900 dark:text-white">{adminUser.name}</span> (
              {adminUser.role})
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as InquiryType | "all");
                  setPage(1);
                }}
                className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Channels</option>
                <option value="consultation">Consultations</option>
                <option value="quote">Quotations</option>
                <option value="support">Support Tickets</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as InquiryStatus | "all");
                  setPage(1);
                }}
                className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-4 h-4 ${inquiriesState.status === "loading" ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {inquiriesState.status === "loading" && (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loading database entries...
              </p>
            </div>
          )}

          {inquiriesState.status === "error" && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{inquiriesState.error.message}</span>
            </div>
          )}

          {inquiriesState.status === "success" && inquiriesState.data.data.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No tickets match the selected filters.
              </p>
            </div>
          )}

          {inquiriesState.status === "success" && inquiriesState.data.data.length > 0 && (
            <>
              <div className="space-y-3">
                {inquiriesState.data.data.map((inquiry) => {
                  const isExpanded = expandedId === inquiry.id;
                  const detail = detailState[inquiry.id];

                  return (
                    <div
                      key={inquiry.id}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl shadow-xs hover:shadow-sm transition-all overflow-hidden"
                    >
                      <div
                        onClick={() => toggleExpand(inquiry.id)}
                        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_STYLES[inquiry.type]}`}
                          >
                            {TYPE_LABELS[inquiry.type]}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                            {inquiry.reference}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                            {inquiry.organization || inquiry.full_name}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatLocalizedDate(inquiry.created_at)}</span>
                          </div>
                          <span
                            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[inquiry.status]}`}
                          >
                            {STATUS_LABELS[inquiry.status]}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-50 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                          {!detail || detail.status === "loading" ? (
                            <div className="text-center py-6">
                              <Loader2 className="w-5 h-5 animate-spin text-blue-500 mx-auto" />
                            </div>
                          ) : detail.status === "error" ? (
                            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg text-xs">
                              {detail.error.message}
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                    Contact Profile
                                  </p>
                                  <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                                    <p>
                                      <span className="text-slate-400 font-medium">Name:</span>{" "}
                                      {detail.data.full_name}
                                    </p>
                                    <p>
                                      <span className="text-slate-400 font-medium">Email:</span>{" "}
                                      {detail.data.email}
                                    </p>
                                    <p>
                                      <span className="text-slate-400 font-medium">Phone:</span>{" "}
                                      {detail.data.phone}
                                    </p>
                                    {detail.data.organization && (
                                      <p>
                                        <span className="text-slate-400 font-medium">
                                          Organization:
                                        </span>{" "}
                                        {detail.data.organization}
                                      </p>
                                    )}
                                    {detail.data.subject && (
                                      <p>
                                        <span className="text-slate-400 font-medium">Subject:</span>{" "}
                                        {detail.data.subject}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                    Update Ticket
                                  </p>
                                  <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <select
                                        value={editStatus}
                                        onChange={(e) =>
                                          setEditStatus(e.target.value as InquiryStatus)
                                        }
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                      >
                                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                          <option key={value} value={value}>
                                            {label}
                                          </option>
                                        ))}
                                      </select>
                                      <select
                                        value={editPriority}
                                        onChange={(e) =>
                                          setEditPriority(
                                            e.target.value as AdminInquiry["priority"],
                                          )
                                        }
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                      >
                                        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                          <option key={value} value={value}>
                                            {label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <button
                                      onClick={() => handleSaveStatus(inquiry.id)}
                                      disabled={savingEdit}
                                      className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    >
                                      {savingEdit ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                      )}
                                      Save Status & Priority
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                  Client Requirement Details
                                </p>
                                <div className="bg-white dark:bg-slate-950 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs leading-relaxed whitespace-pre-line">
                                  {detail.data.details}
                                </div>
                              </div>

                              {editError && (
                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-xs">
                                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                  <span>{editError}</span>
                                </div>
                              )}

                              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  Follow-Up Notes
                                </span>

                                <div className="space-y-2">
                                  {(detail.data.notes ?? []).length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">
                                      No notes yet for this ticket.
                                    </p>
                                  ) : (
                                    detail.data.notes?.map((n) => (
                                      <div
                                        key={n.id}
                                        className="p-3 bg-slate-100/70 dark:bg-slate-950/50 rounded-lg border border-slate-200/40 dark:border-slate-800 text-xs space-y-1"
                                      >
                                        <div className="flex items-center justify-between text-slate-400 font-semibold">
                                          <span>{n.author?.name ?? "Unknown"}</span>
                                          <span>{formatLocalizedDate(n.created_at)}</span>
                                        </div>
                                        <p className="text-slate-800 dark:text-slate-200">
                                          {n.body}
                                        </p>
                                      </div>
                                    ))
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <textarea
                                    rows={2}
                                    value={noteBody}
                                    onChange={(e) => setNoteBody(e.target.value)}
                                    placeholder="e.g., Scheduled site assessment for next Tuesday."
                                    className="flex-1 p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                  />
                                  <button
                                    onClick={() => handleAddNote(inquiry.id)}
                                    disabled={savingNote || !noteBody.trim()}
                                    className="px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white rounded-md font-semibold text-xs disabled:opacity-50 shrink-0"
                                  >
                                    {savingNote ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      "Add Note"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
                <span>
                  Page {inquiriesState.data.meta.current_page} of{" "}
                  {inquiriesState.data.meta.last_page} — {inquiriesState.data.meta.total} total
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={inquiriesState.data.meta.current_page <= 1}
                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={
                      inquiriesState.data.meta.current_page >= inquiriesState.data.meta.last_page
                    }
                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
