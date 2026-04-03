"use client";
import { useState, useEffect, useCallback } from "react";

const C = {
  primary: "#1DBF73",
  secondary: "#0F5C4D",
  accent: "#47D89B",
  gold: "#C8A96E",
  dark: "#060D0D",
  navy: "#0A1212",
  navyLight: "#111E1E",
  card: "#0F1A1A",
  border: "rgba(255,255,255,0.07)",
  borderGreen: "rgba(29,191,115,0.2)",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.45)",
  subtle: "rgba(255,255,255,0.08)",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:${C.dark};color:${C.white};min-height:100vh;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:${C.navy};}
  ::-webkit-scrollbar-thumb{background:${C.secondary};border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
  @keyframes cartBounce{0%,100%{transform:scale(1);}50%{transform:scale(1.25);}}
  @keyframes float3d{0%,100%{transform:perspective(900px) rotateY(-15deg) rotateX(5deg) translateY(0);}50%{transform:perspective(900px) rotateY(-15deg) rotateX(5deg) translateY(-14px);}}

  .hero-row{display:flex;align-items:center;justify-content:space-between;gap:48px;}
  .hero-img{flex:0 0 auto;display:flex;align-items:center;justify-content:center;}
  .kits-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
  .items-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;}
  .apparel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;}
  .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;}
  .cart-grid{display:grid;grid-template-columns:1fr 340px;gap:28px;}
  .checkout-grid{display:grid;grid-template-columns:1fr 340px;gap:28px;align-items:start;}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .mission-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;}

  @media(max-width:900px){
    .kits-grid{grid-template-columns:1fr;}
    .cart-grid{grid-template-columns:1fr;}
    .checkout-grid{grid-template-columns:1fr;}
    .detail-grid{grid-template-columns:1fr;}
    .mission-grid{grid-template-columns:1fr;}
    .hero-row{flex-direction:column;text-align:center;}
    .hero-img{order:-1;width:100%;}
    .hero-img img{width:clamp(200px,65vw,320px)!important;transform:perspective(900px) rotateY(0deg) rotateX(3deg)!important;}
  }
  @media(max-width:600px){
    .items-grid{grid-template-columns:1fr 1fr;}
    .form-grid{grid-template-columns:1fr;}
    .form-grid>*{grid-column:span 1!important;}
  }
  @media(max-width:400px){
    .items-grid{grid-template-columns:1fr;}
  }
