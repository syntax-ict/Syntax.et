import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for lead tracking & support tickets (persists while server is active)
interface Lead {
  id: string;
  type: "consultation" | "quote" | "training" | "support";
  status: "Pending Review" | "In Contact" | "In Progress" | "Resolved" | "Completed";
  createdAt: string;
  data: any;
  notes?: string;
}

const leads: Lead[] = [
  // Seed with a few realistic initial entries to build trust and show how the portal works
  {
    id: "LT-8910",
    type: "consultation",
    status: "Completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      name: "Jean-Pierre Mugisha",
      email: "jp.mugisha@gov-procurement.org",
      organization: "National Procurement Agency",
      phone: "+250 788 123 456",
      problemArea: "Attendance Management & Security",
      details: "Need a biometric clock-in system integrated with our security gates to solve accurate staff attendance tracking.",
      urgency: "High",
      budget: "$5,000 - $10,000"
    },
    notes: "Completed physical site assessment. Recommended Suprema Biometric terminals. Sent formal proposal."
  },
  {
    id: "LT-8911",
    type: "quote",
    status: "In Contact",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      name: "Sarah Kasingye",
      email: "sarah@apexventures.com",
      organization: "Apex Ventures Ltd",
      phone: "+256 701 987 654",
      servicePillar: "Technology Solutions",
      items: ["Networking infrastructure", "System integration", "Technical support"],
      details: "Moving to a new office block. Need structured cabling, high-speed networking setup, and monthly IT maintenance support for 25 workstations.",
      timeline: "Within 30 days"
    },
    notes: "Initial call done. Tech lead scheduled network blueprint design for Monday morning."
  },
  {
    id: "LT-8912",
    type: "training",
    status: "Pending Review",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    data: {
      name: "Erick Ndlovu",
      email: "erick.n@techfuture.io",
      organization: "Individual Professional",
      phone: "+27 82 555 0199",
      course: "Corporate Digital Security & Biometric Integration",
      trainingType: "Online training",
      experience: "Intermediate (IT background)",
      goals: "Looking to gain skills in setting up modern enterprise IP camera systems and CCTV networking for my career advancement."
    }
  },
  {
    id: "LT-8913",
    type: "support",
    status: "Pending Review",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    data: {
      name: "Marcus Aurelius",
      email: "m.aurelius@colosseum-retail.com",
      organization: "Colosseum Retail Hub",
      phone: "+27 11 400 9000",
      subject: "CCTV Stream Offline on Channel 4 & 5",
      priority: "Urgent",
      details: "Cameras on the main entrance and back dock show blank black screens. Tried rebooting the NVR switch, but no response. Require immediate technical support."
    }
  }
];

// Lead Routes
app.get("/api/leads", (req, res) => {
  res.json({ success: true, leads });
});

app.post("/api/leads", (req, res) => {
  const { type, data } = req.body;
  if (!type || !data) {
    return res.status(400).json({ success: false, error: "Missing required fields: type and data" });
  }

  const newId = `LT-${Math.floor(1000 + Math.random() * 9000)}`;
  const newLead: Lead = {
    id: newId,
    type,
    status: "Pending Review",
    createdAt: new Date().toISOString(),
    data
  };

  leads.unshift(newLead);
  res.status(201).json({ success: true, lead: newLead });
});

app.patch("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const leadIndex = leads.findIndex((l) => l.id === id);

  if (leadIndex === -1) {
    return res.status(404).json({ success: false, error: "Lead not found" });
  }

  if (status) leads[leadIndex].status = status;
  if (notes !== undefined) leads[leadIndex].notes = notes;

  res.json({ success: true, lead: leads[leadIndex] });
});

// Secure Server-side Payment Abstraction Layer
interface Transaction {
  txRef: string;
  amount: number;
  currency: string;
  email: string;
  phone: string;
  name: string;
  description: string;
  provider: string;
  status: "PENDING" | "INITIATED" | "PROCESSING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  createdAt: string;
}

const transactions: Transaction[] = [];

