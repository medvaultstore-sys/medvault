"use client";
import { useState } from "react";

export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome to MedVault Chat. Ask a question and I’ll reply." },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const userMessage = { role: "user", content: prompt.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setPrompt("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch chat response.");
      setMessages(prev => [...prev, data.response]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: "100px 20px 40px", background: "#0D1F1F", color: "#EAF3EF" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>MedVault Chat</h1>
        <p style={{ color: "rgba(234,243,239,0.7)", marginBottom: 28 }}>Send a message and get a quick assistant reply from the local chat API.</p>

        <div style={{ display: "grid", gap: 16 }}>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              style={{
                padding: 18,
                borderRadius: 18,
                background: message.role === "user" ? "rgba(29,191,115,0.12)" : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>
                {message.role === "user" ? "You" : "Assistant"}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.8 }}>{message.content}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 12, alignItems: "center" }}>
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, minWidth: 0, padding: "16px 18px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", color: "#EAF3EF", fontSize: 15 }}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{ padding: "16px 24px", borderRadius: 14, border: "none", background: "#1DBF73", color: "#0D1F1F", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>

        {error && <div style={{ marginTop: 16, color: "#ff6b6b" }}>{error}</div>}
      </div>
    </main>
  );
}