`;

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
const disc = (p, o) => Math.round(((o - p) / o) * 100);
const isUrl = (s) => typeof s === "string" && (s.startsWith("/") || s.startsWith("http"));

// ── Image Gallery ─────────────────────────────────────────────
function ImageGallery({ images, name, height = 420 }) {
  const [active, setActive] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div>
      <div style={{ height, borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, background: C.card, position: "relative" }}>
        <img
          src={images[active]}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.3s" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        {images.length > 1 && (
          <>
            <button onClick={() => setActive(i => (i - 1 + images.length) % images.length)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: C.white, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <button onClick={() => setActive(i => (i + 1) % images.length)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: C.white, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {images.map((_, i) => (
                <span key={i} onClick={() => setActive(i)} style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 3, background: i === active ? C.primary : "rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.2s" }} />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
          {images.map((img, i) => (
            <div key={i} onClick={() => setActive(i)} style={{ width: 60, height: 60, flexShrink: 0, borderRadius: 10, overflow: "hidden", cursor: "pointer", border: `2px solid ${i === active ? C.primary : "transparent"}`, transition: "border 0.2s" }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Accurate product images ────────────────────────────────────
const U = "https://images.unsplash.com/photo-";
const IMG = {
  // Kits — physio examination & medical bag context
  kit1: [
    `${U}1559757148-5c350d0d3c56?w=700&q=80`,  // medical instruments spread out
    `${U}1584308666744-24d5c474f2ae?w=700&q=80`, // stethoscope + tools
    `${U}1530026405845-96b785d5e0db?w=700&q=80`, // physiotherapy session
    `${U}1576091160550-2173dba999ef?w=700&q=80`, // doctor tools on table
    `${U}ulTeKLUAhf4?w=700&q=80`,               // medical kit bag
  ],
  kit2: [
    `${U}1576091160550-2173dba999ef?w=700&q=80`,
    `${U}1559757148-5c350d0d3c56?w=700&q=80`,
    `${U}1530026405845-96b785d5e0db?w=700&q=80`,
    `${U}1584308666744-24d5c474f2ae?w=700&q=80`,
    `${U}1504439904031-93ced9f77fcf?w=700&q=80`,
  ],
  kit3: [
    `${U}1481627834876-b7833e8f5570?w=700&q=80`, // open books & notes
    `${U}1571019614242-c5c5dee9f50b?w=700&q=80`, // resistance band exercise
    `${U}1544367567-0f2fcb009e0b?w=700&q=80`,    // yoga mat rolled
    `${U}1544947950-fa07a98d237f?w=700&q=80`,    // study notes
    `${U}1491728236548-1808ef3aac77?w=700&q=80`, // reading / studying
  ],

  // Goniometer — physiotherapy joint measurement
  goniometer: [
    `${U}1530026405845-96b785d5e0db?w=700&q=80`, // physio measuring joint ROM
    `${U}1559757148-5c350d0d3c56?w=700&q=80`,
    `${U}1576091160550-2173dba999ef?w=700&q=80`,
    `${U}1584308666744-24d5c474f2ae?w=700&q=80`,
    `${U}1504439904031-93ced9f77fcf?w=700&q=80`,
  ],

  // Knee hammer — neurological reflex testing
  hammer: [
    `${U}1576091160550-2173dba999ef?w=700&q=80`, // neurology exam tools
    `${U}1559757148-5c350d0d3c56?w=700&q=80`,
    `${U}1530026405845-96b785d5e0db?w=700&q=80`,
    `${U}1584308666744-24d5c474f2ae?w=700&q=80`,
    `${U}1504439904031-93ced9f77fcf?w=700&q=80`,
  ],

  // Tuning fork — medical neurology
  tuningfork: [
    `${U}1559757148-5c350d0d3c56?w=700&q=80`,
    `${U}1576091160550-2173dba999ef?w=700&q=80`,
    `${U}1530026405845-96b785d5e0db?w=700&q=80`,
    `${U}1584308666744-24d5c474f2ae?w=700&q=80`,
    `${U}1504439904031-93ced9f77fcf?w=700&q=80`,
  ],

  // Measuring tape — actual tape measure
  tape: [
    `${U}AgxK4Ohn1Cw?w=700&q=80`,  // close-up measuring tape with numbers
    `${U}Pa2EMnpJGVk?w=700&q=80`,  // white measuring tape
    `${U}M779tNeoSKc?w=700&q=80`,  // tape measure macro
    `${U}3lU3ejA3_gA?w=700&q=80`,  // yellow measuring tape
    `${U}mz9koyBQd4Q?w=700&q=80`,  // black and white measuring tape
  ],

  // Pen torch — clinical penlight (use medical exam context)
  pentorch: [
    `${U}1504439904031-93ced9f77fcf?w=700&q=80`,
    `${U}1576091160550-2173dba999ef?w=700&q=80`,
    `${U}1559757148-5c350d0d3c56?w=700&q=80`,
    `${U}1530026405845-96b785d5e0db?w=700&q=80`,
    `${U}1584308666744-24d5c474f2ae?w=700&q=80`,
  ],

  // Stethoscope — actual stethoscope shots
  stethoscope: [
    `${U}yo01Z-9HQAw?w=700&q=80`,   // clean black stethoscope product shot
    `${U}hIgeoQjS_iE?w=700&q=80`,   // doctor holding stethoscope
    `${U}NFvdKIhxYlU?w=700&q=80`,   // green stethoscope on desk
    `${U}lDH1fxwguxw?w=700&q=80`,   // doctor using stethoscope on patient
    `${U}00heEp9LFP0?w=700&q=80`,   // stethoscope on books
  ],

  // Yoga mat — actual yoga mat photos
  yogamat: [
    `${U}b8Q5fHBsyik?w=700&q=80`,   // yoga mat with blocks on top
    `${U}GpVak9-cL6E?w=700&q=80`,   // green yoga mat with person
    `${U}6LMRstrUWUE?w=700&q=80`,   // pink yoga mat kneeling
    `${U}taLFD7eUKkI?w=700&q=80`,   // lying on yoga mat
    `${U}G9H5edUL0T8?w=700&q=80`,   // standing on yoga mat
  ],

  // Resistance band — exercise band shots
  band: [
    `${U}1571019614242-c5c5dee9f50b?w=700&q=80`, // resistance band exercise
    `${U}9IU6lNGUvHY?w=700&q=80`,                // woman with resistance band
    `${U}1544367567-0f2fcb009e0b?w=700&q=80`,
    `${U}1506126613408-eca07ce68773?w=700&q=80`,
    `${U}1518611012118-696072aa579a?w=700&q=80`,
  ],

  // Vaseline / cream jar
  vaseline: [
    `${U}6w2eMsA7HCc?w=700&q=80`,  // moisturizer cream jar on blue bg
    `${U}4cJ_MMY1zhU?w=700&q=80`,  // woman holding cream jar
    `${U}KNMMXSHL8SA?w=700&q=80`,  // skincare cream jar with dropper
    `${U}lIi4yy4_vN8?w=700&q=80`,  // jar of cream
    `${U}1584820927498-cfe5211fd8bf?w=700&q=80`,
  ],

  // Medical / physio notes & textbooks
  notes: [
    `${U}NIJuEQw0RKg?w=700&q=80`,  // books on shelves
    `${U}eeSdJfLfx1A?w=700&q=80`,  // stacked books
    `${U}Oaqk7qqNh_c?w=700&q=80`,  // open book
    `${U}1481627834876-b7833e8f5570?w=700&q=80`,
    `${U}1544947950-fa07a98d237f?w=700&q=80`,
  ],

  // Medical tape — kinesio / bandage tape (physio relevant)
  medtape: [
    `${U}M7jnoUWX7gA?w=700&q=80`,  // physio kinesio tape on knee
    `${U}rKJoUsqmSs4?w=700&q=80`,  // person holding bandage
    `${U}qxYDhV0rBPk?w=700&q=80`,  // wrapping bandage
    `${U}2kqcVTOAc8Q?w=700&q=80`,  // bandage on arm
    `${U}1584820927498-cfe5211fd8bf?w=700&q=80`,
  ],

  // Scrubs — actual medical scrubs
  scrubs: [
    `${U}A2CK97sS0ns?w=700&q=80`,  // people in blue scrubs
    `${U}P_YA5TsPD4Y?w=700&q=80`,  // white medical scrub
    `${U}bNXOexRUDBQ?w=700&q=80`,  // blue scrub suit with mask
    `${U}D_rVQbuYAJA?w=700&q=80`,  // female doctor in scrubs
    `${U}oM3o8sWsOOk?w=700&q=80`,  // blue scrub beside white robe
  ],

  // Lab apron / white coat
  apron: [
    `${U}QfNs16axnpw?w=700&q=80`,  // man in white lab coat
    `${U}v5_0UjZEmgM?w=700&q=80`,  // woman in white coat with stethoscope
    `${U}d2D_OF14-70?w=700&q=80`,  // person in white coat
    `${U}Ictq5tY3_A0?w=700&q=80`,  // doctor in white coat with x-ray
    `${U}0X-1-9lpEbM?w=700&q=80`,  // white coat writing notes
  ],
};

// ── Kits ──────────────────────────────────────────────────────
const KITS = [
  {
    id: "kit-1", type: "kit",
    name: "Physio Curated Kit",
    tagline: "The complete BPT starter bundle",
    price: 1999, originalPrice: 2599,
    badge: "BESTSELLER", badgeColor: C.primary,
    desc: "Every instrument a first-year BPT student needs — sourced, quality-checked, and packed by MedVault. Walk into your practical lab fully equipped.",
    items: [
      { name: "Goniometer Set (3-in-1)", qty: 1, retail: 450 },
      { name: "Knee Hammer", qty: 1, retail: 150 },
      { name: "Tuning Fork", qty: 1, retail: 220 },
      { name: "Inch Tape", qty: 1, retail: 80 },
      { name: "Pen Torch", qty: 1, retail: 120 },
      { name: "Stethoscope", qty: 1, retail: 299 },
      { name: "Yoga Mat", qty: 1, retail: 350 },
      { name: "Resistance Band", qty: 1, retail: 180 },
      { name: "Vaseline", qty: 1, retail: 80 },
      { name: "Physio Notes (basic)", qty: 1, retail: 300 },
    ],
    stock: 48, images: IMG.kit1,
    features: ["Hospital-grade instruments","Curated for BPT curriculum","Delivered to SRM campus","Quality-checked by MedVault"],
  },
  {
    id: "kit-2", type: "kit",
    name: "Practical Exam Kit",
    tagline: "Core tools for clinical practicals",
    price: 699, originalPrice: 870,
    badge: "EXAM READY", badgeColor: C.gold,
    desc: "The five instruments you need most for practical exams. Compact, affordable, and ready to carry. Perfect for students who already own some tools.",
    items: [
      { name: "Goniometer", qty: 1, retail: 300 },
      { name: "Knee Hammer", qty: 1, retail: 150 },
      { name: "Tuning Fork", qty: 1, retail: 220 },
      { name: "Inch Tape", qty: 1, retail: 80 },
      { name: "Pen Torch", qty: 1, retail: 120 },
    ],
    stock: 72, images: IMG.kit2,
    features: ["5 core exam instruments","Lightweight & portable","Exam-compliant tools","Quick delivery"],
  },
  {
    id: "kit-3", type: "kit",
    name: "Smart Study Kit",
    tagline: "Refill consumables + study material",
    price: 549, originalPrice: 680,
    badge: "STUDY SMART", badgeColor: C.accent,
    desc: "Stay stocked throughout the semester. Includes replacement resistance band, Vaseline, medical tape, and curated physio notes — everything that runs out.",
    items: [
      { name: "Resistance Band", qty: 1, retail: 180 },
      { name: "Vaseline", qty: 1, retail: 80 },
      { name: "Medical Tape", qty: 1, retail: 120 },
      { name: "Physio Notes (basic)", qty: 1, retail: 300 },
    ],
    stock: 100, images: IMG.kit3,
    features: ["Semester-long consumables","Curated notes included","Affordable refill pack","Pairs with any kit"],
  },
];

// ── Individual Items ───────────────────────────────────────────
const ITEMS = [
  { id:"i-1",  type:"item", name:"Goniometer Set (3-in-1)", tagline:"Joint angle measurement",    price:450, originalPrice:600, badge:"MEASUREMENT", images:IMG.goniometer, desc:"Full 3-piece goniometer set for measuring joint range of motion. Includes large, small, and finger goniometers.", stock:80 },
  { id:"i-2",  type:"item", name:"Knee Hammer",             tagline:"Reflex testing",              price:150, originalPrice:220, badge:"DIAGNOSTIC",  images:IMG.hammer,     desc:"Standard Taylor percussion hammer with triangular rubber head for patellar, achilles, and tendon reflexes.", stock:95 },
  { id:"i-3",  type:"item", name:"Tuning Fork (128 Hz)",    tagline:"Vibration & hearing tests",   price:220, originalPrice:300, badge:"DIAGNOSTIC",  images:IMG.tuningfork, desc:"Aluminium alloy 128 Hz tuning fork for vibration sense testing, Rinne and Weber tests. Frequency-stamped.", stock:60 },
  { id:"i-4",  type:"item", name:"Inch Tape",               tagline:"Body measurement",            price:80,  originalPrice:120, badge:"MEASUREMENT", images:IMG.tape,       desc:"Flexible 150 cm measuring tape with dual-side inch and cm markings. Essential for limb girth and posture.", stock:150 },
  { id:"i-5",  type:"item", name:"Pen Torch",               tagline:"Pupil & oral exam",           price:120, originalPrice:180, badge:"DIAGNOSTIC",  images:IMG.pentorch,   desc:"Bright LED pen torch with pupil gauge on barrel. Pocket clip, replaceable batteries, chrome finish.", stock:110 },
  { id:"i-6",  type:"item", name:"Stethoscope",             tagline:"Basic auscultation",          price:299, originalPrice:420, badge:"MONITORING",  images:IMG.stethoscope,desc:"Dual-head stethoscope with diaphragm and bell. High acoustic sensitivity, soft-seal ear tips, latex-free.", stock:55 },
  { id:"i-7",  type:"item", name:"Yoga Mat",                tagline:"Exercise & rehab support",    price:350, originalPrice:500, badge:"REHAB",        images:IMG.yogamat,    desc:"Non-slip 6mm thick yoga mat for therapeutic exercise, stretching, and rehabilitation sessions.", stock:40 },
  { id:"i-8",  type:"item", name:"Resistance Band",         tagline:"Strength training",           price:180, originalPrice:260, badge:"REHAB",        images:IMG.band,       desc:"Medium-resistance latex-free exercise band for upper and lower limb strengthening. Used in all BPT sessions.", stock:120 },
  { id:"i-9",  type:"item", name:"Vaseline (100g)",         tagline:"Skin care & UST medium",      price:80,  originalPrice:120, badge:"CONSUMABLE",  images:IMG.vaseline,   desc:"Medical-grade petroleum jelly used as ultrasound coupling medium and general skin care. 100g jar.", stock:200 },
  { id:"i-10", type:"item", name:"Physio Notes",            tagline:"Basic syllabus notes",        price:300, originalPrice:450, badge:"EDUCATION",   images:IMG.notes,      desc:"Curated first-year BPT notes covering anatomy, physiology, and basic physiotherapy. SRM curriculum-aligned.", stock:30 },
  { id:"i-11", type:"item", name:"Medical Tape",            tagline:"Consumable strapping tape",   price:120, originalPrice:170, badge:"CONSUMABLE",  images:IMG.medtape,    desc:"Hypoallergenic micropore medical tape for wound dressing, strapping, and electrode fixation.", stock:180 },
];

// ── Apparel ────────────────────────────────────────────────────
const APPAREL = [
  {
    id:"ap-1", type:"apparel",
    name:"MedVault Scrubs Set", tagline:"Top & bottom — clinical-grade",
    price:899, originalPrice:1299, badge:"APPAREL",
    images: IMG.scrubs,
    desc:"Premium cotton-blend scrubs with MedVault branding. Breathable, easy to wash, designed for long clinical hours.",
    sizes:["XS","S","M","L","XL","XXL"], sizeNote:"True to size. Relaxed clinical fit.", stock:60, colors:["Navy Blue","Ceil Blue"],
    features:["Cotton-blend fabric","MedVault branding","Two-pocket top","Drawstring bottoms","Easy-care wash"],
  },
  {
    id:"ap-2", type:"apparel",
    name:"Lab Apron", tagline:"Full-length protective apron",
    price:349, originalPrice:499, badge:"APPAREL",
    images: IMG.apron,
    desc:"White full-length lab apron with two front pockets and adjustable neck strap. SRM practical lab compliant.",
    sizes:["S","M","L","XL"], sizeNote:"Select based on height. M fits 5'4\"–5'8\".", stock:80, colors:["White"],
    features:["Polyester-cotton blend","Two front pockets","Adjustable neck strap","Easy to clean","SRM compliant"],
  },
];

const ALL_PRODUCTS = [...KITS, ...ITEMS, ...APPAREL];

// ── Navbar ────────────────────────────────────────────────────
function Navbar({ cartCount, onCart, onHome }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(10,18,18,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.3s ease", padding: "0 5%",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <button onClick={onHome} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <img src="/logo.png" alt="MedVault" style={{ height: 44, width: "auto", display: "block" }} />
        </button>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={onHome} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 500, letterSpacing: 1,
            textTransform: "uppercase", padding: "8px 14px",
          }}>Shop</button>
          <button onClick={onCart} style={{
            position: "relative",
            background: cartCount > 0 ? "rgba(29,191,115,0.1)" : C.subtle,
            border: `1px solid ${cartCount > 0 ? C.borderGreen : C.border}`,
            borderRadius: 10, padding: "9px 18px", cursor: "pointer", color: C.white,
            display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600,
            transition: "all 0.2s",
          }}>
            🛒
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

// ── Hero ──────────────────────────────────────────────────────
function HeroSection({ onShop }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: `radial-gradient(ellipse 70% 60% at 65% 40%, rgba(29,191,115,0.09) 0%, transparent 65%), linear-gradient(160deg, ${C.navy} 0%, ${C.dark} 100%)`,
      padding: "110px 5% 80px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: `linear-gradient(${C.primary} 1px, transparent 1px), linear-gradient(90deg, ${C.primary} 1px, transparent 1px)`, backgroundSize: "72px 72px", pointerEvents: "none" }} />

      <div className="hero-row" style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div className="hero-text" style={{ flex: "0 0 auto", maxWidth: 540, animation: "fadeUp 0.8s ease both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            border: `1px solid rgba(200,169,110,0.35)`, borderRadius: 100,
            padding: "5px 16px", marginBottom: 32,
            background: "rgba(200,169,110,0.06)",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, display: "block" }} />
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>Physiotherapy Collection</span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond',serif", fontWeight: 700,
            fontSize: "clamp(52px, 8vw, 108px)", lineHeight: 0.92,
            letterSpacing: "-1px", marginBottom: 28,
          }}>
            <span style={{ display: "block", color: C.white }}>Secure</span>
            <span style={{ display: "block", color: C.primary, fontStyle: "italic" }}>Your</span>
            <span style={{ display: "block", color: C.white }}>Essentials</span>
          </h1>

          <p style={{ fontSize: 16, color: C.muted, fontWeight: 300, maxWidth: 440, lineHeight: 1.75, marginBottom: 44 }}>
            Curated physiotherapy kits for BPT students at SRM campus — every instrument, scrub, and study material you need, in one place.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={onShop} style={{
              background: C.primary, color: C.dark, border: "none",
              padding: "15px 38px", borderRadius: 10, cursor: "pointer",
              fontWeight: 700, fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase",
              transition: "all 0.2s", boxShadow: `0 0 32px rgba(29,191,115,0.25)`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 40px rgba(29,191,115,0.35)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 0 32px rgba(29,191,115,0.25)`; }}
            >Shop Now →</button>
            <div style={{ display: "flex", gap: 28, paddingLeft: 4 }}>
              {[["4000+", "Students"], ["3", "Kit Types"], ["48h", "Delivery"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 22, color: C.primary }}>{n}</div>
                  <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-img" style={{ animation: "fadeUp 1s ease 0.2s both" }}>
          <div style={{ position: "relative", animation: "float3d 5s ease-in-out infinite", filter: "drop-shadow(0 32px 48px rgba(29,191,115,0.25))" }}>
            <div style={{ position: "absolute", inset: -24, borderRadius: 32, background: "radial-gradient(ellipse at center, rgba(29,191,115,0.14) 0%, transparent 70%)", zIndex: 0 }} />
            <img src="/pouch.jpg" alt="MedVault Physio Kit" style={{
              position: "relative", zIndex: 1,
              width: "clamp(260px, 32vw, 460px)",
              mixBlendMode: "screen",
              transform: "perspective(900px) rotateY(-15deg) rotateX(5deg)",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab Navigation ────────────────────────────────────────────
function TabNav({ active, onChange }) {
  const tabs = [
    { id: "kits", label: "Curated Kits", icon: "📦" },
    { id: "items", label: "Individual Items", icon: "🔬" },
    { id: "apparel", label: "Scrubs & Aprons", icon: "🥼" },
  ];
  return (
    <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.border}`, marginBottom: 48, overflowX: "auto", paddingBottom: 0 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "14px 24px", fontSize: 14, fontWeight: 600,
          color: active === t.id ? C.primary : C.muted,
          borderBottom: `2px solid ${active === t.id ? C.primary : "transparent"}`,
          transition: "all 0.2s", marginBottom: -1, whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Kit Card ──────────────────────────────────────────────────
function KitCard({ kit, onView, onAddToCart }) {
  const [hovered, setHovered] = useState(false);
  const pct = disc(kit.price, kit.originalPrice);
  const saved = kit.originalPrice - kit.price;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.navyLight : C.card,
        border: `1px solid ${hovered ? C.borderGreen : C.border}`,
        borderRadius: 20, overflow: "hidden", cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.4)` : "none",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Kit image */}
      <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
        <img src={kit.images[0]} alt={kit.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(10,18,18,0.9) 100%)" }} />
      </div>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, rgba(29,191,115,0.06), rgba(10,18,18,0))`,
        padding: "24px 28px 20px",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{
            background: kit.badgeColor === C.gold ? "rgba(200,169,110,0.15)" : "rgba(29,191,115,0.12)",
            border: `1px solid ${kit.badgeColor === C.gold ? "rgba(200,169,110,0.3)" : C.borderGreen}`,
            color: kit.badgeColor, borderRadius: 100, padding: "4px 12px",
            fontSize: 10, fontWeight: 700, letterSpacing: 2,
          }}>{kit.badge}</span>
          <span style={{ fontSize: 11, color: C.muted, background: "rgba(255,255,255,0.05)", borderRadius: 100, padding: "4px 10px" }}>−{pct}%</span>
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 26, lineHeight: 1.1, marginBottom: 6 }}>{kit.name}</h3>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{kit.tagline}</p>
      </div>

      {/* Items list */}
      <div style={{ padding: "20px 28px", flex: 1 }}>
        <p style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>What's inside</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {kit.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.primary, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{item.name}</span>
              </div>
              <span style={{ fontSize: 12, color: C.muted }}>{fmt(item.retail)}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16, padding: "10px 14px", borderRadius: 8,
          background: "rgba(29,191,115,0.05)", border: `1px solid rgba(29,191,115,0.1)`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: C.muted }}>Retail total</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "line-through" }}>{fmt(kit.items.reduce((s, i) => s + i.retail, 0))}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 28px 28px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 36, color: C.primary }}>{fmt(kit.price)}</span>
          <span style={{ fontSize: 14, color: C.muted, textDecoration: "line-through" }}>{fmt(kit.originalPrice)}</span>
          <span style={{ fontSize: 12, color: C.accent }}>Save {fmt(saved)}</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onView(kit)} style={{
            flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
            background: "none", border: `1px solid ${C.border}`,
            color: C.muted, fontSize: 13, fontWeight: 600, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderGreen; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
          >Details</button>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(kit); }} style={{
            flex: 2, padding: "12px", borderRadius: 10, cursor: "pointer",
            background: C.primary, border: "none", color: C.dark,
            fontSize: 13, fontWeight: 700, letterSpacing: 0.5, transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Add to Cart</button>
        </div>
        <p style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 10 }}>🟢 {kit.stock} in stock · SRM campus delivery</p>
      </div>
    </div>
  );
}

// ── Item Card ─────────────────────────────────────────────────
function ItemCard({ item, onView, onAddToCart }) {
  const [hovered, setHovered] = useState(false);
  const pct = disc(item.price, item.originalPrice);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(item)}
      style={{
        background: hovered ? C.navyLight : C.card,
        border: `1px solid ${hovered ? C.borderGreen : C.border}`,
        borderRadius: 16, overflow: "hidden", cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
    >
      <div style={{ height: 160, position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}` }}>
        <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => e.target.style.display="none"} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(10,18,18,0.7) 100%)" }} />
        <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.55)", color: C.accent, borderRadius: 100, padding: "3px 9px", fontSize: 10, fontWeight: 700 }}>−{pct}%</span>
      </div>
      <div style={{ padding: "16px 16px 14px" }}>
        <p style={{ fontSize: 10, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>{item.badge}</p>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{item.name}</h4>
        <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.4 }}>{item.tagline}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 22, color: C.primary }}>{fmt(item.price)}</span>
            <span style={{ fontSize: 11, color: C.muted, textDecoration: "line-through", marginLeft: 6 }}>{fmt(item.originalPrice)}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} style={{
            background: C.primary, border: "none", color: C.dark,
            borderRadius: 8, padding: "8px 14px", cursor: "pointer",
            fontSize: 12, fontWeight: 700, transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Add</button>
        </div>
      </div>
    </div>
  );
}

