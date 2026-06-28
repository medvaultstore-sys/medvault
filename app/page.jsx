"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Search,
  Package,
  Info,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const C = {
  bg: "#F0F4F8",
  white: "#FFFFFF",
  header: "#0A1628",
  headerBorder: "#162544",
  primary: "#0057A8",
  primaryHover: "#004490",
  accent: "#00875A",
  deal: "#E53E3E",
  dealBg: "#FFF5F5",
  gold: "#B7791F",
  goldBg: "#FFFFF0",
  text: "#0D1B2A",
  textSub: "#2D3748",
  muted: "#718096",
  border: "#CBD5E0",
  card: "#FFFFFF",
  shadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 14px rgba(0,0,0,0.05)",
  shadowHover: "0 8px 30px rgba(0,0,0,0.13)",
  strip: "#0057A8",
  stripText: "#E8F0FE",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans','Inter',sans-serif;background:#F0F4F8;color:#0D1B2A;min-height:100vh;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:#F0F4F8;}
  ::-webkit-scrollbar-thumb{background:#A0AEC0;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
  @keyframes cartBounce{0%,100%{transform:scale(1);}50%{transform:scale(1.3);}}
  @keyframes float3d{0%,100%{transform:translateY(0px) rotate(-1deg);}50%{transform:translateY(-14px) rotate(-1deg);}}
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}

  .hero-row{display:flex;align-items:center;justify-content:space-between;gap:56px;}
  .hero-img{flex:0 0 auto;display:flex;align-items:center;justify-content:center;}
  .kits-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
  .items-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:20px;}
  .apparel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;}
  .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;}
  .cart-grid{display:grid;grid-template-columns:1fr 360px;gap:32px;}
  .checkout-grid{display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:start;}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .mission-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;}

  @media(max-width:900px){
    .kits-grid{grid-template-columns:1fr;}
    .cart-grid{grid-template-columns:1fr;}
    .checkout-grid{grid-template-columns:1fr;}
    .detail-grid{grid-template-columns:1fr;}
    .mission-grid{grid-template-columns:1fr;}
    .location-grid{grid-template-columns:1fr;}
    .hero-row{flex-direction:column;text-align:center;}
    .hero-img{order:-1;width:100%;}
    .hero-img img{width:clamp(200px,65vw,320px)!important;}
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
      <div style={{ height, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, background: "#F8FAFC", position: "relative", boxShadow: C.shadow }}>
        <img
          src={images[active]}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.3s" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        {images.length > 1 && (
          <>
            <button onClick={() => setActive(i => (i - 1 + images.length) % images.length)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: `1px solid ${C.border}`, color: C.text, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: C.shadow }}>‹</button>
            <button onClick={() => setActive(i => (i + 1) % images.length)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: `1px solid ${C.border}`, color: C.text, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: C.shadow }}>›</button>
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {images.map((_, i) => (
                <span key={i} onClick={() => setActive(i)} style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 3, background: i === active ? C.primary : "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.2s" }} />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
          {images.map((img, i) => (
            <div key={i} onClick={() => setActive(i)} style={{ width: 60, height: 60, flexShrink: 0, borderRadius: 10, overflow: "hidden", cursor: "pointer", border: `2px solid ${i === active ? C.primary : C.border}`, transition: "border 0.2s", background: "#F8FAFC" }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pollinations image helpers ────────────────────────────────
const PH = (prompt, seed, model = "flux-realism") =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=700&height=500&nologo=true&seed=${seed}&model=${model}&enhance=true`;
const R = (p, s) => PH(p, s, "flux-realism");
const F = (p, s) => PH(p, s, "flux");

const IMG = {
  kit1: [
    "/kit.jpg",
  ],
  kit2: [
    "/placeholder.svg",
  ],
  kit3: [
    "/placeholder.svg",
  ],
  goniometer: [
    "/placeholder.svg",
  ],
  hammer: [
    "/placeholder.svg",
  ],
  tuningfork: [
    "/placeholder.svg",
  ],
  tape: [
    "/placeholder.svg",
  ],
  pentorch: [
    "/placeholder.svg",
  ],
  stethoscope: [
    "/placeholder.svg",
  ],
  sphygmo: [
    "/placeholder.svg",
  ],
  yogamat: [
    "/placeholder.svg",
  ],
  band: [
    "/placeholder.svg",
  ],
  dynamometer: [
    "/placeholder.svg",
  ],
  foamroller: [
    "/placeholder.svg",
  ],
  myospaz: [
    "/placeholder.svg",
  ],
  ultrasoundgel: [
    "/placeholder.svg",
  ],
  sanitizer: [
    "/placeholder.svg",
  ],
  cotton: [
    "/placeholder.svg",
  ],
  medtape: [
    "/placeholder.svg",
  ],
  mask: [
    "/placeholder.svg",
  ],
  gloves: [
    "/placeholder.svg",
  ],
  notes: [
    "/placeholder.svg",
  ],
  notepad: [
    "/placeholder.svg",
  ],
  penset: [
    "/placeholder.svg",
  ],
  markerset: [
    "/placeholder.svg",
  ],
  usb: [
    "/placeholder.svg",
  ],
  kit4: [
    "/placeholder.svg",
  ],
  assessmentpad: [
    "/placeholder.svg",
  ],
  anatomycharts: [
    "/placeholder.svg",
  ],
  flashcards: [
    "/placeholder.svg",
  ],
  therapyball: [
    "/placeholder.svg",
  ],
  handgrip: [
    "/placeholder.svg",
  ],
  tenselectrodes: [
    "/placeholder.svg",
  ],
  lubgel: [
    "/placeholder.svg",
  ],
  scrubs: [
    "/placeholder.svg",
  ],
  apron: [
    "/placeholder.svg",
  ],
  // Accessory images (local generated + Pollinations fallbacks)
  accStethoscope: [
    "/placeholder.svg",
  ],
  accPouch: [
    "/pouch.jpg",
  ],
  accSheets: [
    "/placeholder.svg",
  ],
  accMarker: [
    "/placeholder.svg",
  ],
  accYogaMat: [
    "/placeholder.svg",
  ],
  accBands: [
    "/placeholder.svg",
  ],
  accBP: [
    "/placeholder.svg",
  ],
};

// ── Kits ──────────────────────────────────────────────────────
const KITS = [
  {
    id: "kit-1", type: "kit",
    name: "MedVault MVP Physiotherapy Assessment Kit",
    tagline: "The complete BPT starter bundle",
    price: 1799, originalPrice: 2358,
    badge: "BESTSELLER",
    desc: "Why pay more when you can get everything you need in one complete kit? Premium-quality products, trusted BPL stethoscope, complete curriculum-based assessment kit, ready for clinical postings, and better value than buying products individually. Save more. Learn better. Choose MedVault.",
    items: [
      { name: "BPL Dual-Sided Chestpiece Stethoscope", qty: 1, retail: 950 },
      { name: "Universal Goniometer",                  qty: 1, retail: 293 },
      { name: "Half-Range Goniometer",                 qty: 1, retail: 267 },
      { name: "Finger Goniometer",                     qty: 1, retail: 267 },
      { name: "128 Hz Tuning Fork",                    qty: 1, retail: 102 },
      { name: "Knee Hammer",                           qty: 1, retail: 78  },
      { name: "Measuring Tape",                        qty: 1, retail: 100 },
      { name: "Assessment Notepad",                    qty: 1, retail: 150 },
      { name: "Skin Marker",                           qty: 1, retail: 151 },
    ],
    stock: 48, images: IMG.kit1,
    features: ["Premium-quality products", "Trusted BPL stethoscope", "Curriculum-based", "Ready for clinicals"],
  },
  {
    id: "kit-2", type: "kit",
    name: "MedVault Clinical Goniometer Set",
    tagline: "Musculoskeletal & neurological assessment",
    price: 849, originalPrice: 1358,
    badge: "ESSENTIAL",
    desc: "Everything required for musculoskeletal and neurological assessment in one complete kit. Ideal for practical examinations and daily clinical practice.",
    items: [
      { name: "Universal Goniometer",             qty: 1, retail: 293 },
      { name: "Half Range Goniometer",            qty: 1, retail: 267 },
      { name: "Finger Goniometer",               qty: 1, retail: 267 },
      { name: "Reflex (Knee) Hammer",            qty: 1, retail: 78  },
      { name: "128 Hz Tuning Fork",              qty: 1, retail: 102 },
      { name: "Measuring Tape",                  qty: 1, retail: 100 },
      { name: "Clinical Assessment Sheet (FREE)", qty: 1, retail: 100 },
      { name: "Skin Marker (FREE)",              qty: 1, retail: 151 },
    ],
    stock: 72, images: IMG.kit2,
    features: ["Musculoskeletal assessment", "Neurological assessment", "Ideal for practical exams", "Includes free additions"],
  },
  {
    id: "kit-3", type: "kit",
    name: "CNS Assessment Kit",
    tagline: "Complete neurological examination kit",
    price: 748, originalPrice: 904,
    badge: "NEURO",
    desc: "Complete neurological examination kit designed for physiotherapy students and clinicians. Ideal for neurological assessment and practical examinations.",
    items: [
      { name: "Reflex Hammer",             qty: 1, retail: 78  },
      { name: "128 Hz Tuning Fork",        qty: 1, retail: 102 },
      { name: "Neurological Pin Wheel",    qty: 1, retail: 200 },
      { name: "Cotton Swab",               qty: 1, retail: 50  },
      { name: "Safety Pin",                qty: 1, retail: 50  },
      { name: "Measuring Tape",            qty: 1, retail: 100 },
      { name: "Pen Torch",                 qty: 1, retail: 124 },
      { name: "Clinical Assessment Sheet", qty: 1, retail: 100 },
      { name: "Premium Carry Pouch",       qty: 1, retail: 100 },
    ],
    stock: 100, images: IMG.kit3,
    features: ["Complete neuro kit", "Premium carry pouch", "Student and clinician ready", "Ideal for practical exams"],
  },
];

// ── Individual Items ───────────────────────────────────────────
const ITEMS = [
  { id:"i-1",  type:"item", name:"BPL Dual-Sided Chestpiece Stethoscope", tagline:"Acoustic medical instrument", price:950, originalPrice:1299, badge:"MONITORING", images:IMG.stethoscope, desc:"A dual-head acoustic stethoscope with a diaphragm for high-frequency sounds and a bell for low-frequency sounds. Suitable for cardiac, pulmonary, and abdominal auscultation.", stock:55 },
  { id:"i-2",  type:"item", name:"Universal Goniometer", tagline:"Large joint ROM measurement", price:293, originalPrice:450, badge:"PHYSIO TOOL", images:IMG.goniometer, desc:"A large transparent goniometer for measuring joint range of motion (ROM) in major joints like the hip, knee, and shoulder.", stock:80 },
  { id:"i-3",  type:"item", name:"Half-Range Goniometer", tagline:"Medium joint ROM measurement", price:267, originalPrice:300, badge:"PHYSIO TOOL", images:IMG.goniometer, desc:"A standard 180-degree half-circle goniometer with two adjustable arms, perfect for elbow and ankle measurements.", stock:80 },
  { id:"i-4",  type:"item", name:"Finger Goniometer", tagline:"Small joint ROM measurement", price:267, originalPrice:350, badge:"PHYSIO TOOL", images:IMG.goniometer, desc:"A small 90-degree finger goniometer for precision measurement of small joint ranges of motion.", stock:80 },
  { id:"i-5",  type:"item", name:"128 Hz Tuning Fork", tagline:"Vibration & hearing tests", price:102, originalPrice:320, badge:"NEURO TOOL", images:IMG.tuningfork, desc:"A 128 Hz aluminium alloy tuning fork used for assessing vibration sense and conducting Rinne and Weber tests.", stock:60 },
  { id:"i-6",  type:"item", name:"Reflex (Knee) Hammer", tagline:"Deep tendon reflex testing", price:78, originalPrice:220, badge:"NEURO TOOL", images:IMG.hammer, desc:"The Taylor percussion hammer is the standard tool for testing deep tendon reflexes in neurological and physiotherapy assessments.", stock:95 },
  { id:"i-7",  type:"item", name:"Measuring Tape", tagline:"Body & limb measurement", price:100, originalPrice:150, badge:"MEASUREMENT", images:IMG.tape, desc:"A flexible 150cm measuring tape used extensively for limb girth measurements and postural assessment.", stock:150 },
  { id:"i-8",  type:"item", name:"Assessment Notepad", tagline:"Clinical documentation forms", price:150, originalPrice:200, badge:"STUDY TOOL", images:IMG.notepad, desc:"A clinical assessment sheet pad with pre-printed forms for recording patient history, ROM measurements, and muscle testing grades.", stock:120 },
  { id:"i-9",  type:"item", name:"Skin Marker", tagline:"Surgical skin marker", price:151, originalPrice:250, badge:"CLINICAL", images:IMG.markerset, desc:"A clinical skin marker for accurate marking during surgical procedures, orthopaedic assessments, and anatomy mapping.", stock:100 },
  { id:"i-10", type:"item", name:"Neurological Pin Wheel", tagline:"Sensory testing wheel", price:200, originalPrice:300, badge:"NEURO TOOL", images:IMG.hammer, desc:"A Wartenberg pinwheel used to test nerve reactions (sensitivity) as it is rolled systematically across the skin.", stock:50 },
  { id:"i-11", type:"item", name:"Cotton Swab", tagline:"Sensory testing", price:50, originalPrice:80, badge:"CONSUMABLE", images:IMG.cotton, desc:"Medical-grade cotton swabs often used for light touch sensory testing in neurological assessments.", stock:200 },
  { id:"i-12", type:"item", name:"Safety Pin", tagline:"Pain sensation testing", price:50, originalPrice:80, badge:"CONSUMABLE", images:IMG.medtape, desc:"Clinical safety pins used for sharp/dull discrimination testing during neurological examinations.", stock:200 },
  { id:"i-13", type:"item", name:"Pen Torch", tagline:"Pupillary reflex testing", price:124, originalPrice:250, badge:"NEURO TOOL", images:IMG.pentorch, desc:"A chrome LED medical pen torch with bright LED tip and pupil gauge millimetre scale on the barrel.", stock:100 },
  { id:"i-14", type:"item", name:"Premium Carry Pouch", tagline:"Instrument storage", price:100, originalPrice:200, badge:"ACCESSORY", images:IMG.kit3, desc:"A premium zip carry pouch to safely store and transport all your clinical assessment instruments.", stock:150 },
];

// ── Accessories ────────────────────────────────────────────────
const ACCESSORIES = [
  {
    id: "acc-1", type: "item",
    name: "BPL Dual Head Stethoscope",
    tagline: "Clear acoustics for clinical auscultation",
    price:950, originalPrice:1299, badge: "MONITORING",
    images: IMG.accStethoscope,
    desc: "Experience clear acoustic performance with the trusted BPL Dual Head Stethoscope. Designed for accurate auscultation — ideal for physiotherapy students during clinical postings, practical examinations, and patient assessments. Features a dual head chest piece (diaphragm + bell) for both high and low frequency sounds, comfortable soft ear tips for extended wear, and excellent sound clarity tubing. Backed by a 1-Year Manufacturer Warranty. Perfect for BPT Students, MPT Students, and Healthcare Professionals.",
    stock: 60,
    features: ["Premium BPL Quality", "Dual Head Chest Piece", "Comfortable Soft Ear Tips", "Excellent Sound Clarity", "1-Year Manufacturer Warranty"],
  },
  {
    id: "acc-2", type: "item",
    name: "Personalized MedVault Clinical Pouch",
    tagline: "Waterproof pouch with free name printing",
    price: 399, originalPrice: 599, badge: "ACCESSORY",
    images: IMG.accPouch,
    desc: "Protect and organise your clinical instruments in a premium waterproof MedVault carrying pouch. Designed for BPT students to safely carry their entire assessment kit — goniometers, reflex hammer, tuning fork, and more — all in one place. Special launch offer: FREE personalisation for the first 50 orders — get your Name and RA Number printed at no extra cost. Durable waterproof exterior, soft inner lining, double zip closure, and multiple inner pockets.",
    stock: 50,
    features: ["Waterproof outer material", "Soft inner lining", "Double zip closure", "FREE Name Printing (limited)", "FREE RA Number Printing (limited)"],
  },
  {
    id: "acc-3", type: "item",
    name: "MedVault Physiotherapy Assessment Sheets",
    tagline: "Professionally designed patient evaluation templates",
    price: 149, originalPrice: 249, badge: "STUDY TOOL",
    images: IMG.accSheets,
    desc: "Professionally designed physiotherapy assessment templates for complete patient evaluation. Includes dedicated sections for Patient History, Pain Assessment (NRS/VAS scales), Range of Motion measurements, Muscle Strength grading, Postural Analysis, Functional Assessment, Treatment Plan, and Progress Notes. Perforated sheets for easy removal and submission during practicals. Perfectly formatted for clinical postings, internships, and practical exams.",
    stock: 200,
    features: ["Patient History & Pain Assessment", "ROM & Muscle Strength sections", "Posture & Functional Assessment", "Treatment Plan & Progress Notes", "Perforated for easy removal"],
  },
  {
    id: "acc-4", type: "item",
    name: "Surgical Skin Marker",
    tagline: "Fine-tip clinical marking pen",
    price: 120, originalPrice: 199, badge: "CLINICAL",
    images: IMG.accMarker,
    desc: "High-quality medical skin marker for clinical assessment, anatomical landmark identification, and treatment planning in physiotherapy. The fine precision tip allows accurate marking for electrode placement in electrotherapy, joint line identification, and postural assessment. Long-lasting, skin-friendly ink that is easy to remove. An essential tool for musculoskeletal and neurological practical sessions.",
    stock: 150,
    features: ["Long-lasting Ink", "Skin Friendly & Safe", "Fine Precision Tip", "Easy to Remove", "Ideal for electrotherapy & postural use"],
  },
  {
    id: "acc-5", type: "item",
    name: "Premium Yoga Mat",
    tagline: "Anti-slip mat for rehab & home workouts",
    price: 649, originalPrice: 999, badge: "REHAB",
    images: IMG.accYogaMat,
    desc: "Comfortable, non-slip yoga mat suitable for physiotherapy exercises, rehabilitation sessions, and home workouts. The textured anti-slip surface provides stability during balance exercises, core strengthening, and therapeutic movement routines. Lightweight, easy to clean, and made from durable PVC foam material. Available in multiple colours. Ideal for BPT students for home exercise practice, patient demonstration, and physiotherapy rehabilitation protocols.",
    stock: 40,
    features: ["Anti-Slip Surface", "Lightweight & portable", "Easy to Clean", "Durable PVC material", "Available in multiple colours"],
  },
  {
    id: "acc-6", type: "item",
    name: "Resistance Band Set",
    tagline: "Progressive resistance for rehab & strength",
    price: 299, originalPrice: 449, badge: "REHAB",
    images: IMG.accBands,
    desc: "Strengthen muscles and improve rehabilitation outcomes with premium latex-free resistance bands. Available in multiple resistance levels (light, medium, heavy) to match patient ability and progression. Suitable for Strength Training, Home Exercise Programs, Physiotherapy Rehabilitation, and Sports Conditioning. Used across BPT semesters for exercises like terminal knee extension, clamshell, and theraband shoulder routines. Lightweight and portable for campus and clinical use.",
    stock: 120,
    features: ["Multiple resistance levels", "Latex-free & skin-safe", "Suitable for all BPT years", "Home & clinical use", "Lightweight & portable"],
  },
  {
    id: "acc-7", type: "item",
    name: "Manual BP Apparatus",
    tagline: "Professional aneroid blood pressure monitor",
    price: 849, originalPrice: 1199, badge: "MONITORING",
    images: IMG.accBP,
    desc: "Professional manual sphygmomanometer for accurate cardiovascular assessment in clinical and practical settings. Features a high-accuracy aneroid gauge with clear mmHg scale (0–300), a durable fabric arm cuff with velcro closure, and an easy-grip rubber inflation bulb with release valve. Clinical grade performance trusted by students and practitioners. Essential for cardiopulmonary physiotherapy practicals and patient monitoring during clinical postings.",
    stock: 35,
    features: ["High Accuracy Aneroid Gauge", "Durable Velcro Arm Cuff", "Easy-to-Read mmHg Scale", "Clinical Grade Performance", "Ideal for students & practitioners"],
  },
];

// ── Apparel ────────────────────────────────────────────────────
const APPAREL = [
  {
    id:"ap-1", type:"apparel",
    name:"MedVault Scrubs Set", tagline:"Top & bottom — clinical-grade",
    price:899, originalPrice:1299, badge:"APPAREL",
    images: IMG.scrubs,
    desc:"MedVault Scrubs are designed specifically for BPT students who spend long hours in practical labs, physiotherapy wards, and clinical postings. Made from a premium cotton-blend fabric that is breathable, sweat-wicking, and durable through repeated machine washes. The relaxed clinical fit allows full freedom of movement for floor exercises, patient transfers, and hands-on practical work. The top features two front pockets for carrying pens, a pen torch, and small instruments. Drawstring bottoms ensure a comfortable, adjustable fit. Available in Navy Blue and Ceil Blue. MedVault branding adds a professional identity on campus.",
    sizes:["XS","S","M","L","XL","XXL"], sizeNote:"True to size. Relaxed clinical fit.", stock:60, colors:["Navy Blue","Ceil Blue"],
    features:["Cotton-blend fabric","MedVault branding","Two-pocket top","Drawstring bottoms","Easy-care wash"],
  },
  {
    id:"ap-2", type:"apparel",
    name:"Lab Apron", tagline:"Full-length protective apron",
    price:349, originalPrice:499, badge:"APPAREL",
    images: IMG.apron,
    desc:"A white full-length lab apron made from a polyester-cotton blend fabric that is easy to clean, resistant to light chemical splashes, and durable for semester-long lab use. Features two spacious front pockets for storing pens, notepads, and small instruments during lab sessions. The adjustable neck strap and back tie ensure a secure, comfortable fit across different body types. Meets practical lab dress code requirements for anatomy, physiology, and physiotherapy labs. Easy to wash and quick to dry — an essential item for every lab session.",
    sizes:["S","M","L","XL"], sizeNote:"Select based on height. M fits 5'4\"–5'8\".", stock:80, colors:["White"],
    features:["Polyester-cotton blend","Two front pockets","Adjustable neck strap","Easy to clean","Lab compliant"],
  },
];

// ── BPT Textbooks ──────────────────────────────────────────────
// Amazon CDN covers (ISBN-10 mapped, real book photos)
const AMZ = (isbn10) => `https://images-na.ssl-images-amazon.com/images/P/${isbn10}.jpg`;
// Open Library fallback (CC licensed ISBN covers)
const OL = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
// Google Books official preview thumbnails
const GB = (id) => `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=3`;
// AI fallback
const BK = (title, seed) => R(`${title} medical textbook cover, professional academic book, white background, studio photography, no people`, seed);

const BOOK_ITEMS = [
  // 1st Year
  { id:"b-1",  type:"book", year:"1st Year", subject:"Anatomy",
    name:"Anatomy & Physiology in Health and Illness", tagline:"Ross & Wilson · Elsevier",
    price:799, originalPrice:949, badge:"1ST YEAR", stock:20,
    desc:"The classic Ross & Wilson text covering human anatomy and physiology with clear diagrams and clinical applications. Widely used in BPT first year for understanding the structural and functional basis of the human body. Elsevier edition with full-colour illustrations, case studies, and self-test questions aligned to BPT curriculum.",
    images:[AMZ("0323834604"), OL("9780702078491"), GB("8sCOWgEACAAJ")] },

  { id:"b-2",  type:"book", year:"1st Year", subject:"Anatomy",
    name:"Gray's Anatomy", tagline:"Gray H. · Churchill Livingstone",
    price:1249, originalPrice:1499, badge:"1ST YEAR", stock:15,
    desc:"The definitive anatomical reference, Gray's Anatomy is the gold standard for medical and physiotherapy students. The Churchill Livingstone edition provides comprehensive coverage of gross anatomy with detailed illustrations, clinical boxes, and dissection guides. Essential for BPT first-year anatomy lab preparation and long-term clinical reference.",
    images:[AMZ("0443069522"), OL("9780702052309"), GB("CxVqAAAAMAAJ")] },

  { id:"b-3",  type:"book", year:"1st Year", subject:"Physiology",
    name:"Textbook of Medical Physiology", tagline:"Guyton A.C. & Hall J.E. · Elsevier",
    price:849, originalPrice:1099, badge:"1ST YEAR", stock:18,
    desc:"Guyton and Hall's Textbook of Medical Physiology is the most widely used physiology textbook in medical and physiotherapy education. Covers all major organ systems with clinical correlations, updated research, and clear mechanistic explanations. The Elsevier edition includes full-colour illustrations and a comprehensive index — essential for BPT first and second year physiology.",
    images:[AMZ("0323597122"), OL("9780323597128"), GB("wqkVAAAAYAAJ")] },

  { id:"b-4",  type:"book", year:"1st Year", subject:"Physiology",
    name:"Essentials of Medical Physiology", tagline:"Sembulingam K. · Jaypee",
    price:449, originalPrice:549, badge:"1ST YEAR", stock:22,
    desc:"Sembulingam's Essentials of Medical Physiology is a concise, India-focused physiology text popular among BPT students for its straightforward explanations and exam-oriented approach. The Jaypee edition covers all major physiological systems with relevant clinical applications, making it an ideal companion to Guyton or as a standalone revision resource.",
    images:[AMZ("9352706927"), OL("9789386150950"), GB("YYBhDwAAQBAJ")] },

  { id:"b-5",  type:"book", year:"1st Year", subject:"Psychology",
    name:"General Psychology", tagline:"Mangal S.K.",
    price:279, originalPrice:349, badge:"1ST YEAR", stock:25,
    desc:"Mangal's General Psychology is the prescribed psychology text for BPT first year, covering fundamental psychological concepts including behaviour, perception, learning, memory, motivation, emotion, and personality. Written in simple language with Indian examples, it helps physiotherapy students understand the psychosocial dimensions of patient care and therapeutic relationships.",
    images:[AMZ("9386245760"), OL("9788121909310")] },

  { id:"b-6",  type:"book", year:"1st Year", subject:"Sociology",
    name:"An Introduction to Sociology", tagline:"Sachdeva D.R. & Bhushan V.",
    price:229, originalPrice:299, badge:"1ST YEAR", stock:25,
    desc:"Sachdeva and Bhushan's Introduction to Sociology covers the core sociological concepts required in the BPT first-year curriculum: social structure, culture, family, community health, and social determinants of disease. Helps physiotherapy students understand patients in their social context and develop community-oriented clinical practice.",
    images:["https://www.kitabmahalpublishers.com/uploads/product_image/product_9788122507324_1.jpg", OL("9788131512340")] },

  // 2nd Year
  { id:"b-7",  type:"book", year:"2nd Year", subject:"Pathology & Microbiology",
    name:"Textbook of Pathology", tagline:"Mohan H. · Jaypee",
    price:649, originalPrice:799, badge:"2ND YEAR", stock:18,
    desc:"Mohan's Textbook of Pathology is the standard pathology reference for BPT second year, providing a comprehensive understanding of disease processes, cellular pathology, inflammation, neoplasia, and organ-specific diseases. The Jaypee edition is widely available in India and includes full-colour histopathology images, relevant clinical correlations, and exam-oriented summaries.",
    images:[AMZ("8180613682"), OL("9789386150394"), GB("F-nRsgEACAAJ")] },

  { id:"b-8",  type:"book", year:"2nd Year", subject:"Exercise Therapy",
    name:"Principles of Exercise Therapy", tagline:"Gardiner D. · CBS Publishers",
    price:449, originalPrice:549, badge:"2ND YEAR", stock:20,
    desc:"Gardiner's Principles of Exercise Therapy is the core exercise therapy textbook for BPT second year, covering the theoretical and practical foundations of therapeutic exercise including active, passive, resisted, and stretching exercises. Includes principles of strengthening, endurance training, and functional movement — directly applicable to BPT practical lab work.",
    images:[AMZ("8123908938"), OL("9788123910765")] },

  { id:"b-9",  type:"book", year:"2nd Year", subject:"Biomechanics",
    name:"Joint Structure and Function", tagline:"Norkin C.C. & Levangie P.K. · F.A. Davis",
    price:749, originalPrice:899, badge:"2ND YEAR", stock:15,
    desc:"Norkin and Levangie's Joint Structure and Function is the definitive biomechanics reference for physiotherapy students, covering articular structure, kinematics, and kinetics of all major joints. Published by F.A. Davis, it bridges anatomy and clinical physiotherapy practice, making it essential for understanding normal and pathological movement in BPT second year.",
    images:[AMZ("0803607105"), OL("9780803623620"), GB("ym7HPQAACAAJ")] },

  { id:"b-10", type:"book", year:"2nd Year", subject:"Pharmacology",
    name:"Essentials of Medical Pharmacology", tagline:"Tripathi K.D. · Jaypee",
    price:549, originalPrice:699, badge:"2ND YEAR", stock:20,
    desc:"Tripathi's Essentials of Medical Pharmacology is the standard pharmacology text used across Indian medical and allied health curricula. Covers all major drug classes with mechanisms of action, indications, contraindications, and clinical uses relevant to physiotherapy practice — including NSAIDs, muscle relaxants, analgesics, and drugs used in neurological and cardiovascular conditions.",
    images:[AMZ("9356964327"), OL("9789389587166"), GB("2gP1DwAAQBAJ")] },

  // 3rd Year
  { id:"b-11", type:"book", year:"3rd Year", subject:"Electrotherapy",
    name:"Electrotherapy Explained: Principles and Practice", tagline:"Robertson V. · Elsevier",
    price:649, originalPrice:799, badge:"3RD YEAR", stock:15,
    desc:"Robertson's Electrotherapy Explained is the comprehensive reference for electrotherapy in BPT third year, covering TENS, ultrasound, IFT, shortwave diathermy, LASER, and neuromuscular electrical stimulation. The Elsevier edition includes physiological rationale, evidence-based clinical applications, dosage guidelines, contraindications, and safety protocols — aligned directly to the BPT electrotherapy curriculum.",
    images:[AMZ("0750688432"), OL("9780750688147"), GB("3RcuI8nfJFEC")] },

  { id:"b-12", type:"book", year:"3rd Year", subject:"General Medicine & Surgery",
    name:"Principles and Practice of Medicine", tagline:"Davidson's · Elsevier",
    price:999, originalPrice:1299, badge:"3RD YEAR", stock:12,
    desc:"Davidson's Principles and Practice of Medicine is the gold-standard internal medicine reference, widely used by physiotherapy students in their third year clinical postings. Covers major medical conditions, their pathophysiology, diagnosis, and management — providing physiotherapy students the medical background needed for evidence-based clinical reasoning in all specialty areas.",
    images:[AMZ("0702083488"), OL("9780702070273"), GB("9x5FEAAAQBAJ")] },

  { id:"b-13", type:"book", year:"3rd Year", subject:"Orthopaedics",
    name:"Essential Orthopaedics", tagline:"Maheshwari J. · Jaypee",
    price:549, originalPrice:699, badge:"3RD YEAR", stock:18,
    desc:"Maheshwari's Essential Orthopaedics is the primary orthopaedics reference for BPT third year, covering fractures, dislocations, joint diseases, spinal conditions, and orthopaedic procedures from a clinical perspective. The Jaypee edition is India-specific, with conditions and clinical cases relevant to the Indian population and hospital setting, making it ideal for ward postings.",
    images:[AMZ("9372026654"), OL("9789354651403"), GB("rOtFDwAAQBAJ")] },

  { id:"b-14", type:"book", year:"3rd Year", subject:"Neurology",
    name:"Neurological Examination in Clinical Practice", tagline:"Bickerstaff E.R.",
    price:449, originalPrice:549, badge:"3RD YEAR", stock:15,
    desc:"Bickerstaff's Neurological Examination in Clinical Practice is the clinical neurology examination guide used by BPT students in their third-year neurology postings. Covers systematic neurological assessment — cranial nerves, motor system, sensory system, reflexes, coordination, and cerebellar function — with practical guidance for examination technique and clinical interpretation.",
    images:[AMZ("086542909X"), OL("9780632013173"), GB("9jtqAAAAMAAJ")] },

  // Final Year
  { id:"b-15", type:"book", year:"Final Year", subject:"Physiotherapy in Orthopaedics",
    name:"Clinical Orthopaedic Rehabilitation", tagline:"Brotzman S.B. · Elsevier",
    price:799, originalPrice:999, badge:"FINAL YEAR", stock:12,
    desc:"Brotzman's Clinical Orthopaedic Rehabilitation is the definitive rehabilitation protocols reference for final-year BPT students and clinical physiotherapists. Provides evidence-based, protocol-driven rehabilitation programs for all major orthopaedic conditions — ACL reconstruction, rotator cuff repair, hip and knee arthroplasty, and sports injuries — aligned to current clinical practice standards.",
    images:[AMZ("0323393705"), OL("9780323393706"), GB("bkXfBQAAQBAJ")] },

  { id:"b-16", type:"book", year:"Final Year", subject:"Physiotherapy in Neurology",
    name:"Neurological Rehabilitation", tagline:"Umphred D.A. · Mosby",
    price:849, originalPrice:1049, badge:"FINAL YEAR", stock:10,
    desc:"Umphred's Neurological Rehabilitation is the comprehensive neurorehabilitation reference for final-year BPT students, covering neuroplasticity, motor control theories, and rehabilitation approaches for stroke, traumatic brain injury, spinal cord injury, Parkinson's disease, multiple sclerosis, and cerebral palsy. The Mosby edition is internationally recognised and includes evidence-based intervention frameworks.",
    images:[AMZ("032307586X"), OL("9780323172271"), GB("tvMJAAAAQBAJ")] },

  { id:"b-17", type:"book", year:"Final Year", subject:"Cardio-Respiratory Physiotherapy",
    name:"Physiotherapy for Respiratory and Cardiac Problems", tagline:"Pryor J.A. & Prasad S.A.",
    price:699, originalPrice:849, badge:"FINAL YEAR", stock:12,
    desc:"Pryor and Prasad's Physiotherapy for Respiratory and Cardiac Problems is the key cardiopulmonary physiotherapy reference for BPT final year, covering lung volumes, airway clearance techniques, breathing exercises, cardiac rehabilitation, and physiotherapy management of COPD, asthma, pneumonia, and post-cardiac surgery conditions. Includes evidence-based clinical reasoning frameworks.",
    images:[AMZ("813123634X"), OL("9780443073144"), GB("KBYDAAAACAAJ")] },

  { id:"b-18", type:"book", year:"Final Year", subject:"Therapeutic Exercise",
    name:"Therapeutic Exercise: Foundations and Techniques", tagline:"Kisner C. & Colby L. · F.A. Davis",
    price:799, originalPrice:999, badge:"FINAL YEAR", stock:10,
    desc:"Kisner and Colby's Therapeutic Exercise is the most comprehensive and widely used therapeutic exercise textbook in physiotherapy education. The F.A. Davis edition covers exercise principles, stretching, strengthening, aerobic conditioning, and condition-specific exercise programs for orthopaedic, neurological, and cardiopulmonary conditions — a cornerstone reference for final-year BPT students and practising physiotherapists.",
    images:[AMZ("080362574X"), OL("9780803658509"), GB("9GxHAAAAYAAJ")] },

  { id:"b-19", type:"book", year:"Final Year", subject:"Rehabilitation & Community Medicine",
    name:"Preventive and Social Medicine", tagline:"Park K.",
    price:449, originalPrice:549, badge:"FINAL YEAR", stock:20,
    desc:"Park's Preventive and Social Medicine is the standard PSM and community medicine reference for BPT final year, covering epidemiology, public health, nutrition, environmental health, health statistics, and community-based rehabilitation. Provides physiotherapy students with the public health framework needed for community outreach, disability management, and preventive physiotherapy programs.",
    images:["https://prithvibooks.com/wp-content/uploads/2025/01/Parks_Textbook_of_Preventive_and_Social_Medicine_28th_Edition_2025.png", OL("9789389863741"), GB("4D_CzgEACAAJ")] },
];

const ALL_PRODUCTS = [...KITS, ...ITEMS, ...APPAREL, ...BOOK_ITEMS];

// // ── Navbar ────────────────────────────────────────────────────
// function Navbar({ cartCount, onCart, onHome, searchQuery, onSearchChange }) {
//   return (
//     <nav style={{
//       position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
//       background: C.header,
//       borderBottom: `1px solid ${C.headerBorder}`,
//       padding: "0 5%",
//     }}>
//       <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 24 }}>
//         {/* Logo */}
//         <button onClick={onHome} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
//           <img src="/logo.png" alt="MedVault" style={{ height: 40, width: "auto", display: "block", mixBlendMode: "screen" }} />
//         </button>

//         {/* Search bar */}
//         <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
//           <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>&#128269;</span>
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={e => onSearchChange(e.target.value)}
//             style={{
//               width: "100%", padding: "9px 14px 9px 36px",
//               background: "rgba(255,255,255,0.08)",
//               border: `1px solid rgba(255,255,255,0.12)`,
//               borderRadius: 8, color: "#FFFFFF", fontSize: 13,
//               outline: "none",
//             }}
//             onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
//             onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
//           />
//         </div>

//         {/* Right nav */}
//         <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
//           <button onClick={onHome} style={{
//             background: "none", border: "none", cursor: "pointer",
//             color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500,
//             padding: "8px 14px", letterSpacing: 0.3,
//           }}>Shop</button>
//           <button onClick={onCart} style={{
//             position: "relative",
//             background: "transparent",
//             border: `1px solid rgba(255,255,255,0.25)`,
//             borderRadius: 8, padding: "8px 18px", cursor: "pointer", color: C.white,
//             display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600,
//             transition: "all 0.2s",
//           }}
//             onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
//             onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.background = "transparent"; }}
//           >
//             <span style={{ fontSize: 15 }}>&#128722;</span>
//             <span>Cart</span>
//             {cartCount > 0 && (
//               <span style={{
//                 background: C.deal, color: C.white, borderRadius: "50%",
//                 width: 19, height: 19, display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: 10, fontWeight: 800, animation: "cartBounce 0.3s ease",
//               }}>{cartCount}</span>
//             )}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }


// ─────────────────────────────────────────────────────────────
// NAVBAR
// PART 1
// Paste Part 2 where mentioned below.
// ─────────────────────────────────────────────────────────────


const NAV_ITEMS = [
  {
    title: "Assessment Kit",
    icon: <Package size={16} />,
  },
  {
    title: "Products",
    icon: <Search size={16} />,
  },
  {
    title: "About",
    icon: <Info size={16} />,
  },
];

function Navbar({
  cartCount,
  onCart,
  onHome,
  searchQuery,
  onSearchChange,
}) {
  return (
    <>
      {/* ================================================= */}
      {/* Announcement Bar */}
      {/* ================================================= */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 34,
          background:
            "linear-gradient(90deg,#16A34A,#15803D,#16A34A)",
          color: "#fff",
          overflow: "hidden",
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "marquee 22s linear infinite",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: ".3px",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginRight: 60,
              }}
            >
              <Sparkles size={14} />

              FREE Name & RA Number Printing

              <ChevronRight size={14} />

              First 50 Orders

              <ChevronRight size={14} />

              Campus Delivery Available
            </span>
          ))}
        </div>
      </div>

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav
        style={{
          position: "fixed",
          top: 34,
          left: 0,
          right: 0,
          zIndex: 1100,

          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          background: "rgba(7,22,43,.78)",

          borderBottom:
            "1px solid rgba(255,255,255,.08)",

          boxShadow:
            "0 8px 30px rgba(0,0,0,.12)",

          padding: "0 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            height: 72,

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            gap: 28,
          }}
        >
          {/* ========================================= */}
          {/* Logo */}
          {/* ========================================= */}

          <button
            onClick={onHome}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,

              background: "none",
              border: "none",

              cursor: "pointer",

              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="MedVault"
              style={{
                width: 48,
                height: 48,
                objectFit: "contain",
              }}
            />

            <div
              style={{
                textAlign: "left",
              }}
            >
              <div
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: ".3px",
                }}
              >
                MedVault
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,.55)",
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                Physiotherapy Essentials
              </div>
            </div>
          </button>
          {/* ========================================= */}
          {/* Navigation */}
          {/* ========================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,

                  background: "transparent",

                  border: "none",

                  color: "rgba(255,255,255,.75)",

                  padding: "10px 16px",

                  borderRadius: 12,

                  cursor: "pointer",

                  transition: ".25s",

                  fontWeight: 600,

                  fontSize: 14,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,.08)";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color =
                    "rgba(255,255,255,.75)";
                }}
              >
                {item.icon}
                {item.title}
              </button>
            ))}
          </div>

          {/* ========================================= */}
          {/* Search */}
          {/* ========================================= */}

          <div
            style={{
              flex: 1,
              maxWidth: 360,
              position: "relative",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,.45)",
              }}
            />

            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              style={{
                width: "100%",

                background: "rgba(255,255,255,.06)",

                border:
                  "1px solid rgba(255,255,255,.10)",

                borderRadius: 14,

                color: "#fff",

                outline: "none",

                padding: "13px 18px 13px 46px",

                fontSize: 14,

                transition: ".25s",
              }}
              onFocus={(e) => {
                e.target.style.border =
                  "1px solid rgba(96,165,250,.45)";
              }}
              onBlur={(e) => {
                e.target.style.border =
                  "1px solid rgba(255,255,255,.10)";
              }}
            />
          </div>

          {/* ========================================= */}
          {/* Cart */}
          {/* ========================================= */}

          <button
            onClick={onCart}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,

              background:
                "linear-gradient(135deg,#0057A8,#1E88E5)",

              color: "#FFFFFF",

              border: "none",

              borderRadius: 14,

              padding: "12px 22px",

              cursor: "pointer",

              fontWeight: 700,

              boxShadow:
                "0 12px 30px rgba(0,87,168,.28)",

              transition: ".25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >
            <ShoppingCart size={19} />

            Cart

            {cartCount > 0 && (
              <div
                style={{
                  width: 22,
                  height: 22,

                  borderRadius: "50%",

                  background: "#22C55E",

                  color: "#fff",

                  display: "flex",

                  justifyContent: "center",

                  alignItems: "center",

                  fontSize: 11,

                  fontWeight: 800,
                }}
              >
                {cartCount}
              </div>
            )}
          </button>

        </div>
      </nav>

      {/* ========================================= */}
      {/* Announcement Animation */}
      {/* ========================================= */}

      <style>{`
        @keyframes marquee{
          0%{
            transform:translateX(0%);
          }

          100%{
            transform:translateX(-50%);
          }
        }

        @media (max-width:1024px){

          nav input{
            display:none;
          }

        }

        @media (max-width:900px){

          nav{

            padding:0 18px !important;

          }

        }

        @media (max-width:768px){

          nav{

            top:34px;

          }

        }

      `}</style>

    </>
  );
}


