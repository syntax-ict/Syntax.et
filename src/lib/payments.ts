import { getErrorMessage } from "./errors";

export type PaymentProvider = "chapa" | "telebirr" | "cbe_birr" | "bank_transfer";

export type PaymentStatus =
  | "PENDING"
  | "INITIATED"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface PaymentMethodConfig {
  id: PaymentProvider;
  name: string;
  logo: string;
  enabled: boolean;
  instructions?: string;
}

export interface PaymentDetails {
  txRef: string;
  amount: number;
  currency: string;
  email: string;
  phone: string;
  name: string;
  description: string;
  provider: PaymentProvider;
}

export interface PaymentResponse {
  success: boolean;
  txRef: string;
  status: PaymentStatus;
  checkoutUrl?: string; // Redirect URL for hosted payment gateways like Chapa/Telebirr
  message?: string;

  // Populated by GET /api/payments/verify/:txRef
  amount?: number;
  currency?: string;
  email?: string;
  provider?: PaymentProvider;
  description?: string;
  createdAt?: string;
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: "chapa",
    name: "Chapa (Debit/Credit Card, Telebirr, CBE Birr)",
    logo: "💳",
    enabled: true,
    instructions:
      "Pay instantly using your Debit Card, Credit Card, Telebirr, or CBE Birr via Chapa's secured payment gateway.",
  },
  {
    id: "telebirr",
    name: "Telebirr (Direct)",
    logo: "📱",
    enabled: true,
    instructions: "Authorize directly with your Telebirr mobile wallet app.",
  },
  {
    id: "cbe_birr",
    name: "CBE Birr (Direct)",
    logo: "🏦",
    enabled: true,
    instructions: "Pay directly using your Commercial Bank of Ethiopia (CBE) Birr account.",
  },
  {
    id: "bank_transfer",
    name: "Commercial Bank Transfer",
    logo: "📋",
    enabled: true,
    instructions:
      "Transfer to Commercial Bank of Ethiopia (CBE) A/C: 1000123456789. Please use your Transaction Reference as the description and submit transfer receipt.",
  },
];

/**
 * Abstraction layer to initialize a payment securely.
 * Sends request to backend to fetch secure hosted URLs from payment gateways.
 */
export async function initializePayment(details: PaymentDetails): Promise<PaymentResponse> {
  try {
    const res = await fetch("/api/payments/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Payment initialization failure:", error);
    return {
      success: false,
      txRef: details.txRef,
      status: "FAILED",
      message: getErrorMessage(error, "Failed to initialize payment gateway."),
    };
  }
}

/**
 * Abstraction layer to verify a payment server-side.
 * Never trust local client parameters. Forces secure server-side verification callbacks.
 */
export async function verifyPaymentStatus(txRef: string): Promise<PaymentResponse> {
  try {
    const res = await fetch(`/api/payments/verify/${txRef}`);
    if (!res.ok) {
      throw new Error(`Verification endpoint returned ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Payment verification failure:", error);
    return {
      success: false,
      txRef,
      status: "PROCESSING",
      message:
        "Unable to confirm payment status at this moment. Our team will verify and update your status shortly.",
    };
  }
}