// ── Apparel Card ──────────────────────────────────────────────
function ApparelCard({ item, onView, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [hovered, setHovered] = useState(false);
  const pct = disc(item.price, item.originalPrice);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!selectedSize) { alert("Please select a size first"); return; }
    onAddToCart({ ...item, selectedSize, name: `${item.name} (${selectedSize})` });
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.navyLight : C.card,
        border: `1px solid ${hovered ? C.borderGreen : C.border}`,
        borderRadius: 20, overflow: "hidden",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      <div style={{ height: 200, position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}` }}>
        <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(10,18,18,0.6) 100%)" }} />
        <span style={{
          position: "absolute", top: 14, left: 14,
          background: "rgba(200,169,110,0.12)", border: `1px solid rgba(200,169,110,0.25)`,
          color: C.gold, borderRadius: 100, padding: "4px 12px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
        }}>{item.badge}</span>
        <span style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(0,0,0,0.5)", color: C.accent,
          borderRadius: 100, padding: "4px 10px", fontSize: 10, fontWeight: 700,
        }}>−{pct}%</span>
      </div>
      <div style={{ padding: "24px" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{item.name}</h3>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{item.tagline}</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Available in: {item.colors.join(", ")}</p>

        {/* Size selector */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>
            Select Size {selectedSize && <span style={{ color: C.primary, letterSpacing: 0, textTransform: "none", fontWeight: 700 }}>— {selectedSize}</span>}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {item.sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)} style={{
                width: 44, height: 44, borderRadius: 8, cursor: "pointer",
                border: `1px solid ${selectedSize === s ? C.primary : C.border}`,
                background: selectedSize === s ? "rgba(29,191,115,0.15)" : "none",
                color: selectedSize === s ? C.primary : C.muted,
                fontSize: 12, fontWeight: 700, transition: "all 0.15s",
              }}>{s}</button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>📐 {item.sizeNote}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 30, color: C.primary }}>{fmt(item.price)}</span>
            <span style={{ fontSize: 13, color: C.muted, textDecoration: "line-through", marginLeft: 8 }}>{fmt(item.originalPrice)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onView(item)} style={{
            flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
            background: "none", border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, fontWeight: 600,
          }}>Details</button>
          <button onClick={handleAdd} style={{
            flex: 2, padding: "12px", borderRadius: 10, cursor: "pointer",
            background: selectedSize ? C.primary : "rgba(29,191,115,0.2)",
            border: "none", color: selectedSize ? C.dark : C.muted,
            fontSize: 13, fontWeight: 700, transition: "all 0.2s",
          }}>{selectedSize ? "Add to Cart" : "Pick a size"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Size Guide Modal ──────────────────────────────────────────
function SizeGuide({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36, maxWidth: 520, width: "100%" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 24 }}>Size Guide</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <p style={{ fontSize: 12, color: C.muted, marginBottom: 20, letterSpacing: 1 }}>SCRUBS & APRON SIZING (in cm)</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Size", "Chest", "Waist", "Hip", "Height"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.accent, fontWeight: 600, fontSize: 11, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["XS", "78–82", "60–64", "84–88", "155–160"],
              ["S",  "84–88", "66–70", "90–94", "160–165"],
              ["M",  "90–94", "72–76", "96–100","165–170"],
              ["L",  "96–100","78–82", "102–106","170–175"],
              ["XL", "102–106","84–88","108–112","175–180"],
              ["XXL","108–114","90–94","114–120","180+"],
            ].map(([s, ...vals]) => (
              <tr key={s} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: C.primary }}>{s}</td>
                {vals.map((v, i) => <td key={i} style={{ padding: "10px 12px", color: "rgba(255,255,255,0.65)" }}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 16 }}>* Scrubs have a relaxed clinical fit. Aprons are available in S–XL only.</p>
      </div>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────────────
function HomePage({ onView, onAddToCart }) {
  const [tab, setTab] = useState("kits");
  const [query, setQuery] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const scrollToShop = () => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });

  const q = query.trim().toLowerCase();
  const filteredItems = q ? ITEMS.filter(p => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.badge.toLowerCase().includes(q)) : ITEMS;

  return (
    <div>
      <HeroSection onShop={scrollToShop} />

      {/* Trust strip */}
      <div style={{ background: `linear-gradient(90deg, ${C.secondary}, #0a2218)`, padding: "18px 5%", borderTop: `1px solid rgba(29,191,115,0.1)`, borderBottom: `1px solid rgba(29,191,115,0.1)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: "8%", flexWrap: "wrap" }}>
          {[["🚚","SRM Campus Delivery"],["🦴","Physio-Grade Quality"],["📦","Ready to Ship"],["💬","Order via WhatsApp"]].map(([ic, lb]) => (
            <div key={lb} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500, padding: "4px 0" }}>
              <span>{ic}</span><span>{lb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shop section */}
      <div id="shop" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5% 100px" }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: C.accent, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>What We Offer</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(32px,5vw,56px)", lineHeight: 1 }}>
            <span style={{ color: C.white }}>Choose Your </span>
            <span style={{ color: C.primary, fontStyle: "italic" }}>Kit</span>
          </h2>
        </div>

        <TabNav active={tab} onChange={setTab} />

        {/* Kits tab */}
        {tab === "kits" && (
          <div className="kits-grid" style={{ animation: "fadeUp 0.4s ease both" }}>
            {KITS.map(k => <KitCard key={k.id} kit={k} onView={onView} onAddToCart={onAddToCart} />)}
          </div>
        )}

        {/* Individual items tab */}
        {tab === "items" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
              <p style={{ fontSize: 14, color: C.muted }}>Pick exactly what you need — {ITEMS.length} items available</p>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>🔍</span>
                <input type="text" placeholder="Search items…" value={query} onChange={e => setQuery(e.target.value)} style={{
                  padding: "10px 14px 10px 36px", background: C.subtle, border: `1px solid ${query ? C.borderGreen : C.border}`,
                  borderRadius: 10, color: C.white, fontSize: 13, outline: "none", width: 220,
                }} />
              </div>
            </div>

            {/* Price list table */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 40 }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Item</p>
                <div style={{ display: "flex", gap: 60 }}>
                  <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Price</p>
                  <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>MRP</p>
                </div>
              </div>
              {filteredItems.map((item, i) => (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 24px", cursor: "pointer",
                  borderBottom: i < filteredItems.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                  onClick={() => onView(item)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}><img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} /></div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: C.muted }}>{item.tagline}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: C.primary, minWidth: 60, textAlign: "right" }}>{fmt(item.price)}</span>
                    <span style={{ fontSize: 13, color: C.muted, textDecoration: "line-through", minWidth: 60, textAlign: "right" }}>{fmt(item.originalPrice)}</span>
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} style={{
                      background: C.primary, border: "none", color: C.dark,
                      borderRadius: 8, padding: "8px 16px", cursor: "pointer",
                      fontSize: 12, fontWeight: 700,
                    }}>Add</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="items-grid">
              {filteredItems.map(item => <ItemCard key={item.id} item={item} onView={onView} onAddToCart={onAddToCart} />)}
            </div>
          </div>
        )}

        {/* Apparel tab */}
        {tab === "apparel" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 14, color: C.muted, maxWidth: 480 }}>Select your size directly on the product card. Refer to the size guide if you're unsure.</p>
              <button onClick={() => setShowSizeGuide(true)} style={{
                background: "none", border: `1px solid ${C.borderGreen}`, borderRadius: 10,
                padding: "10px 20px", cursor: "pointer", color: C.accent, fontSize: 13, fontWeight: 600,
              }}>📐 Size Guide</button>
            </div>
            <div className="apparel-grid">
              {APPAREL.map(item => <ApparelCard key={item.id} item={item} onView={onView} onAddToCart={onAddToCart} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mission */}
      <div style={{ background: `linear-gradient(135deg, #0a1a14, ${C.dark})`, padding: "72px 5%", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="mission-grid" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <p style={{ fontSize: 10, color: C.accent, letterSpacing: 3, fontWeight: 700, marginBottom: 14, textTransform: "uppercase" }}>Our Mission</p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", fontFamily: "'Cormorant Garamond',serif" }}>Support BPT students and physiotherapy professionals with thoughtfully curated medical essentials that improve learning, build confidence, and support strong clinical practice.</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: C.accent, letterSpacing: 3, fontWeight: 700, marginBottom: 14, textTransform: "uppercase" }}>Our Vision</p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", fontFamily: "'Cormorant Garamond',serif" }}>Be the most trusted on-campus medical store at SRM — known for premium quality, honest pricing, and understanding what a physio student truly needs.</p>
          </div>
        </div>
      </div>

      {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
    </div>
  );
}

