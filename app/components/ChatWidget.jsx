"use client";
import { useState, useEffect, useRef } from "react";

const C = {
  primary: "#1DBF73",
  secondary: "#0F5C4D",
  navy: "#0D1F1F",
  navyLight: "#162929",
  white: "#FFFFFF",
  accent: "#47D89B",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm the MedVault assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
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
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error || "No response received."}` }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message || "Network error. Please try again."}` }]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes widgetFadeUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes widgetPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.12); }
        }
        .chat-bubble::-webkit-scrollbar { width: 4px; }
        .chat-bubble::-webkit-scrollbar-thumb { background: rgba(29,191,115,0.3); border-radius: 4px; }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Chat with us"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9998,
          width: 56, height: 56, borderRadius: "50%", border: "none",
          background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
          color: C.white, fontSize: 24, cursor: "pointer",
          boxShadow: `0 4px 24px rgba(29,191,115,0.45)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
          animation: open ? "none" : "widgetPulse 2.5s ease-in-out infinite",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 9997,
          width: 340, maxWidth: "calc(100vw - 40px)",
          background: C.navy, border: `1px solid rgba(29,191,115,0.25)`,
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 16px 60px rgba(0,0,0,0.5)",
          animation: "widgetFadeUp 0.25s ease both",
          display: "flex", flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${C.secondary}, #0a2218)`,
            padding: "16px 20px",
            borderBottom: `1px solid rgba(29,191,115,0.15)`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 900, color: C.white,
              fontFamily: "sans-serif",
            }}>MV</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.white, fontFamily: "sans-serif" }}>MedVault Assistant</div>
              <div style={{ fontSize: 11, color: C.accent, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, display: "inline-block" }} />
                Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="chat-bubble"
            style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, maxHeight: 320 }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? C.primary : "rgba(255,255,255,0.07)",
                  color: m.role === "user" ? C.navy : C.white,
                  fontSize: 13, lineHeight: 1.5,
                  fontFamily: "sans-serif",
                  border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 16px", borderRadius: "16px 16px 16px 4px",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", gap: 5, alignItems: "center",
                }}>
                  {[0, 1, 2].map(d => (
                    <span key={d} style={{
                      width: 6, height: 6, borderRadius: "50%", background: C.accent,
                      display: "inline-block",
                      animation: `widgetPulse 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px",
            borderTop: `1px solid rgba(255,255,255,0.06)`,
            display: "flex", gap: 8,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message…"
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: C.white, fontSize: 13,
                outline: "none", fontFamily: "sans-serif",
              }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                padding: "10px 14px", borderRadius: 10, border: "none",
                background: input.trim() ? C.primary : "rgba(255,255,255,0.08)",
                color: input.trim() ? C.navy : "rgba(255,255,255,0.3)",
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontSize: 16, transition: "all 0.2s",
              }}
            >➤</button>
          </div>
        </div>
      )}
    </>
  );
}