// // ── Hero ──────────────────────────────────────────────────────
// function HeroSection({ onShop }) {
//   return (
//     <div style={{
//       background: "linear-gradient(160deg, #0A1628 0%, #0D2D5A 55%, #0A1E3E 100%)",
//       padding: "108px 5% 72px", position: "relative", overflow: "hidden",
//     }}>
//       {/* Subtle grid overlay */}
//       <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
//       {/* Glow blobs */}
//       <div style={{ position: "absolute", top: -100, right: "8%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,87,168,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
//       <div style={{ position: "absolute", bottom: -80, left: "2%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,135,90,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

//       <div className="hero-row" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative" }}>
//         <div style={{ flex: "0 0 auto", maxWidth: 540, animation: "fadeUp 0.7s ease both" }}>
//           {/* Pill */}
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: 8,
//             background: "rgba(0,87,168,0.35)", border: "1px solid rgba(0,87,168,0.6)",
//             borderRadius: 100, padding: "6px 18px", marginBottom: 28,
//           }}>
//             <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4CAF90", display: "block", boxShadow: "0 0 6px #4CAF90" }} />
//             <span style={{ fontSize: 11, color: "#A8D5FF", fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>SRM Campus Delivery</span>
//           </div>

//           <h1 style={{
//             fontWeight: 900, fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1.06,
//             color: "#FFFFFF", marginBottom: 22, letterSpacing: "-1px",
//           }}>
//             Everything a<br />
//             <span style={{
//               background: "linear-gradient(90deg, #60A5FA, #34D399)",
//               WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//             }}>BPT Student</span><br />
//             <span style={{ color: "rgba(255,255,255,0.85)" }}>Needs.</span>
//           </h1>

