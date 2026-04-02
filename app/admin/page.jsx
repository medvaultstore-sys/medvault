"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

// ── Shared helpers ─────────────────────────────────────────────

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: C.navyLight, border: "1px solid rgba(29,191,115,0.15)",
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
    cancelled: { bg: "rgba(255,100,100,0.15)", color: "#ff6464", label: "Cancelled" },
  };
  const s = colors[status] || colors.pending;
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
      {s.label}
    </span>
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

// ── Order components ───────────────────────────────────────────

function OrderRow({ order, onView }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const time = new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return (
    <tr
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
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
      <td style={{ padding: "16px 20px" }}><StatusBadge status={order.status} /></td>
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
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: C.navyLight, border: "1px solid rgba(29,191,115,0.2)",
        borderRadius: 24, padding: 36, maxWidth: 580, width: "100%", maxHeight: "85vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Order Details</div>
            <div style={{ fontFamily: "monospace", fontSize: 18, color: C.primary, fontWeight: 700 }}>{order.orderId}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{date}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: C.white, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        <div style={{ background: "rgba(29,191,115,0.05)", border: "1px solid rgba(29,191,115,0.1)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Customer</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Info label="Name" val={order.customerName} />
            <Info label="Email" val={order.email} />
            <Info label="Phone" val={order.phone || "—"} />
            <Info label="Status" val={<StatusBadge status={order.status} />} />
          </div>
          <div style={{ marginTop: 12 }}><Info label="Delivery Address" val={order.address} /></div>
        </div>

        <div style={{ background: "rgba(29,191,115,0.05)", border: "1px solid rgba(29,191,115,0.1)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Items Ordered</div>
          {Array.isArray(order.items) && order.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < order.items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {item.img && (item.img.startsWith("/") || item.img.startsWith("http"))
                  ? <img src={item.img} alt={item.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} />
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

// ── Product components ─────────────────────────────────────────

function ProductModal({ product, onSave, onClose }) {
  const isEdit = !!product?._id;
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    image: product?.image || "",
    description: product?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Product name is required"); return; }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) { setError("Valid price is required"); return; }
    setSaving(true);
    setError("");

    const payload = { name: form.name.trim(), price: Number(form.price), image: form.image.trim(), description: form.description.trim() };
    const url = isEdit ? `/api/products/${product._id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { onSave(); }
      else { setError(data.error || "Failed to save product"); }
    } catch { setError("Connection error"); }
    setSaving(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    color: C.white, outline: "none", marginBottom: 14,
    fontFamily: "'Barlow',sans-serif",
  };
  const labelStyle = { fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: C.navyLight, border: "1px solid rgba(29,191,115,0.2)",
        borderRadius: 24, padding: 36, maxWidth: 480, width: "100%",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22 }}>
            {isEdit ? "Edit Product" : "Add New Product"}
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: C.white, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        <label style={labelStyle}>Product Name *</label>
        <input
          style={inputStyle}
          placeholder="e.g. Stethoscope, BP Apparatus"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          onFocus={e => e.target.style.borderColor = C.primary}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />

        <label style={labelStyle}>Price (₹) *</label>
        <input
          style={inputStyle}
          type="number"
          min="1"
          placeholder="e.g. 499"
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          onFocus={e => e.target.style.borderColor = C.primary}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />

        <label style={labelStyle}>Image URL (optional)</label>
        <input
          style={inputStyle}
          placeholder="https://example.com/image.jpg"
          value={form.image}
          onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
          onFocus={e => e.target.style.borderColor = C.primary}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />

        <label style={labelStyle}>Description (optional)</label>
        <textarea
          style={{ ...inputStyle, height: 80, resize: "vertical" }}
          placeholder="Brief product description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          onFocus={e => e.target.style.borderColor = C.primary}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />

        {error && <div style={{ color: "#ff6464", fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)", fontSize: 14,
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: "12px", borderRadius: 10, cursor: saving ? "not-allowed" : "pointer",
            background: saving ? C.secondary : C.primary, border: "none",
            color: saving ? C.accent : C.dark,
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 1,
          }}>{saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ product, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm(product._id);
    setDeleting(false);
  };
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onCancel}>
      <div style={{
        background: C.navyLight, border: "1px solid rgba(255,100,100,0.3)",
        borderRadius: 24, padding: 36, maxWidth: 400, width: "100%", textAlign: "center",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🗑️</div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Delete Product?</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>
          &ldquo;{product.name}&rdquo; will be permanently removed.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)", fontSize: 14,
          }}>Cancel</button>
          <button onClick={handleDelete} disabled={deleting} style={{
            flex: 1, padding: "12px", borderRadius: 10, cursor: deleting ? "not-allowed" : "pointer",
            background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.4)",
            color: "#ff6464", fontSize: 14, fontWeight: 700,
          }}>{deleting ? "Deleting…" : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Main admin page ────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState("orders");

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productModal, setProductModal] = useState(null); // null | {} (add) | {_id,...} (edit)
  const [deleteConfirm, setDeleteConfirm] = useState(null); // product to delete
  const [productSearch, setProductSearch] = useState("");

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) { console.error(e); }
    setOrdersLoading(false);
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (e) { console.error(e); }
    setProductsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      setSelectedOrder(prev => prev?._id === id ? { ...prev, status } : prev);
    } catch (e) { console.error(e); }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchProducts();
    } catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  // Derived stats
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const filteredOrders = orders.filter(o => {
    const matchSearch = o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.description?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setTab(id)} style={{
      padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600,
      background: tab === id ? C.primary : "rgba(255,255,255,0.04)",
      color: tab === id ? C.dark : "rgba(255,255,255,0.6)",
      border: `1px solid ${tab === id ? C.primary : "rgba(255,255,255,0.08)"}`,
      transition: "all 0.2s",
    }}>{label}</button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0D1F1F; color: #fff; font-family: 'Barlow', sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
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
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {tabBtn("orders", "Orders")}
              {tabBtn("products", "Products")}
              <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, marginLeft: 8 }}>Logout</button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 5%" }}>

          {/* ── ORDERS TAB ── */}
          {tab === "orders" && (
            <>
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
                  placeholder="Search by name, email, order ID…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
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
                <button onClick={fetchOrders} style={{ background: "rgba(29,191,115,0.08)", border: "1px solid rgba(29,191,115,0.2)", borderRadius: 10, padding: "10px 16px", color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>↻ Refresh</button>
              </div>

              {/* Orders table */}
              <div style={{ background: C.navyLight, border: "1px solid rgba(29,191,115,0.12)", borderRadius: 20, overflow: "hidden" }}>
                {ordersLoading ? (
                  <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 16 }}>Loading orders…</div>
                ) : filteredOrders.length === 0 ? (
                  <div style={{ padding: 60, textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No orders yet</div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Orders appear here once customers start buying</div>
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
                        {filteredOrders.map(order => (
                          <OrderRow key={order._id} order={order} onView={setSelectedOrder} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "right" }}>
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            </>
          )}

          {/* ── PRODUCTS TAB ── */}
          {tab === "products" && (
            <>
              {/* Product stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20, marginBottom: 40 }}>
                <StatCard label="Total Products" value={products.length} sub="In catalogue" />
                <StatCard label="Avg. Price" value={products.length ? fmt(Math.round(products.reduce((s, p) => s + p.price, 0) / products.length)) : "—"} sub="Per product" color={C.accent} />
              </div>

              {/* Product toolbar */}
              <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
                <input
                  placeholder="Search products…"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  style={{
                    flex: 1, minWidth: 240, padding: "12px 16px", borderRadius: 12,
                    background: C.navyLight, border: "1px solid rgba(255,255,255,0.08)",
                    color: C.white, outline: "none", fontSize: 14,
                  }}
                />
                <button onClick={fetchProducts} style={{ background: "rgba(29,191,115,0.08)", border: "1px solid rgba(29,191,115,0.2)", borderRadius: 10, padding: "10px 16px", color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>↻ Refresh</button>
                <button onClick={() => setProductModal({})} style={{
                  background: C.primary, border: "none", borderRadius: 10, padding: "10px 20px",
                  color: C.dark, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800, fontSize: 15, letterSpacing: 1,
                }}>+ Add Product</button>
              </div>

              {/* Products table */}
              <div style={{ background: C.navyLight, border: "1px solid rgba(29,191,115,0.12)", borderRadius: 20, overflow: "hidden" }}>
                {productsLoading ? (
                  <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 16 }}>Loading products…</div>
                ) : filteredProducts.length === 0 ? (
                  <div style={{ padding: 60, textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No products yet</div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Add your first product to get started</div>
                    <button onClick={() => setProductModal({})} style={{
                      background: C.primary, border: "none", borderRadius: 10, padding: "12px 24px",
                      color: C.dark, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif",
                      fontWeight: 800, fontSize: 16, letterSpacing: 1,
                    }}>+ Add First Product</button>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(29,191,115,0.04)" }}>
                          {["Image", "Name", "Price", "Description", "Added", "Actions"].map(h => (
                            <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map(product => (
                          <tr
                            key={product._id}
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(29,191,115,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <td style={{ padding: "14px 20px" }}>
                              {product.image ? (
                                <img src={product.image} alt={product.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, background: "rgba(29,191,115,0.08)" }} />
                              ) : (
                                <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(29,191,115,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💊</div>
                              )}
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <div style={{ fontWeight: 600, fontSize: 15 }}>{product.name}</div>
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: C.primary }}>{fmt(product.price)}</div>
                            </td>
                            <td style={{ padding: "14px 20px", maxWidth: 240 }}>
                              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                {product.description || <span style={{ opacity: 0.3 }}>No description</span>}
                              </div>
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                                {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </div>
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => setProductModal(product)} style={{
                                  background: "rgba(29,191,115,0.08)", border: "1px solid rgba(29,191,115,0.2)",
                                  borderRadius: 8, padding: "6px 14px", color: C.accent, cursor: "pointer", fontSize: 12, fontWeight: 600,
                                }}>Edit</button>
                                <button onClick={() => setDeleteConfirm(product)} style={{
                                  background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)",
                                  borderRadius: 8, padding: "6px 14px", color: "#ff8080", cursor: "pointer", fontSize: 12, fontWeight: 600,
                                }}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "right" }}>
                {filteredProducts.length} of {products.length} products
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={updateOrderStatus} />
      {productModal !== null && (
        <ProductModal
          product={productModal._id ? productModal : null}
          onSave={() => { fetchProducts(); setProductModal(null); }}
          onClose={() => setProductModal(null)}
        />
      )}
      {deleteConfirm && (
        <DeleteConfirm product={deleteConfirm} onConfirm={handleDeleteProduct} onCancel={() => setDeleteConfirm(null)} />
      )}
    </>
  );
}