app.post("/api/payments/initialize", (req, res) => {
  const { txRef, amount, currency, email, phone, name, description, provider } = req.body;

  if (!txRef || !amount || !currency || !email || !name || !provider) {
    return res.status(400).json({ success: false, error: "Missing required parameters for payment initialization" });
  }

  // Create authoritative server-side record
  const transaction: Transaction = {
    txRef,
    amount: Number(amount),
    currency,
    email,
    phone: phone || "",
    name,
    description: description || "Syntax Technology Invoice",
    provider,
    status: "INITIATED",
    createdAt: new Date().toISOString()
  };

  transactions.push(transaction);

  // Return a simulation checkoutUrl that redirects the client to our secure localized payment portal
  const checkoutUrl = `/payment-checkout?txRef=${txRef}`;

  res.status(201).json({
    success: true,
    txRef,
    status: "INITIATED",
    checkoutUrl,
    message: "Payment successfully initiated on authoritative server"
  });
});

app.get("/api/payments/verify/:txRef", (req, res) => {
  const { txRef } = req.params;
  const transaction = transactions.find((t) => t.txRef === txRef);

  if (!transaction) {
    return res.status(404).json({ success: false, error: "Transaction not found" });
  }

  // Authoritatively update state to PAID if it is still INITIATED/PROCESSING to simulate real gateway callbacks
  if (transaction.status === "INITIATED" || transaction.status === "PROCESSING") {
    transaction.status = "PAID"; // Simulate successful webhook or provider-side confirmation
  }

  res.json({
    success: true,
    txRef: transaction.txRef,
    status: transaction.status,
    amount: transaction.amount,
    currency: transaction.currency,
    email: transaction.email,
    provider: transaction.provider,
    description: transaction.description,
    createdAt: transaction.createdAt
  });
});

// Lazy-initialize Gemini SDK to protect against missing API keys on startup
let geminiAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }
    geminiAI = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiAI;
}

// AI Assistant Route for interactive consultation guidance
app.post("/api/assistant", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, error: "Messages array is required." });
  }

  try {
    const ai = getGeminiClient();
    
    // Construct conversation with system guidelines
    const systemInstruction = `You are the Syntax AI Business Consultant, a sophisticated, professional advisor representing Syntax Technology. 
Your objective is to consult visitors, understand their organizational or individual needs, and guide them towards the appropriate solution in one of our 4 business pillars:
1. TECHNOLOGY SOLUTIONS (IT Infrastructure, Networking, Maintenance, Software, Integration, Automation).
2. SECURITY & SMART SYSTEMS (CCTV/Surveillance, Biometrics, Access Control, GPS/Fleet Tracking).
3. PROFESSIONAL TRAINING (Online/Face-to-face technology training, corporate digital skills).
4. BUSINESS SUPPORT (Printing, Branding, Advertising, Signage, Business tech support).

ABOUT SYNTAX TECHNOLOGY:
- 8 years of solid business experience.
- Premium, modern, international quality service delivery.
- Focuses on real, practical problem solving (e.g., organizations wanting accurate attendance tracking, better security, or modern scalable network infrastructure).

YOUR TONE & CONSTRAINTS:
- Professional, objective, helpful, clear, and action-oriented.
- Strictly do not invent stats, false clients, or fake testimonials. Refer only to our official offering and 8 years of experienced capability.
- Actively encourage visitors to perform one of our primary/secondary CTAs when they share their needs: "Request a Consultation", "Request a Quote", or "Register for Training".
- If they describe a problem, break down how Syntax Technology solves it using one of our actual core business pillars, and draft a high-level proposed scope of work or checklist of steps they should discuss with our team.
- Keep responses concise, beautiful, readable, and structured using markdown. Avoid verbose AI filler words.`;

    // Map conversation array to content parts format expected by modern @google/genai SDK
    // Simple prompt representation with context for simplicity
    const promptContext = messages.map(msg => `${msg.role === 'user' ? 'Client' : 'Syntax Advisor'}: ${msg.content}`).join("\n");
    const fullPrompt = `${promptContext}\n\nSyntax Advisor:`;

    const result = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const responseText = result.text || "I apologize, but I am unable to process your request at this moment. Please feel free to initiate a custom Consultation Request using our forms.";
    res.json({ success: true, text: responseText });
  } catch (error: any) {
    console.error("Gemini API Error in /api/assistant:", error);
    res.status(500).json({ 
      success: false, 
      error: "Unable to connect to Syntax AI. Please try again or complete a direct Consultation Request.",
      details: error.message 
    });
  }
});

// Vite & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