//           <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", fontWeight: 400, maxWidth: 460, lineHeight: 1.8, marginBottom: 40 }}>
//             Physiotherapy instruments, clinical kits, scrubs &amp; study supplies — curated for SRM students and delivered to your hostel in 48 hours.
//           </p>

//           <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 48 }}>
//             <button onClick={onShop} style={{
//               background: "linear-gradient(135deg, #0057A8, #0070D4)",
//               color: C.white, border: "none",
//               padding: "15px 36px", borderRadius: 10, cursor: "pointer",
//               fontWeight: 700, fontSize: 15, letterSpacing: 0.3,
//               transition: "all 0.22s", boxShadow: "0 6px 20px rgba(0,87,168,0.45)",
//             }}
//               onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,87,168,0.55)"; }}
//               onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,87,168,0.45)"; }}
//             >Browse Kits &#8594;</button>
//             <a href={`https://wa.me/918248613274?text=${encodeURIComponent("Hi MedVault, I'd like to place an order")}`} target="_blank" rel="noreferrer" style={{
//               display: "flex", alignItems: "center", gap: 8,
//               background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)",
//               color: "rgba(255,255,255,0.9)", padding: "14px 24px", borderRadius: 10,
//               textDecoration: "none", fontWeight: 600, fontSize: 14, transition: "all 0.2s",
//             }}
//               onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
//               onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
//             >
//               <span style={{ fontSize: 16 }}>&#128172;</span> Order on WhatsApp
//             </a>
//           </div>

