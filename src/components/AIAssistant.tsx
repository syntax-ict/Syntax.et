import React, { useState, useRef, useEffect } from "react";
import type { AssistantMessage } from "../types";
import { Send, Cpu, Loader2, Sparkles, AlertCircle, HelpCircle } from "lucide-react";
import { getErrorMessage } from "../lib/errors";

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: "assistant",
      content: "Hello! I am the **Syntax AI Business Consultant**. I specialize in aligning our 8 years of technology experience with your organization's security, networking, digital skills, or branding problems.\n\nTell me about your current bottleneck, or select one of the quick scenarios below:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { label: "Biometric Attendance & Security gates", text: "We need an integrated biometric attendance clock-in system and secure gate controls for 150 staff to solve buddy punching." },
    { label: "Slow network & ongoing computer crashes", text: "Our corporate network drops constantly and office computers are slow. What ongoing maintenance SLA do you recommend?" },
    { label: "Hands-on CCTV training classes", text: "I want to study modern IP cameras and security systems. What professional courses and schedules do you have?" },
    { label: "Brand signboards & printing support", text: "We are moving offices and need outdoor LED lightboxes, acrylic internal branding, and premium stationery printing." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError("");
    const userMsg: AssistantMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error || "Failed to receive consultant advice");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to communicate with Syntax AI. Please check server connections."));
      // Fallback response inside the chat
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but my real-time Gemini pipeline is currently experiencing connection problems. \n\nHowever, you can directly launch our high-fidelity **Consultation** or **Quotation** builders using the CTAs on our solutions page to get a professional evaluation!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Render basic custom markdown features simply
  const renderMessageContent = (content: string) => {
    return content.split("\n\n").map((para, i) => {
      // Bold handling: **text** -> <strong>text</strong>
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(para)) !== null) {
        if (match.index > lastIndex) {
          parts.push(para.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-slate-900 dark:text-white">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < para.length) {
        parts.push(para.substring(lastIndex));
      }

      // Check for lists
      if (para.trim().startsWith("1.") || para.trim().startsWith("-") || para.trim().startsWith("•")) {
        return (
          <div key={i} className="pl-4 space-y-1.5 my-2">
            {para.split("\n").map((line, idx) => {
              const cleanLine = line.replace(/^[\d.\-•\s]+/, "").trim();
              // Apply bold inline on lists
              const lineParts = [];
              let lLastIdx = 0;
              let lMatch;
              while ((lMatch = boldRegex.exec(cleanLine)) !== null) {
                if (lMatch.index > lLastIdx) {
                  lineParts.push(cleanLine.substring(lLastIdx, lMatch.index));
                }
                lineParts.push(<strong key={lMatch.index} className="font-bold text-slate-900 dark:text-white">{lMatch[1]}</strong>);
                lLastIdx = boldRegex.lastIndex;
              }
              if (lLastIdx < cleanLine.length) {
                lineParts.push(cleanLine.substring(lLastIdx));
              }

              return (
                <div key={idx} className="flex items-start gap-2 text-xs md:text-sm">
                  <span className="text-blue-500 font-bold shrink-0 mt-1">•</span>
                  <span>{lineParts.length > 0 ? lineParts : cleanLine}</span>
                </div>
              );
            })}
          </div>
        );
      }

      return (
        <p key={i} className="text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {parts.length > 0 ? parts : para}
        </p>
      );
    });
  };

  return (
    <div id="ai-assistant-root" className="flex flex-col h-[600px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Assistant Header */}
      <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Syntax Business Architect</h4>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Active"></span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Powered by Gemini 3.7-Flash • 8Y Experience</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/30 text-[10px] text-blue-700 dark:text-blue-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Interactive Consultant</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                isUser 
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" 
                  : "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
              }`}>
                {isUser ? "U" : "S"}
              </div>
              <div className="space-y-1">
                <div className={`px-4 py-3 rounded-2xl border ${
                  isUser
                    ? "bg-blue-600 border-blue-600 text-white rounded-tr-xs"
                    : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 rounded-tl-xs"
                }`}>
                  {isUser ? (
                    <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="space-y-2.5">
                      {renderMessageContent(m.content)}
                    </div>
                  )}
                </div>
                <p className={`text-[9px] text-slate-400 ${isUser ? "text-right" : "text-left"}`}>
                  {m.timestamp}
                </p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-xs">
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                Analyzing your organizational requirements...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-xs max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length === 1 && (
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Select a specific target problem scenario:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedPrompts.map((sp, i) => (
              <button
                key={i}
                onClick={() => handleSend(sp.text)}
                className="p-2.5 bg-white dark:bg-slate-800 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 hover:border-blue-200 dark:hover:border-blue-900 border border-slate-200/60 dark:border-slate-700 rounded-xl text-left transition select-none"
              >
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">{sp.label}</span>
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">{sp.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Send Input Panel */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
        <input
          type="text"
          placeholder="Type your security, networking, or business support requirements..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(input);
            }
          }}
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-xs md:text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={loading || !input.trim()}
          className="px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center shrink-0 disabled:opacity-50 shadow-md shadow-blue-500/10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
