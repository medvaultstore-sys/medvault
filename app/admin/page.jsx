"use client";

import { useState } from "react";

const C = {
  bg: "#F0F4F8",
  white: "#FFFFFF",
  header: "#0A1628",
  headerBorder: "#162544",
  primary: "#0057A8",
  primaryHover: "#004490",
  accent: "#00875A",
  danger: "#E53E3E",
  text: "#0D1B2A",
  textSub: "#2D3748",
  muted: "#718096",
  border: "#CBD5E0",
  shadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 14px rgba(0,0,0,0.05)",
  shadowHover: "0 8px 30px rgba(0,0,0,0.13)",
};

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: C.white, borderRadius: 16, padding: "24px 28px",
      boxShadow: C.shadow, border: `1px solid ${C.border}`,
    }}>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 36, color: color || C.primary, lineHeight: 1, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    confirmed: { bg: "#E6F4EC", color: "#00875A", label: "Confirmed" },
    pending:   { bg: "#FFFBEB", color: "#B45309", label: "Pending" },
    shipped:   { bg: "#EBF5FF", color: "#0057A8", label: "Shipped" },
    cancelled: { bg: "#FEF2F2", color: "#E53E3E", label: "Cancelled" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color, borderRadius: 100,
      padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
    }}>{s.label}</span>
  );
}

