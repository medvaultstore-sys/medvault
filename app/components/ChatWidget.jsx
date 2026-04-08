"use client";
import { useState, useEffect, useRef } from "react";

const C = {
  primary: "#1D4ED8",
  header: "#0D1B2A",
  white: "#FFFFFF",
  accent: "#16A34A",
  light: "#EFF6FF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
};

const QUICK_REPLIES = [
  { label: "🛒 Place an Order", msg: "I want to place an order" },
  { label: "📦 View Kits", msg: "What kits do you sell and what are the prices?" },
  { label: "🎓 I'm a 1st year BPT", msg: "I'm a first year BPT student. What should I buy?" },
  { label: "📋 Exam Prep Kit", msg: "Tell me about the Practical Exam Kit" },
  { label: "🦴 Teach me Anatomy", msg: "Explain the muscles of the rotator cuff and their actions" },
  { label: "📐 How to use Goniometer", msg: "How do I use a goniometer to measure joint range of motion?" },
  { label: "🩺 MMT Grades", msg: "Explain Manual Muscle Testing grades 0 to 5" },
  { label: "🚚 Delivery Info", msg: "How does delivery work? How long does it take?" },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! 👋 I'm the MedVault Assistant.\n\nI can help you:\n🛒 Choose products, check prices & place orders\n🎓 Learn anatomy, physiology & clinical techniques\n\nWhat do you need today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput("");
    setShowQuick(false);

    const userMsg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, data.response]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: `Sorry, something went wrong. Please try again or WhatsApp us directly at +91 82486 13274.` }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error. Please WhatsApp us at +91 82486 13274 to place your order." }]);
    }
    setLoading(false);
  };

  // Render message content — convert newlines and WhatsApp links
  const renderContent = (content) => {
    const waLinkRegex = /https:\/\/wa\.me\/\S+/g;
    const parts = content.split(waLinkRegex);
    const links = content.match(waLinkRegex) || [];
    return (
      <span style={{ whiteSpace: "pre-wrap" }}>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {links[i] && (
              <a href={links[i]} target="_blank" rel="noreferrer" style={{
                color: C.primary, fontWeight: 700, textDecoration: "underline",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
                📲 Order on WhatsApp
              </a>
            )}
          </span>
        ))}
      </span>
    );
  };

  return (
    <>
      <style>{`
        @keyframes widgetFadeUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(29,78,216,0.4); }
          50%       { box-shadow: 0 4px 32px rgba(29,78,216,0.7); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-6px); }
        }
        .mv-chat-scroll::-webkit-scrollbar { width: 4px; }
        .mv-chat-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        .mv-quick-btn:hover { background: #DBEAFE !important; border-color: #93C5FD !important; }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Chat with MedVault"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9998,
          width: 58, height: 58, borderRadius: "50%", border: "none",
          background: C.primary,
          color: C.white, fontSize: 22, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
          animation: open ? "none" : "chatPulse 2.5s ease-in-out infinite",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 100, right: 28, zIndex: 9997,
          width: 360, maxWidth: "calc(100vw - 40px)",
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          animation: "widgetFadeUp 0.25s ease both",
          display: "flex", flexDirection: "column",
          maxHeight: "calc(100vh - 140px)",
        }}>

          {/* Header */}
          <div style={{
            background: C.header,
            padding: "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: C.primary,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: C.white,
              }}>MV</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>MedVault Assistant</div>
                <div style={{ fontSize: 11, color: "#6EE7B7", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE7B7", display: "inline-block" }} />
                  Online · Replies instantly
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/918248613274"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#25D366", color: C.white, border: "none",
                borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                fontSize: 11, fontWeight: 700, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              📲 WhatsApp
            </a>
          </div>

          {/* Messages */}
          <div
            className="mv-chat-scroll"
            style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 10 }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && (
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", background: C.primary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, color: C.white,
                    flexShrink: 0, marginRight: 7, marginTop: 2,
                  }}>MV</div>
                )}
                <div style={{
                  maxWidth: "78%",
                  padding: "10px 13px",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? C.primary : "#F3F4F6",
                  color: m.role === "user" ? C.white : C.text,
                  fontSize: 13, lineHeight: 1.55,
                  border: m.role === "user" ? "none" : `1px solid ${C.border}`,
                }}>
                  {renderContent(m.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.white, flexShrink: 0 }}>MV</div>
                <div style={{ padding: "10px 16px", borderRadius: "16px 16px 16px 4px", background: "#F3F4F6", border: `1px solid ${C.border}`, display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(d => (
                    <span key={d} style={{
                      width: 6, height: 6, borderRadius: "50%", background: C.muted, display: "inline-block",
                      animation: `dotBounce 1.2s ease-in-out ${d * 0.18}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick replies — show after first bot message and before user sends anything */}
            {showQuick && !loading && (
              <div style={{ marginTop: 4 }}>
                <p style={{ fontSize: 11, color: C.muted, marginBottom: 8, paddingLeft: 33 }}>Quick options:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 33 }}>
                  {QUICK_REPLIES.map(q => (
                    <button
                      key={q.label}
                      className="mv-quick-btn"
                      onClick={() => send(q.msg)}
                      style={{
                        background: C.light, border: `1px solid #BFDBFE`,
                        borderRadius: 20, padding: "6px 12px",
                        fontSize: 12, fontWeight: 600, color: C.primary,
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >{q.label}</button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* WhatsApp CTA bar */}
          <div style={{
            background: "#F0FDF4", borderTop: `1px solid #BBF7D0`,
            padding: "8px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>Ready to order?</span>
            <a
              href="https://wa.me/918248613274"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#25D366", color: C.white,
                borderRadius: 7, padding: "6px 14px",
                fontSize: 12, fontWeight: 700, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >📲 Order on WhatsApp</a>
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 12px",
            borderTop: `1px solid ${C.border}`,
            display: "flex", gap: 8, background: C.white,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about products or pricing..."
              style={{
                flex: 1, padding: "9px 12px", borderRadius: 10,
                border: `1px solid ${C.border}`,
                background: "#F9FAFB", color: C.text, fontSize: 13,
                outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                padding: "9px 14px", borderRadius: 10, border: "none",
                background: input.trim() ? C.primary : "#E5E7EB",
                color: input.trim() ? C.white : C.muted,
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontSize: 15, transition: "all 0.15s",
              }}
            >➤</button>
          </div>
        </div>
      )}
    </>
  );
}
