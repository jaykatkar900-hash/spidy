import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "user" | "spidy";
  text: string;
  timestamp: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const SPIDY_RESPONSES = [
  "Analyzing data streams... All systems operational, boss.",
  "Web sensors detecting no immediate threats. All clear.",
  "Running diagnostics. Processing speed at 99.7% efficiency.",
  "I've scanned the surrounding network — perimeter secure.",
  "Task logged. Initiating protocol sequence now.",
  "My spider-sense is tingling... but it's probably just a notification.",
  "Cross-referencing databases. Found 847 relevant entries.",
  "Suit systems online. Power cells at maximum capacity.",
  "Location tracked. Routing optimized for fastest trajectory.",
  "Threat assessment complete. Recommend immediate action.",
  "Quantum processing engaged. Solution derived in 0.003 seconds.",
  "All neural pathways synchronized. Ready for next command.",
];

const STATUS_ITEMS = [
  { label: "NEURAL NET", value: "ONLINE", color: "#00ff88" },
  { label: "THREAT LVL", value: "MINIMAL", color: "#00d4ff" },
  { label: "POWER CORE", value: "99.7%", color: "#00ff88" },
  { label: "UPLINK", value: "SECURE", color: "#00d4ff" },
];

function now() {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SpiderWebSVG() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" className="absolute inset-0 opacity-20 pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
      {/* Radial lines */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="110" y1="110"
            x2={110 + 100 * Math.cos(rad)}
            y2={110 + 100 * Math.sin(rad)}
            stroke="#00d4ff" strokeWidth="0.5"
          />
        );
      })}
      {/* Concentric hexagons */}
      {[20, 40, 60, 80, 100].map((r, ri) => (
        <polygon
          key={ri}
          points={Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const rad = (angle * Math.PI) / 180;
            return `${110 + r * Math.cos(rad)},${110 + r * Math.sin(rad)}`;
          }).join(" ")}
          fill="none"
          stroke="#00d4ff"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

function RadarOrb({ listening }: { listening: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      {/* Pulse rings */}
      {listening && (
        <>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-cyan-400 pulse-ring"
              style={{
                width: 160,
                height: 160,
                animationDelay: `${i * 0.6}s`,
                borderColor: "rgba(0, 212, 255, 0.5)",
              }}
            />
          ))}
        </>
      )}

      {/* Outer rotating ring */}
      <div
        className="absolute rounded-full rotate-slow"
        style={{
          width: 190,
          height: 190,
          border: "1px dashed rgba(0, 212, 255, 0.3)",
        }}
      />

      {/* Inner rotating ring */}
      <div
        className="absolute rounded-full rotate-reverse"
        style={{
          width: 150,
          height: 150,
          border: "2px solid transparent",
          borderTopColor: "#00d4ff",
          borderRightColor: "rgba(0, 212, 255, 0.3)",
        }}
      />

      {/* Spider web pattern */}
      <SpiderWebSVG />

      {/* Core orb */}
      <div
        className="relative z-10 float-orb rounded-full flex items-center justify-center"
        style={{
          width: 100,
          height: 100,
          background: "radial-gradient(circle at 35% 35%, #1a4a8a, #020817)",
          boxShadow: listening
            ? "0 0 30px rgba(0,212,255,0.8), 0 0 60px rgba(0,100,255,0.4), inset 0 0 20px rgba(0,212,255,0.2)"
            : "0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,100,255,0.2), inset 0 0 15px rgba(0,212,255,0.1)",
        }}
      >
        {/* Spider logo */}
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          {/* Body */}
          <ellipse cx="26" cy="28" rx="8" ry="11" fill="#00d4ff" opacity="0.9" />
          <ellipse cx="26" cy="17" rx="6" ry="7" fill="#00d4ff" opacity="0.9" />
          {/* Legs left */}
          <line x1="18" y1="22" x2="4" y2="16" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="27" x2="3" y2="26" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="32" x2="5" y2="37" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="19" y1="36" x2="8" y2="44" stroke="#00d4ff" strokeWidth="1.2" strokeLinecap="round" />
          {/* Legs right */}
          <line x1="34" y1="22" x2="48" y2="16" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="34" y1="27" x2="49" y2="26" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="34" y1="32" x2="47" y2="37" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="33" y1="36" x2="44" y2="44" stroke="#00d4ff" strokeWidth="1.2" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="23" cy="15" rx="2" ry="1.5" fill="white" opacity="0.95" />
          <ellipse cx="29" cy="15" rx="2" ry="1.5" fill="white" opacity="0.95" />
        </svg>
      </div>
    </div>
  );
}