function OrderRow({ order, onView }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const time = new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: hovered ? "#F8FAFC" : C.white, transition: "background 0.15s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(order)}
    >
      <td style={{ padding: "16px 20px" }}>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.primary, fontWeight: 600 }}>{order.orderId}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{date} · {time}</div>
      </td>
      <td style={{ padding: "16px 20px" }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{order.customerName}</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{order.email}</div>
      </td>
      <td style={{ padding: "16px 20px", maxWidth: 240 }}>
        <div style={{ fontSize: 13, color: C.textSub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {Array.isArray(order.items) ? order.items.map(i => `${i.name?.split("—")[0].trim()} ×${i.quantity}`).join(", ") : "—"}
        </div>
      </td>
      <td style={{ padding: "16px 20px" }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{fmt(order.total)}</div>
      </td>
      <td style={{ padding: "16px 20px" }}>
        <StatusBadge status={order.status} />
      </td>
      <td style={{ padding: "16px 20px" }}>
        <button
          onClick={e => { e.stopPropagation(); onView(order); }}
          style={{
            background: C.primary, border: "none", borderRadius: 8,
            padding: "7px 16px", color: C.white, cursor: "pointer",
            fontSize: 12, fontWeight: 600,
          }}
        >View</button>
      </td>
    </tr>
  );
}

function Info({ label, val }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{val}</div>
    </div>
  );
}

function OrderModal({ order, onClose, onStatusChange }) {
  if (!order) return null;
  const date = new Date(order.createdAt).toLocaleString("en-IN");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(10,22,40,0.6)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: C.white, borderRadius: 24, padding: 36,
        maxWidth: 580, width: "100%", maxHeight: "85vh", overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.18)", border: `1px solid ${C.border}`,
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Order Details</div>
            <div style={{ fontFamily: "monospace", fontSize: 18, color: C.primary, fontWeight: 700 }}>{order.orderId}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{date}</div>
          </div>
          <button onClick={onClose} style={{
            background: C.bg, border: `1px solid ${C.border}`, color: C.text,
            width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18, lineHeight: 1,
          }}>×</button>
        </div>

        {/* Customer */}
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>Customer</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Info label="Name" val={order.customerName} />
            <Info label="Email" val={order.email} />
            <Info label="Phone" val={order.phone || "—"} />
            <Info label="Status" val={<StatusBadge status={order.status} />} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Info label="Delivery Address" val={order.address} />
          </div>
        </div>

        {/* Items */}
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>Items Ordered</div>
          {Array.isArray(order.items) && order.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: i < order.items.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {item.img && (item.img.startsWith("/") || item.img.startsWith("http"))
                  ? <img src={item.img} alt={item.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.border}` }} />
                  : <span style={{ fontSize: 24 }}>{item.img}</span>}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Qty: {item.quantity}</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: C.primary }}>{fmt(item.price * item.quantity)}</div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: 22, color: C.primary }}>{fmt(order.total)}</span>
          </div>
        </div>

        {/* Update Status */}
        <div>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Update Status</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["confirmed", "shipped", "cancelled"].map(s => (
              <button key={s} onClick={() => onStatusChange(order._id, s)} style={{
                padding: "9px 20px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: order.status === s ? C.primary : C.white,
                color: order.status === s ? C.white : C.textSub,
                border: `1px solid ${order.status === s ? C.primary : C.border}`,
                textTransform: "capitalize",
              }}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const ADMIN_EMAIL = "medvaultstore@gmail.com";
  const ADMIN_PASS = "medvault2026";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      setSelected(prev => prev?._id === id ? { ...prev, status } : prev);
    } catch (e) { console.error(e); }
  };

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      setLoginError("");
      setAuthed(true);
      fetchOrders();
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  // ── Login Screen ──────────────────────────────────────────────
  if (!authed) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Plus Jakarta Sans','Inter',sans-serif;background:${C.bg};}
        input::placeholder{color:${C.muted};}
      `}</style>
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{
          background: C.white, borderRadius: 24, padding: 48,
          maxWidth: 400, width: "100%", boxShadow: C.shadowHover, border: `1px solid ${C.border}`,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{
              width: 40, height: 40, background: C.header, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: C.white, letterSpacing: 0.5,
            }}>MV+</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: C.text, letterSpacing: 0.5 }}>MedVault</div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Admin Dashboard</div>
            </div>
          </div>

          <div style={{ fontWeight: 700, fontSize: 22, color: C.text, marginBottom: 6 }}>Sign in</div>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>Enter your admin credentials to continue</div>

          <input
            type="email" placeholder="Admin email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 14,
              background: C.bg, border: `1px solid ${C.border}`,
              color: C.text, outline: "none", marginBottom: 12, fontFamily: "inherit",
            }}
          />
          <input
            type="password" placeholder="Password" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 14,
              background: C.bg, border: `1px solid ${C.border}`,
              color: C.text, outline: "none", marginBottom: 16, fontFamily: "inherit",
            }}
          />
          {loginError && (
            <div style={{ color: C.danger, fontSize: 13, marginBottom: 14, fontWeight: 500 }}>{loginError}</div>
          )}
          <button onClick={handleLogin} style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: C.primary, color: C.white, cursor: "pointer",
            fontFamily: "inherit", fontWeight: 700, fontSize: 15,
          }}>Sign in</button>
        </div>
      </div>
    </>
  );

  const filtered = orders.filter(o => {
    const matchSearch =
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Plus Jakarta Sans','Inter',sans-serif;background:${C.bg};color:${C.text};}
        table{border-collapse:collapse;width:100%;}
        input::placeholder{color:${C.muted};}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:${C.bg};}
        ::-webkit-scrollbar-thumb{background:#A0AEC0;border-radius:4px;}
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg }}>

        {/* Header */}
        <div style={{ background: C.header, borderBottom: `1px solid ${C.headerBorder}`, padding: "0 5%" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 34, height: 34, background: C.primary, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: C.white, letterSpacing: 0.5,
              }}>MV+</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.white, letterSpacing: 0.5 }}>MedVault</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>Admin Dashboard</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={fetchOrders} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10, padding: "8px 16px", color: "rgba(255,255,255,0.8)",
                cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              }}>↻ Refresh</button>
              <button onClick={() => setAuthed(false)} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10, padding: "8px 16px", color: "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: 13, fontFamily: "inherit",
              }}>Logout</button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 5%" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20, marginBottom: 40 }}>
            <StatCard label="Total Orders" value={orders.length} sub="All time" />
            <StatCard label="Total Revenue" value={fmt(totalRevenue)} sub="All time" color={C.accent} />
            <StatCard label="Today's Orders" value={todayOrders.length} sub={new Date().toLocaleDateString("en-IN")} />
            <StatCard label="Confirmed" value={orders.filter(o => o.status === "confirmed").length} sub="Ready to ship" color={C.primary} />
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
            <input
              placeholder="Search by name, email, order ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: 260, padding: "12px 16px", borderRadius: 12,
                background: C.white, border: `1px solid ${C.border}`,
                color: C.text, outline: "none", fontSize: 14, fontFamily: "inherit",
                boxShadow: C.shadow,
              }}
            />
            {["all", "confirmed", "shipped", "pending", "cancelled"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: filter === f ? C.primary : C.white,
                color: filter === f ? C.white : C.textSub,
                border: `1px solid ${filter === f ? C.primary : C.border}`,
                textTransform: "capitalize", fontFamily: "inherit",
                boxShadow: filter === f ? "none" : C.shadow,
              }}>{f}</button>
            ))}
          </div>

          {/* Orders Table */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", boxShadow: C.shadow }}>
            {loading ? (
              <div style={{ padding: 60, textAlign: "center", color: C.muted, fontSize: 15 }}>
                Loading orders...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>No orders yet</div>
                <div style={{ fontSize: 14, color: C.muted }}>Orders will appear here once customers start buying</div>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
                      {["Order ID", "Customer", "Items", "Total", "Status", ""].map(h => (
                        <th key={h} style={{
                          padding: "14px 20px", textAlign: "left", fontSize: 11,
                          color: C.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(order => (
                      <OrderRow key={order._id} order={order} onView={setSelected} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ marginTop: 14, fontSize: 12, color: C.muted, textAlign: "right" }}>
            Showing {filtered.length} of {orders.length} orders
          </div>
        </div>
      </div>

      <OrderModal order={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} />
    </>
  );
}
