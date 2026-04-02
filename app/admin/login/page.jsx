"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  primary: "#1DBF73",
  secondary: "#0F5C4D",
  accent: "#47D89B",
  navy: "#0D1F1F",
  navyLight: "#162929",
  white: "#FFFFFF",
};

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password) { setError("Password required"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid password");
        setLoading(false);
      }
    } catch {
      setError("Connection error. Try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.navy}; color: ${C.white}; font-family: 'Barlow', sans-serif; }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
      <div style={{
        minHeight: "100vh", background: C.navy,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Barlow',sans-serif",
      }}>
        <div style={{
          background: C.navyLight, border: "1px solid rgba(29,191,115,0.2)",
          borderRadius: 24, padding: 48, maxWidth: 400, width: "100%", textAlign: "center",
        }}>
          {/* Logo */}
          <div style={{
            width: 52, height: 52, margin: "0 auto 20px",
            background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 16, color: C.white,
          }}>MV+</div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, color: C.primary, marginBottom: 6 }}>MEDVAULT</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 36, letterSpacing: 1 }}>Admin Dashboard</div>

          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 15,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: C.white, outline: "none", marginBottom: 12,
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = C.primary}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />

          {error && (
            <div style={{ color: "#ff6464", fontSize: 13, marginBottom: 12, textAlign: "left" }}>{error}</div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: loading ? C.secondary : C.primary,
              color: loading ? C.accent : C.navy,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18, letterSpacing: 2,
              transition: "all 0.2s",
            }}
          >
            {loading ? "Logging in…" : "LOGIN"}
          </button>
        </div>
      </div>
    </>
  );
}
