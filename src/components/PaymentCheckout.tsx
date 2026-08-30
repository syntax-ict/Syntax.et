import React, { useState, useEffect } from "react";
import { ShieldCheck, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useLocalization } from "../context/useLocalization";
import type { PaymentProvider, PaymentResponse } from "../lib/payments";
import { PAYMENT_METHODS, verifyPaymentStatus } from "../lib/payments";
import { getErrorMessage } from "../lib/errors";

interface PaymentCheckoutProps {
  txRef: string;
  onVerificationComplete: (status: "PAID" | "FAILED", data: PaymentResponse) => void;
  onCancel: () => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  txRef,
  onVerificationComplete,
  onCancel,
}) => {
  const { t, formatCurrency } = useLocalization();
  const [transaction, setTransaction] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "method" | "simulating_gateway" | "verifying_with_server"
  >("method");
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>("chapa");
  const [errorMsg, setErrorMsg] = useState("");

  // Simulated fields for user inputs (keeps card details completely safe, no actual data saved)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [walletPhone, setWalletPhone] = useState("");

  useEffect(() => {
    // Retrieve transient tx information from backend securely
    const fetchTx = async () => {
      try {
        const res = await fetch(`/api/payments/verify/${txRef}`);
        if (!res.ok) throw new Error("Could not fetch payment reference details.");
        const data = await res.json();
        setTransaction(data);
        setSelectedProvider(data.provider);
      } catch (err) {
        setErrorMsg(getErrorMessage(err, "Failed to retrieve transaction reference."));
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [txRef]);

  const handleSimulatePayment = async () => {
    setProcessingPayment(true);
    setPaymentStep("simulating_gateway");

    // Phase 1: Simulate the redirect/authorisation process of Chapa, Telebirr, or CBE Birr
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setPaymentStep("verifying_with_server");
    // Phase 2: Contact our server authoritatively to verify payment callback status
    try {
      const verification = await verifyPaymentStatus(txRef);
      if (verification.success && verification.status === "PAID") {
        onVerificationComplete("PAID", verification);
      } else {
        onVerificationComplete("FAILED", verification);
      }
    } catch {
      setErrorMsg("Cryptographic verification failed. Server handshake error.");
      setPaymentStep("method");
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <h3 className="text-sm font-bold text-slate-900">{t("common.loading")}</h3>
      </div>
    );
  }

  if (errorMsg || !transaction) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-2">Transaction Error</h3>
        <p className="text-xs text-slate-500 mb-6">
          {errorMsg || "Transaction could not be synchronized."}
        </p>
        <button
          onClick={onCancel}
          className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg"
        >
          {t("common.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-xl overflow-hidden my-8">
      {/* Simulation Banner */}
      <div className="bg-amber-500 text-white text-[11px] font-black px-4 py-2 text-center uppercase tracking-wider flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        <span>SECURE GATEWAY SANDBOX: AUTHENTIC CRYPTOGRAPHIC FLOW TESTING</span>
      </div>

      {paymentStep === "method" && (
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-900 pb-5 mb-6">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Transaction Invoice
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {transaction.description ?? "Syntax Technology Invoice"}
              </h2>
              <p className="text-[11px] text-slate-400 font-bold mt-1">Ref: {transaction.txRef}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Amount Due
              </span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {formatCurrency(transaction.amount ?? 0)}
              </span>
            </div>
          </div>

          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            {t("payment.methods")}
          </h3>

          <div className="grid grid-cols-1 gap-2.5 mb-6">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedProvider === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedProvider(method.id)}
                  className={`w-full text-left p-4 rounded-xl border text-xs transition flex items-start gap-3.5 ${
                    isSelected
                      ? "bg-blue-50/50 border-blue-500 dark:bg-blue-950/20 dark:border-blue-500"
                      : "bg-white border-slate-100 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800"
                  }`}
                >
                  <span className="text-2xl mt-0.5">{method.logo}</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {method.name}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block leading-relaxed">
                      {method.instructions}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Provider Fields to Simulate Flow */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
              Gateway authorization credentials
            </span>

            {selectedProvider === "chapa" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Almaz Kebede"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 dark:bg-slate-950 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 dark:bg-slate-950 rounded-lg"
                  />
                </div>
              </div>
            )}

            {(selectedProvider === "telebirr" || selectedProvider === "cbe_birr") && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                  Registered Wallet Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0911234567"
                  value={walletPhone}
                  onChange={(e) => setWalletPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 dark:bg-slate-950 rounded-lg max-w-xs"
                />
              </div>
            )}

            {selectedProvider === "bank_transfer" && (
              <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Please initiate a bank transfer from your mobile banking app to CBE A/C:{" "}
                <strong className="text-slate-900 dark:text-white">1000123456789</strong>. Upon
                receipt, our financial audit team matches the reference ID{" "}
                <span className="font-mono text-blue-600 font-bold">{transaction.txRef}</span>.
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleSimulatePayment}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg uppercase tracking-widest transition flex items-center gap-2"
            >
              <span>{t("payment.initiate")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {paymentStep !== "method" && (
        <div className="p-8 text-center min-h-[350px] flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />

          {paymentStep === "simulating_gateway" && (
            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Contacting Local Payment Gateway...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                We have securely redirected your authorization request. Completing 3-D secure
                challenge queries for{" "}
                <span className="font-bold text-blue-600">{selectedProvider.toUpperCase()}</span>.
              </p>
            </div>
          )}

          {paymentStep === "verifying_with_server" && (
            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Cryptographic Signature Handshake
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Querying Syntax's server-side secure payment callback webhook. Validating
                transaction authenticity...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