//           {/* Stats */}
//           <div style={{ display: "flex", gap: 36, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 28 }}>
//             {[["4,000+", "Students Served"], ["28+", "Products"], ["1 hr", "Delivery"]].map(([n, l]) => (
//               <div key={l}>
//                 <div style={{ fontWeight: 800, fontSize: 24, color: "#FFFFFF", letterSpacing: "-0.5px" }}>{n}</div>
//                 <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, marginTop: 2 }}>{l}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="hero-img" style={{ animation: "fadeUp 0.9s ease 0.18s both" }}>
//           <div style={{ position: "relative", animation: "float3d 5s ease-in-out infinite" }}>
//             <div style={{ position: "absolute", inset: -24, borderRadius: 32, background: "radial-gradient(ellipse, rgba(0,87,168,0.3) 0%, transparent 70%)", zIndex: 0 }} />
//             <img src="/kit.jpg" alt="MedVault Physio Kit" style={{
//               position: "relative", zIndex: 1,
//               width: "clamp(240px, 28vw, 430px)",
//               borderRadius: 22, boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
//             }} onError={e => e.target.style.display = "none"} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// ─────────────────────────────────────────────────────────────
// HERO SECTION - PART 1
// Paste PART 2 inside the LEFT CONTENT div.
// Paste PART 3 inside the RIGHT CONTENT div.
// Paste PART 4 after the Hero Container.
// ─────────────────────────────────────────────────────────────

