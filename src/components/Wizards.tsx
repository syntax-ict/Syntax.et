import React, { useState } from "react";
import {
  Check,
  Send,
  AlertCircle,
  HelpCircle,
  Loader2,
  DollarSign,
  Calendar,
  Shield,
  Cpu,
  BookOpen,
  Printer,
} from "lucide-react";
import { PaymentCheckout } from "./PaymentCheckout";
import { initializePayment } from "../lib/payments";
import { getErrorMessage } from "../lib/errors";
import type { Lead } from "../types";
import { useLocalization } from "../context/useLocalization";

interface WizardProps {
  onSuccess: (lead: Lead) => void;
  onClose?: () => void;
}

export const ConsultationWizard: React.FC<WizardProps> = ({ onSuccess, onClose }) => {
  const { t, formatNumber } = useLocalization();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);
  const [txRef, setTxRef] = useState("");
  const [pendingLead, setPendingLead] = useState<Lead | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    problemArea: "Technology Solutions",
    urgency: "Medium",
    budget: "$1,000 - $5,000",
    details: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consultation",
          data: formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Lead created successfully. Initialize payment simulation
        const generatedTxRef = `ST-CONS-${Date.now().toString(36).toUpperCase()}`;

        const paymentRes = await initializePayment({
          txRef: generatedTxRef,
          amount: 250, // 250 Birr refundable consultation fee
          currency: "ETB",
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          description: `Consultation Reservation Fee - ${formData.organization}`,
          provider: "chapa",
        });

        if (paymentRes.success) {
          setTxRef(generatedTxRef);
          setPendingLead(result.lead);
          setShowPaymentCheckout(true);
        } else {
          // Fallback to free standard submission if payment system fails
          onSuccess(result.lead);
          setStep(4);
        }
      } else {
        throw new Error(result.error || "Failed to submit request");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (showPaymentCheckout && txRef) {
    return (
      <div
        id="consultation-wizard-container"
        className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm animate-fade-in"
      >
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Secure Consultation Deposit
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Syntax Technology secures bookings with a small simulated deposit to protect field
          engineer schedules.
        </p>
        <PaymentCheckout
          txRef={txRef}
          onVerificationComplete={(status) => {
            if (status === "PAID" && pendingLead) {
              setShowPaymentCheckout(false);
              onSuccess(pendingLead);
              setStep(4);
            } else {
              setError("Payment verification failed. Please try again.");
              setShowPaymentCheckout(false);
            }
          }}
          onCancel={() => {
            setError("Payment cancelled. You can retry submission.");
            setShowPaymentCheckout(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      id="consultation-wizard-container"
      className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {t("solutions.requestConsult")}
        </h3>
        {step < 4 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Step {formatNumber(step)} of {formatNumber(3)}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("form.name")} *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Jean-Pierre Mugisha"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("form.organization")} *
            </label>
            <input
              type="text"
              name="organization"
              required
              value={formData.organization}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. National Procurement Agency"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("form.email")} *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="jp.mugisha@gov.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("form.phone")} *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. +251 911 234 567"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Continue to Service Details
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(3);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Primary Problem Area *
            </label>
            <select
              name="problemArea"
              value={formData.problemArea}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Technology Solutions">
                Technology Solutions (IT, Networks, OS Maintenance)
              </option>
              <option value="Security & Smart Systems">
                Security & Smart Systems (CCTV, Biometrics, GPS)
              </option>
              <option value="Professional Training">
                Professional Training (Corporate or Short-Term)
              </option>
              <option value="Business Support">
                Business Support (Printing, Signage, Branding)
              </option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("form.urgency")} *
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low (Planning phase)</option>
                <option value="Medium">Medium (Needed in 1-2 months)</option>
                <option value="High">High (Immediate installation)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("form.budget")} *
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000+">$10,000+</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {t("common.back")}
            </button>
            <button
              type="submit"
              className="w-2/3 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Continue to Project Summary
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("form.details")} *
            </label>
            <textarea
              name="details"
              required
              rows={4}
              value={formData.details}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Provide a detailed description of what you are trying to solve (e.g. need 12 biometrics terminals configured for 500 staff, or continuous IT support contract for our office computers)."
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-xs space-y-2 text-slate-600 dark:text-slate-400">
            <p className="font-semibold text-slate-900 dark:text-white">Form Verification:</p>
            <p>• Lead type: Qualified Business Inquiry</p>
            <p>
              • Contact: {formData.name} ({formData.organization})
            </p>
            <p>
              • Category: {formData.problemArea} | Urgency: {formData.urgency}
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={loading}
              className="w-1/3 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
            >
              {t("common.back")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("common.submit")}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {step === 4 && (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("form.successTitle")}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              {t("form.successDesc")}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-lg text-xs font-mono text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Ticket ID: ST-{Math.floor(10000 + Math.random() * 90000)}
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => {
                setStep(1);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  organization: "",
                  problemArea: "Technology Solutions",
                  urgency: "Medium",
                  budget: "$1,000 - $5,000",
                  details: "",
                });
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition"
            >
              Submit Another
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                Close Window
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const QuoteWizard: React.FC<WizardProps> = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [timeline, setTimeline] = useState("Within 30 days");

  const [isPriority, setIsPriority] = useState(true);
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);
  const [txRef, setTxRef] = useState("");
  const [pendingLead, setPendingLead] = useState<Lead | null>(null);

  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    details: "",
  });

  const availableServices = [
    { id: "cctv", name: "CCTV & Surveillance Design", baseCost: 450, icon: Shield },
    { id: "biometrics", name: "Biometric Attendance Terminals", baseCost: 350, icon: Cpu },
    { id: "net", name: "IT Network Structured Cabling", baseCost: 120, icon: Cpu },
    { id: "maintenance", name: "Computer Hardware Maintenance SLA", baseCost: 80, icon: Cpu },
    { id: "branding", name: "Corporate Print & Store Signage", baseCost: 500, icon: Printer },
    { id: "training", name: "Corporate Group Skills Course", baseCost: 950, icon: BookOpen },
  ];

  const handleToggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName) ? prev.filter((s) => s !== serviceName) : [...prev, serviceName],
    );
  };

  const calculateEstimate = () => {
    let total = 0;
    selectedServices.forEach((sName) => {
      const s = availableServices.find((as) => as.name === sName);
      if (s) {
        if (s.id === "net" || s.id === "maintenance") {
          total += s.baseCost * quantity; // Scaled by nodes/computers
        } else {
          total += s.baseCost;
        }
      }
    });
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      setError("Please select at least one core service.");
      return;
    }

    setLoading(true);
    setError("");

    const estimate = calculateEstimate();
    const dataPayload = {
      ...clientInfo,
      selectedServices,
      quantity,
      timeline,
      estimatedBaseCost: `$${estimate}`,
      prioritySLA: isPriority ? "Priority (500 ETB Deposit)" : "Standard (Free)",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote",
          data: dataPayload,
        }),
      });

      const result = await response.json();
      if (result.success) {
        if (isPriority) {
          const generatedTxRef = `ST-QUOTE-${Date.now().toString(36).toUpperCase()}`;
          const paymentRes = await initializePayment({
            txRef: generatedTxRef,
            amount: 500, // 500 ETB priority site survey deposit
            currency: "ETB",
            email: clientInfo.email,
            phone: clientInfo.phone,
            name: clientInfo.name,
            description: `Priority Survey Deposit - ${clientInfo.organization}`,
            provider: "chapa",
          });

          if (paymentRes.success) {
            setTxRef(generatedTxRef);
            setPendingLead(result.lead);
            setShowPaymentCheckout(true);
          } else {
            // Fallback to standard standard free registration if payment gateway fails
            onSuccess(result.lead);
            setSuccess(true);
          }
        } else {
          // Standard lead goes straight to success screen
          onSuccess(result.lead);
          setSuccess(true);
        }
      } else {
        throw new Error(result.error || "Failed to submit quote request");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong submitting quote request."));
    } finally {
      setLoading(false);
    }
  };

  if (showPaymentCheckout && txRef) {
    return (
      <div
        id="quote-wizard-container"
        className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm animate-fade-in"
      >
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Secure Priority Audit Deposit
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Authorize a Priority Survey Booking deposit securely through our local payment gateway
          simulation.
        </p>
        <PaymentCheckout
          txRef={txRef}
          onVerificationComplete={(status) => {
            if (status === "PAID" && pendingLead) {
              setShowPaymentCheckout(false);
              onSuccess(pendingLead);
              setSuccess(true);
            } else {
              setError("Payment verification failed. Please try again.");
              setShowPaymentCheckout(false);
            }
          }}
          onCancel={() => {
            setError("Payment cancelled. Standard request will still be processed.");
            setShowPaymentCheckout(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      id="quote-wizard-container"
      className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
        Dynamic Quote & Proposal Estimator
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Select your required services, scale, and timeline to view a high-level estimate and request
        a formal quotation.
      </p>

      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Quotation Request Logged!
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Your customized estimate has been submitted to the Syntax Business Support division.
              An official stamped PDF quotation will be dispatched to your email address shortly.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-left text-xs max-w-md mx-auto space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1">
              Submission Details:
            </p>
            <p>
              • Estimated Total:{" "}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ${calculateEstimate()}
              </span>
            </p>
            <p>• Items: {selectedServices.join(", ")}</p>
            <p>• Target Timeline: {timeline}</p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => {
                setSuccess(false);
                setSelectedServices([]);
                setQuantity(1);
                setClientInfo({ name: "", email: "", phone: "", organization: "", details: "" });
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition"
            >
              Create New Estimate
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                Close
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Service Selector Grid */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              1. Select Core Solutions required:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableServices.map((as) => {
                const isSelected = selectedServices.includes(as.name);
                const Icon = as.icon;
                return (
                  <button
                    type="button"
                    key={as.id}
                    onClick={() => handleToggleService(as.name)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-slate-900 dark:text-white"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-md mt-0.5 ${isSelected ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800"}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-900 dark:text-white">
                        {as.name}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {as.id === "net"
                          ? "Starts at $120 per node"
                          : as.id === "maintenance"
                            ? "Starts at $80 per device"
                            : `Base cost: $${as.baseCost}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scaler Node count if network/computer selected */}
          {selectedServices.some(
            (s) =>
              s.includes("Node") ||
              s.includes("Device") ||
              s.includes("Maintenance") ||
              s.includes("Cabling"),
          ) && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Number of workstations / network nodes to configure:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 w-10 text-right">
                  {quantity}
                </span>
              </div>
            </div>
          )}

          {/* Timeline and Estimate summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-blue-50/40 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/30">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Timeline
              </label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Urgent (Within 7 days)">Urgent (Within 7 days)</option>
                <option value="Within 30 days">Within 30 days</option>
                <option value="Flexible (Planning ahead)">Flexible (Planning ahead)</option>
              </select>
            </div>
            <div className="text-right">
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                High-Level Base Estimate
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-end gap-0.5">
                <DollarSign className="w-5 h-5 text-emerald-500 shrink-0" />
                {calculateEstimate()}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                Excludes specific hardware brand premium
              </span>
            </div>
          </div>

          {/* Client Details Form */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              2. Request Formal Quotation from Syntax:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Your Name *"
                value={clientInfo.name}
                onChange={(e) => setClientInfo((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                required
                placeholder="Company / Org Name *"
                value={clientInfo.organization}
                onChange={(e) =>
                  setClientInfo((prev) => ({ ...prev, organization: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                required
                placeholder="Business Email *"
                value={clientInfo.email}
                onChange={(e) => setClientInfo((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number *"
                value={clientInfo.phone}
                onChange={(e) => setClientInfo((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              placeholder="Any specific brands or detailed structural specs (e.g. Suprema Biometrics, Cat6 STP Cabling, Hikvision CCTV locks)?"
              rows={2}
              value={clientInfo.details}
              onChange={(e) => setClientInfo((prev) => ({ ...prev, details: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priority SLA Selection */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              3. Choose Proposal SLA Priority:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsPriority(true)}
                className={`p-3 rounded-xl border text-left flex gap-3 transition ${
                  isPriority
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">⚡</span>
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Priority Audit (500 ETB)
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Guaranteed 24hr site survey, stamped official quotation & custom SLA design
                    blueprint.
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsPriority(false)}
                className={`p-3 rounded-xl border text-left flex gap-3 transition ${
                  !isPriority
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">📋</span>
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Standard Estimate (Free)
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Dispatched within 5-7 business days depending on engineering caseload. No
                    physical survey.
                  </span>
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Estimate...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Formal Request & Track Lead
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export const TrainingRegistration: React.FC<WizardProps & { preselectedCourse?: string }> = ({
  onSuccess,
  onClose,
  preselectedCourse = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    course: preselectedCourse || "CCTV Surveillance Design & Biometric Integration",
    trainingType: "Face-to-face training",
    experience: "Beginner (No technical background)",
    goals: "",
  });

  const coursesList = [
    "CCTV Surveillance Design & Biometric Integration",
    "Enterprise Networking & Security Foundations",
    "Office Technology & Business Automation",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "training",
          data: formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        onSuccess(result.lead);
        setSuccess(true);
      } else {
        throw new Error(result.error || "Failed to submit course registration");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong registering for the training."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="training-registration-container"
      className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
        Course Enrollment & Registration
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Enroll in Syntax Technology's practical skills academies to upskill yourself or your
        corporate team.
      </p>

      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Registration Application Submitted!
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Your registration is complete. A training representative will email your course
              itinerary, lab guidelines, and payment options for your enrollment.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg text-left text-xs max-w-sm mx-auto space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1">
              Enrollment Specs:
            </p>
            <p>• Student: {formData.name}</p>
            <p>
              • Course: <span className="font-semibold">{formData.course}</span>
            </p>
            <p>• Mode: {formData.trainingType}</p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  organization: "",
                  course: "CCTV Surveillance Design & Biometric Integration",
                  trainingType: "Face-to-face training",
                  experience: "Beginner (No technical background)",
                  goals: "",
                });
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition"
            >
              Enroll Another Participant
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition"
              >
                Close
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Organization / Employer (Optional)
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Individual or Tech Ltd"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="jane.doe@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+250 788 000 000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Select Professional Course *
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {coursesList.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Training Mode *
              </label>
              <select
                name="trainingType"
                value={formData.trainingType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Face-to-face training">Face-to-face training</option>
                <option value="Online training">Online training (Hybrid)</option>
                <option value="Corporate training">Corporate team training</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Current Technical Background *
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Beginner (No technical background)">
                Beginner (No technical background)
              </option>
              <option value="Intermediate (Some IT/hardware background)">
                Intermediate (Some IT/hardware background)
              </option>
              <option value="Advanced (Current field engineer/networking technician)">
                Advanced (Current field engineer/networking technician)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Participant Goals & Skills target *
            </label>
            <textarea
              name="goals"
              required
              rows={3}
              value={formData.goals}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="What practical skill do you specifically want to master during this training cohort?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Registration...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                Submit Enrollment Registration
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export const SupportWizard: React.FC<WizardProps> = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    priority: "Medium",
    details: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "support",
          data: formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        onSuccess(result.lead);
        setSuccess(true);
      } else {
        throw new Error(result.error || "Failed to submit support ticket");
      }
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to log support incident. Please check server connections."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="support-wizard-container"
      className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Syntax Technical Support SLA Helpdesk
        </h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Existing customer or SLA partner? File an instant support ticket below. Field crews dispatch
        according to priority schedules.
      </p>

      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Technical Support Ticket Logged!
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Your support incident is registered. Your ticket has been piped directly into the
              Syntax active dispatcher queue.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg text-left text-xs max-w-sm mx-auto space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1">
              Ticket Details:
            </p>
            <p>• Contact: {formData.name}</p>
            <p>
              • Issue: <span className="font-semibold">{formData.subject}</span>
            </p>
            <p>
              • Priority:{" "}
              <span
                className={`font-bold ${formData.priority === "Urgent" ? "text-red-500" : "text-orange-500"}`}
              >
                {formData.priority}
              </span>
            </p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  organization: "",
                  subject: "",
                  priority: "Medium",
                  details: "",
                });
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition"
            >
              Log Another Incident
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition"
              >
                Close
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Marcus Aurelius"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Company / Org Name *
              </label>
              <input
                type="text"
                name="organization"
                required
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Colosseum Retail Hub"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="m.aurelius@colosseum-retail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Direct Callback Phone *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="+27 11 400 9000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Symptom / Subject Line *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g. CCTV Stream Offline on Channel 4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Priority Severity *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="Low">Low (General question)</option>
                <option value="Medium">Medium (System degraded)</option>
                <option value="Urgent">Urgent (Network / CCTV offline!)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Symptom Details & Hardware Diagnostics *
            </label>
            <textarea
              name="details"
              required
              rows={4}
              value={formData.details}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Please list any symptoms, which channel or switch fails, what you have tried (e.g., rebooted PoE injector switch) so we dispatch the correct spare equipment."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Dispatching Incident...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Dispatch Critical Support SLA Ticket
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