// ── Product Detail ────────────────────────────────────────────
function ProductDetailPage({ product, onBack, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const isKit = product.type === "kit";
  const isApparel = product.type === "apparel";
  const pct = disc(product.price, product.originalPrice);

  const handleAdd = () => {
    if (isApparel && !selectedSize) { alert("Please select a size"); return; }
    const p = isApparel ? { ...product, selectedSize, name: `${product.name} (${selectedSize})` } : product;
    for (let i = 0; i < qty; i++) onAddToCart(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "110px 5% 80px", animation: "fadeUp 0.5s ease both" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 52, opacity: 0.8 }}>
        ← Back
      </button>

      <div className="detail-grid">
        {/* Left — image gallery */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2, display: "flex", gap: 8 }}>
            <span style={{ background: "rgba(29,191,115,0.15)", border: `1px solid ${C.borderGreen}`, color: C.primary, borderRadius: 100, padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>{product.badge}</span>
            <span style={{ background: "rgba(0,0,0,0.5)", color: C.accent, borderRadius: 100, padding: "5px 14px", fontSize: 10, fontWeight: 700 }}>−{pct}% OFF</span>
          </div>
          <ImageGallery images={product.images} name={product.name} height={420} />
        </div>

        {/* Right */}
        <div>
          <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2.5, fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>{product.tagline}</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.05, marginBottom: 18 }}>{product.name}</h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>{product.desc}</p>

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28, padding: 20, background: "rgba(29,191,115,0.05)", borderRadius: 14, border: `1px solid ${C.borderGreen}` }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 44, color: C.primary }}>{fmt(product.price)}</span>
            <span style={{ fontSize: 16, color: C.muted, textDecoration: "line-through" }}>{fmt(product.originalPrice)}</span>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>You save {fmt(product.originalPrice - product.price)}</span>
          </div>

          {/* Kit items */}
          {isKit && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Kit includes</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {product.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.primary, flexShrink: 0 }} />
                      <span style={{ fontSize: 13 }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.muted }}>{fmt(item.retail)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {product.features && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Features</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.features.map(f => (
                  <span key={f} style={{ background: "rgba(29,191,115,0.07)", border: `1px solid ${C.borderGreen}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: C.accent }}>✓ {f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Size selector for apparel */}
          {isApparel && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Select Size {selectedSize && <span style={{ color: C.primary }}>— {selectedSize}</span>}</p>
                <button onClick={() => setShowSizeGuide(true)} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: 12 }}>Size Guide →</button>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    width: 52, height: 52, borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${selectedSize === s ? C.primary : C.border}`,
                    background: selectedSize === s ? "rgba(29,191,115,0.15)" : "none",
                    color: selectedSize === s ? C.primary : C.muted,
                    fontSize: 14, fontWeight: 700, transition: "all 0.15s",
                  }}>{s}</button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>📐 {product.sizeNote}</p>
            </div>
          )}

          {/* Qty + CTA */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: C.subtle, border: "none", color: C.white, width: 44, height: 52, cursor: "pointer", fontSize: 18 }}>−</button>
              <span style={{ width: 44, textAlign: "center", fontSize: 16, fontWeight: 700 }}>{qty}</span>
              <button onClick={() => setQty(Math.min(10, qty + 1))} style={{ background: C.subtle, border: "none", color: C.white, width: 44, height: 52, cursor: "pointer", fontSize: 18 }}>+</button>
            </div>
            <button onClick={handleAdd} style={{
              flex: 1, padding: "16px 28px", borderRadius: 12, border: "none",
              background: added ? C.secondary : C.primary, color: added ? C.accent : C.dark,
              cursor: "pointer", fontWeight: 700, fontSize: 16, letterSpacing: 1,
              transition: "all 0.3s",
            }}>{added ? "✓ Added!" : "Add to Cart"}</button>
          </div>

          <p style={{ marginTop: 14, fontSize: 12, color: C.muted }}>🟢 {product.stock} in stock · Fast dispatch from SRM campus</p>
        </div>
      </div>
      {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
    </div>
  );
}

