"use client";

import { useState } from "react";

const C = {
  primary: "#1DBF73",
  secondary: "#0F5C4D",
  accent: "#47D89B",
  dark: "#1E2B2B",
  navy: "#0D1F1F",
  navyLight: "#162929",
  white: "#FFFFFF",
};

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: C.navyLight, border: `1px solid rgba(29,191,115,0.15)`,
      borderRadius: 16, padding: "24px 28px",
    }}>
      <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 42, color: color || C.primary, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    confirmed: { bg: "rgba(29,191,115,0.15)", color: C.primary, label: "Confirmed" },
    pending:   { bg: "rgba(255,193,7,0.15)",  color: "#FFC107", label: "Pending" },
    shipped:   { bg: "rgba(71,216,155,0.15)", color: C.accent,  label: "Shipped" },
    cancelled: { bg: "rgba(255,100,100,0.15)",color: "#ff6464", label: "Cancelled" },
  };
  const s = colors[status] || colors.pending;
  return (
    <span style={{
      background: s.bg, color: s.color, borderRadius: 100,
      padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 1,
    }}>{s.label}</span>
  );
}

function OrderRow({ order, onView }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const time = new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(29,191,115,0.04)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      onClick={() => onView(order)}
    >
      <td style={{ padding: "16px 20px" }}>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.accent }}>{order.orderId}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{date} · {time}</div>
      </td>
      <td style={{ padding: "16px 20px" }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{order.customerName}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{order.email}</div>
      </td>
      <td style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          {Array.isArray(order.items) ? order.items.map(i => `${i.name?.split("—")[0].trim()} ×${i.quantity}`).join(", ") : "—"}
        </div>
      </td>
      <td style={{ padding: "16px 20px" }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: C.primary }}>{fmt(order.total)}</div>
      </td>
      <td style={{ padding: "16px 20px" }}>
        <StatusBadge status={order.status} />
      </td>
      <td style={{ padding: "16px 20px" }}>
        <button onClick={e => { e.stopPropagation(); onView(order); }} style={{
          background: "rgba(29,191,115,0.08)", border: "1px solid rgba(29,191,115,0.2)",
          borderRadius: 8, padding: "6px 14px", color: C.accent, cursor: "pointer", fontSize: 12, fontWeight: 600,
        }}>View</button>
      </td>
    </tr>
  );
}

function OrderModal({ order, onClose, onStatusChange }) {
  if (!order) return null;
  const date = new Date(order.createdAt).toLocaleString("en-IN");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: C.navyLight, border: "1px solid rgba(29,191,115,0.2)",
        borderRadius: 24, padding: 36, maxWidth: 580, width: "100%",
        maxHeight: "85vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Order Details</div>
            <div style={{ fontFamily: "monospace", fontSize: 18, color: C.primary, fontWeight: 700 }}>{order.orderId}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{date}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: C.white, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        {/* Customer */}
        <div style={{ background: "rgba(29,191,115,0.05)", border: "1px solid rgba(29,191,115,0.1)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Customer</div>
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
        <div style={{ background: "rgba(29,191,115,0.05)", border: "1px solid rgba(29,191,115,0.1)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Items Ordered</div>
          {Array.isArray(order.items) && order.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < order.items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {item.img && (item.img.startsWith("/") || item.img.startsWith("http"))
                  ? <img src={item.img} alt={item.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6, background: "rgba(29,191,115,0.08)" }} />
                  : <span style={{ fontSize: 24 }}>{item.img}</span>}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Qty: {item.quantity}</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: C.accent }}>{fmt(item.price * item.quantity)}</div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 24, color: C.primary }}>{fmt(order.total)}</span>
          </div>
        </div>

        {/* Update Status */}
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Update Status</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["confirmed", "shipped", "cancelled"].map(s => (
              <button key={s} onClick={() => onStatusChange(order._id, s)} style={{
                padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: order.status === s ? C.primary : "rgba(255,255,255,0.06)",
                color: order.status === s ? C.dark : C.white,
                border: `1px solid ${order.status === s ? C.primary : "rgba(255,255,255,0.1)"}`,
                textTransform: "capitalize",
              }}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, val }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 14, color: C.white, fontWeight: 500 }}>{val}</div>
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
    } catch (e) {
      console.error(e);
    }
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

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow',sans-serif" }}>
      <div style={{ background: C.navyLight, border: "1px solid rgba(29,191,115,0.2)", borderRadius: 24, padding: 48, maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, color: C.primary, marginBottom: 8 }}>MEDVAULT</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 32 }}>Admin Dashboard</div>
        <input
          type="email" placeholder="Admin email" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 15,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: C.white, outline: "none", marginBottom: 12,
          }}
        />
        <input
          type="password" placeholder="Admin password" value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 15,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: C.white, outline: "none", marginBottom: 12,
          }}
        />
        {loginError && <div style={{ color: "#ff6464", fontSize: 13, marginBottom: 12 }}>{loginError}</div>}
        <button onClick={handleLogin} style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: C.primary, color: C.dark, cursor: "pointer",
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18, letterSpacing: 2,
        }}>LOGIN</button>
      </div>
    </div>
  );

  const filtered = orders.filter(o => {
    const matchSearch = o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
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
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0D1F1F; color: #fff; font-family: 'Barlow', sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #1DBF73; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.navy }}>
        {/* Header */}
        <div style={{ background: C.navyLight, borderBottom: "1px solid rgba(29,191,115,0.15)", padding: "0 5%" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: C.white }}>MV+</div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>MEDVAULT</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase" }}>Admin Dashboard</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button onClick={fetchOrders} style={{ background: "rgba(29,191,115,0.08)", border: "1px solid rgba(29,191,115,0.2)", borderRadius: 10, padding: "8px 16px", color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>↻ Refresh</button>
              <button onClick={() => setAuthed(false)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13 }}>Logout</button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 5%" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20, marginBottom: 40 }}>
            <StatCard label="Total Orders" value={orders.length} sub="All time" />
            <StatCard label="Total Revenue" value={fmt(totalRevenue)} sub="All time" color={C.accent} />
            <StatCard label="Today's Orders" value={todayOrders.length} sub={new Date().toLocaleDateString("en-IN")} />
            <StatCard label="Confirmed" value={orders.filter(o => o.status === "confirmed").length} sub="Ready to ship" color="#5BE6A8" />
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
            <input
              placeholder="Search by name, email, order ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: 260, padding: "12px 16px", borderRadius: 12,
                background: C.navyLight, border: "1px solid rgba(255,255,255,0.08)",
                color: C.white, outline: "none", fontSize: 14,
              }}
            />
            {["all", "confirmed", "shipped", "pending", "cancelled"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: filter === f ? C.primary : "rgba(255,255,255,0.04)",
                color: filter === f ? C.dark : "rgba(255,255,255,0.6)",
                border: `1px solid ${filter === f ? C.primary : "rgba(255,255,255,0.08)"}`,
                textTransform: "capitalize",
              }}>{f}</button>
            ))}
          </div>

          {/* Orders Table */}
          <div style={{ background: C.navyLight, border: "1px solid rgba(29,191,115,0.12)", borderRadius: 20, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
                Loading orders...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No orders yet</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Orders will appear here once customers start buying</div>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(29,191,115,0.04)" }}>
                      {["Order ID", "Customer", "Items", "Total", "Status", ""].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{h}</th>
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

          <div style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "right" }}>
            Showing {filtered.length} of {orders.length} orders
          </div>
        </div>
      </div>

      <OrderModal order={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} />
    </>
  );
}