function HeroSection({ onShop }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg,#071827 0%,#0B2342 45%,#123B69 100%)",
        minHeight: "90vh",
        padding: "120px 5% 60px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px)",
          backgroundSize: "34px 34px",
          opacity: .5,
          pointerEvents: "none",
        }}
      />

      {/* Blue Glow */}
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -180,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(59,130,246,.20),transparent 72%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Green Glow */}
      <div
        style={{
          position: "absolute",
          bottom: -180,
          left: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(34,197,94,.15),transparent 72%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Hero Container */}
      <div
        className="hero-row"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1320,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "46% 54%",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(34,197,94,.12)",
              border: "1px solid rgba(34,197,94,.18)",
              color: "#86EFAC",
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 22,
            }}
          >
            ✨ India's Trusted Physiotherapy Student Store
          </div>

          <h1
            style={{
              fontSize: "clamp(48px,5vw,74px)",
              lineHeight: 1.02,
              fontWeight: 900,
              letterSpacing: "-2px",
              color: "#FFFFFF",
              marginBottom: 20,
            }}
          >
            Everything You Need
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,#60A5FA,#34D399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              For Your BPT
            </span>
            <br />
            Journey.
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,.72)",
              fontSize: 17,
              lineHeight: 1.75,
              maxWidth: 520,
              marginBottom: 30,
            }}
          >
            Premium physiotherapy assessment kits, trusted BPL stethoscopes,
            personalized clinical accessories and everything required for
            practicals, postings and patient assessments.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gap: 14,
              marginBottom: 32,
            }}
          >
            {[
              "BPL Dual Head Stethoscope",
              "Clinical Goniometer Set",
              "FREE Personalized Pouch",
              "Assessment Sheets Included",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#E5E7EB",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#22C55E",
                    display: "grid",
                    placeItems: "center",
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 34,
            }}
          >
            <div>
              <div
                style={{
                  color: "rgba(255,255,255,.55)",
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Complete MVP Kit
              </div>
              <div
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1,
                }}
              >
                ₹1,799
              </div>
            </div>

            <div
              style={{
                padding: "14px 18px",
                borderRadius: 14,
                background: "rgba(34,197,94,.10)",
                border: "1px solid rgba(34,197,94,.18)",
              }}
            >
              <div
                style={{
                  color: "#4ADE80",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                Save ₹500
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,.45)",
                  textDecoration: "line-through",
                  marginTop: 4,
                  fontSize: 14,
                }}
              >
                ₹2,299
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onShop}
              style={{
                background: "linear-gradient(135deg,#0066CC,#0B84FF)",
                border: "none",
                color: "#FFFFFF",
                borderRadius: 14,
                padding: "17px 34px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 16px 40px rgba(0,102,204,.35)",
              }}
            >
              Order MVP Kit →
            </button>
            <a
              href="https://wa.me/918248613274"
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                padding: "17px 28px",
                borderRadius: 14,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.12)",
                color: "#FFFFFF",
                fontWeight: 600,
              }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            minHeight: 620,
            width: "100%",
          }}
        >
          {/* Blue Glow */}
          <div
            style={{
              position: "absolute",
              width: 560,
              height: 560,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(37,99,235,.22), transparent 72%)",
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />

          {/* Product Image */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              animation: "floatHero 6s ease-in-out infinite",
            }}
          >
            <img
              src="/kit.jpg"
              alt="MedVault MVP Kit"
              style={{
                width: "100%",
                maxWidth: 560,
                objectFit: "contain",
                filter: "drop-shadow(0 35px 70px rgba(0,0,0,.45))",
              }}
            />

            {/* Genuine Product */}
            <div
              style={{
                position: "absolute",
                top: 40,
                left: -50,
                background: "#FFFFFF",
                borderRadius: 16,
                padding: "14px 18px",
                boxShadow: "0 16px 35px rgba(0,0,0,.18)",
                minWidth: 210,
              }}
            >
              <div
                style={{
                  color: "#16A34A",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                ✓ Genuine Product
              </div>
              <div
                style={{
                  color: "#111827",
                  fontWeight: 700,
                  marginTop: 4,
                  fontSize: 15,
                }}
              >
                BPL Dual Head Stethoscope
              </div>
            </div>

            {/* Personalization */}
            <div
              style={{
                position: "absolute",
                top: 130,
                right: -45,
                background: "#FFFFFF",
                borderRadius: 16,
                padding: "14px 18px",
                boxShadow: "0 16px 35px rgba(0,0,0,.18)",
                minWidth: 210,
              }}
            >
              <div
                style={{
                  color: "#2563EB",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                FREE Launch Offer
              </div>
              <div
                style={{
                  color: "#111827",
                  fontWeight: 700,
                  marginTop: 4,
                  fontSize: 15,
                }}
              >
                Name + RA Printing
              </div>
            </div>

            {/* Rating */}
            <div
              style={{
                position: "absolute",
                bottom: 130,
                left: -35,
                background: "#FFFFFF",
                borderRadius: 18,
                padding: "15px 20px",
                boxShadow: "0 16px 35px rgba(0,0,0,.18)",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#111827",
                }}
              >
                ⭐ 4.9
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Student Rating
              </div>
            </div>

            {/* Students */}
            <div
              style={{
                position: "absolute",
                bottom: 35,
                right: -30,
                background: "#FFFFFF",
                borderRadius: 18,
                padding: "15px 22px",
                boxShadow: "0 16px 35px rgba(0,0,0,.18)",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#111827",
                }}
              >
                4000+
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Students Served
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          justifyContent: "center",
          gap: 28,
          flexWrap: "wrap",
          color: "rgba(255,255,255,.72)",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {[
          "✓ Genuine BPL Products",
          "✓ Fast Campus Delivery",
          "✓ Student Pricing",
          "✓ GST Invoice Available",
        ].map((item) => (
          <div key={item}>
            {item}
          </div>
        ))}
      </div>

      <style>{`
@keyframes floatHero{
  0%{
    transform:translateY(0px);
  }
  50%{
    transform:translateY(-12px);
  }
  100%{
    transform:translateY(0px);
  }
}
@media (max-width:1100px){
.hero-row{
grid-template-columns:1fr !important;
gap:70px !important;
text-align:center;
}
.hero-row > div:first-child{
max-width:100% !important;
}
.hero-row > div:last-child{
justify-content:center !important;
}
}
@media (max-width:768px){
section{
padding-top:130px !important;
padding-bottom:60px !important;
}
.hero-row{
gap:45px !important;
}
.hero-row h1{
font-size:44px !important;
line-height:1.08 !important;
}
.hero-row p{
font-size:15px !important;
}
.hero-row img{
max-width:340px !important;
}
}
@media (max-width:768px){
.hero-row img + div,
.hero-row img ~ div{
display:none;
}
}
`}</style>

    </section>
  );
}

// ── Book Year Filter + Grid ───────────────────────────────────
function BookYearFilter({ items, onView, onAddToCart }) {
  const years = ["All", "1st Year", "2nd Year", "3rd Year", "Final Year"];
  const [activeYear, setActiveYear] = useState("All");
  const yearColors = { "1st Year": "#0057A8", "2nd Year": "#00875A", "3rd Year": "#B7791F", "Final Year": "#6B21A8" };

  const filtered = activeYear === "All" ? items : items.filter(b => b.year === activeYear);

  return (
    <div>
      {/* Year pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {years.map(y => {
          const col = y === "All" ? C.primary : (yearColors[y] || C.primary);
          const isActive = activeYear === y;
          return (
            <button key={y} onClick={() => setActiveYear(y)} style={{
              padding: "7px 18px", borderRadius: 100, cursor: "pointer", fontSize: 13, fontWeight: 700,
              background: isActive ? col : C.white,
              color: isActive ? C.white : col,
              border: `1.5px solid ${isActive ? col : col + "40"}`,
              transition: "all 0.15s",
            }}>{y}</button>
          );
        })}
      </div>

      {/* Books grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
        {filtered.map(book => {
          const col = yearColors[book.year] || C.primary;
          const pct = disc(book.price, book.originalPrice);
          return (
            <div key={book.id} style={{
              background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 16,
              overflow: "hidden", display: "flex", flexDirection: "column",
              boxShadow: C.shadow, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = col; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = C.shadowHover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = C.shadow; }}
            >
              {/* Image — cascades: Open Library → Google Books → Pollinations AI */}
              <div style={{ height: 160, background: "#F3F4F6", position: "relative", overflow: "hidden", cursor: "pointer" }} onClick={() => onView(book)}>
                <img src={book.images[0]} alt={book.name} loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  data-idx="0"
                  data-images={JSON.stringify(book.images)}
                  onError={e => {
                    const idx = parseInt(e.target.dataset.idx || "0", 10);
                    const imgs = JSON.parse(e.target.dataset.images || "[]");
                    if (idx + 1 < imgs.length) {
                      e.target.dataset.idx = String(idx + 1);
                      e.target.src = imgs[idx + 1];
                    } else {
                      e.target.style.display = "none";
                    }
                  }}
                />
                <div style={{ position: "absolute", top: 10, left: 10, background: col, color: C.white, borderRadius: 6, padding: "3px 9px", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>{book.year}</div>
                {pct > 0 && <div style={{ position: "absolute", top: 10, right: 10, background: "#E53E3E", color: C.white, borderRadius: 6, padding: "3px 9px", fontSize: 10, fontWeight: 800 }}>-{pct}%</div>}
              </div>

              {/* Content */}
              <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: 10, color: col, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>{book.subject}</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1.3, marginBottom: 4, cursor: "pointer" }} onClick={() => onView(book)}>{book.name}</p>
                <p style={{ fontSize: 11, color: C.muted, marginBottom: 14, flex: 1 }}>{book.tagline}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 900, color: C.primary }}>{fmt(book.price)}</span>
                    {book.originalPrice > book.price && <span style={{ fontSize: 12, color: C.muted, textDecoration: "line-through", marginLeft: 6 }}>{fmt(book.originalPrice)}</span>}
                  </div>
                  <button onClick={() => onAddToCart(book)} style={{
                    background: C.primary, color: C.white, border: "none",
                    borderRadius: 8, padding: "8px 16px", cursor: "pointer",
                    fontSize: 12, fontWeight: 700, transition: "background 0.18s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = C.primaryHover}
                    onMouseLeave={e => e.currentTarget.style.background = C.primary}
                  >Add to Cart</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab Navigation ────────────────────────────────────────────
function TabNav({ active, onChange }) {
  const tabs = [
    { id: "kits", label: "🎁 Curated Kits", desc: "Best value bundles" },
    { id: "items", label: "🔬 Individual Items", desc: "Buy what you need" },
    { id: "apparel", label: "🥼 Scrubs & Aprons", desc: "Clinical uniform" },
    { id: "books", label: "📚 Books", desc: "BPT Textbooks" },
  ];
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 40, overflowX: "auto", paddingBottom: 2 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: "12px 22px", borderRadius: 12, cursor: "pointer",
          background: active === t.id ? C.primary : C.white,
          color: active === t.id ? C.white : C.textSub,
          border: `1.5px solid ${active === t.id ? C.primary : C.border}`,
          fontSize: 13, fontWeight: 700,
          transition: "all 0.18s", whiteSpace: "nowrap",
          boxShadow: active === t.id ? `0 4px 14px rgba(0,87,168,0.25)` : C.shadow,
        }}
          onMouseEnter={e => { if (active !== t.id) { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; } }}
          onMouseLeave={e => { if (active !== t.id) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; } }}
        >
          {t.label}
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
  const retailTotal = kit.items.reduce((s, i) => s + i.retail, 0);
  const isGold = kit.badge === "BESTSELLER";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        border: `1.5px solid ${hovered ? C.primary : C.border}`,
        borderRadius: 18, overflow: "hidden", cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered ? C.shadowHover : C.shadow,
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ height: 220, overflow: "hidden", position: "relative", background: "#F7FAFC" }}>
        <img src={kit.images[0]} alt={kit.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.45s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} onError={e => e.target.style.display = "none"} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.28) 100%)" }} />
        {/* Discount badge */}
        <span style={{
          position: "absolute", top: 14, right: 14,
          background: C.deal, color: C.white,
          borderRadius: 8, padding: "5px 11px", fontSize: 12, fontWeight: 800,
          boxShadow: "0 2px 8px rgba(229,62,62,0.35)",
        }}>-{pct}%</span>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 22px 0", flex: 1 }}>
        {/* Badge */}
        <span style={{
          display: "inline-block",
          background: isGold ? C.goldBg : "#EBF5FF",
          color: isGold ? C.gold : C.primary,
          border: `1px solid ${isGold ? "#FAD56E" : "#BDD9FF"}`,
          borderRadius: 100, padding: "3px 10px", fontSize: 10, fontWeight: 700,
          letterSpacing: 1.5, marginBottom: 10,
        }}>{kit.badge}</span>

        <h3 style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 4, lineHeight: 1.2 }}>{kit.name}</h3>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 14, lineHeight: 1.45 }}>{kit.tagline}</p>

        {/* Items inside */}
        <p style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>What's inside</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px", marginBottom: 14 }}>
          {kit.items.map((item, i) => (
            <span key={i} style={{ fontSize: 11, color: C.textSub, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.primary, display: "inline-block", flexShrink: 0 }} />
              {item.name}
            </span>
          ))}
        </div>

        {/* Savings callout */}
        <div style={{
          background: "linear-gradient(135deg, #EBF5FF, #F0FFF4)",
          border: `1px solid #BDD9FF`, borderRadius: 10,
          padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
        }}>
          <span style={{ fontSize: 12, color: C.textSub, fontWeight: 500 }}>You save</span>
          <span style={{ fontSize: 14, color: C.accent, fontWeight: 800 }}>{fmt(saved)} ({pct}% off)</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "0 22px 22px", borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 28, color: C.primary, letterSpacing: "-0.5px" }}>{fmt(kit.price)}</span>
          <span style={{ fontSize: 14, color: C.muted, textDecoration: "line-through" }}>{fmt(kit.originalPrice)}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onView(kit)} style={{
            flex: 1, padding: "11px", borderRadius: 10, cursor: "pointer",
            background: "none", border: `1.5px solid ${C.border}`,
            color: C.textSub, fontSize: 13, fontWeight: 600, transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
          >Details</button>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(kit); }} style={{
            flex: 2, padding: "11px", borderRadius: 10, cursor: "pointer",
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`,
            border: "none", color: C.white,
            fontSize: 13, fontWeight: 700, transition: "all 0.18s",
            boxShadow: "0 4px 12px rgba(0,87,168,0.3)",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Add to Cart</button>
        </div>
        <p style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 10 }}>
          <span style={{ color: C.accent }}>&#9679;</span> {kit.stock} in stock &middot; SRM campus delivery
        </p>
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
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12, overflow: "hidden", cursor: "pointer",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? C.shadowHover : C.shadow,
      }}
    >
      <div style={{ height: 160, position: "relative", overflow: "hidden", background: "#F8FAFC" }}>
        <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.35s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} onError={e => e.target.style.display = "none"} />
        <span style={{
          position: "absolute", top: 8, right: 8,
          background: C.deal, color: C.white,
          borderRadius: 5, padding: "3px 7px", fontSize: 10, fontWeight: 800,
        }}>-{pct}%</span>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ fontSize: 9, color: C.primary, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>{item.badge}</p>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3, lineHeight: 1.25 }}>{item.name}</h4>
        <p style={{ fontSize: 11, color: C.muted, marginBottom: 10, lineHeight: 1.35 }}>{item.tagline}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{fmt(item.price)}</span>
            <span style={{ fontSize: 11, color: C.muted, textDecoration: "line-through", marginLeft: 5 }}>{fmt(item.originalPrice)}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} style={{
            background: C.primary, border: "none", color: C.white,
            borderRadius: 6, padding: "7px 12px", cursor: "pointer",
            fontSize: 12, fontWeight: 700, transition: "background 0.18s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.primaryHover}
            onMouseLeave={e => e.currentTarget.style.background = C.primary}
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
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14, overflow: "hidden",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? C.shadowHover : C.shadow,
      }}
    >
      <div style={{ height: 200, position: "relative", overflow: "hidden", background: "#F8FAFC" }}>
        <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease", transform: hovered ? "scale(1.04)" : "scale(1)" }} onError={e => e.target.style.display = "none"} />
        <span style={{
          position: "absolute", top: 12, left: 12,
          background: C.goldBg, color: C.gold, border: `1px solid #FDE68A`,
          borderRadius: 100, padding: "4px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
        }}>{item.badge}</span>
        <span style={{
          position: "absolute", top: 12, right: 12,
          background: C.deal, color: C.white,
          borderRadius: 6, padding: "4px 9px", fontSize: 10, fontWeight: 800,
        }}>-{pct}%</span>
      </div>
      <div style={{ padding: "20px" }}>
        <h3 style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 3 }}>{item.name}</h3>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>{item.tagline}</p>
        <p style={{ fontSize: 11, color: C.muted, marginBottom: 18 }}>Colors: {item.colors.join(", ")}</p>

        {/* Size selector */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
            Select Size {selectedSize && <span style={{ color: C.primary, letterSpacing: 0, textTransform: "none", fontWeight: 700 }}>— {selectedSize}</span>}
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {item.sizes.map(s => (
              <button key={s} onClick={() => setSelectedSize(s)} style={{
                width: 40, height: 40, borderRadius: 6, cursor: "pointer",
                border: `1.5px solid ${selectedSize === s ? C.primary : C.border}`,
                background: selectedSize === s ? "#EFF6FF" : C.white,
                color: selectedSize === s ? C.primary : C.textSub,
                fontSize: 12, fontWeight: 700, transition: "all 0.15s",
              }}>{s}</button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{item.sizeNote}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 22, color: C.text }}>{fmt(item.price)}</span>
            <span style={{ fontSize: 12, color: C.muted, textDecoration: "line-through", marginLeft: 7 }}>{fmt(item.originalPrice)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onView(item)} style={{
            flex: 1, padding: "11px", borderRadius: 8, cursor: "pointer",
            background: "none", border: `1px solid ${C.border}`, color: C.textSub, fontSize: 13, fontWeight: 600, transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
          >Details</button>
          <button onClick={handleAdd} style={{
            flex: 2, padding: "11px", borderRadius: 8, cursor: "pointer",
            background: selectedSize ? C.primary : "#E5E7EB",
            border: "none", color: selectedSize ? C.white : C.muted,
            fontSize: 13, fontWeight: 700, transition: "all 0.18s",
          }}
            onMouseEnter={e => { if (selectedSize) e.currentTarget.style.background = C.primaryHover; }}
            onMouseLeave={e => { if (selectedSize) e.currentTarget.style.background = C.primary; }}
          >{selectedSize ? "Add to Cart" : "Pick a size"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Size Guide Modal ──────────────────────────────────────────
function SizeGuide({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, maxWidth: 520, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ fontWeight: 700, fontSize: 20, color: C.text }}>Size Guide</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>&#10005;</button>
        </div>
        <p style={{ fontSize: 12, color: C.muted, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>Scrubs & Apron Sizing (cm)</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: `1px solid ${C.border}` }}>
              {["Size", "Chest", "Waist", "Hip", "Height"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: C.primary, fontWeight: 700, fontSize: 11, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["XS", "78–82", "60–64", "84–88", "155–160"],
              ["S", "84–88", "66–70", "90–94", "160–165"],
              ["M", "90–94", "72–76", "96–100", "165–170"],
              ["L", "96–100", "78–82", "102–106", "170–175"],
              ["XL", "102–106", "84–88", "108–112", "175–180"],
              ["XXL", "108–114", "90–94", "114–120", "180+"],
            ].map(([s, ...vals], ri) => (
              <tr key={s} style={{ background: ri % 2 === 0 ? C.white : "#F9FAFB", borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: C.primary }}>{s}</td>
                {vals.map((v, i) => <td key={i} style={{ padding: "10px 12px", color: C.textSub }}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 11, color: C.muted, marginTop: 14 }}>* Scrubs have a relaxed clinical fit. Aprons available in S–XL only.</p>
      </div>
    </div>
  );
}

// ── BPT Book Catalogue Data ───────────────────────────────────
const BOOKS_DATA = [
  {
    year: "1st Year", icon: "🩺", color: "#0057A8", bg: "#EBF5FF",
    subjects: [
      {
        name: "Anatomy", books: [
          { num: 1, authors: "Ross & Wilson", title: "Anatomy and Physiology in Health and Illness", publisher: "Elsevier" },
          { num: 2, authors: "Gray H.", title: "Gray's Anatomy", publisher: "Churchill Livingstone" },
        ]
      },
      {
        name: "Physiology", books: [
          { num: 3, authors: "Guyton A.C. & Hall J.E.", title: "Textbook of Medical Physiology", publisher: "Elsevier" },
          { num: 4, authors: "Sembulingam K.", title: "Essentials of Medical Physiology", publisher: "Jaypee" },
        ]
      },
      {
        name: "Psychology", books: [
          { num: 5, authors: "Mangal S.K.", title: "General Psychology", publisher: "" },
        ]
      },
      {
        name: "Sociology", books: [
          { num: 6, authors: "Sachdeva D.R. & Bhushan V.", title: "An Introduction to Sociology", publisher: "" },
        ]
      },
    ],
  },
  {
    year: "2nd Year", icon: "⚙️", color: "#00875A", bg: "#F0FFF4",
    subjects: [
      {
        name: "Pathology & Microbiology", books: [
          { num: 7, authors: "Mohan H.", title: "Textbook of Pathology", publisher: "Jaypee" },
        ]
      },
      {
        name: "Exercise Therapy", books: [
          { num: 8, authors: "Gardiner D.", title: "Principles of Exercise Therapy", publisher: "CBS Publishers" },
        ]
      },
      {
        name: "Biomechanics", books: [
          { num: 9, authors: "Norkin C.C. & Levangie P.K.", title: "Joint Structure and Function", publisher: "F.A. Davis" },
        ]
      },
      {
        name: "Pharmacology & Biochemistry", books: [
          { num: 10, authors: "Tripathi K.D.", title: "Essentials of Medical Pharmacology", publisher: "Jaypee" },
        ]
      },
    ],
  },
  {
    year: "3rd Year", icon: "⚡", color: "#B7791F", bg: "#FFFFF0",
    subjects: [
      {
        name: "Electrotherapy", books: [
          { num: 11, authors: "Robertson V.", title: "Electrotherapy Explained: Principles and Practice", publisher: "Elsevier" },
        ]
      },
      {
        name: "General Medicine & Surgery", books: [
          { num: 12, authors: "Davidson's", title: "Principles and Practice of Medicine", publisher: "Elsevier" },
        ]
      },
      {
        name: "Orthopaedics", books: [
          { num: 13, authors: "Maheshwari J.", title: "Essential Orthopaedics", publisher: "Jaypee" },
        ]
      },
      {
        name: "Neurology", books: [
          { num: 14, authors: "Bickerstaff E.R.", title: "Neurological Examination in Clinical Practice", publisher: "" },
        ]
      },
    ],
  },
  {
    year: "Final Year", icon: "🧠", color: "#6B21A8", bg: "#FAF5FF",
    subjects: [
      {
        name: "Physiotherapy in Orthopaedics", books: [
          { num: 15, authors: "Brotzman S.B.", title: "Clinical Orthopaedic Rehabilitation", publisher: "Elsevier" },
        ]
      },
      {
        name: "Physiotherapy in Neurology", books: [
          { num: 16, authors: "Umphred D.A.", title: "Neurological Rehabilitation", publisher: "Mosby" },
        ]
      },
      {
        name: "Cardio-Respiratory Physiotherapy", books: [
          { num: 17, authors: "Pryor J.A. & Prasad S.A.", title: "Physiotherapy for Respiratory and Cardiac Problems", publisher: "" },
        ]
      },
      {
        name: "Therapeutic Exercise", books: [
          { num: 18, authors: "Kisner C. & Colby L.", title: "Therapeutic Exercise: Foundations and Techniques", publisher: "F.A. Davis" },
        ]
      },
      {
        name: "Rehabilitation & Community Medicine", books: [
          { num: 19, authors: "Park K.", title: "Preventive and Social Medicine", publisher: "" },
        ]
      },
    ],
  },
];

// ── BPT Book Catalogue Section ────────────────────────────────
function BooksSection() {
  const [activeYear, setActiveYear] = useState("1st Year");
  const active = BOOKS_DATA.find(y => y.year === activeYear);

  return (
    <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "64px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EBF5FF", borderRadius: 100, padding: "4px 14px", marginBottom: 12 }}>
              <span style={{ fontSize: 13 }}>📚</span>
              <span style={{ fontSize: 11, color: C.primary, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" }}>Reference Library</span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "clamp(22px,3.5vw,36px)", color: C.text, letterSpacing: "-0.5px" }}>
              BPT Textbook Catalogue
            </h2>
            <p style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>Year-wise recommended textbooks for the BPT curriculum</p>
          </div>
        </div>

        {/* Year tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 32, overflowX: "auto", paddingBottom: 2 }}>
          {BOOKS_DATA.map(y => (
            <button key={y.year} onClick={() => setActiveYear(y.year)} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 12, cursor: "pointer", whiteSpace: "nowrap",
              background: activeYear === y.year ? y.color : C.white,
              color: activeYear === y.year ? "#fff" : C.textSub,
              border: `1.5px solid ${activeYear === y.year ? y.color : C.border}`,
              fontSize: 13, fontWeight: 700, transition: "all 0.18s",
              boxShadow: activeYear === y.year ? `0 4px 14px ${y.color}40` : C.shadow,
            }}>
              <span>{y.icon}</span> {y.year}
            </button>
          ))}
        </div>

        {/* Year header pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: active.bg, border: `1.5px solid ${active.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            {active.icon}
          </div>
          <div>
            <p style={{ fontSize: 11, color: active.color, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>BPT — {active.year}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{active.subjects.reduce((n, s) => n + s.books.length, 0)} prescribed textbooks</p>
          </div>
        </div>

        {/* Subjects + Books grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {active.subjects.map(subject => (
            <div key={subject.name} style={{
              background: C.white, borderRadius: 14, border: `1.5px solid ${C.border}`,
              overflow: "hidden", boxShadow: C.shadow,
            }}>
              {/* Subject header */}
              <div style={{ padding: "12px 18px", background: active.bg, borderBottom: `1px solid ${active.color}20` }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: active.color, letterSpacing: 1.5, textTransform: "uppercase" }}>{subject.name}</p>
              </div>
              {/* Books */}
              <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                {subject.books.map(book => (
                  <div key={book.num} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                      background: active.bg, color: active.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, border: `1px solid ${active.color}30`,
                    }}>{book.num}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.35, marginBottom: 2 }}>{book.title}</p>
                      <p style={{ fontSize: 11, color: C.muted }}>{book.authors}{book.publisher ? ` · ${book.publisher}` : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ fontSize: 12, color: C.muted, marginTop: 20, textAlign: "center" }}>
          📖 These are the standard BPT curriculum references. Available at your college library and major online bookstores.
        </p>
      </div>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────────────
function HomePage({ onView, onAddToCart, searchQuery }) {
  const [tab, setTab] = useState("kits");
  const [localQuery, setLocalQuery] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const scrollToShop = () => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });

  // Global search from navbar overrides local
  const activeQ = (searchQuery || localQuery).trim().toLowerCase();

  // If global search has query, show items tab
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0) setTab("items");
  }, [searchQuery]);

  const filteredItems = activeQ
    ? ITEMS.filter(p => p.name.toLowerCase().includes(activeQ) || p.tagline.toLowerCase().includes(activeQ) || p.badge.toLowerCase().includes(activeQ))
    : ITEMS;

  return (
    <div>
      <HeroSection onShop={scrollToShop} />

      {/* Shop section */}
      <div id="shop" style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 5% 90px" }}>
        <div style={{ marginBottom: 36, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EBF5FF", borderRadius: 100, padding: "4px 14px", marginBottom: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, display: "block" }} />
              <span style={{ fontSize: 11, color: C.primary, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" }}>SRM Campus Store</span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "clamp(26px,4vw,42px)", color: C.text, lineHeight: 1.08, letterSpacing: "-0.5px" }}>
              Shop <span style={{ color: C.primary }}>MedVault</span>
            </h2>
          </div>
          <a href={`https://wa.me/918248613274?text=${encodeURIComponent("Hi, I want to place an order")}`} target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "#25D366", color: C.white,
            padding: "11px 22px", borderRadius: 10, textDecoration: "none",
            fontSize: 13, fontWeight: 700, boxShadow: "0 4px 12px rgba(37,211,102,0.35)",
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <span style={{ fontSize: 15 }}>💬</span> Order on WhatsApp
          </a>
        </div>

        <TabNav active={tab} onChange={setTab} />

        {/* Kits tab */}
        {tab === "kits" && (
          <div className="kits-grid" style={{ animation: "fadeUp 0.35s ease both" }}>
            {KITS.map(k => <KitCard key={k.id} kit={k} onView={onView} onAddToCart={onAddToCart} />)}
          </div>
        )}

        {/* Individual items tab */}
        {tab === "items" && (
          <div style={{ animation: "fadeUp 0.35s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
              <p style={{ fontSize: 14, color: C.muted }}>{filteredItems.length} items available</p>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 13 }}>&#128269;</span>
                <input type="text" placeholder="Filter items..." value={localQuery} onChange={e => setLocalQuery(e.target.value)} style={{
                  padding: "9px 13px 9px 33px", background: C.white, border: `1px solid ${C.border}`,
                  borderRadius: 8, color: C.text, fontSize: 13, outline: "none", width: 200,
                  boxShadow: C.shadow,
                }}
                  onFocus={e => e.target.style.borderColor = C.primary}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>
            </div>

            {/* Price list table */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 36, boxShadow: C.shadow }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: "#F9FAFB", display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: 11, color: C.primary, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>Item</p>
                <div style={{ display: "flex", gap: 56 }}>
                  <p style={{ fontSize: 11, color: C.primary, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>Price</p>
                  <p style={{ fontSize: 11, color: C.primary, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>MRP</p>
                </div>
              </div>
              {filteredItems.map((item, i) => (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 20px", cursor: "pointer",
                  background: i % 2 === 0 ? C.white : "#FAFAFA",
                  borderBottom: i < filteredItems.length - 1 ? `1px solid ${C.border}` : "none",
                  transition: "background 0.12s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#EFF6FF"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? C.white : "#FAFAFA"}
                  onClick={() => onView(item)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#F3F4F6" }}>
                      <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.name}</p>
                      <p style={{ fontSize: 11, color: C.muted }}>{item.tagline}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 56, alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.primary, minWidth: 56, textAlign: "right" }}>{fmt(item.price)}</span>
                    <span style={{ fontSize: 13, color: C.muted, textDecoration: "line-through", minWidth: 56, textAlign: "right" }}>{fmt(item.originalPrice)}</span>
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} style={{
                      background: C.primary, border: "none", color: C.white,
                      borderRadius: 7, padding: "7px 14px", cursor: "pointer",
                      fontSize: 12, fontWeight: 700, transition: "background 0.18s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = C.primaryHover}
                      onMouseLeave={e => e.currentTarget.style.background = C.primary}
                    >Add</button>
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
          <div style={{ animation: "fadeUp 0.35s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 14, color: C.muted, maxWidth: 480 }}>Select your size directly on the card. Use the size guide if needed.</p>
              <button onClick={() => setShowSizeGuide(true)} style={{
                background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
                padding: "9px 18px", cursor: "pointer", color: C.primary, fontSize: 13, fontWeight: 600, boxShadow: C.shadow,
                transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = "#EFF6FF"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.white; }}
              >Size Guide</button>
            </div>
            <div className="apparel-grid">
              {APPAREL.map(item => <ApparelCard key={item.id} item={item} onView={onView} onAddToCart={onAddToCart} />)}
            </div>
          </div>
        )}

        {/* Books tab */}
        {tab === "books" && (
          <div style={{ animation: "fadeUp 0.35s ease both" }}>
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>Year-wise BPT textbooks — add directly to cart and we'll deliver to your SRM hostel.</p>
              {/* Year filter pills */}
              <BookYearFilter items={BOOK_ITEMS} onView={onView} onAddToCart={onAddToCart} />
            </div>
          </div>
        )}
      </div>

      {/* BPT Book Catalogue */}
      <BooksSection />

      {/* Find Us */}
      <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: "64px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EBF5FF", borderRadius: 100, padding: "4px 14px", marginBottom: 12 }}>
              <span style={{ fontSize: 13 }}>📍</span>
              <span style={{ fontSize: 11, color: C.primary, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" }}>Find Us</span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "clamp(22px,3.5vw,36px)", color: C.text, letterSpacing: "-0.5px" }}>Visit Our Store</h2>
          </div>

          <div className="location-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }}>
            {/* Map */}
            <div style={{ borderRadius: 18, overflow: "hidden", border: `1.5px solid ${C.border}`, boxShadow: C.shadow, minHeight: 360 }}>
              <iframe
                title="MedVault Store Location"
                src="https://maps.google.com/maps?q=12.8510693,80.0681062&z=16&output=embed"
                width="100%"
                height="380"
                style={{ border: 0, display: "block" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Info panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Address card */}
              <div style={{ background: C.bg, borderRadius: 14, padding: "22px 24px", border: `1.5px solid ${C.border}` }}>
                <p style={{ fontSize: 11, color: C.primary, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Address</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>Medvault Enterprises</p>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.65 }}>
                  Mahalakshmi Nagar Main Road<br />
                  Chennai, Tamil Nadu<br />
                  India
                </p>
              </div>

              {/* Contact card */}
              <div style={{ background: C.bg, borderRadius: 14, padding: "22px 24px", border: `1.5px solid ${C.border}` }}>
                <p style={{ fontSize: 11, color: C.primary, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Contact</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="https://wa.me/918248613274" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: "#25D36615", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>💬</span>
                    <div>
                      <p style={{ fontSize: 12, color: C.muted, marginBottom: 1 }}>WhatsApp Orders</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#25D366" }}>+91 82486 13274</p>
                    </div>
                  </a>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: "#EBF5FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🕐</span>
                    <div>
                      <p style={{ fontSize: 12, color: C.muted, marginBottom: 1 }}>Delivery Hours</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Mon – Sat, 9am – 7pm</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: "#F0FFF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🚚</span>
                    <div>
                      <p style={{ fontSize: 12, color: C.muted, marginBottom: 1 }}>Delivery</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.text }}>SRM Campus · 48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Directions CTA */}
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=12.8510693,80.0681062"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`,
                  color: C.white, padding: "14px", borderRadius: 12,
                  textDecoration: "none", fontWeight: 700, fontSize: 14,
                  boxShadow: "0 4px 14px rgba(0,87,168,0.3)", transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <span style={{ fontSize: 16 }}>📍</span> Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mission / Footer */}
      <div style={{ background: "linear-gradient(160deg, #0A1628 0%, #0D2D5A 100%)", padding: "64px 5% 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div className="mission-grid" style={{ marginBottom: 48 }}>
            <div>
              <p style={{ fontSize: 10, color: "rgba(100,180,255,0.7)", letterSpacing: 3, fontWeight: 700, marginBottom: 14, textTransform: "uppercase" }}>Our Mission</p>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "rgba(255,255,255,0.7)", maxWidth: 440 }}>Support BPT students and physiotherapy professionals with thoughtfully curated medical essentials that improve learning, build confidence, and support strong clinical practice.</p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "rgba(100,180,255,0.7)", letterSpacing: 3, fontWeight: 700, marginBottom: 14, textTransform: "uppercase" }}>Our Vision</p>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "rgba(255,255,255,0.7)", maxWidth: 440 }}>Be the most trusted on-campus medical store at SRM — known for premium quality, honest pricing, and understanding what a physio student truly needs.</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>© 2025 MedVault · SRM Campus, Chennai</span>
            <a href={`https://wa.me/918248613274`} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "rgba(100,200,120,0.8)", textDecoration: "none", fontWeight: 600 }}>
              💬 +91 82486 13274
            </a>
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
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 5% 80px", animation: "fadeUp 0.5s ease both" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}>
          &#8592; Back
        </button>

        <div className="detail-grid">
          {/* Left — image gallery */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2, display: "flex", gap: 8 }}>
              <span style={{ background: "#EFF6FF", border: `1px solid #BFDBFE`, color: C.primary, borderRadius: 100, padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>{product.badge}</span>
              <span style={{ background: C.deal, color: C.white, borderRadius: 100, padding: "5px 14px", fontSize: 10, fontWeight: 700 }}>-{pct}% OFF</span>
            </div>
            <ImageGallery images={product.images} name={product.name} height={420} />
          </div>

          {/* Right */}
          <div>
            <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>{product.tagline}</p>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(26px,4vw,40px)", color: C.text, lineHeight: 1.1, marginBottom: 16 }}>{product.name}</h1>
            <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.75, marginBottom: 28 }}>{product.desc}</p>

            {/* Price box */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28, padding: "18px 20px", background: "#EFF6FF", borderRadius: 12, border: `1px solid #BFDBFE` }}>
              <span style={{ fontWeight: 800, fontSize: 40, color: C.primary }}>{fmt(product.price)}</span>
              <span style={{ fontSize: 16, color: C.muted, textDecoration: "line-through" }}>{fmt(product.originalPrice)}</span>
              <span style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>Save {fmt(product.originalPrice - product.price)}</span>
            </div>

            {/* Kit items */}
            {isKit && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Kit includes</p>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                  {product.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", background: i % 2 === 0 ? C.white : "#F9FAFB", borderBottom: i < product.items.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.primary, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: C.text }}>{item.name}</span>
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
                <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Features</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {product.features.map(f => (
                    <span key={f} style={{ background: "#F0FDF4", border: `1px solid #BBF7D0`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: C.accent, fontWeight: 500 }}>&#10003; {f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector for apparel */}
            {isApparel && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Select Size {selectedSize && <span style={{ color: C.primary, textTransform: "none", letterSpacing: 0 }}>— {selectedSize}</span>}</p>
                  <button onClick={() => setShowSizeGuide(true)} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 12, fontWeight: 600 }}>Size Guide &#8594;</button>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} style={{
                      width: 50, height: 50, borderRadius: 8, cursor: "pointer",
                      border: `1.5px solid ${selectedSize === s ? C.primary : C.border}`,
                      background: selectedSize === s ? "#EFF6FF" : C.white,
                      color: selectedSize === s ? C.primary : C.textSub,
                      fontSize: 13, fontWeight: 700, transition: "all 0.15s",
                    }}>{s}</button>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>{product.sizeNote}</p>
              </div>
            )}

            {/* Qty + CTA */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", background: C.white }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "#F9FAFB", border: "none", color: C.text, width: 44, height: 50, cursor: "pointer", fontSize: 18, fontWeight: 600 }}>&#8722;</button>
                <span style={{ width: 44, textAlign: "center", fontSize: 15, fontWeight: 700, color: C.text }}>{qty}</span>
                <button onClick={() => setQty(Math.min(10, qty + 1))} style={{ background: "#F9FAFB", border: "none", color: C.text, width: 44, height: 50, cursor: "pointer", fontSize: 18, fontWeight: 600 }}>+</button>
              </div>
              <button onClick={handleAdd} style={{
                flex: 1, padding: "15px 24px", borderRadius: 10, border: "none",
                background: added ? C.accent : C.primary,
                color: C.white, cursor: "pointer", fontWeight: 700, fontSize: 15,
                transition: "all 0.25s", boxShadow: "0 4px 12px rgba(29,78,216,0.25)",
              }}
                onMouseEnter={e => { if (!added) e.currentTarget.style.background = C.primaryHover; }}
                onMouseLeave={e => { if (!added) e.currentTarget.style.background = C.primary; }}
              >{added ? "&#10003; Added!" : "Add to Cart"}</button>
            </div>

            <p style={{ marginTop: 12, fontSize: 12, color: C.muted }}>
              <span style={{ color: C.accent }}>&#9679;</span> {product.stock} in stock &middot; Fast dispatch from SRM campus
            </p>
          </div>
        </div>
        {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
      </div>
    </div>
  );
}

// ── Cart ──────────────────────────────────────────────────────
function CartPage({ cart, onRemove, onQty, onCheckout, onBack }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal >= 2000 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, padding: "120px 5%" }}>
      <div style={{ fontSize: 64 }}>&#128722;</div>
      <h2 style={{ fontWeight: 800, fontSize: 32, color: C.text }}>Your cart is empty</h2>
      <p style={{ color: C.muted, fontSize: 15 }}>Add some products to get started</p>
      <button onClick={onBack} style={{ background: C.primary, color: C.white, border: "none", padding: "13px 30px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 12px rgba(29,78,216,0.3)" }}>Browse Products</button>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 5% 80px", animation: "fadeUp 0.4s ease" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 13, fontWeight: 600, marginBottom: 36, display: "flex", alignItems: "center", gap: 8 }}>&#8592; Continue Shopping</button>
        <h1 style={{ fontWeight: 800, fontSize: 36, color: C.text, marginBottom: 32 }}>
          Your Cart
        </h1>

        <div className="cart-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedSize || ""}`} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, display: "flex", gap: 16, alignItems: "center", boxShadow: C.shadow }}>
                <div style={{ width: 64, height: 64, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                  {isUrl(item.img) ? <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (item.images ? <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <span style={{ fontSize: 26 }}>&#128230;</span>)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.primary, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>{item.tagline}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 2 }}>{item.name}</div>
                  {item.selectedSize && <div style={{ fontSize: 12, color: C.muted }}>Size: {item.selectedSize}</div>}
                  <div style={{ color: C.primary, fontWeight: 700, fontSize: 16, marginTop: 4 }}>{fmt(item.price)}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                    <button onClick={() => onQty(item.id, item.quantity - 1, item.selectedSize)} style={{ background: "#F9FAFB", border: "none", color: C.text, width: 34, height: 34, cursor: "pointer", fontWeight: 700 }}>&#8722;</button>
                    <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontSize: 14, color: C.text }}>{item.quantity}</span>
                    <button onClick={() => onQty(item.id, item.quantity + 1, item.selectedSize)} style={{ background: "#F9FAFB", border: "none", color: C.text, width: 34, height: 34, cursor: "pointer", fontWeight: 700 }}>+</button>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{fmt(item.price * item.quantity)}</div>
                  <button onClick={() => onRemove(item.id, item.selectedSize)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, height: "fit-content", position: "sticky", top: 80, boxShadow: C.shadow }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: C.muted }}>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{fmt(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: C.muted }}>Shipping</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: shipping === 0 ? C.accent : C.text }}>{shipping === 0 ? "FREE" : fmt(shipping)}</span>
              </div>
              {shipping > 0 && <p style={{ fontSize: 11, color: C.muted }}>Free shipping on orders above &#8377;2,000</p>}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 26, color: C.primary }}>{fmt(total)}</span>
            </div>
            <button onClick={onCheckout} style={{
              width: "100%", padding: "15px", borderRadius: 10, border: "none",
              background: C.primary, color: C.white, cursor: "pointer",
              fontWeight: 800, fontSize: 15, letterSpacing: 0.5,
              boxShadow: "0 4px 12px rgba(29,78,216,0.3)", transition: "background 0.18s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = C.primaryHover}
              onMouseLeave={e => e.currentTarget.style.background = C.primary}
            >Order on WhatsApp &#8594;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Checkout ──────────────────────────────────────────────────
function FormField({ label, field, type = "text", placeholder, half, errors, form, setForm, setErrors }) {
  return (
    <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
      <label style={{ display: "block", fontSize: 11, color: errors[field] ? "#EF4444" : C.muted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 7 }}>
        {label} {errors[field] && <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>— {errors[field]}</span>}
      </label>
      <input
        type={type} value={form[field]} placeholder={placeholder}
        onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: null })); }}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 8, fontSize: 14,
          background: C.white, border: `1px solid ${errors[field] ? "#FCA5A5" : C.border}`,
          color: C.text, outline: "none", transition: "border-color 0.18s",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
        onFocus={e => e.target.style.borderColor = C.primary}
        onBlur={e => e.target.style.borderColor = errors[field] ? "#FCA5A5" : C.border}
      />
    </div>
  );
}