// ── Cart ──────────────────────────────────────────────────────
const fmt2 = fmt;
function CartPage({ cart, onRemove, onQty, onCheckout, onBack }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal >= 2000 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, padding: "120px 5%" }}>
      <div style={{ fontSize: 72 }}>🛒</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700 }}>Your cart is empty</h2>
      <p style={{ color: C.muted, fontSize: 15 }}>Add some products to get started</p>
      <button onClick={onBack} style={{ background: C.primary, color: C.dark, border: "none", padding: "14px 32px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Browse Products</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 5% 80px", animation: "fadeUp 0.5s ease" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: 13, fontWeight: 600, marginBottom: 40, display: "flex", alignItems: "center", gap: 8 }}>← Continue Shopping</button>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 44, marginBottom: 40 }}>
        <span style={{ color: C.white }}>Your </span><span style={{ color: C.primary, fontStyle: "italic" }}>Cart</span>
      </h1>

      <div className="cart-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {cart.map(item => (
            <div key={`${item.id}-${item.selectedSize || ""}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 10, background: "rgba(29,191,115,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                {isUrl(item.img) ? <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} /> : item.img}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>{item.tagline}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{item.name}</div>
                {item.selectedSize && <div style={{ fontSize: 12, color: C.muted }}>Size: {item.selectedSize}</div>}
                <div style={{ color: C.primary, fontWeight: 700, fontSize: 16, marginTop: 4 }}>{fmt2(item.price)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                  <button onClick={() => onQty(item.id, item.quantity - 1, item.selectedSize)} style={{ background: C.subtle, border: "none", color: C.white, width: 34, height: 36, cursor: "pointer" }}>−</button>
                  <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                  <button onClick={() => onQty(item.id, item.quantity + 1, item.selectedSize)} style={{ background: C.subtle, border: "none", color: C.white, width: 34, height: 36, cursor: "pointer" }}>+</button>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{fmt2(item.price * item.quantity)}</div>
                <button onClick={() => onRemove(item.id, item.selectedSize)} style={{ background: "none", border: "none", color: "rgba(255,100,100,0.55)", cursor: "pointer", fontSize: 12 }}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.borderGreen}`, borderRadius: 20, padding: 24, height: "fit-content", position: "sticky", top: 88 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 22, marginBottom: 20 }}>Order Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: C.muted }}>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{fmt2(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: C.muted }}>Shipping</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: shipping === 0 ? C.primary : C.white }}>{shipping === 0 ? "FREE" : fmt2(shipping)}</span>
            </div>
            {shipping > 0 && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Free shipping on orders above ₹2,000</p>}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 28, color: C.primary }}>{fmt2(total)}</span>
          </div>
          <button onClick={onCheckout} style={{
            width: "100%", padding: "17px", borderRadius: 12, border: "none",
            background: C.primary, color: C.dark, cursor: "pointer",
            fontWeight: 800, fontSize: 16, letterSpacing: 1.5, textTransform: "uppercase",
          }}>Order on WhatsApp →</button>
        </div>
      </div>
    </div>
  );
}

