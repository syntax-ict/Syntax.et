import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

app.use(express.json());

// Security audit finding M2: baseline hardening headers on every response.
// Deliberately no Content-Security-Policy here — see backend's
// SecurityHeaders middleware docblock for why a CSP isn't a safe default
// to ship without deployment-specific tuning.
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

// Health probe for container orchestrators and uptime monitoring
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Security audit finding H3: this route proxies to a paid third-party API
// (Gemini) with no authentication of its own, so it needs its own
// abuse ceiling independent of anything upstream. A small in-process,
// per-IP sliding window — consistent with this file's existing
// in-memory-Map style — rather than pulling in a new dependency for one
// route. Resets naturally on redeploy/restart, which is an accepted
// tradeoff for a single-instance dev/prototype server; a multi-instance
// production deployment would need a shared store (e.g. Redis) instead.
const ASSISTANT_RATE_LIMIT = 10; // requests
const ASSISTANT_RATE_WINDOW_MS = 60_000; // per minute, per IP
const assistantRequestLog = new Map<string, number[]>();

function isRateLimited(ip: string): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const windowStart = now - ASSISTANT_RATE_WINDOW_MS;
  const recent = (assistantRequestLog.get(ip) ?? []).filter((ts) => ts > windowStart);

  if (recent.length >= ASSISTANT_RATE_LIMIT) {
    const retryAfterSeconds = Math.ceil((recent[0] + ASSISTANT_RATE_WINDOW_MS - now) / 1000);
    assistantRequestLog.set(ip, recent);
    return { limited: true, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
  }

  recent.push(now);
  assistantRequestLog.set(ip, recent);
  return { limited: false, retryAfterSeconds: 0 };
}

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
  const { limited, retryAfterSeconds } = isRateLimited(req.ip ?? "unknown");
  if (limited) {
    res.setHeader("Retry-After", String(retryAfterSeconds));
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please try again shortly.",
    });
  }

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
    const promptContext = messages
      .map((msg) => `${msg.role === "user" ? "Client" : "Syntax Advisor"}: ${msg.content}`)
      .join("\n");
    const fullPrompt = `${promptContext}\n\nSyntax Advisor:`;

    const result = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText =
      result.text ||
      "I apologize, but I am unable to process your request at this moment. Please feel free to initiate a custom Consultation Request using our forms.";
    res.json({ success: true, text: responseText });
  } catch (error) {
    // Security audit finding M4: log the real error server-side, but never
    // echo it (or its message) back to the client — it can contain
    // upstream API internals not meant for end users.
    console.error("Gemini API Error in /api/assistant:", error);
    res.status(500).json({
      success: false,
      error:
        "Unable to connect to Syntax AI. Please try again or complete a direct Consultation Request.",
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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(
      `Server running on http://localhost:${PORT} (${process.env.NODE_ENV ?? "development"})`,
    );
  });
}

startServer().catch((error) => {
  console.error("Fatal: failed to start server.", error);
  process.exitCode = 1;
});