const STATES = ["Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Telangana", "Andhra Pradesh", "Kerala", "Gujarat", "Rajasthan", "Uttar Pradesh"];

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
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 5% 80px", animation: "fadeUp 0.4s ease" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 13, fontWeight: 600, marginBottom: 36, display: "flex", alignItems: "center", gap: 8 }}>&#8592; Back to Cart</button>
        <h1 style={{ fontWeight: 800, fontSize: 36, color: C.text, marginBottom: 32 }}>Checkout</h1>

        <div className="checkout-grid">
          <div>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 26, marginBottom: 18, boxShadow: C.shadow }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 20 }}>Delivery Details</h3>
              <div className="form-grid">
                <FormField label="Full Name" field="name" placeholder="Dr. Arjun Sharma" errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
                <FormField label="Email" field="email" type="email" placeholder="you@email.com" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
                <FormField label="Phone" field="phone" type="tel" placeholder="9876543210" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
                <FormField label="Address" field="address" placeholder="Hostel / Campus Address" errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
                <FormField label="City" field="city" placeholder="Chennai" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
                <FormField label="PIN Code" field="pincode" placeholder="600003" half errors={errors} form={form} setForm={setForm} setErrors={setErrors} />
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 7 }}>State</label>
                  <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={{ width: "100%", padding: "12px 14px", borderRadius: 8, fontSize: 14, background: C.white, border: `1px solid ${C.border}`, color: C.text, outline: "none" }}>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ background: "#F0FDF4", border: `1px solid #BBF7D0`, borderRadius: 12, padding: 18, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24 }}>&#128172;</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>Order via WhatsApp</div>
                <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>Your full order will be sent to our WhatsApp. We'll confirm and arrange campus delivery.</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  {["WhatsApp", "Cash on Delivery", "UPI on Confirmation"].map(m => (
                    <span key={m} style={{ background: C.white, border: `1px solid #BBF7D0`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: C.accent }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, boxShadow: C.shadow }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 18 }}>Order Review</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedSize || ""}`} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#F3F4F6" }}>
                    {item.images ? <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <span style={{ fontSize: 18 }}>&#128230;</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.2 }}>{item.name}</div>
                    {item.selectedSize && <div style={{ fontSize: 11, color: C.muted }}>Size: {item.selectedSize}</div>}
                    <div style={{ fontSize: 12, color: C.muted }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: C.primary, fontSize: 14 }}>{fmt(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: C.muted }}>Subtotal</span>
                <span style={{ fontSize: 14, color: C.text }}>{fmt(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: C.muted }}>Shipping</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: shipping === 0 ? C.accent : C.text }}>{shipping === 0 ? "FREE" : fmt(shipping)}</span>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 26, color: C.primary }}>{fmt(total)}</span>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={paying} style={{
              width: "100%", padding: "15px", borderRadius: 10, border: "none",
              background: paying ? "#93C5FD" : C.primary, color: C.white,
              cursor: paying ? "not-allowed" : "pointer", fontWeight: 800, fontSize: 14,
              letterSpacing: 0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.25s", boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
            }}>
              {paying ? (<><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: C.white, borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Processing...</>) : `Order on WhatsApp — ${fmt(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confirmation ──────────────────────────────────────────────
function ConfirmationPage({ order, onHome }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 5%" }}>
      <div style={{ maxWidth: 480, width: "100%", background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 40, animation: "fadeUp 0.6s ease both", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
        <div style={{ width: 64, height: 64, background: "#F0FDF4", border: `1px solid #BBF7D0`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 24px", color: C.accent }}>&#10003;</div>
        <h2 style={{ fontWeight: 800, fontSize: 28, color: C.text, marginBottom: 8 }}>Order Placed!</h2>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 32, lineHeight: 1.65 }}>Your order has been sent to our WhatsApp. We'll confirm and arrange delivery shortly.</p>

        <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "left", border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: C.muted }}>Order ID</span>
            <span style={{ fontWeight: 700, color: C.primary, fontSize: 13 }}>{order.orderId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: C.muted }}>Total</span>
            <span style={{ fontWeight: 800, color: C.primary, fontSize: 20 }}>{fmt(order.total)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: C.muted }}>Delivery to</span>
            <span style={{ fontSize: 13, textAlign: "right", maxWidth: "55%", color: C.text }}>{order.address}</span>
          </div>
        </div>

        <button onClick={onHome} style={{
          width: "100%", padding: "14px", borderRadius: 10, border: "none",
          background: C.primary, color: C.white, cursor: "pointer",
          fontWeight: 700, fontSize: 15, boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
          transition: "background 0.18s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = C.primaryHover}
          onMouseLeave={e => e.currentTarget.style.background = C.primary}
        >Continue Shopping</button>
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────
function Toast({ msg, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: `translateX(-50%) translateY(${visible ? "0" : "100px"})`,
      zIndex: 9999, background: C.header, border: `1px solid rgba(255,255,255,0.12)`,
      borderRadius: 12, padding: "12px 22px",
      display: "flex", alignItems: "center", gap: 10,
      opacity: visible ? 1 : 0, transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)", whiteSpace: "nowrap",
    }}>
      <span style={{ color: C.accent, fontSize: 14 }}>&#10003;</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{msg}</span>
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
  const [navSearch, setNavSearch] = useState("");

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
  const goHome = () => { setPage("home"); setSelectedProduct(null); setNavSearch(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goDetail = (p) => { setSelectedProduct(p); setPage("detail"); window.scrollTo({ top: 0 }); };
  const goCart = () => { setPage("cart"); window.scrollTo({ top: 0 }); };
  const goCheckout = () => { setPage("checkout"); window.scrollTo({ top: 0 }); };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: C.bg }}>
        {page !== "confirmation" && (
          <Navbar
            cartCount={cartCount}
            onCart={goCart}
            onHome={goHome}
            searchQuery={navSearch}
            onSearchChange={val => { setNavSearch(val); if (page !== "home") goHome(); }}
          />
        )}
        {page === "home" && <HomePage onView={goDetail} onAddToCart={addToCart} searchQuery={navSearch} />}
        {page === "detail" && selectedProduct && <ProductDetailPage product={selectedProduct} onBack={goHome} onAddToCart={addToCart} />}
        {page === "cart" && <CartPage cart={cart} onRemove={removeFromCart} onQty={updateQty} onCheckout={goCheckout} onBack={goHome} />}
        {page === "checkout" && <CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} onBack={goCart} />}
        {page === "confirmation" && order && <ConfirmationPage order={order} onHome={goHome} />}
        <Toast msg={toast.msg} visible={toast.visible} />
      </div>
    </>
  );
}