function WaveformVisualizer({ active }: { active: boolean }) {
  const bars = 28;
  return (
    <div className="flex items-center justify-center gap-[3px]" style={{ height: 48 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 3,
            height: active ? `${Math.random() * 80 + 20}%` : "15%",
            background: active
              ? `linear-gradient(to top, #0066ff, #00d4ff)`
              : "rgba(0, 212, 255, 0.25)",
            animationName: active ? "wave" : "none",
            animationDuration: `${0.5 + (i % 5) * 0.15}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${(i * 0.05) % 0.5}s`,
            transition: "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

function StatusBar() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {STATUS_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
            {item.label}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: item.color, letterSpacing: "0.05em" }}>
            {item.value}
          </span>
        </div>
      ))}
      <div className="ml-auto" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-muted)" }}>
        {now()}
      </div>
    </div>
  );
}

function ChatMessage({ msg }: { msg: Message }) {
  const isSpidy = msg.role === "spidy";
  return (
    <div className={`msg-in flex gap-3 ${isSpidy ? "flex-row" : "flex-row-reverse"}`}>
      {isSpidy && (
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,100,200,0.3)", border: "1px solid rgba(0,212,255,0.4)" }}
        >
          <svg width="14" height="14" viewBox="0 0 52 52" fill="none">
            <ellipse cx="26" cy="28" rx="8" ry="11" fill="#00d4ff" opacity="0.9" />
            <ellipse cx="26" cy="17" rx="6" ry="7" fill="#00d4ff" opacity="0.9" />
            <line x1="18" y1="22" x2="4" y2="16" stroke="#00d4ff" strokeWidth="2" />
            <line x1="18" y1="27" x2="3" y2="26" stroke="#00d4ff" strokeWidth="2" />
            <line x1="34" y1="22" x2="48" y2="16" stroke="#00d4ff" strokeWidth="2" />
            <line x1="34" y1="27" x2="49" y2="26" stroke="#00d4ff" strokeWidth="2" />
          </svg>
        </div>
      )}
      <div style={{ maxWidth: "75%" }}>
        <div
          className="px-4 py-2.5 rounded-lg text-sm leading-relaxed"
          style={{
            background: isSpidy
              ? "rgba(0, 50, 120, 0.4)"
              : "rgba(0, 30, 80, 0.6)",
            border: isSpidy
              ? "1px solid rgba(0, 212, 255, 0.25)"
              : "1px solid rgba(100, 150, 255, 0.2)",
            fontFamily: "'Exo 2', sans-serif",
            color: isSpidy ? "var(--text-primary)" : "#a0c4ff",
            borderRadius: isSpidy ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
          }}
        >
          {msg.text}
        </div>
        <div
          className={`mt-1 ${isSpidy ? "text-left" : "text-right"}`}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)" }}
        >
          {msg.timestamp}
        </div>
      </div>
      {!isSpidy && (
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "rgba(0,50,150,0.4)", border: "1px solid rgba(100,150,255,0.3)", color: "#a0c4ff" }}
        >
          U
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="msg-in flex gap-3 flex-row">
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: "rgba(0,100,200,0.3)", border: "1px solid rgba(0,212,255,0.4)" }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: "#00d4ff" }} />
      </div>
      <div
        className="px-4 py-3 rounded-lg flex items-center gap-1"
        style={{
          background: "rgba(0,50,120,0.4)",
          border: "1px solid rgba(0,212,255,0.25)",
          borderRadius: "4px 12px 12px 12px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#00d4ff",
              animation: "typing-dots 1.2s ease infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HexagonStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex items-center justify-center"
        style={{ width: 70, height: 70 }}
      >
        <svg width="70" height="70" viewBox="0 0 70 70" className="absolute inset-0">
          <polygon
            points="35,4 63,19 63,51 35,66 7,51 7,19"
            fill="rgba(0,50,120,0.3)"
            stroke="rgba(0,212,255,0.4)"
            strokeWidth="1"
          />
          <polygon
            points="35,10 57,22 57,48 35,60 13,48 13,22"
            fill="none"
            stroke="rgba(0,212,255,0.15)"
            strokeWidth="0.5"
          />
        </svg>
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#00d4ff", position: "relative", zIndex: 1 }}>
          {value}
        </span>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.1em", textAlign: "center" }}>
        {label}
      </span>
      {sub && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(0,212,255,0.4)" }}>{sub}</span>}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "spidy",
      text: "SPIDY online. All neural networks synchronized. Good to see you — what can I do for you today?",
      timestamp: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(1);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: msgCount + 1,
      role: "user",
      text: input.trim(),
      timestamp: now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setMsgCount((n) => n + 1);
    setTyping(true);

    setTimeout(() => {
      const reply = SPIDY_RESPONSES[Math.floor(Math.random() * SPIDY_RESPONSES.length)];
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: msgCount + 2, role: "spidy", text: reply, timestamp: now() },
      ]);
      setMsgCount((n) => n + 1);
    }, 1200 + Math.random() * 800);
  }, [input, msgCount]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleListening = () => {
    setListening((l) => !l);
    if (!listening) {
      setTimeout(() => {
        setListening(false);
        const msg: Message = {
          id: msgCount + 1,
          role: "spidy",
          text: "Voice input received. Processing audio waveform — I'm on it.",
          timestamp: now(),
        };
        setMessages((m) => [...m, msg]);
        setMsgCount((n) => n + 1);
      }, 3000);
    }
  };

  return (
    <div
      className="scanlines relative size-full flex flex-col"
      style={{ background: "var(--bg-primary)", overflow: "hidden" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow blobs */}
      <div
        className="absolute pointer-events-none"
        style={{ width: 500, height: 500, top: -150, right: -100, background: "radial-gradient(circle, rgba(0,100,200,0.12) 0%, transparent 70%)", borderRadius: "50%" }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ width: 400, height: 400, bottom: -100, left: -80, background: "radial-gradient(circle, rgba(0,50,150,0.1) 0%, transparent 70%)", borderRadius: "50%" }}
      />

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-6 py-3"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(2,8,23,0.9)", backdropFilter: "blur(10px)" }}
      >
        <div className="flex items-center gap-4">
          {/* Logo mark */}
          <div
            className="relative w-9 h-9 flex items-center justify-center rounded"
            style={{ background: "rgba(0,100,200,0.2)", border: "1px solid rgba(0,212,255,0.4)" }}
          >
            <svg width="22" height="22" viewBox="0 0 52 52" fill="none">
              <ellipse cx="26" cy="28" rx="8" ry="11" fill="#00d4ff" />
              <ellipse cx="26" cy="17" rx="6" ry="7" fill="#00d4ff" />
              <line x1="18" y1="22" x2="4" y2="16" stroke="#00d4ff" strokeWidth="2" />
              <line x1="18" y1="27" x2="3" y2="26" stroke="#00d4ff" strokeWidth="2" />
              <line x1="18" y1="32" x2="5" y2="37" stroke="#00d4ff" strokeWidth="2" />
              <line x1="34" y1="22" x2="48" y2="16" stroke="#00d4ff" strokeWidth="2" />
              <line x1="34" y1="27" x2="49" y2="26" stroke="#00d4ff" strokeWidth="2" />
              <line x1="34" y1="32" x2="47" y2="37" stroke="#00d4ff" strokeWidth="2" />
              <ellipse cx="23" cy="15" rx="2" ry="1.5" fill="white" />
              <ellipse cx="29" cy="15" rx="2" ry="1.5" fill="white" />
            </svg>
          </div>
          <div>
            <h1
              className="glitch"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#00d4ff",
                letterSpacing: "0.15em",
                textShadow: "0 0 10px rgba(0,212,255,0.6), 0 0 20px rgba(0,212,255,0.3)",
                lineHeight: 1,
              }}
            >
              SPIDY
            </h1>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.2em", marginTop: 2 }}>
              ADVANCED AI INTERFACE v4.2.0
            </p>
          </div>
        </div>

        <StatusBar />
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* Left panel — Orb + Stats */}
        <div
          className="flex flex-col items-center py-6 px-4 gap-6"
          style={{
            width: 280,
            borderRight: "1px solid var(--border)",
            background: "rgba(2,10,30,0.6)",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
          }}
        >
          {/* HUD label */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.25em" }}>
            ◆ NEURAL CORE ◆
          </div>

          {/* Radar orb */}
          <RadarOrb listening={listening} />

          {/* Status text */}
          <div className="text-center">
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: listening ? "#00ff88" : "#00d4ff",
                letterSpacing: "0.2em",
                textShadow: listening ? "0 0 8px #00ff88" : "0 0 8px rgba(0,212,255,0.5)",
                transition: "color 0.3s",
              }}
            >
              {listening ? "LISTENING..." : "STANDBY"}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", marginTop: 4 }}>
              {listening ? "voice input active" : "awaiting command"}
            </div>
          </div>

          {/* Waveform */}
          <div
            className="w-full px-2 py-2 rounded hud-bracket"
            style={{ border: "1px solid var(--border)", background: "rgba(0,20,50,0.5)" }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "var(--text-muted)", marginBottom: 6, letterSpacing: "0.15em" }}>
              AUDIO WAVEFORM
            </div>
            <WaveformVisualizer active={listening} />
          </div>

          {/* Hex stats */}
          <div className="grid grid-cols-3 gap-2 w-full">
            <HexagonStat label="TASKS" value="12" />
            <HexagonStat label="UPTIME" value="99%" />
            <HexagonStat label="SCAN" value="847" />
          </div>

          {/* Mic button */}
          <button
            onClick={toggleListening}
            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: listening
                ? "rgba(0,255,136,0.15)"
                : "rgba(0,100,200,0.2)",
              border: listening
                ? "1px solid rgba(0,255,136,0.5)"
                : "1px solid rgba(0,212,255,0.3)",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: listening ? "#00ff88" : "#00d4ff",
              letterSpacing: "0.15em",
              cursor: "pointer",
              boxShadow: listening ? "0 0 20px rgba(0,255,136,0.2)" : "none",
            }}
          >
            <span style={{ fontSize: 14 }}>{listening ? "⬛" : "🎙"}</span>
            {listening ? "STOP" : "VOICE INPUT"}
          </button>
        </div>

        {/* Center — Chat panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Chat header */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: "1px solid var(--border)", background: "rgba(2,10,30,0.4)" }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.2em" }}>
              ◆ COMMS CHANNEL ◆
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#00ff88" }}>ENCRYPTED</span>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
            {typing && <TypingIndicator />}
          </div>

          {/* Input */}
          <div
            className="px-5 py-4"
            style={{ borderTop: "1px solid var(--border)", background: "rgba(2,8,23,0.8)", backdropFilter: "blur(10px)" }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg hud-bracket"
              style={{
                background: "rgba(0,20,60,0.6)",
                border: "1px solid rgba(0,212,255,0.3)",
                boxShadow: "0 0 20px rgba(0,100,200,0.1)",
              }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#00d4ff", opacity: 0.7 }}>&gt;_</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Enter command for SPIDY..."
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: 13,
                  color: "var(--text-primary)",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="px-4 py-1.5 rounded transition-all duration-200"
                style={{
                  background: input.trim() ? "rgba(0,100,200,0.5)" : "rgba(0,50,100,0.2)",
                  border: `1px solid ${input.trim() ? "rgba(0,212,255,0.6)" : "rgba(0,212,255,0.15)"}`,
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  color: input.trim() ? "#00d4ff" : "rgba(0,212,255,0.3)",
                  letterSpacing: "0.1em",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  boxShadow: input.trim() ? "0 0 10px rgba(0,212,255,0.2)" : "none",
                }}
              >
                SEND
              </button>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", marginTop: 6, paddingLeft: 2 }}>
              Press ENTER to transmit · SHIFT+ENTER for new line
            </div>
          </div>
        </div>

        {/* Right panel — System info */}
        <div
          className="flex flex-col py-6 px-4 gap-5"
          style={{
            width: 220,
            borderLeft: "1px solid var(--border)",
            background: "rgba(2,10,30,0.6)",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
            overflowY: "auto",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.25em" }}>
            ◆ SYSTEM LOG ◆
          </div>

          {/* Live metrics */}
          {[
            { label: "CPU LOAD", value: 23, color: "#00d4ff" },
            { label: "MEMORY", value: 67, color: "#00ff88" },
            { label: "NET I/O", value: 45, color: "#ff3d7f" },
            { label: "SCAN DEPTH", value: 88, color: "#00d4ff" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: item.color }}>
                  {item.value}%
                </span>
              </div>
              <div className="w-full rounded-full" style={{ height: 3, background: "rgba(0,212,255,0.1)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.value}%`,
                    background: item.color,
                    boxShadow: `0 0 6px ${item.color}`,
                  }}
                />
              </div>
            </div>
          ))}

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border)" }} />

          {/* Recent events */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.2em", marginBottom: 10 }}>
              RECENT EVENTS
            </div>
            <div className="flex flex-col gap-3">
              {[
                { time: "09:12:44", event: "Perimeter scan complete", status: "ok" },
                { time: "09:11:02", event: "Database sync", status: "ok" },
                { time: "09:09:33", event: "Threat detected", status: "warn" },
                { time: "09:08:11", event: "System boot", status: "ok" },
                { time: "09:07:00", event: "Auth check passed", status: "ok" },
              ].map((ev, i) => (
                <div key={i} className="flex gap-2">
                  <div
                    className="w-1 rounded-full flex-shrink-0 mt-1"
                    style={{
                      height: 12,
                      background: ev.status === "ok" ? "#00ff88" : "#ff3d7f",
                      boxShadow: `0 0 4px ${ev.status === "ok" ? "#00ff88" : "#ff3d7f"}`,
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 10, color: "var(--text-primary)" }}>
                      {ev.event}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "var(--text-muted)" }}>
                      {ev.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border)" }} />

          {/* Quick actions */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.2em", marginBottom: 8 }}>
              QUICK ACTIONS
            </div>
            <div className="flex flex-col gap-2">
              {["SCAN NETWORK", "RUN DIAGNOSTICS", "ENCRYPT COMM", "DEPLOY WEB"].map((action) => (
                <button
                  key={action}
                  className="w-full py-2 px-3 rounded text-left transition-all duration-200 hover:border-cyan-400"
                  style={{
                    background: "rgba(0,30,80,0.4)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 8,
                    fontWeight: 600,
                    color: "#4a7fa5",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#00d4ff";
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,100,200,0.2)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#4a7fa5";
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,30,80,0.4)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
                  }}
                >
                  ▶ {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
