"use client";
import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#F4F6F9",
  white: "#FFFFFF",
  header: "#0D1B2A",
  headerBorder: "#1A3350",
  primary: "#1D4ED8",
  primaryHover: "#1E40AF",
  accent: "#16A34A",
  deal: "#DC2626",
  dealBg: "#FEF2F2",
  gold: "#D97706",
  goldBg: "#FFFBEB",
  text: "#111827",
  textSub: "#374151",
  muted: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",
  shadow: "0 1px 3px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
  shadowHover: "0 4px 20px rgba(0,0,0,0.12)",
  strip: "#1B3A6B",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;background:#F4F6F9;color:#111827;min-height:100vh;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:#F4F6F9;}
  ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
  @keyframes cartBounce{0%,100%{transform:scale(1);}50%{transform:scale(1.25);}}
  @keyframes float3d{0%,100%{transform:perspective(900px) rotateY(-8deg) rotateX(3deg) translateY(0);}50%{transform:perspective(900px) rotateY(-8deg) rotateX(3deg) translateY(-12px);}}

  .hero-row{display:flex;align-items:center;justify-content:space-between;gap:48px;}
  .hero-img{flex:0 0 auto;display:flex;align-items:center;justify-content:center;}
  .kits-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
  .items-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;}
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
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pollinations image helpers ────────────────────────────────
const P = (prompt, seed = 42, model = "flux") =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ", product photography, professional, high quality, 4k")}?width=700&height=500&nologo=true&seed=${seed}&model=${model}`;
const F  = (p, s = 42)  => P(p, s, "flux");
const FR = (p, s = 100) => P(p, s, "flux-realism");
const T  = (p, s = 200) => P(p, s, "turbo");

const IMG = {
  kit1: [
    "/kit.jpg",
    F("physiotherapy complete BPT kit contents: goniometer, stethoscope, knee hammer, tuning fork, pen torch, yoga mat, resistance band laid out professionally on white background", 10),
    FR("medvault physio student kit all instruments neatly arranged flat lay: goniometer stethoscope reflex hammer penlight tuning fork resistance band", 20),
    T("BPT first year physiotherapy starter kit 10 instruments neatly arranged flat lay white background professional product photography", 30),
    F("physiotherapy curated bundle complete kit goniometer stethoscope reflex hammer tuning fork yoga mat resistance band vaseline notes", 40),
    FR("navy blue open physio case showing goniometer tuning fork reflex hammer pen torch stethoscope resistance band measuring tape", 50),
    T("clinical physiotherapy instruments flat lay dark background premium product shot goniometer hammer tuning fork torch stethoscope", 60),
  ],
  kit2: [
    F("flat lay: goniometer, taylor reflex hammer, 128hz tuning fork, flexible measuring tape, LED medical pen torch arranged neatly on white background, physiotherapy practical exam kit 5 instruments"),
    FR("five core physiotherapy exam instruments goniometer knee hammer tuning fork inch tape pen torch minimal clean product photography", 11),
    T("physiotherapy practical examination essential tools kit compact 5 piece goniometer reflex hammer tuning fork penlight tape", 21),
    F("BPT practical exam kit 5 instruments laid out top view white background professional", 31),
    FR("clinical physio exam tools compact lightweight kit five instruments packed neatly", 41),
    T("physiotherapy practical exam instruments arranged in row white background clean minimal product shot", 51),
    F("goniometer reflex hammer tuning fork inch tape penlight five piece kit flat lay studio lighting", 61),
  ],
  kit3: [
    F("flat lay: A5 notepad, pen set, markers, USB drive, sanitizer sachets, face masks arranged on clean white background, smart study kit stationery"),
    FR("student study kit notepad pens markers USB drive sanitizer masks on white background minimal clean", 12),
    T("smart study kit: spiral notepad, ballpoint pens, whiteboard markers, USB flash drive, sanitizer sachets, disposable masks flat lay", 22),
    F("study stationery kit notepad pens markers USB sanitizer masks product photography", 32),
    FR("student essentials study kit notepad pen set markers USB drive medical accessories flat lay", 42),
    T("study smart kit stationery supplies notepad pens markers USB sanitizer masks top view white", 52),
    F("medical student study essentials flat lay: notepad pens markers USB sanitizer masks clean background", 62),
  ],
  goniometer: [
    F("medical goniometer set 3 pieces joint angle measurement tool silver metal physiotherapy instrument white background"),
    FR("goniometer protractor medical device measuring joint range of motion close up", 13),
    T("physiotherapy goniometer 360 degree angle measurement instrument clean product shot", 23),
    F("three piece goniometer set large medium small finger physiotherapy laid out", 33),
    FR("doctor using goniometer to measure knee joint angle patient clinical", 43),
    T("silver metal goniometer set physiotherapy clinical assessment tool on white", 53),
    F("goniometer measurement tool set with ruler scale physiotherapy instrument", 63),
  ],
  hammer: [
    F("Taylor percussion reflex hammer medical triangular rubber head chrome handle neurological examination tool white background"),
    FR("knee reflex hammer medical instrument triangular rubber head close up chrome", 14),
    T("neurological reflex hammer Taylor percussion hammer chrome silver product shot", 24),
    F("doctor using reflex hammer on patient knee patellar reflex test clinical", 34),
    FR("medical reflex hammer stainless steel handle rubber head isolated white background", 44),
    T("Taylor hammer triangular rubber tip neurology diagnostic tool close up", 54),
    F("reflex percussion hammer chrome finish medical grade clean minimal", 64),
  ],
  tuningfork: [
    F("medical tuning fork 128 Hz aluminium alloy silver vibration testing neurological examination instrument white background"),
    FR("128Hz medical tuning fork aluminium close up vibration sense test product shot", 15),
    T("doctor holding tuning fork neurological exam Rinne Weber test clinical", 25),
    F("silver aluminium medical tuning fork on white background clean product photography", 35),
    FR("tuning fork 128Hz vibration neurological physiotherapy diagnostic instrument", 45),
    T("medical grade tuning fork frequency stamped aluminium handle close up", 55),
    F("tuning fork on white surface shadows minimal medical product photography", 65),
  ],
  tape: [
    F("flexible measuring tape 150cm medical inch tape body measurement physiotherapy white background"),
    FR("measuring tape rolled up centimeter markings medical measurement close up", 16),
    T("physiotherapy body measurement tape 60 inch flexible extended product shot", 26),
    F("medical measuring tape limb circumference measurement tool white background", 36),
    FR("inch tape measurement tool physiotherapy assessment dual sided cm inch", 46),
    T("measuring tape coiled clinical assessment physiotherapy instrument minimal", 56),
    F("flexible retractable measuring tape 150cm medical grade product photography", 66),
  ],
  pentorch: [
    F("medical pen torch LED penlight chrome silver pupil gauge printed on barrel clinical examination tool white background"),
    FR("doctor penlight torch silver medical grade LED close up product shot", 17),
    T("clinical pen torch with pupil gauge scale chrome finish isolated", 27),
    F("medical penlight flashlight doctor examination tool pocket clip close up", 37),
    FR("LED pen torch neurological pupil examination medical instrument chrome", 47),
    T("pen torch medical grade bright LED pupil gauge white background clean", 57),
    F("chrome medical penlight torch with mm scale clinical instrument", 67),
  ],
  stethoscope: [
    F("dual head stethoscope navy blue diaphragm bell acoustic medical grade clean white background product shot"),
    FR("stethoscope chest piece diaphragm bell close up medical grade product photography", 18),
    T("doctor wearing stethoscope around neck medical professional clinical", 28),
    F("black stethoscope on white surface clean product photography flat lay", 38),
    FR("acoustic stethoscope soft seal ear tips latex free tubing full product", 48),
    T("stethoscope coiled clean white background studio lighting medical equipment", 58),
    F("dual head stethoscope close up diaphragm chest piece silver ring", 68),
  ],
  sphygmo: [
    F("sphygmomanometer blood pressure monitor manual aneroid gauge medical white background product shot"),
    FR("aneroid blood pressure cuff manometer gauge close up clinical", 101),
    T("manual blood pressure monitor sphygmomanometer mercury gauge medical instrument", 201),
    F("blood pressure measurement device aneroid sphygmomanometer clinic white background", 301),
    FR("sphygmomanometer cuff pump gauge medical diagnostic equipment isolated", 401),
    T("manual BP monitor aneroid gauge cuff stethoscope clinical product photography", 501),
    F("blood pressure monitor aneroid type medical grade product flat lay white", 601),
  ],
  yogamat: [
    F("non slip yoga mat 6mm thick rolled up teal green physiotherapy exercise rehabilitation white background"),
    FR("yoga exercise mat unrolled on floor clean minimal teal physiotherapy", 19),
    T("physiotherapy rehabilitation mat person stretching exercise therapy", 29),
    F("rolled yoga mat with carry strap green exercise product shot", 39),
    FR("yoga mat close up texture non slip surface exercise physiotherapy", 49),
    T("thick yoga mat unrolled on clean floor teal blue top view", 59),
    F("yoga mat folded compact carry portable physiotherapy rehab product", 69),
  ],
  band: [
    F("resistance exercise band medium strength latex free green physiotherapy strength training rehabilitation white background"),
    FR("resistance band loop exercise physiotherapy strength training product shot", 50),
    T("person using resistance band for knee rehabilitation physiotherapy clinical", 51),
    F("set of resistance bands different strengths physiotherapy rehab laid out", 52),
    FR("latex resistance band close up texture physiotherapy exercise green", 53),
    T("green resistance band stretched exercise therapy isolated white background", 70),
    F("resistance exercise band coiled product photography minimal clean", 71),
  ],
  dynamometer: [
    F("hand grip dynamometer digital muscle force measurement physiotherapy white background product shot"),
    FR("grip strength dynamometer digital display muscle force testing close up clinical", 102),
    T("hand grip dynamometer physiotherapy strength assessment device isolated", 202),
    F("digital grip dynamometer strength measurement instrument physiotherapy product", 302),
    FR("dynamometer hand grip force meter digital clinical assessment tool white background", 402),
    T("grip strength tester dynamometer digital medical grade isolated product photography", 502),
    F("hand dynamometer muscle force meter physiotherapy clean product shot", 602),
  ],
  foamroller: [
    F("foam roller EVA physiotherapy myofascial release recovery exercise white background product shot"),
    FR("foam roller cylindrical massage recovery physiotherapy close up texture", 103),
    T("foam roller myofascial release physiotherapy rehabilitation exercise product", 203),
    F("EVA foam roller high density physiotherapy recovery tool isolated white", 303),
    FR("person using foam roller back muscles physiotherapy recovery clinical", 403),
    T("foam roller physiotherapy exercise equipment isolated product photography", 503),
    F("foam roller cylindrical grid texture recovery physiotherapy isolated", 603),
  ],
  myospaz: [
    F("myospaz muscle relaxant topical gel tube physiotherapy white background product shot"),
    FR("muscle relaxant gel tube physiotherapy topical application close up", 104),
    T("myospaz topical gel physiotherapy muscle relaxant cream tube product", 204),
    F("muscle gel tube white background physiotherapy pain relief product photography", 304),
    FR("topical analgesic gel tube physiotherapy muscle relaxant isolated clean", 404),
    T("physio gel tube muscle relaxant cream product shot isolated white", 504),
    F("myospaz gel tube physiotherapy product clean minimal white background", 604),
  ],
  ultrasoundgel: [
    F("ultrasound coupling gel bottle 250ml clear physiotherapy UST medium white background product shot"),
    FR("ultrasound gel clear bottle 250ml physiotherapy coupling medium close up", 105),
    T("clear ultrasound gel bottle physiotherapy coupling medium isolated product", 205),
    F("ultrasound gel 250ml bottle physiotherapy UST product photography white background", 305),
    FR("ultrasound coupling gel bottle clinical physiotherapy product isolated clean", 405),
    T("ultrasound gel bottle clear physiotherapy medium product shot minimal", 505),
    F("ultrasound gel bottle 250ml clear physiotherapy clinical product photography", 605),
  ],
  sanitizer: [
    F("hand sanitizer sachets pack disposable instant sanitizer white background product shot"),
    FR("sanitizer sachets pack disposable hand hygiene clinical close up", 106),
    T("instant hand sanitizer sachets pack disposable hygiene product photography", 206),
    F("hand sanitizer single dose sachets pack clinical hygiene product white background", 306),
    FR("disposable sanitizer sachets individual packets hygiene medical isolated", 406),
    T("sanitizer sachets pack 10 pieces hygiene disposable product photography minimal", 506),
    F("hand sanitizer sachets pack disposable instant hygiene product isolated", 606),
  ],
  cotton: [
    F("medical cotton pack white fluffy clinical grade physiotherapy white background product shot"),
    FR("medical grade cotton wool pack fluffy white clinical close up product", 107),
    T("medical cotton roll pack white clinical grade physiotherapy product photography", 207),
    F("white medical cotton pack clinical grade hygiene product isolated white background", 307),
    FR("medical cotton pack fluffy white clinical grade product shot isolated clean", 407),
    T("cotton wool medical grade pack white clean clinical product photography", 507),
    F("medical cotton pack white fluffy hygiene clinical product isolated", 607),
  ],
  medtape: [
    F("medical micropore tape roll white hypoallergenic bandage tape physiotherapy strapping wound dressing"),
    FR("kinesio tape rolls colorful physiotherapy strapping knee product shot", 62),
    T("medical tape applied on knee physiotherapy strapping clinical", 63),
    F("micropore white medical tape roll close up product shot isolated", 64),
    FR("physiotherapy taping technique kinesiology tape application clinical", 65),
    T("white medical tape rolls stack clean product photography minimal", 76),
    F("hypoallergenic micropore tape roll medical grade white background", 77),
  ],
  mask: [
    F("disposable 3-ply face mask medical surgical blue white pack white background product shot"),
    FR("surgical face mask 3 ply disposable medical blue pack close up", 108),
    T("disposable surgical mask blue medical grade 3-ply product photography", 208),
    F("blue white 3-ply face mask pack disposable medical surgical isolated", 308),
    FR("surgical disposable face mask pack 10 pieces medical grade isolated clean", 408),
    T("3-ply disposable face mask medical surgical pack product photography minimal", 508),
    F("disposable face mask medical surgical blue pack isolated white background", 608),
  ],
  gloves: [
    F("nitrile examination gloves pair box medical grade white background product shot"),
    FR("nitrile medical examination gloves pair close up clinical product photography", 109),
    T("nitrile gloves pair medical examination clinical product isolated", 209),
    F("medical grade nitrile gloves pair box clinical examination isolated white background", 309),
    FR("nitrile gloves pair medical clinical examination product shot isolated clean", 409),
    T("nitrile examination gloves pair medical grade product photography minimal", 509),
    F("medical nitrile gloves pair examination clinical isolated white background", 609),
  ],
  notes: [
    F("physiotherapy BPT first year textbook notes anatomy physiology clinical notes stack on desk"),
    FR("medical physio textbook open showing anatomy diagrams notes close up", 58),
    T("BPT first year study material physio notes handwritten pages clinical", 59),
    F("physiotherapy clinical notes book stack medical education white background", 60),
    FR("anatomy physiology medical notes physiotherapy student study textbooks", 61),
    T("open anatomy physiology book detailed diagrams physiotherapy notes", 74),
    F("BPT study notes stacked with pen pencil desk setup medical student", 75),
  ],
  notepad: [
    F("A5 spiral notepad medical student notebook clean white background product shot"),
    FR("A5 spiral notebook clean pages medical student note taking close up", 110),
    T("A5 notepad spiral bound medical student clinical notes product photography", 210),
    F("spiral A5 notepad student notebook clean isolated white background", 310),
    FR("A5 spiral notepad clinical notes student isolated clean product photography", 410),
    T("notepad A5 spiral bound medical student notebook product shot minimal", 510),
    F("A5 spiral notepad clean white background student medical product isolated", 610),
  ],
  penset: [
    F("ballpoint pen set 5 pieces clinical writing instruments white background product shot"),
    FR("5 ballpoint pens set clinical writing student product photography close up", 111),
    T("pen set 5 pieces ballpoint clinical writing student product photography", 211),
    F("ballpoint pens set 5 pieces student clinical writing isolated white background", 311),
    FR("5 piece ballpoint pen set clinical writing student isolated product photography", 411),
    T("pen set 5 ballpoint clinical writing student product shot minimal", 511),
    F("ballpoint pen set 5 pieces clinical writing isolated white background", 611),
  ],
  markerset: [
    F("whiteboard marker set colourful teaching hospital product shot white background"),
    FR("colourful whiteboard markers set teaching hospital clinical close up product", 112),
    T("whiteboard marker set colourful teaching clinical hospital product photography", 212),
    F("whiteboard markers set colourful teaching clinical hospital isolated white background", 312),
    FR("colourful whiteboard marker set clinical teaching hospital isolated product photography", 412),
    T("whiteboard marker set colourful clinical teaching product shot minimal", 512),
    F("whiteboard markers set colourful teaching clinical isolated white background", 612),
  ],
  usb: [
    F("USB flash drive 16GB study material storage medical student white background product shot"),
    FR("USB flash drive 16GB compact storage medical student close up product photography", 113),
    T("16GB USB flash drive study material medical student product photography", 213),
    F("USB drive 16GB compact storage medical student isolated white background", 313),
    FR("16GB USB flash drive compact study material medical student isolated product", 413),
    T("USB flash drive 16GB medical student study product shot minimal", 513),
    F("USB flash drive 16GB compact study material medical isolated white background", 613),
  ],
  scrubs: [
    F("medical scrubs set navy blue top and bottom professional hospital uniform physiotherapy clean product shot"),
    FR("physiotherapy student wearing navy blue scrubs professional clinical", 66),
    T("medical scrub uniform top and bottom set folded neat product photography", 67),
    F("nurse doctor wearing blue scrubs hospital clinical uniform professional", 68),
    FR("medical scrubs flat lay navy blue folded neat product photography", 69),
    T("scrubs uniform set top pants navy blue clean background product shot", 78),
    F("medical scrub set unisex navy blue professional healthcare uniform", 79),
  ],
  apron: [
    F("white full length lab apron two front pockets adjustable neck strap polyester cotton medical laboratory"),
    FR("white lab coat apron medical student wearing laboratory clinical", 70),
    T("full length white lab apron clinical protective garment product shot", 71),
    F("lab apron white with pockets medical student physio practical flat lay", 72),
    FR("white protective lab apron folded product photography clean minimal", 73),
    T("white lab apron full length on hanger studio product photography", 80),
    F("medical protective apron white front view pockets clean background", 81),
  ],
};

// ── Kits ──────────────────────────────────────────────────────
const KITS = [
  {
    id: "kit-1", type: "kit",
    name: "Physio Curated Kit",
    tagline: "The complete BPT starter bundle",
    price: 1999, originalPrice: 2946,
    badge: "BESTSELLER",
    desc: "Every instrument a first-year BPT student needs — sourced, quality-checked, and packed by MedVault. Walk into your practical lab fully equipped.",
    items: [
      { name: "Goniometer Set (3-in-1)", qty: 1, retail: 450 },
      { name: "Knee Hammer", qty: 1, retail: 150 },
      { name: "Tuning Fork (128 Hz)", qty: 1, retail: 220 },
      { name: "Inch Tape", qty: 1, retail: 80 },
      { name: "Pen Torch", qty: 1, retail: 120 },
      { name: "Stethoscope", qty: 1, retail: 799 },
      { name: "Yoga Mat", qty: 1, retail: 349 },
      { name: "Resistance Band", qty: 1, retail: 180 },
      { name: "Myospaz Gel", qty: 1, retail: 299 },
      { name: "Physio Books", qty: 1, retail: 299 },
    ],
    stock: 48, images: IMG.kit1,
    features: ["Hospital-grade instruments", "Curated for BPT curriculum", "Delivered to SRM campus", "Quality-checked by MedVault"],
  },
  {
    id: "kit-2", type: "kit",
    name: "Practical Exam Kit",
    tagline: "Core tools for clinical practicals",
    price: 699, originalPrice: 1020,
    badge: "EXAM READY",
    desc: "The five instruments you need most for practical exams. Compact, affordable, and ready to carry. Perfect for students who already own some tools.",
    items: [
      { name: "Goniometer Set (3-in-1)", qty: 1, retail: 450 },
      { name: "Knee Hammer", qty: 1, retail: 150 },
      { name: "Tuning Fork (128 Hz)", qty: 1, retail: 220 },
      { name: "Inch Tape", qty: 1, retail: 80 },
      { name: "Pen Torch", qty: 1, retail: 120 },
    ],
    stock: 72, images: IMG.kit2,
    features: ["5 core exam instruments", "Lightweight & portable", "Exam-compliant tools", "Quick delivery"],
  },
  {
    id: "kit-3", type: "kit",
    name: "Smart Study Kit",
    tagline: "Stationery + essentials bundle",
    price: 549, originalPrice: 754,
    badge: "STUDY SMART",
    desc: "Everything you need at your desk. Includes notepad, pens, markers, USB drive, sanitizer sachets, and masks — the student essentials kit.",
    items: [
      { name: "Notepad (A5)", qty: 1, retail: 79 },
      { name: "Pen Set (5 pcs)", qty: 1, retail: 79 },
      { name: "Markers Set", qty: 1, retail: 149 },
      { name: "USB Drive (16GB)", qty: 1, retail: 299 },
      { name: "Sanitizer Sachets (5 pcs)", qty: 1, retail: 49 },
      { name: "Mask (5 pcs)", qty: 1, retail: 99 },
    ],
    stock: 100, images: IMG.kit3,
    features: ["Semester-long stationery", "USB for study material", "Hygiene essentials included", "Great value bundle"],
  },
];

// ── Individual Items ───────────────────────────────────────────
const ITEMS = [
  { id:"i-1",  type:"item", name:"Goniometer Set (3-in-1)",     tagline:"Joint ROM measurement",       price:450, originalPrice:650,  badge:"PHYSIO TOOL",   images:IMG.goniometer,   desc:"Full 3-piece goniometer set for measuring joint range of motion. Includes large, small, and finger goniometers.", stock:80 },
  { id:"i-2",  type:"item", name:"Knee Hammer",                  tagline:"Reflex testing",               price:150, originalPrice:220,  badge:"NEURO TOOL",    images:IMG.hammer,       desc:"Standard Taylor percussion hammer with triangular rubber head for patellar, achilles, and tendon reflexes.", stock:95 },
  { id:"i-3",  type:"item", name:"Tuning Fork (128 Hz)",         tagline:"Vibration & hearing tests",    price:220, originalPrice:320,  badge:"NEURO TOOL",    images:IMG.tuningfork,   desc:"Aluminium alloy 128 Hz tuning fork for vibration sense testing, Rinne and Weber tests. Frequency-stamped.", stock:60 },
  { id:"i-4",  type:"item", name:"Inch Tape (150cm)",            tagline:"Body & limb measurement",     price:80,  originalPrice:120,  badge:"MEASUREMENT",   images:IMG.tape,         desc:"Flexible 150 cm measuring tape with dual-side inch and cm markings. Essential for limb girth and posture.", stock:150 },
  { id:"i-5",  type:"item", name:"Pen Torch (LED)",              tagline:"Pupil & oral exam",            price:120, originalPrice:180,  badge:"DIAGNOSTIC",    images:IMG.pentorch,     desc:"Bright LED pen torch with pupil gauge on barrel. Pocket clip, replaceable batteries, chrome finish.", stock:110 },
  { id:"i-6",  type:"item", name:"Stethoscope",                  tagline:"Dual-head auscultation",       price:799, originalPrice:1299, badge:"MONITORING",    images:IMG.stethoscope,  desc:"Dual-head stethoscope with diaphragm and bell. High acoustic sensitivity, soft-seal ear tips, latex-free.", stock:55 },
  { id:"i-7",  type:"item", name:"Sphygmomanometer",             tagline:"Blood pressure monitor",       price:499, originalPrice:799,  badge:"DIAGNOSTIC",    images:IMG.sphygmo,      desc:"Aneroid manual sphygmomanometer with cuff and gauge. Clinical-grade blood pressure monitoring for practicals.", stock:40 },
  { id:"i-8",  type:"item", name:"Yoga Mat (6mm)",               tagline:"Exercise & rehabilitation",    price:349, originalPrice:499,  badge:"REHAB",         images:IMG.yogamat,      desc:"Non-slip 6mm thick yoga mat for therapeutic exercise, stretching, and rehabilitation sessions.", stock:40 },
  { id:"i-9",  type:"item", name:"Resistance Band",              tagline:"Strength & rehab training",    price:180, originalPrice:260,  badge:"REHAB",         images:IMG.band,         desc:"Medium-resistance latex-free exercise band for upper and lower limb strengthening. Used in all BPT sessions.", stock:120 },
  { id:"i-10", type:"item", name:"Dynamometer",                  tagline:"Grip & muscle force",          price:699, originalPrice:1299, badge:"STRENGTH TOOL", images:IMG.dynamometer,  desc:"Digital hand grip dynamometer for muscle force assessment. Essential for strength testing in physiotherapy.", stock:35 },
  { id:"i-11", type:"item", name:"Foam Roller / Micropod",       tagline:"Myofascial release",           price:249, originalPrice:399,  badge:"RECOVERY",      images:IMG.foamroller,   desc:"High-density EVA foam roller for myofascial release, muscle recovery, and self-massage therapy.", stock:50 },
  { id:"i-12", type:"item", name:"Myospaz Gel",                  tagline:"Muscle relaxant gel",          price:299, originalPrice:399,  badge:"THERAPEUTIC",   images:IMG.myospaz,      desc:"Topical muscle relaxant gel for localised muscle spasm relief. Used widely in physiotherapy practice.", stock:90 },
  { id:"i-13", type:"item", name:"Ultrasound Gel (250ml)",       tagline:"UST coupling medium",          price:99,  originalPrice:149,  badge:"CONSUMABLE",    images:IMG.ultrasoundgel,desc:"Clear ultrasound coupling gel for UST sessions. 250ml bottle, non-staining, water-based formula.", stock:150 },
  { id:"i-14", type:"item", name:"Sanitizer Sachets (10 pcs)",   tagline:"Instant hand sanitizer",      price:49,  originalPrice:79,   badge:"HYGIENE",       images:IMG.sanitizer,    desc:"Single-dose disposable hand sanitizer sachets. Pack of 10. Convenient for clinical rounds and practicals.", stock:200 },
  { id:"i-15", type:"item", name:"Cotton Pack",                  tagline:"Medical grade cotton",         price:79,  originalPrice:119,  badge:"CONSUMABLE",    images:IMG.cotton,       desc:"Medical-grade cotton wool pack for wound dressing, clinical procedures, and physiotherapy applications.", stock:180 },
  { id:"i-16", type:"item", name:"Micropore Tape",               tagline:"Hypoallergenic strapping",     price:49,  originalPrice:79,   badge:"CONSUMABLE",    images:IMG.medtape,      desc:"Hypoallergenic micropore medical tape for wound dressing, strapping, and electrode fixation.", stock:200 },
  { id:"i-17", type:"item", name:"Face Mask (10 pcs)",           tagline:"3-ply disposable mask",        price:49,  originalPrice:79,   badge:"PPE",           images:IMG.mask,         desc:"3-ply disposable surgical face masks. Pack of 10. Compliant with clinical standards for campus use.", stock:300 },
  { id:"i-18", type:"item", name:"Nitrile Gloves (pair)",        tagline:"Examination gloves",           price:79,  originalPrice:119,  badge:"PPE",           images:IMG.gloves,       desc:"Medical-grade nitrile examination gloves. Latex-free, powder-free. Sold per pair.", stock:250 },
  { id:"i-19", type:"item", name:"Physio Books",                 tagline:"BPT syllabus notes",           price:299, originalPrice:450,  badge:"EDUCATION",     images:IMG.notes,        desc:"Curated first-year BPT notes covering anatomy, physiology, and basic physiotherapy. SRM curriculum-aligned.", stock:30 },
  { id:"i-20", type:"item", name:"Notepad (A5)",                 tagline:"Clinical note-taking",         price:79,  originalPrice:119,  badge:"STATIONERY",    images:IMG.notepad,      desc:"A5 spiral-bound notepad for clinical notes, case records, and class notes. 80 pages.", stock:150 },
  { id:"i-21", type:"item", name:"Pen Set (5 pcs)",              tagline:"Everyday writing set",         price:49,  originalPrice:79,   badge:"STATIONERY",    images:IMG.penset,       desc:"Set of 5 smooth-writing ballpoint pens. Ideal for clinical documentation and everyday use.", stock:200 },
  { id:"i-22", type:"item", name:"Markers Set",                  tagline:"Whiteboard markers",           price:149, originalPrice:199,  badge:"STATIONERY",    images:IMG.markerset,    desc:"Colourful whiteboard marker set for teaching, presentations, and clinical annotations.", stock:100 },
  { id:"i-23", type:"item", name:"USB Drive (16GB)",             tagline:"Study material storage",       price:299, originalPrice:499,  badge:"UTILITY",       images:IMG.usb,          desc:"16GB USB flash drive for study material storage, lecture recordings, and document sharing.", stock:80 },
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
function Navbar({ cartCount, onCart, onHome, searchQuery, onSearchChange }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: C.header,
      borderBottom: `1px solid ${C.headerBorder}`,
      padding: "0 5%",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 24 }}>
        {/* Logo */}
        <button onClick={onHome} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <img src="/logo.png" alt="MedVault" style={{ height: 40, width: "auto", display: "block", mixBlendMode: "screen" }} />
        </button>

        {/* Search bar */}
        <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>&#128269;</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            style={{
              width: "100%", padding: "9px 14px 9px 36px",
              background: "rgba(255,255,255,0.08)",
              border: `1px solid rgba(255,255,255,0.12)`,
              borderRadius: 8, color: "#FFFFFF", fontSize: 13,
              outline: "none",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
          />
        </div>

        {/* Right nav */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <button onClick={onHome} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500,
            padding: "8px 14px", letterSpacing: 0.3,
          }}>Shop</button>
          <button onClick={onCart} style={{
            position: "relative",
            background: "transparent",
            border: `1px solid rgba(255,255,255,0.25)`,
            borderRadius: 8, padding: "8px 18px", cursor: "pointer", color: C.white,
            display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 15 }}>&#128722;</span>
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{
                background: C.deal, color: C.white, borderRadius: "50%",
                width: 19, height: 19, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, animation: "cartBounce 0.3s ease",
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
      background: "linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 50%, #DBEAFE 100%)",
      padding: "100px 5% 64px", position: "relative", overflow: "hidden",
    }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -80, right: "10%", width: 360, height: 360, borderRadius: "50%", background: "rgba(29,78,216,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: "5%", width: 220, height: 220, borderRadius: "50%", background: "rgba(29,78,216,0.04)", pointerEvents: "none" }} />

      <div className="hero-row" style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div style={{ flex: "0 0 auto", maxWidth: 520, animation: "fadeUp 0.7s ease both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#EFF6FF", border: `1px solid #BFDBFE`,
            borderRadius: 100, padding: "5px 16px", marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, display: "block" }} />
            <span style={{ fontSize: 11, color: C.primary, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Physiotherapy Collection</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1.05,
            color: "#0D1B2A", marginBottom: 20, letterSpacing: "-0.5px",
          }}>
            Equip Every<br />
            <span style={{ color: C.primary }}>BPT Student</span>
          </h1>

          <p style={{ fontSize: 16, color: C.textSub, fontWeight: 400, maxWidth: 440, lineHeight: 1.75, marginBottom: 36 }}>
            Curated physiotherapy kits for SRM campus — every instrument, scrub, and study material you need, in one place.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 40 }}>
            <button onClick={onShop} style={{
              background: C.primary, color: C.white, border: "none",
              padding: "14px 32px", borderRadius: 8, cursor: "pointer",
              fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
              transition: "all 0.2s", boxShadow: "0 4px 14px rgba(29,78,216,0.35)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.primaryHover; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.transform = "none"; }}
            >Shop Now &#8594;</button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32 }}>
            {[["4000+", "Students Served"], ["3", "Kit Types"], ["48h", "Delivery"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontWeight: 800, fontSize: 22, color: C.primary }}>{n}</div>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-img" style={{ animation: "fadeUp 0.9s ease 0.15s both" }}>
          <div style={{ position: "relative", animation: "float3d 5s ease-in-out infinite" }}>
            <div style={{ position: "absolute", inset: -32, borderRadius: 32, background: "radial-gradient(ellipse at center, rgba(29,78,216,0.12) 0%, transparent 70%)", zIndex: 0 }} />
            <img src="/kit.jpg" alt="MedVault Physio Kit" style={{
              position: "relative", zIndex: 1,
              width: "clamp(240px, 30vw, 440px)",
              borderRadius: 20, boxShadow: "0 24px 64px rgba(29,78,216,0.18)",
            }} onError={e => e.target.style.display = "none"} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Trust Strip ───────────────────────────────────────────────
function TrustStrip() {
  return (
    <div style={{ background: C.strip, padding: "14px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: "6%", flexWrap: "wrap" }}>
        {[
          ["&#128666;", "Free Campus Delivery"],
          ["&#129516;", "Physio-Grade Quality"],
          ["&#128230;", "Ready to Ship"],
          ["&#128172;", "WhatsApp Orders"],
        ].map(([ic, lb]) => (
          <div key={lb} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 500 }}>
            <span dangerouslySetInnerHTML={{ __html: ic }} />
            <span>{lb}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab Navigation ────────────────────────────────────────────
function TabNav({ active, onChange }) {
  const tabs = [
    { id: "kits", label: "Curated Kits" },
    { id: "items", label: "Individual Items" },
    { id: "apparel", label: "Scrubs & Aprons" },
  ];
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 36, overflowX: "auto" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: "9px 20px", borderRadius: 100, cursor: "pointer",
          background: active === t.id ? C.primary : "#E5E7EB",
          color: active === t.id ? C.white : C.textSub,
          border: "none", fontSize: 13, fontWeight: 600,
          transition: "all 0.18s", whiteSpace: "nowrap",
        }}>
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
        border: `1px solid ${C.border}`,
        borderRadius: 16, overflow: "hidden", cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? C.shadowHover : C.shadow,
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
        <img src={kit.images[0]} alt={kit.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: hovered ? "scale(1.04)" : "scale(1)" }} onError={e => e.target.style.display="none"} />
        {/* Discount badge */}
        <span style={{
          position: "absolute", top: 12, right: 12,
          background: C.deal, color: C.white,
          borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 800,
        }}>-{pct}%</span>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 0", flex: 1 }}>
        {/* Badge */}
        <span style={{
          display: "inline-block",
          background: isGold ? C.goldBg : "#EFF6FF",
          color: isGold ? C.gold : C.primary,
          border: `1px solid ${isGold ? "#FDE68A" : "#BFDBFE"}`,
          borderRadius: 100, padding: "3px 10px", fontSize: 10, fontWeight: 700,
          letterSpacing: 1.5, marginBottom: 10,
        }}>{kit.badge}</span>

        <h3 style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 4, lineHeight: 1.2 }}>{kit.name}</h3>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 14, lineHeight: 1.45 }}>{kit.tagline}</p>

        {/* Items inside */}
        <p style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>What's inside</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
          {kit.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.primary, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: C.textSub }}>{item.name}</span>
              </div>
              <span style={{ fontSize: 11, color: C.muted }}>{fmt(item.retail)}</span>
            </div>
          ))}
        </div>

        {/* Retail total */}
        <div style={{
          background: "#F9FAFB", border: `1px solid ${C.border}`, borderRadius: 8,
          padding: "8px 12px", display: "flex", justifyContent: "space-between", marginBottom: 16,
        }}>
          <span style={{ fontSize: 12, color: C.muted }}>Retail total</span>
          <span style={{ fontSize: 12, color: C.muted, textDecoration: "line-through" }}>{fmt(retailTotal)}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
          <span style={{ fontWeight: 800, fontSize: 26, color: C.primary }}>{fmt(kit.price)}</span>
          <span style={{ fontSize: 13, color: C.muted, textDecoration: "line-through" }}>{fmt(kit.originalPrice)}</span>
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>Save {fmt(saved)}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onView(kit)} style={{
            flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer",
            background: "none", border: `1px solid ${C.border}`,
            color: C.textSub, fontSize: 13, fontWeight: 600, transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
          >View Details</button>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(kit); }} style={{
            flex: 2, padding: "10px", borderRadius: 8, cursor: "pointer",
            background: C.primary, border: "none", color: C.white,
            fontSize: 13, fontWeight: 700, transition: "all 0.18s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.primaryHover}
            onMouseLeave={e => e.currentTarget.style.background = C.primary}
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
        <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.35s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} onError={e => e.target.style.display="none"} />
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
        <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease", transform: hovered ? "scale(1.04)" : "scale(1)" }} onError={e => e.target.style.display="none"} />
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
              ["S",  "84–88", "66–70", "90–94", "160–165"],
              ["M",  "90–94", "72–76", "96–100","165–170"],
              ["L",  "96–100","78–82", "102–106","170–175"],
              ["XL", "102–106","84–88","108–112","175–180"],
              ["XXL","108–114","90–94","114–120","180+"],
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
      <TrustStrip />

      {/* Shop section */}
      <div id="shop" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 5% 80px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: C.primary, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Our Products</p>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,4vw,40px)", color: C.text, lineHeight: 1.1 }}>
            Choose Your <span style={{ color: C.primary }}>Kit</span>
          </h2>
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
                      <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} />
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
      </div>

      {/* Mission */}
      <div style={{ background: C.header, padding: "60px 5%" }}>
        <div className="mission-grid" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 3, fontWeight: 700, marginBottom: 12, textTransform: "uppercase" }}>Our Mission</p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.75)" }}>Support BPT students and physiotherapy professionals with thoughtfully curated medical essentials that improve learning, build confidence, and support strong clinical practice.</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 3, fontWeight: 700, marginBottom: 12, textTransform: "uppercase" }}>Our Vision</p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.75)" }}>Be the most trusted on-campus medical store at SRM — known for premium quality, honest pricing, and understanding what a physio student truly needs.</p>
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
                  {isUrl(item.img) ? <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (item.images ? <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} /> : <span style={{ fontSize: 26 }}>&#128230;</span>)}
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
                    {item.images ? <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} /> : <span style={{ fontSize: 18 }}>&#128230;</span>}
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
