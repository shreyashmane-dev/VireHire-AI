"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Shield, Sparkles, AlertTriangle, Search, Lock, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  { icon: Search, text: "Is Google actually hiring remotely for $120k/month?" },
  { icon: AlertTriangle, text: "A recruiter asked for my SSN before interview" },
  { icon: Lock, text: "I got a job offer but they want upfront training fees" },
  { icon: Zap, text: "How do I verify if a LinkedIn recruiter is real?" },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    if (!hasStarted) setHasStarted(true);

    const userMsg: Message = { role: "user", content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageText, sourceType: "chat" })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unable to respond right now.");

      const analysis = data.data;
      const reply =
        analysis?.explanation ||
        analysis?.recommendedAction ||
        "I've analyzed that query. Please proceed with caution and verify through official channels.";

      const riskScore = analysis?.riskScore;
      let fullReply = reply;
      if (riskScore !== undefined) {
        fullReply += `\n\n**Risk Score: ${riskScore}/100** (${analysis?.riskLevel || "Unknown"} Risk)`;
        if (analysis?.redFlags?.length > 0) {
          fullReply += `\n\n**Red Flags:**\n${analysis.redFlags.slice(0, 3).map((f: string) => `• ${f}`).join('\n')}`;
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: fullReply, timestamp: new Date() }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Connection lost. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: message, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-white mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('• ')) {
        return <p key={i} className="flex gap-2 items-start text-zinc-300 pl-1"><span className="text-indigo-400 mt-1">•</span>{line.slice(2)}</p>;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return <p key={i} className="mt-1">{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p)}</p>;
      }
      return line ? <p key={i} className="mt-1">{line}</p> : <br key={i} />;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto relative">

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-black" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">VeriHire AI Agent</h1>
            <p className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Neural Engine Active
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Llama-3.3-70B
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4 pr-1 scrollbar-thin">

        {/* Welcome Screen */}
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center pt-8 pb-4"
          >
            <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {user?.displayName ? `Welcome back, ${user.displayName.split(' ')[0]}` : "Threat Intelligence Agent"}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md mb-10">
              Ask me about any job offer, recruiter, or suspicious email. I analyze it against known scam patterns in real-time.
            </p>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  onClick={() => handleSend(prompt.text)}
                  className="group flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.07] hover:border-indigo-500/30 transition-all text-left"
                >
                  <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-all">
                    <prompt.icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">{prompt.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat Messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-zinc-900 border border-white/10"
              }`}>
                {msg.role === "user"
                  ? (user?.displayName?.[0] || "U")
                  : <Shield className="h-4 w-4 text-indigo-400" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[78%] space-y-1 ${msg.role === "user" ? "items-end flex flex-col" : ""}`}>
                <div className={`rounded-[1.5rem] px-5 py-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-md"
                    : "bg-zinc-950 border border-white/8 text-zinc-300 rounded-tl-md"
                }`}>
                  {msg.role === "assistant" ? formatContent(msg.content) : msg.content}
                </div>
                <p className="text-[10px] font-mono text-zinc-600 px-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="h-9 w-9 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-indigo-400 animate-pulse" />
              </div>
              <div className="bg-zinc-950 border border-white/8 rounded-[1.5rem] rounded-tl-md px-5 py-4">
                <div className="flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.span
                      key={i}
                      className="inline-block h-2 w-2 rounded-full bg-indigo-500"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay }}
                    />
                  ))}
                  <span className="ml-2 text-xs font-mono text-zinc-600">Analyzing threat patterns...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="flex-shrink-0 pt-4">
        <div className="relative flex items-center gap-3 p-2 rounded-[2rem] border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl focus-within:border-indigo-500/40 transition-all">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Ask about a job offer, recruiter, or company..."
            className="flex-1 bg-transparent border-none outline-none px-5 py-3 text-sm text-white placeholder:text-zinc-600"
          />

          <motion.button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            whileTap={{ scale: 0.92 }}
            className="h-12 w-12 rounded-[1.4rem] bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-indigo-500/30 shrink-0"
          >
            {isLoading
              ? <Loader2 className="h-5 w-5 text-white animate-spin" />
              : <Send className="h-5 w-5 text-white" />
            }
          </motion.button>
        </div>

        <p className="text-center text-[10px] font-mono text-zinc-700 mt-3 uppercase tracking-widest">
          Powered by Llama-3.3-70B · Responses are AI-generated threat assessments
        </p>
      </div>
    </div>
  );
}