// ── Checkout ──────────────────────────────────────────────────
function FormField({ label, field, type = "text", placeholder, half, errors, form, setForm, setErrors }) {
  return (
    <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
      <label style={{ display: "block", fontSize: 11, color: errors[field] ? "#ff6b6b" : C.muted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        {label} {errors[field] && <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>— {errors[field]}</span>}
      </label>
      <input
        type={type} value={form[field]} placeholder={placeholder}
        onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: null })); }}
        style={{
          width: "100%", padding: "13px 15px", borderRadius: 10, fontSize: 14,
          background: "rgba(255,255,255,0.04)", border: `1px solid ${errors[field] ? "rgba(255,100,100,0.4)" : C.border}`,
          color: C.white, outline: "none", transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = C.primary}
        onBlur={e => e.target.style.borderColor = errors[field] ? "rgba(255,100,100,0.4)" : C.border}
      />
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
    if (!form.phone.match(/^\d{10}$/)) e.phone = "10-digit number";
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

    await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) });

    const productList = cart.map(i => `• ${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString("en-IN")}`).join("\n");
    const waMsg = `Hello MedVault! I want to place an order 🛒\n\n${productList}\n\n*Total: ₹${total.toLocaleString("en-IN")}*\n\n*Customer Details:*\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nAddress: ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
    window.open(`https://wa.me/918248613274?text=${encodeURIComponent(waMsg)}`, "_blank");

    setPaying(false);
    onPlaceOrder(orderData);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 5% 80px", animation: "fadeUp 0.5s ease" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: 13, fontWeight: 600, marginBottom: 40, display: "flex", alignItems: "center", gap: 8 }}>← Back to Cart</button>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 44, marginBottom: 40, color: C.white }}>Checkout</h1>

      <div className="checkout-grid">
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, marginBottom: 22 }}>Delivery Details</h3>
            <div className="form-grid">
              <FormField label="Full Name" field="name" placeholder="Dr. Arjun Sharma" errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="Email" field="email" type="email" placeholder="you@email.com" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="Phone" field="phone" type="tel" placeholder="9876543210" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="Address" field="address" placeholder="Hostel / Campus Address" errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="City" field="city" placeholder="Chennai" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <FormField label="PIN Code" field="pincode" placeholder="600003" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>State</label>
                <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={{ width: "100%", padding: "13px 15px", borderRadius: 10, fontSize: 14, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.white, outline: "none" }}>
                  {STATES.map(s => <option key={s} value={s} style={{ background: C.dark }}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{ background: "rgba(29,191,115,0.05)", border: `1px solid ${C.borderGreen}`, borderRadius: 16, padding: 18, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 26 }}>💬</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Order via WhatsApp</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Your full order will be sent to our WhatsApp. We'll confirm and arrange campus delivery.</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {["💬 WhatsApp","Cash on Delivery","UPI on Confirmation"].map(m => (
                  <span key={m} style={{ background: C.subtle, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.borderGreen}`, borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Order Review</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedSize || ""}`} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{isUrl(item.img) ? "📦" : item.img}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{item.name}</div>
                  {item.selectedSize && <div style={{ fontSize: 11, color: C.muted }}>Size: {item.selectedSize}</div>}
                  <div style={{ fontSize: 12, color: C.muted }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 700, color: C.accent, fontSize: 14 }}>{fmt(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: C.muted }}>Subtotal</span>
              <span style={{ fontSize: 14 }}>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: C.muted }}>Shipping</span>
              <span style={{ fontSize: 14, color: shipping === 0 ? C.primary : C.white }}>{shipping === 0 ? "FREE" : fmt(shipping)}</span>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 28, color: C.primary }}>{fmt(total)}</span>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={paying} style={{
            width: "100%", padding: "17px", borderRadius: 12, border: "none",
            background: paying ? C.secondary : C.primary, color: paying ? C.accent : C.dark,
            cursor: paying ? "not-allowed" : "pointer", fontWeight: 800, fontSize: 15,
            letterSpacing: 1.5, textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "all 0.3s",
          }}>
            {paying ? (<><span style={{ width: 16, height: 16, border: `2px solid rgba(255,255,255,0.3)`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Processing…</>) : `Order on WhatsApp — ${fmt(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirmation ──────────────────────────────────────────────
function ConfirmationPage({ order, onHome }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 5%" }}>
      <div style={{ maxWidth: 480, width: "100%", background: C.card, border: `1px solid ${C.borderGreen}`, borderRadius: 24, padding: 40, animation: "fadeUp 0.6s ease both", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "rgba(29,191,115,0.12)", border: `1px solid ${C.borderGreen}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 24px" }}>✓</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 32, color: C.white, marginBottom: 8 }}>Order Placed!</h2>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 32, lineHeight: 1.6 }}>Your order has been sent to our WhatsApp. We'll confirm and arrange delivery shortly.</p>

        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 20, marginBottom: 24, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: C.muted }}>Order ID</span>
            <span style={{ fontWeight: 700, color: C.accent, fontSize: 13 }}>{order.orderId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: C.muted }}>Total</span>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: C.primary, fontSize: 20 }}>{fmt(order.total)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: C.muted }}>Delivery to</span>
            <span style={{ fontSize: 13, textAlign: "right", maxWidth: "55%" }}>{order.address}</span>
          </div>
        </div>

        <button onClick={onHome} style={{
          width: "100%", padding: "15px", borderRadius: 12, border: "none",
          background: C.primary, color: C.dark, cursor: "pointer",
          fontWeight: 700, fontSize: 15, letterSpacing: 1,
        }}>Continue Shopping</button>
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────
function Toast({ msg, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: `translateX(-50%) translateY(${visible ? "0" : "100px"})`,
      zIndex: 9999, background: C.navyLight, border: `1px solid ${C.borderGreen}`,
      borderRadius: 14, padding: "12px 24px",
      display: "flex", alignItems: "center", gap: 10,
      opacity: visible ? 1 : 0, transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      boxShadow: `0 8px 32px rgba(0,0,0,0.4)`, whiteSpace: "nowrap",
    }}>
      <span style={{ color: C.primary, fontSize: 16 }}>✓</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{msg}</span>
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
    const key = product.selectedSize ? `${product.id}-${product.selectedSize}` : product.id;
    setCart(prev => {
      const existing = prev.find(i => (i.selectedSize ? `${i.id}-${i.selectedSize}` : i.id) === key);
      if (existing) return prev.map(i => (i.selectedSize ? `${i.id}-${i.selectedSize}` : i.id) === key ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name.split("—")[0].trim()} added`);
  };

  const removeFromCart = (id, size) => setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)));
  const updateQty = (id, qty, size) => {
    if (qty < 1) { removeFromCart(id, size); return; }
    if (qty > 10) return;
    setCart(prev => prev.map(i => i.id === id && i.selectedSize === size ? { ...i, quantity: qty } : i));
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const handlePlaceOrder = (orderData) => { setOrder(orderData); setCart([]); setPage("confirmation"); };
  const goHome = () => { setPage("home"); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goDetail = (p) => { setSelectedProduct(p); setPage("detail"); window.scrollTo({ top: 0 }); };
  const goCart = () => { setPage("cart"); window.scrollTo({ top: 0 }); };
  const goCheckout = () => { setPage("checkout"); window.scrollTo({ top: 0 }); };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: C.dark }}>
        {page !== "confirmation" && <Navbar cartCount={cartCount} onCart={goCart} onHome={goHome} />}
        {page === "home" && <HomePage onView={goDetail} onAddToCart={addToCart} />}
        {page === "detail" && selectedProduct && <ProductDetailPage product={selectedProduct} onBack={goHome} onAddToCart={addToCart} />}
        {page === "cart" && <CartPage cart={cart} onRemove={removeFromCart} onQty={updateQty} onCheckout={goCheckout} onBack={goHome} />}
        {page === "checkout" && <CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} onBack={goCart} />}
        {page === "confirmation" && order && <ConfirmationPage order={order} onHome={goHome} />}
        <Toast msg={toast.msg} visible={toast.visible} />
      </div>
    </>
  );
}
