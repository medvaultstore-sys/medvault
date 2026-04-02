"use client";
import { useState, useEffect, useCallback } from "react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  primary: "#1DBF73",
  secondary: "#0F5C4D",
  accent: "#47D89B",
  dark: "#1E2B2B",
  bg: "#EAF3EF",
  white: "#FFFFFF",
  navy: "#0D1F1F",
  navyLight: "#162929",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Barlow',sans-serif;background:${C.navy};color:${C.white};min-height:100vh;}
  ::-webkit-scrollbar{width:6px;}
  ::-webkit-scrollbar-track{background:${C.dark};}
  ::-webkit-scrollbar-thumb{background:${C.primary};border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}};
  @keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
  @keyframes cartBounce{0%,100%{transform:scale(1);}50%{transform:scale(1.3);}}
  @keyframes float3d{0%,100%{transform:perspective(900px) rotateY(-18deg) rotateX(6deg) translateY(0px);}50%{transform:perspective(900px) rotateY(-18deg) rotateX(6deg) translateY(-18px);}}
  @keyframes glowPulse{0%,100%{box-shadow:0 30px 80px rgba(29,191,115,0.25),0 0 0 1px rgba(29,191,115,0.1);}50%{box-shadow:0 40px 100px rgba(29,191,115,0.4),0 0 0 1px rgba(29,191,115,0.2);}}

  /* ── Responsive layout classes ── */
  .hero-row{display:flex;align-items:center;justify-content:space-between;gap:40px;}
  .hero-img{flex:0 0 auto;display:flex;align-items:center;justify-content:center;}
  .mission-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;}
  .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;}
  .cart-grid{display:grid;grid-template-columns:1fr 360px;gap:32px;}
  .checkout-grid{display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:start;}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .trust-bar{display:flex;justify-content:center;gap:10%;flex-wrap:wrap;padding:20px 5%;}
  .trust-item{display:flex;align-items:center;gap:10;color:rgba(255,255,255,0.8);font-size:13px;font-weight:500;}

  @media(max-width:768px){
    .hero-row{flex-direction:column;text-align:center;}
    .hero-img{order:-1;width:100%;}
    .hero-img img{width:clamp(220px,70vw,340px) !important;transform:perspective(900px) rotateY(0deg) rotateX(4deg) !important;}
    .mission-grid{grid-template-columns:1fr;}
    .detail-grid{grid-template-columns:1fr;}
    .cart-grid{grid-template-columns:1fr;}
    .checkout-grid{grid-template-columns:1fr;}
    .form-grid{grid-template-columns:1fr;}
    .form-grid>*{grid-column:span 1 !important;}
    .trust-bar{gap:20px;padding:20px 5%;}
    .nav-inner{height:60px !important;}
    .nav-logo-text{font-size:16px !important;}
    .hero-text h1{font-size:clamp(44px,14vw,80px) !important;}
    .hero-text p{font-size:15px !important;}
    .section-pad{padding:60px 4% !important;}
    .detail-image{height:280px !important;}
    .cart-item{flex-direction:column;align-items:flex-start !important;gap:12px !important;}
    .cart-item-actions{flex-direction:row !important;align-items:center !important;}
  }

  @media(max-width:480px){
    .hero-img img{width:clamp(180px,80vw,280px) !important;}
    .hero-text h1{font-size:clamp(40px,16vw,64px) !important;}
    .products-header{flex-direction:column !important;align-items:flex-start !important;}
    .search-bar{width:100% !important;min-width:unset !important;}
  }
