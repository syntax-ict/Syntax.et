import React, { useState, useEffect } from "react";
import type { Lead } from "../types";
import { RefreshCw, Search, ShieldCheck, ChevronDown, ChevronUp, MessageSquare, Clock, Edit3 } from "lucide-react";
import { useLocalization } from "../context/useLocalization";

interface LeadPortalProps {
  onTriggerRefresh?: boolean;
}

export const LeadPortal: React.FC<LeadPortalProps> = ({ onTriggerRefresh }) => {
  const { formatLocalizedDate } = useLocalization();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Status edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<Lead["status"] | "">("");
  const [editNotes, setEditNotes] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [onTriggerRefresh]);

  const handleUpdateLead = async (id: string) => {
    setSaveLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          notes: editNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setLeads(prev => prev.map(l => l.id === id ? data.lead : l));
        setEditingId(null);
      }
    } catch (err) {
      console.error("Error updating lead:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending Review":
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
      case "In Contact":
        return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30";
      case "In Progress":
        return "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30";
      case "Resolved":
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "consultation": return "Consultation";
      case "quote": return "Price Estimate";
      case "training": return "Training Registration";
      case "support": return "Support SLA Ticket";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consultation": return "bg-blue-100/75 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300";
      case "quote": return "bg-emerald-100/75 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300";
      case "training": return "bg-purple-100/75 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300";
      case "support": return "bg-orange-100/75 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.data.name && l.data.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.data.organization && l.data.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.data.details && l.data.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.data.subject && l.data.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "all" || l.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div id="lead-portal-main" className="space-y-6">
      {/* Top Controls bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setIsAdmin(false)}
              className={`px-3 py-1.5 rounded-md transition ${!isAdmin ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Client Ticket Tracker
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1 ${isAdmin ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Syntax Portal (Admin)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition shrink-0 flex items-center justify-center disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative w-full md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Channels</option>
            <option value="consultation">Consultations</option>
            <option value="quote">Quotations</option>
            <option value="training">Registrations</option>
            <option value="support">Support Tickets</option>
          </select>
        </div>
      </div>

      {/* Description header */}
      <div>
        {isAdmin ? (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg text-xs text-blue-800 dark:text-blue-300">
            <span className="font-bold">Administrative Access Enabled</span>: Change ticket statuses, write technical feasibility responses, or record site assessment notes. This simulates Syntax Technology's backend operations in lead qualification.
          </div>
        ) : (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-lg text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold">Client Support Tracking</span>: Submitted forms register directly with our API. Monitor live status changes or consult advisor notes associated with your organization.
          </div>
        )}
      </div>

      {/* Leads Table/Grid */}
      {loading && leads.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading database entries...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400">No active leads match the selected filter query.</p>
          <p className="text-xs text-slate-400 mt-1">Submit a Consultation, Estimate, Training, or Support form to instantly populate this tracker!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const isEditing = editingId === lead.id;

            return (
              <div
                key={lead.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl shadow-xs hover:shadow-sm transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTypeColor(lead.type)}`}>
                      {getTypeLabel(lead.type)}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                      {lead.id}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                      {lead.data.organization || lead.data.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatLocalizedDate(lead.createdAt)}</span>
                    </div>
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />}
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-50 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* General metadata */}
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Contact Profile</p>
                        <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                          <p><span className="text-slate-400 font-medium">Name:</span> {lead.data.name}</p>
                          <p><span className="text-slate-400 font-medium">Email:</span> {lead.data.email}</p>
                          <p><span className="text-slate-400 font-medium">Phone:</span> {lead.data.phone}</p>
                          {lead.data.organization && <p><span className="text-slate-400 font-medium">Organization:</span> {lead.data.organization}</p>}
                        </div>
                      </div>

                      {/* Channel-specific metadata */}
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Inquiry Parameters</p>
                        <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                          {lead.type === "consultation" && (
                            <>
                              <p><span className="text-slate-400 font-medium">Problem Area:</span> {lead.data.problemArea}</p>
                              <p><span className="text-slate-400 font-medium">Project Urgency:</span> {lead.data.urgency}</p>
                              <p><span className="text-slate-400 font-medium">Target Budget:</span> {lead.data.budget}</p>
                            </>
                          )}
                          {lead.type === "quote" && (
                            <>
                              <p><span className="text-slate-400 font-medium">Required Core:</span> {lead.data.selectedServices ? lead.data.selectedServices.join(", ") : "Not selected"}</p>
                              {(lead.data.quantity ?? 0) > 1 && <p><span className="text-slate-400 font-medium">Nodes/Workstations:</span> {lead.data.quantity}</p>}
                              <p><span className="text-slate-400 font-medium">Estimated cost base:</span> <span className="font-bold text-emerald-600">{lead.data.estimatedBaseCost}</span></p>
                              <p><span className="text-slate-400 font-medium">Timeline:</span> {lead.data.timeline}</p>
                            </>
                          )}
                          {lead.type === "training" && (
                            <>
                              <p><span className="text-slate-400 font-medium">Target Course:</span> {lead.data.course}</p>
                              <p><span className="text-slate-400 font-medium">Training Mode:</span> {lead.data.trainingType}</p>
                              <p><span className="text-slate-400 font-medium">Student Level:</span> {lead.data.experience}</p>
                            </>
                          )}
                          {lead.type === "support" && (
                            <>
                              <p><span className="text-slate-400 font-medium">Support Subject:</span> {lead.data.subject}</p>
                              <p><span className="text-slate-400 font-medium">Priority Severity:</span> <span className="font-semibold text-red-500">{lead.data.priority}</span></p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Requirements / Details text box */}
                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Client Requirement Details</p>
                      <div className="bg-white dark:bg-slate-950 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs leading-relaxed">
                        {lead.data.details || lead.data.goals || "No detailed requirements provided."}
                      </div>
                    </div>

                    {/* Follow-up / Support interaction notes */}
                    <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Syntax Official Follow-Up Notes
                        </span>
                        {isAdmin && !isEditing && (
                          <button
                            onClick={() => {
                              setEditingId(lead.id);
                              setEditStatus(lead.status);
                              setEditNotes(lead.notes || "");
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            Update Ticket
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="bg-blue-50/30 dark:bg-blue-950/10 p-3 rounded-lg border border-blue-100/50 dark:border-blue-900/30 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Update Status</label>
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as Lead["status"])}
                                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              >
                                <option value="Pending Review">Pending Review</option>
                                <option value="In Contact">In Contact</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Technical Consultation / Site Assessment Notes</label>
                            <textarea
                              rows={3}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              placeholder="e.g., Scheduled site assessment. Recommended Suprema Face recognition locking mechanisms for entrance gates."
                            />
                          </div>
                          <div className="flex gap-2 justify-end text-xs">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLead(lead.id)}
                              disabled={saveLoading}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md font-semibold flex items-center gap-1"
                            >
                              {saveLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Save Changes"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-slate-100/70 dark:bg-slate-950/50 rounded-lg border border-slate-200/40 dark:border-slate-800 text-xs">
                          {lead.notes ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Technical Advisor Notes:
                              </div>
                              <p className="italic text-slate-800 dark:text-slate-200">{lead.notes}</p>
                            </div>
                          ) : (
                            <div className="text-slate-400 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span>This ticket is currently in queue. A Syntax engineer has been assigned and will update with site-assessment plans.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