`;

// ── Products ──────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "MedVault Pouch — Premium",
    tagline: "All-in-one structured storage",
    price: 2499,
    originalPrice: 3200,
    badge: "BESTSELLER",
    color: C.primary,
    desc: "Our flagship pouch featuring hospital-grade materials, carefully designed compartments, secure straps, and mesh sections. Built for practical labs, ward rounds, and clinical examinations.",
    features: ["Hospital-grade material","Structured compartments","Secure instrument straps","Mesh storage sections","Water-resistant lining"],
    instruments: ["Stethoscope","Reflex Hammer","Penlight","BP Cuff","Thermometer","Scissors","Forceps"],
    stock: 48,
    img: "🏥",
  },
  {
    id: 2,
    name: "MedVault Pouch — Standard",
    tagline: "Essential clinical carry",
    price: 1699,
    originalPrice: 2100,
    badge: "POPULAR",
    color: C.accent,
    desc: "The perfect everyday companion for medical students. Compact yet spacious with organized slots for your core clinical instruments.",
    features: ["Durable polyester build","Organised main compartment","Zippered pockets","Compact carry design","Professional finish"],
    instruments: ["Stethoscope","Reflex Hammer","Penlight","Thermometer","Scissors"],
    stock: 72,
    img: "🩺",
  },
  {
    id: 3,
    name: "MedVault Diagnostic Kit",
    tagline: "Complete first-year bundle",
    price: 4299,
    originalPrice: 5500,
    badge: "BUNDLE",
    color: "#5BE6A8",
    desc: "Everything a first-year medical student needs. Curated to match academic curricula with premium instruments + the Standard Pouch included.",
    features: ["Standard Pouch included","Calibrated stethoscope","Reflex hammer","LED penlight","Mercury-free thermometer"],
    instruments: ["Stethoscope","Reflex Hammer","Penlight","Thermometer","Tongue Depressor","Measuring Tape"],
    stock: 25,
    img: "🔬",
  },
  {
    id: 4,
    name: "MedVault Economy Kit",
    tagline: "Budget-smart essentials",
    price: 999,
    originalPrice: 1400,
    badge: "VALUE",
    color: "#89D4B0",
    desc: "Quality essentials at an accessible price point. Great for first-year students on a budget who refuse to compromise on organisation.",
    features: ["Basic compartment pouch","Essential instruments","Academic-aligned kit","Lightweight design","Easy to clean"],
    instruments: ["Stethoscope","Penlight","Thermometer","Tongue Depressor"],
    stock: 120,
    img: "💊",
  },
  // ── Individual Instruments ─────────────────────────────────
  {
    id: 5,
    name: "Littmann-Style Stethoscope",
    tagline: "Dual-head acoustic stethoscope",
    price: 3499,
    originalPrice: 5500,
    badge: "TOP PICK",
    color: C.primary,
    desc: "Dual-head acoustic stethoscope with high acoustic sensitivity. Ideal for auscultation of heart, lung and bowel sounds. Includes both diaphragm and bell.",
    features: ["Dual-head (bell + diaphragm)","High acoustic sensitivity","Soft-sealing ear tips","Latex-free tubing","2-year warranty"],
    instruments: ["Cardiac","Pulmonary","Pediatric use"],
    stock: 35,
    img: "/products/stethoscope.jpg",
  },
  {
    id: 6,
    name: "Aneroid BP Apparatus",
    tagline: "Manual sphygmomanometer set",
    price: 899,
    originalPrice: 1400,
    badge: "ESSENTIAL",
    color: C.accent,
    desc: "Precision aneroid sphygmomanometer with adult cuff and integrated stethoscope. Meets clinical accuracy standards. Ideal for bedside and ward use.",
    features: ["Calibrated aneroid gauge","Adult & child cuff sizes","Easy-read dial","Durable nylon cuff","Carrying case included"],
    instruments: ["Blood pressure monitoring","Clinical examination"],
    stock: 42,
    img: "/products/bp-apparatus.jpg",
  },
  {
    id: 7,
    name: "Taylor Reflex Hammer",
    tagline: "Standard neurological hammer",
    price: 349,
    originalPrice: 550,
    badge: "CLINICAL",
    color: "#5BE6A8",
    desc: "Classic Taylor percussion hammer for testing deep tendon reflexes. Triangular rubber head delivers consistent, reliable responses across all standard reflex sites.",
    features: ["Triangular rubber head","Chrome-plated handle","Balanced weight distribution","Durable & autoclavable","Standard clinical size"],
    instruments: ["Neurological examination","Reflex testing"],
    stock: 95,
    img: "/products/reflex-hammer.jpg",
  },
  {
    id: 8,
    name: "Digital Thermometer",
    tagline: "Fast-read oral & rectal thermometer",
    price: 249,
    originalPrice: 399,
    badge: "MUST-HAVE",
    color: "#89D4B0",
    desc: "Mercury-free digital thermometer with 60-second fast reading, fever alert beep, and auto shut-off. Accurate to ±0.1°C. Comes with protective case.",
    features: ["Mercury-free","60-second reading","Fever alert beep","Waterproof tip","Auto shut-off"],
    instruments: ["Temperature monitoring","Fever assessment"],
    stock: 150,
    img: "/products/thermometer.jpg",
  },
  {
    id: 9,
    name: "Bandage Scissors",
    tagline: "Blunt-tip safety scissors",
    price: 299,
    originalPrice: 450,
    badge: "UTILITY",
    color: C.primary,
    desc: "Stainless steel bandage scissors with angled blunt tip for safe dressing removal. Serrated lower blade grips material without slipping. Essential for wound care.",
    features: ["Stainless steel","Angled blunt tip","Serrated lower blade","Rust resistant","Autoclavable"],
    instruments: ["Wound dressing","Bandage removal","Suture cutting"],
    stock: 80,
    img: "/products/scissors.jpg",
  },
  {
    id: 10,
    name: "Tongue Depressors (100 pcs)",
    tagline: "Wooden sterile depressors",
    price: 149,
    originalPrice: 250,
    badge: "VALUE PACK",
    color: C.accent,
    desc: "Pack of 100 smooth-edged wooden tongue depressors. Sterile, splinter-free, and individually suitable for oral cavity examination and throat inspection.",
    features: ["Pack of 100","Sterile & splinter-free","Smooth rounded edges","Standard 15 cm length","Individually wrapped option"],
    instruments: ["Oral examination","Throat inspection","Gag reflex testing"],
    stock: 200,
    img: "/products/tongue-depressor.jpg",
  },
  {
    id: 11,
    name: "Diagnostic Penlight",
    tagline: "LED pupil & throat light",
    price: 199,
    originalPrice: 329,
    badge: "COMPACT",
    color: "#5BE6A8",
    desc: "Bright LED penlight for pupillary reflex assessment and oral cavity inspection. Features a crisp focused beam with a built-in pupil gauge printed on the barrel.",
    features: ["Bright LED beam","Pupil gauge on barrel","Pocket clip included","Replaceable batteries","Durable chrome finish"],
    instruments: ["Pupillary reflex","Oral inspection","Ear canal check"],
    stock: 110,
    img: "🔦",
  },
  {
    id: 12,
    name: "Tuning Fork 128 Hz",
    tagline: "Vibration & hearing testing",
    price: 399,
    originalPrice: 650,
    badge: "NEURO",
    color: "#89D4B0",
    desc: "Aluminium alloy tuning fork at 128 Hz — the standard frequency for testing vibration sense and the Rinne/Weber hearing tests. Clearly stamped with frequency.",
    features: ["128 Hz frequency","Aluminium alloy","Frequency stamped","Smooth weighted tines","Long resonance duration"],
    instruments: ["Vibration sense testing","Rinne test","Weber test","Hearing screening"],
    stock: 60,
    img: "🎼",
  },
];

// ── Helpers ───────────────────────────────────────────────────
const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
const disc = (p, o) => Math.round(((o - p) / o) * 100);
const isImgUrl = (s) => typeof s === "string" && (s.startsWith("/") || s.startsWith("http"));

// ── Components ────────────────────────────────────────────────
function Navbar({ cartCount, onCart, onHome, currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(13,31,31,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(29,191,115,0.15)` : "none",
      transition: "all 0.3s ease",
      padding: "0 5%",
    }}>
      <div className="nav-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <button onClick={onHome} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 14, color: C.white, letterSpacing: "-1px",
          }}>MV+</div>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: 3, color: C.white }}>MEDVAULT</span>
        </button>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <NavLink label="Products" onClick={onHome} active={currentPage === "home"} />
          <button onClick={onCart} style={{
            position: "relative", background: cartCount > 0 ? `rgba(29,191,115,0.15)` : "rgba(255,255,255,0.06)",
            border: `1px solid ${cartCount > 0 ? C.primary : "rgba(255,255,255,0.1)"}`,
            borderRadius: 10, padding: "8px 16px", cursor: "pointer", color: C.white,
            display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600,
            transition: "all 0.2s",
          }}>
            <span>🛒</span>
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{
                background: C.primary, color: C.dark, borderRadius: "50%",
                width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, animation: "cartBounce 0.3s ease",
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ label, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer",
      color: active ? C.primary : "rgba(255,255,255,0.65)",
      fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
      padding: "8px 14px", borderRadius: 8,
      transition: "color 0.2s",
    }}>{label}</button>
  );
}

// ── PAGES ─────────────────────────────────────────────────────

function HeroSection({ onShop }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: `radial-gradient(ellipse 80% 60% at 60% 40%, rgba(29,191,115,0.12) 0%, transparent 70%), linear-gradient(160deg, ${C.navy} 0%, #0a1a1a 100%)`,
      padding: "120px 5% 80px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${C.primary} 1px, transparent 1px), linear-gradient(90deg, ${C.primary} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Glow orb */}
      <div style={{
        position: "absolute", right: "5%", top: "20%",
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(29,191,115,0.15) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div className="hero-row" style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {/* Left: text */}
        <div className="hero-text" style={{ flex: "0 0 auto", maxWidth: 560, animation: "fadeUp 0.8s ease both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(29,191,115,0.12)", border: `1px solid rgba(29,191,115,0.3)`,
            borderRadius: 100, padding: "6px 16px", marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, display: "block" }} />
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Premium Medical Essentials</span>
          </div>

          <h1 style={{
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
            fontSize: "clamp(56px, 9vw, 120px)", lineHeight: 0.9,
            textTransform: "uppercase", letterSpacing: "-2px", marginBottom: 24,
          }}>
            <span style={{ display: "block", color: C.white }}>SECURE</span>
            <span style={{ display: "block", color: C.primary }}>YOUR</span>
            <span style={{ display: "block", color: C.white }}>ESSENTIALS</span>
          </h1>

          <p style={{
            fontSize: 18, color: "rgba(255,255,255,0.55)", fontWeight: 300,
            maxWidth: 480, lineHeight: 1.7, marginBottom: 44,
          }}>
            Smart medical kits and organised storage solutions built for healthcare students and professionals who value precision, quality, and confidence.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={onShop} style={{
              background: C.primary, color: C.dark, border: "none",
              padding: "16px 40px", borderRadius: 12, cursor: "pointer",
              fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
              fontSize: 16, letterSpacing: 2, textTransform: "uppercase",
              transition: "all 0.2s", boxShadow: `0 0 40px rgba(29,191,115,0.3)`,
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >Shop Now →</button>
            <div style={{ display: "flex", gap: 32, alignItems: "center", paddingLeft: 8 }}>
              <Stat num="4000+" label="Students" />
              <Stat num="3+" label="Kit Types" />
            </div>
          </div>
        </div>

        {/* Right: 3D floating pouch */}
        <div className="hero-img" style={{ animation: "fadeUp 1s ease 0.2s both" }}>
          <div style={{
            position: "relative",
            animation: "float3d 5s ease-in-out infinite",
            filter: "drop-shadow(0 40px 60px rgba(29,191,115,0.3))",
          }}>
            {/* Glow ring behind image */}
            <div style={{
              position: "absolute", inset: -20,
              borderRadius: 32,
              background: "radial-gradient(ellipse at center, rgba(29,191,115,0.18) 0%, transparent 70%)",
              animation: "glowPulse 5s ease-in-out infinite",
              zIndex: 0,
            }} />
            <img
              src="/pouch.jpg"
              alt="MedVault Pouch"
              style={{
                position: "relative", zIndex: 1,
                width: "clamp(280px, 35vw, 480px)",
                mixBlendMode: "screen",
                transform: "perspective(900px) rotateY(-18deg) rotateX(6deg)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ num, label }) {
  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: C.primary }}>{num}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function ProductCard({ product, onView, onAddToCart }) {
  const [hovered, setHovered] = useState(false);
  const pct = disc(product.price, product.originalPrice);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.navyLight : "rgba(22,41,41,0.7)",
        border: `1px solid ${hovered ? "rgba(29,191,115,0.4)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20, overflow: "hidden", cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 20px 60px rgba(29,191,115,0.12)` : "none",
        animation: "fadeUp 0.6s ease both",
      }}
    >
      {/* Image area */}
      <div style={{
        height: 200, display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, rgba(29,191,115,0.08) 0%, rgba(15,92,77,0.15) 100%)`,
        position: "relative", fontSize: 72, overflow: "hidden",
      }}>
        {isImgUrl(product.img)
          ? <img src={product.img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : product.img}
        <div style={{
          position: "absolute", top: 16, left: 16,
          background: C.primary, color: C.dark,
          borderRadius: 100, padding: "4px 12px",
          fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
        }}>{product.badge}</div>
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(0,0,0,0.5)", color: C.accent,
          borderRadius: 100, padding: "4px 12px",
          fontSize: 11, fontWeight: 700,
        }}>−{pct}%</div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 24px 20px" }}>
        <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{product.tagline}</div>
        <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, lineHeight: 1.1, marginBottom: 12 }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.desc}</p>

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 30, color: C.primary }}>{fmt(product.price)}</span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>{fmt(product.originalPrice)}</span>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onView(product)} style={{
            flex: 1, padding: "12px", borderRadius: 10,
            background: "rgba(29,191,115,0.08)", border: `1px solid rgba(29,191,115,0.2)`,
            color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 600,
            transition: "all 0.2s",
          }}>Details</button>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} style={{
            flex: 2, padding: "12px", borderRadius: 10,
            background: C.primary, border: "none",
            color: C.dark, cursor: "pointer", fontSize: 13, fontWeight: 700,
            letterSpacing: 0.5, transition: "all 0.2s",
          }}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ onView, onAddToCart, cartCount, onCart }) {
  const [query, setQuery] = useState("");
  const scrollToProducts = () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  const q = query.trim().toLowerCase();
  const filtered = q
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.features.some(f => f.toLowerCase().includes(q)) ||
        p.instruments.some(i => i.toLowerCase().includes(q)) ||
        p.badge.toLowerCase().includes(q)
      )
    : PRODUCTS;

  return (
    <div>
      <HeroSection onShop={scrollToProducts} />

      {/* Trust bar */}
      <div style={{
        background: C.secondary, padding: "20px 5%",
        display: "flex", justifyContent: "center", gap: "10%", flexWrap: "wrap",
      }}>
        {[["🚚", "Dark Store Delivery"], ["🏥", "Hospital-Grade Quality"], ["📦", "SRM Campus Ready"], ["🔒", "Secure Payments"]].map(([icon, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>{label}
          </div>
        ))}
      </div>

      {/* Products */}
      <div id="products" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5%" }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, color: C.accent, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Our Collection</p>
          <div className="products-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "clamp(36px,5vw,60px)", textTransform: "uppercase", lineHeight: 0.95 }}>
              <span style={{ color: C.white }}>CHOOSE YOUR </span>
              <span style={{ color: C.primary }}>KIT</span>
            </h2>

            {/* Search bar */}
            <div style={{ position: "relative", minWidth: 260 }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                fontSize: 16, pointerEvents: "none", opacity: 0.4,
              }}>🔍</span>
              <input
                type="text"
                placeholder="Search instruments, kits…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: "100%", padding: "12px 40px 12px 40px",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${query ? "rgba(29,191,115,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 12, color: C.white, fontSize: 14,
                  outline: "none", transition: "border-color 0.2s",
                  fontFamily: "'Barlow',sans-serif",
                }}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "rgba(255,255,255,0.4)",
                  cursor: "pointer", fontSize: 16, lineHeight: 1,
                }}>✕</button>
              )}
            </div>
          </div>

          {q && (
            <p style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 24 }}>
            {filtered.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={p} onView={onView} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No products found</p>
            <p style={{ fontSize: 14 }}>Try &ldquo;stethoscope&rdquo;, &ldquo;BP&rdquo;, or &ldquo;kit&rdquo;</p>
          </div>
        )}
      </div>

      {/* Mission strip */}
      <div style={{
        background: `linear-gradient(135deg, ${C.secondary}, #0a2218)`,
        padding: "60px 5%", margin: "0 0 80px",
        borderTop: `1px solid rgba(29,191,115,0.15)`,
        borderBottom: `1px solid rgba(29,191,115,0.15)`,
      }}>
        <div className="mission-grid" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2.5, fontWeight: 700, marginBottom: 16, textTransform: "uppercase" }}>Our Mission</p>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.75)" }}>
              Support healthcare students and professionals with thoughtfully designed medical essentials that improve learning, build confidence, and support strong clinical practice.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2.5, fontWeight: 700, marginBottom: 16, textTransform: "uppercase" }}>Our Vision</p>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.75)" }}>
              Improve the way medical tools and storage kits are designed through smart design and high quality — beginning with a carefully crafted pouch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailPage({ product, onBack, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const pct = disc(product.price, product.originalPrice);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 5% 80px", animation: "fadeUp 0.5s ease both" }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer", color: C.accent,
        fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 48,
      }}>← Back to Products</button>

      <div className="detail-grid">
        {/* Image */}
        <div style={{
          background: `linear-gradient(135deg, rgba(29,191,115,0.08), rgba(15,92,77,0.2))`,
          borderRadius: 24, height: 440,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 120, border: `1px solid rgba(29,191,115,0.15)`,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 20, left: 20,
            background: C.primary, color: C.dark, borderRadius: 100, padding: "6px 16px",
            fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
          }}>{product.badge}</div>
          <div style={{
            position: "absolute", top: 20, right: 20,
            background: "rgba(0,0,0,0.4)", color: C.accent, borderRadius: 100, padding: "6px 16px",
            fontSize: 12, fontWeight: 700,
          }}>−{pct}% OFF</div>
          {isImgUrl(product.img)
            ? <img src={product.img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 24 }} />
            : product.img}
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize: 12, color: C.accent, letterSpacing: 2.5, fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>{product.tagline}</div>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 44, lineHeight: 1, textTransform: "uppercase", marginBottom: 20 }}>{product.name}</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 28 }}>{product.desc}</p>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 32, padding: "20px", background: "rgba(29,191,115,0.06)", borderRadius: 12, border: `1px solid rgba(29,191,115,0.12)` }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 42, color: C.primary }}>{fmt(product.price)}</span>
            <span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>{fmt(product.originalPrice)}</span>
            <span style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>You save {fmt(product.originalPrice - product.price)}</span>
          </div>

          {/* Features */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>What&apos;s included</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.features.map(f => (
                <span key={f} style={{
                  background: "rgba(29,191,115,0.08)", border: `1px solid rgba(29,191,115,0.2)`,
                  borderRadius: 8, padding: "6px 12px", fontSize: 12, color: C.accent, fontWeight: 500,
                }}>✓ {f}</span>
              ))}
            </div>
          </div>

          {/* Instruments */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Fits these instruments</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {product.instruments.map(i => (
                <span key={i} style={{
                  background: "rgba(255,255,255,0.05)", borderRadius: 100, padding: "4px 12px",
                  fontSize: 12, color: "rgba(255,255,255,0.6)",
                }}>{i}</span>
              ))}
            </div>
          </div>

          {/* Qty + CTA */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: C.white, width: 44, height: 52, cursor: "pointer", fontSize: 18 }}>−</button>
              <span style={{ width: 44, textAlign: "center", fontSize: 16, fontWeight: 700 }}>{qty}</span>
              <button onClick={() => setQty(Math.min(10, qty + 1))} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: C.white, width: 44, height: 52, cursor: "pointer", fontSize: 18 }}>+</button>
            </div>
            <button onClick={handleAdd} style={{
              flex: 1, padding: "16px 32px", borderRadius: 12, border: "none",
              background: added ? C.secondary : C.primary, color: added ? C.accent : C.dark,
              cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 800, fontSize: 18, letterSpacing: 1.5, textTransform: "uppercase",
              transition: "all 0.3s",
            }}>{added ? "✓ Added to Cart!" : "Add to Cart"}</button>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, display: "block" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{product.stock} in stock · Fast dispatch from SRM campus dark store</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, onRemove, onQty, onCheckout, onBack }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal >= 2000 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, padding: "120px 5%" }}>
      <div style={{ fontSize: 80 }}>🛒</div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 36, fontWeight: 800 }}>Your cart is empty</h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16 }}>Add some products to get started</p>
      <button onClick={onBack} style={{
        background: C.primary, color: C.dark, border: "none", padding: "14px 32px",
        borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 15,
      }}>Browse Products</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 5% 80px", animation: "fadeUp 0.5s ease" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: 14, fontWeight: 600, marginBottom: 40, display: "flex", alignItems: "center", gap: 8 }}>← Continue Shopping</button>
      <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 48, textTransform: "uppercase", marginBottom: 40 }}>
        <span style={{ color: C.white }}>YOUR </span><span style={{ color: C.primary }}>CART</span>
      </h1>

      <div className="cart-grid">
        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {cart.map(item => (
            <div key={item.id} style={{
              background: C.navyLight, border: `1px solid rgba(255,255,255,0.06)`,
              borderRadius: 16, padding: 24, display: "flex", gap: 20, alignItems: "center",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 12,
                background: "rgba(29,191,115,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, flexShrink: 0,
              }}>{item.img}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{item.tagline}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20 }}>{item.name}</div>
                <div style={{ color: C.primary, fontWeight: 700, fontSize: 18, marginTop: 4 }}>{fmt(item.price)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 10, overflow: "hidden" }}>
                  <button onClick={() => onQty(item.id, item.quantity - 1)} style={{ background: "rgba(255,255,255,0.04)", border: "none", color: C.white, width: 36, height: 40, cursor: "pointer" }}>−</button>
                  <span style={{ width: 36, textAlign: "center", fontWeight: 700 }}>{item.quantity}</span>
                  <button onClick={() => onQty(item.id, item.quantity + 1)} style={{ background: "rgba(255,255,255,0.04)", border: "none", color: C.white, width: 36, height: 40, cursor: "pointer" }}>+</button>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{fmt(item.price * item.quantity)}</div>
                <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "rgba(255,100,100,0.6)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: C.navyLight, border: `1px solid rgba(29,191,115,0.15)`, borderRadius: 20, padding: 28, height: "fit-content", position: "sticky", top: 90 }}>
          <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, textTransform: "uppercase", marginBottom: 24 }}>Order Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            <Row label={`Subtotal (${cart.reduce((s, i) => s + i.quantity, 0)} items)`} val={fmt(subtotal)} />
            <Row label="Shipping" val={shipping === 0 ? <span style={{ color: C.primary }}>FREE</span> : fmt(shipping)} />
            {shipping > 0 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Free shipping on orders above ₹2,000</div>}
          </div>
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 20, marginBottom: 24 }}>
            <Row label="Total" val={fmt(total)} big />
          </div>
          <button onClick={onCheckout} style={{
            width: "100%", padding: "18px", borderRadius: 14, border: "none",
            background: C.primary, color: C.dark, cursor: "pointer",
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 20,
            letterSpacing: 2, textTransform: "uppercase",
            boxShadow: `0 0 30px rgba(29,191,115,0.25)`,
          }}>Order on WhatsApp →</button>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["🔒 Secure", "Razorpay", "UPI / Cards"].map(t => (
              <span key={t} style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, field, type = "text", placeholder, half, errors, form, setForm, setErrors }) {
  return (
    <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
      <label style={{ display: "block", fontSize: 11, color: errors[field] ? "#ff6b6b" : C.accent, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        {label} {errors[field] && <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>— {errors[field]}</span>}
      </label>
      <input
        type={type} value={form[field]} placeholder={placeholder}
        onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: null })); }}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 15,
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${errors[field] ? "rgba(255,100,100,0.4)" : "rgba(255,255,255,0.1)"}`,
          color: C.white, outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = C.primary}
        onBlur={e => e.target.style.borderColor = errors[field] ? "rgba(255,100,100,0.4)" : "rgba(255,255,255,0.1)"}
      />
    </div>
  );
}

function Row({ label, val, big }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: big ? 16 : 14, fontWeight: big ? 700 : 400, color: big ? C.white : "rgba(255,255,255,0.55)" }}>{label}</span>
      <span style={{ fontSize: big ? 22 : 15, fontWeight: big ? 900 : 600, color: big ? C.primary : C.white, fontFamily: big ? "'Barlow Condensed',sans-serif" : "inherit" }}>{val}</span>
    </div>
  );
}

const STATES = ["Tamil Nadu","Karnataka","Maharashtra","Delhi","Telangana","Andhra Pradesh","Kerala","Gujarat","Rajasthan","Uttar Pradesh"];

function CheckoutPage({ cart, onPlaceOrder, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "Tamil Nadu", pincode: "" });
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "10-digit mobile number";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = "6-digit PIN";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setPaying(true);

    const orderData = {
      orderId: "MV" + Date.now(),
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
      items: cart,
      total,
    };

    // Save order to DB
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    // Build WhatsApp message
    const productList = cart
      .map(i => `• ${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString("en-IN")}`)
      .join("\n");
    const waMsg = `Hello MedVault! I want to place an order 🛒\n\n${productList}\n\n*Total: ₹${total.toLocaleString("en-IN")}*\n\n*Customer Details:*\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nAddress: ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/918248613274?text=${encodeURIComponent(waMsg)}`, "_blank");

    setPaying(false);
    onPlaceOrder(orderData);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 5% 80px", animation: "fadeUp 0.5s ease" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: 14, fontWeight: 600, marginBottom: 40, display: "flex", alignItems: "center", gap: 8 }}>← Back to Cart</button>
      <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 48, textTransform: "uppercase", marginBottom: 40 }}>
        <span style={{ color: C.white }}>CHECKOUT</span>
      </h1>

      <div className="checkout-grid">
        <div>
          {/* Delivery info */}
          <div style={{ background: C.navyLight, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 20, padding: 32, marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 24 }}>Delivery Details</h3>
            <div className="form-grid">
              <FormField label="Full Name" field="name" placeholder="Dr. Arjun Sharma" errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="Email" field="email" type="email" placeholder="you@email.com" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="Phone" field="phone" type="tel" placeholder="9876543210" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="Address" field="address" placeholder="Hostel Block / Campus Address" errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="City" field="city" placeholder="Chennai" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="PIN Code" field="pincode" placeholder="600003" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>State</label>
                <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 15,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: C.white, outline: "none",
                }}>
                  {STATES.map(s => <option key={s} value={s} style={{ background: C.dark }}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Payment note */}
          <div style={{
            background: "rgba(29,191,115,0.06)", border: `1px solid rgba(29,191,115,0.2)`,
            borderRadius: 16, padding: 20, display: "flex", gap: 16, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 28 }}>🔒</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Order via WhatsApp</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                Your order details will be sent directly to our WhatsApp. We&apos;ll confirm and arrange delivery from our SRM campus store.
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {["💬 WhatsApp", "Cash on Delivery", "UPI on Confirmation"].map(m => (
                  <span key={m} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: C.navyLight, border: `1px solid rgba(29,191,115,0.15)`, borderRadius: 20, padding: 28 }}>
          <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, textTransform: "uppercase", marginBottom: 20 }}>Order Review</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>{item.img}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 700, color: C.accent, fontSize: 14 }}>{fmt(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            <Row label="Subtotal" val={fmt(subtotal)} />
            <Row label="Shipping" val={shipping === 0 ? <span style={{ color: C.primary }}>FREE</span> : fmt(shipping)} />
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 10, marginTop: 4 }}>
              <Row label="Total" val={fmt(total)} big />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={paying} style={{
            width: "100%", padding: "18px", borderRadius: 14, border: "none",
            background: paying ? C.secondary : C.primary, color: paying ? C.accent : C.dark,
            cursor: paying ? "not-allowed" : "pointer",
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18,
            letterSpacing: 2, textTransform: "uppercase",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "all 0.3s",
          }}>
            {paying ? (
              <>
                <span style={{ width: 18, height: 18, border: `2px solid rgba(255,255,255,0.3)`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                Processing…
              </>
            ) : `Order on WhatsApp — ${fmt(total)}`}
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>By placing order you agree to our Terms &amp; Conditions</p>
        </div>
      </div>
    </div>
  );
}

function ConfirmationPage({ order, onHome }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "120px 5%", flexDirection: "column",
    }}>
      <div style={{
        background: C.navyLight, border: `1px solid rgba(29,191,115,0.2)`,
        borderRadius: 28, padding: "48px 40px", maxWidth: 560, width: "100%",
        animation: "fadeUp 0.6s ease both", textAlign: "center",
        boxShadow: `0 0 80px rgba(29,191,115,0.1)`,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 24px",
          boxShadow: `0 0 40px rgba(29,191,115,0.4)`,
        }}>✓</div>

        <div style={{ fontSize: 11, color: C.accent, letterSpacing: 3, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Order Confirmed!</div>
        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 42, marginBottom: 8 }}>Thank You, {order.customerName.split(" ")[0]}!</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
          Your order has been placed successfully. A confirmation has been sent to <strong style={{ color: C.accent }}>{order.email}</strong>
        </p>

        <div style={{ background: "rgba(29,191,115,0.06)", border: `1px solid rgba(29,191,115,0.12)`, borderRadius: 16, padding: 20, marginBottom: 28, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Order ID</span>
            <span style={{ fontWeight: 700, fontFamily: "monospace", color: C.accent, fontSize: 14 }}>{order.orderId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Total Paid</span>
            <span style={{ fontWeight: 800, color: C.primary, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20 }}>{fmt(order.total)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Delivery to</span>
            <span style={{ fontSize: 13, color: C.white, textAlign: "right", maxWidth: "60%" }}>{order.address}</span>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Your order:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {order.items.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{item.img} {item.name} ×{item.quantity}</span>
                <span style={{ color: C.accent, fontWeight: 600 }}>{fmt(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16, marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            🚀 Orders are dispatched from our <strong style={{ color: "rgba(255,255,255,0.7)" }}>SRM campus dark store</strong> within 24 hours. You&apos;ll receive a tracking link shortly.
          </p>
        </div>

        <button onClick={onHome} style={{
          width: "100%", padding: "16px", borderRadius: 14, border: "none",
          background: C.primary, color: C.dark, cursor: "pointer",
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18,
          letterSpacing: 2, textTransform: "uppercase",
        }}>Continue Shopping</button>
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────
function Toast({ msg, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 9999,
      background: C.secondary, border: `1px solid ${C.primary}`,
      borderRadius: 14, padding: "14px 22px",
      display: "flex", alignItems: "center", gap: 12,
      transform: visible ? "translateY(0)" : "translateY(120px)",
      opacity: visible ? 1 : 0,
      transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      boxShadow: `0 8px 32px rgba(29,191,115,0.25)`,
    }}>
      <span style={{ fontSize: 20 }}>✓</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>{msg}</span>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [order, setOrder] = useState(null);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [toastTimer, setToastTimer] = useState(null);

  const showToast = useCallback((msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToast({ msg, visible: true });
    const t = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
    setToastTimer(t);
  }, [toastTimer]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name.split("—")[0].trim()} added to cart`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    if (qty > 10) return;
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handlePlaceOrder = (orderData) => {
    setOrder(orderData);
    setCart([]);
    setPage("confirmation");
  };

  const goHome = () => { setPage("home"); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goDetail = (p) => { setSelectedProduct(p); setPage("detail"); window.scrollTo({ top: 0 }); };
  const goCart = () => { setPage("cart"); window.scrollTo({ top: 0 }); };
  const goCheckout = () => { setPage("checkout"); window.scrollTo({ top: 0 }); };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: C.navy }}>
        {page !== "confirmation" && (
          <Navbar cartCount={cartCount} onCart={goCart} onHome={goHome} currentPage={page} />
        )}

        {page === "home" && <HomePage onView={goDetail} onAddToCart={addToCart} cartCount={cartCount} onCart={goCart} />}
        {page === "detail" && selectedProduct && <ProductDetailPage product={selectedProduct} onBack={goHome} onAddToCart={addToCart} />}
        {page === "cart" && <CartPage cart={cart} onRemove={removeFromCart} onQty={updateQty} onCheckout={goCheckout} onBack={goHome} />}
        {page === "checkout" && <CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} onBack={goCart} />}
        {page === "confirmation" && order && <ConfirmationPage order={order} onHome={goHome} />}

        <Toast msg={toast.msg} visible={toast.visible} />
      </div>
    </>
  );
}