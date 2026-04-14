"use client";
import { useState, useEffect, useCallback } from "react";

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
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} />
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
    R("overhead flat lay of complete physiotherapy student kit on white surface: transparent plastic goniometer, chrome Taylor reflex hammer, silver tuning fork, black stethoscope, LED penlight, green resistance band, rolled teal yoga mat, myospaz gel tube, measuring tape, physio textbook — studio lighting, no people", 11),
    R("BPT physiotherapy kit contents flat lay on white: three-piece goniometer set, knee hammer, 128hz tuning fork, measuring tape, pen torch, dual head stethoscope, resistance band, yoga mat — all clearly visible, clean product photography, no people", 12),
    R("physiotherapy instruments neatly arranged in a circle on white background: transparent goniometer, triangular rubber reflex hammer, silver tuning fork, black stethoscope, chrome penlight, resistance band, yoga mat — product only, no people", 14),
    R("first year BPT kit top-view flat lay: all instruments arranged on white — goniometer, stethoscope, hammer, tuning fork, tape, torch, yoga mat, band, gel tube, textbook — clean studio product photography, no people", 15),
  ],
  kit2: [
    R("five physiotherapy examination instruments flat lay on white: transparent plastic goniometer, Taylor reflex hammer with red triangular rubber head, 128Hz silver tuning fork, fabric measuring tape 150cm, chrome LED pen torch — arranged neatly, studio lighting, no people", 21),
    R("physiotherapy practical exam kit five tools flat lay on white: goniometer, knee percussion hammer, tuning fork, inch tape, penlight — top view, realistic clinical instruments, no people", 22),
    R("BPT practical exam instruments flat lay on light grey surface: transparent goniometer with degree markings, chrome Taylor hammer, aluminium tuning fork, soft measuring tape coiled, silver penlight — realistic product shot, no people", 24),
    R("physiotherapy five core clinical instruments on white — clear goniometer protractor, triangular headed reflex hammer, U-shaped 128hz tuning fork, rolled inch tape, LED torch pen — clean studio product photography, no people", 25),
  ],
  kit3: [
    R("student smart study kit flat lay on white desk: A5 spiral notepad open, five ballpoint pens fanned out, colourful whiteboard markers, silver 16GB USB drive, small sanitizer foil sachets, blue surgical face masks — top view clean product photography, no people", 31),
    R("medical student study essentials flat lay on white: spiral A5 notebook, ballpoint pen set, multi-colour whiteboard markers, USB flash drive, hand sanitizer sachets, disposable surgical masks — minimal studio lighting, no people", 32),
    R("smart study bundle stationery flat lay on white: spiral notepad, pens, markers, USB drive, sanitizer sachets, mask pack neatly arranged — realistic studio product photography, no people", 33),
    R("study kit items spread on clean white surface: spiral-bound A5 notebook, pen set, markers, silver USB drive, sanitizer sachets, surgical face mask pack — bright studio product photography, no people", 35),
  ],
  goniometer: [
    R("three-piece medical goniometer set on pure white background: large 360-degree transparent plastic full-circle goniometer, medium 180-degree half-circle goniometer with two adjustable arms, small 90-degree finger goniometer — all three laid side by side, studio product photography, no people", 101),
    R("close-up of transparent plastic medical goniometer showing clear angle markings 0 to 360 degrees, two measurement arms, pivot joint screw — physiotherapy ROM tool, white background, no people", 102),
    R("physiotherapy goniometer set three sizes side by side on white: large, standard, and small finger goniometer, transparent plastic with printed degree scale — realistic product shot, no people", 103),
    R("medical goniometer top-down view on white: transparent semicircular protractor body with degree markings, two white plastic arms from pivot — physiotherapy assessment tool, studio lighting, no people", 105),
  ],
  hammer: [
    R("Taylor percussion reflex hammer isolated on pure white background: triangular red rubber striking head, chrome stainless steel handle 25cm — neurological diagnostic instrument, studio product photography, no people", 111),
    R("close-up of Taylor reflex hammer head on white: triangular red rubber striking surface attached to chrome metal handle — medical neurology diagnostic instrument, sharp focus, no people", 112),
    R("medical reflex hammer full product shot on white: slim chrome handle, triangular red rubber percussion head, stainless steel finish — isolated on white seamless background, no people", 113),
    R("neurological reflex hammer flat lay on white: Taylor type triangular rubber head and metal handle, shadow visible beneath — accurate product photography, no people", 115),
  ],
  tuningfork: [
    R("128 Hz medical tuning fork isolated on pure white background: aluminium alloy U-shaped fork with two parallel prongs, long cylindrical handle, '128 Hz' stamped on body — neurological diagnostic instrument, studio product photography, no people", 121),
    R("close-up of 128Hz aluminium medical tuning fork on white: two vibrating prongs with rounded tips, handle with frequency markings — vibration sense testing tool, sharp focus, no people", 122),
    R("medical tuning fork standing upright on white surface: U-shaped prongs and long silver handle — aluminium alloy 128 Hz physiotherapy neurological tool, studio lighting, no people", 123),
    R("128Hz tuning fork and reflex hammer arranged together on white background — standard neurological examination instruments, clinical product photography, no people", 125),
  ],
  tape: [
    R("medical measuring tape on pure white background: soft flexible fabric tape 150cm, coiled loop, centimetre and inch markings on both sides — physiotherapy body measurement tool, studio product photography, no people", 131),
    R("close-up of flexible medical measuring tape partially unrolled on white: clear centimetre graduations and numbers — limb circumference measurement tool, sharp focus, no people", 132),
    R("physiotherapy measuring tape 150cm laid flat on white surface: dual sided centimetre and inch scale, soft flexible material — clinical assessment tool, studio lighting, no people", 133),
    R("medical cloth measuring tape coiled neatly on white background: 150cm dual scale flexible tape, yellow and white — physiotherapy clinical tool, studio lighting, no people", 135),
  ],
  pentorch: [
    R("chrome LED medical pen torch isolated on pure white background: slim cylindrical design, bright LED tip, pupil gauge millimetre scale on barrel, pocket clip — clinical examination penlight, studio product photography, no people", 141),
    R("close-up of medical penlight pen torch on white: LED bulb end and pupil gauge scale printed along chrome body — neurological examination tool, sharp focus, no people", 142),
    R("medical LED pen torch with cap beside it on white: chrome finish, pupil gauge on barrel — clinical diagnostic instrument, studio lighting, no people", 143),
    R("two chrome medical pen torches on white background: LED penlights with pocket clips and pupil gauge scales — diagnostic examination instruments, product photography, no people", 145),
  ],
  stethoscope: [
    R("dual head stethoscope on pure white background: black Y-shaped tubing, chest piece with diaphragm and bell, soft ear tips, spring headset — acoustic medical instrument, studio product photography, no people", 151),
    R("close-up of stethoscope chest piece on white: silver rim, flat diaphragm membrane, bell on reverse — medical auscultation instrument, sharp focus, no people", 152),
    R("black stethoscope coiled in circle on white surface: dual-head chest piece diaphragm and bell clearly visible, soft sealing ear tips — clinical instrument product shot, no people", 153),
    R("stethoscope ear tips close-up on white: soft silicone seal ear tips on metal binaural spring headset — medical acoustic instrument, product photography, no people", 155),
  ],
  sphygmo: [
    R("aneroid sphygmomanometer blood pressure monitor on pure white background: round gauge dial with mmHg scale 0-300, black inflatable arm cuff, rubber hand bulb pump with metal valve, rubber tubing — clinical BP instrument, studio product photography, no people", 161),
    R("close-up of aneroid BP gauge dial on white: circular mercury-free manometer showing mmHg markings, needle indicator, chrome bezel — manual blood pressure instrument, sharp focus, no people", 162),
    R("sphygmomanometer complete set flat lay on white: folded BP cuff, gauge dial, hand pump bulb — clinical blood pressure monitoring kit, studio lighting, no people", 163),
    R("manual blood pressure cuff unrolled on white background: grey fabric cuff with velcro, connected to aneroid gauge and rubber bulb pump — BP measurement device, product photography, no people", 165),
  ],
  yogamat: [
    R("6mm thick teal yoga mat on pure white background: non-slip textured surface, partially rolled showing thickness and cross-section — physiotherapy exercise rehabilitation mat, studio product photography, no people", 171),
    R("yoga mat rolled up tightly with carry strap on white background: teal colour, textured anti-slip surface visible at end — physiotherapy rehabilitation exercise mat, sharp product photo, no people", 172),
    R("yoga mat unrolled flat on white floor: 6mm thick teal exercise mat showing full surface texture and non-slip dotted bottom — physio rehab mat top view, studio lighting, no people", 173),
    R("yoga exercise mat close-up on white: thick 6mm foam with textured teal surface and anti-slip backing pattern — physiotherapy rehabilitation equipment, product photography, no people", 175),
  ],
  band: [
    R("green latex resistance exercise band on pure white background: flat loop band, medium resistance, smooth elastic texture, lying flat — physiotherapy strength training tool, studio product photography, no people", 181),
    R("resistance band coiled flat on white surface: green latex loop exercise band for physiotherapy rehabilitation — strength training tool, studio lighting, no people", 183),
    R("set of three resistance exercise bands flat lay on white: green medium, yellow light, red heavy resistance — different strengths for physiotherapy rehab, product photography, no people", 185),
    R("green resistance band folded over itself on white background: elastic latex exercise band showing texture and flexibility — rehabilitation physiotherapy tool, sharp focus, no people", 186),
  ],
  dynamometer: [
    R("hand grip dynamometer on pure white background: ergonomic D-shaped grip handle, digital LCD display showing force reading in kg, black and chrome finish — physiotherapy muscle strength assessment instrument, studio product photography, no people", 191),
    R("close-up of digital hand dynamometer display on white: LCD screen showing grip strength reading in kg — physiotherapy strength measurement clinical tool, sharp focus, no people", 192),
    R("grip strength dynamometer full product shot on white: hand grip ergonomic device with digital display, chrome and black finish — physiotherapy assessment instrument, studio lighting, no people", 193),
    R("hand grip dynamometer isolated on white: compact ergonomic D-grip design with digital display for force in kilograms — muscle strength measurement physiotherapy tool, no people", 195),
  ],
  foamroller: [
    R("EVA foam roller on pure white background: cylindrical 30cm long 15cm diameter roller, textured grid surface, dark teal colour — physiotherapy myofascial release recovery tool, studio product photography, no people", 201),
    R("foam roller close-up on white showing textured grid EVA surface pattern — high density physiotherapy myofascial release equipment, sharp focus, no people", 202),
    R("foam roller lying on white surface: cylindrical high density EVA foam, textured outer surface — muscle recovery physiotherapy rehabilitation tool, studio lighting, no people", 203),
    R("foam roller standing upright on white background: solid cylindrical EVA foam exercise roller, textured grid surface — physiotherapy muscle recovery equipment, no people", 205),
  ],
  myospaz: [
    R("Myospaz topical gel tube on pure white background: white plastic tube with blue cap, printed label, muscle relaxant topical analgesic — physiotherapy therapeutic product, studio product photography, no people", 211),
    R("close-up of Myospaz gel tube on white: cream-coloured tube with blue screw cap, label details visible — physiotherapy muscle relaxant topical gel, sharp focus, no people", 212),
    R("muscle relaxant gel tube standing upright on white: Myospaz topical analgesic, blue and white packaging, flat end base — physiotherapy therapeutic product, studio lighting, no people", 213),
    R("Myospaz gel tube product shot angled on white: white squeezable tube with cap, muscle relaxant label, clean background — physiotherapy topical gel product photography, no people", 215),
  ],
  ultrasoundgel: [
    R("ultrasound gel bottle 250ml on pure white background: clear squeeze bottle with flip cap, blue label, transparent aqua gel visible inside — physiotherapy UST coupling medium, studio product photography, no people", 221),
    R("close-up of ultrasound coupling gel bottle on white: clear plastic squeeze bottle with blue label, flip cap — physiotherapy therapeutic ultrasound coupling medium, sharp focus, no people", 222),
    R("ultrasound gel 250ml bottle standing on white surface: clear bottle with flip cap, gel visible through translucent body — physiotherapy UST consumable, studio lighting, no people", 223),
    R("ultrasound gel bottle flat lay on white: clear squeeze bottle with label — physiotherapy coupling medium, product photography, no people", 225),
  ],
  sanitizer: [
    R("hand sanitizer sachets on pure white background: individual foil sachets in a pack of 10, silver packaging, sanitizer label, single-dose disposable — clinical hygiene product, studio product photography, no people", 231),
    R("close-up of hand sanitizer sachet on white: small foil single-dose sanitizer pouch, 70 percent alcohol, clinical hygiene — product photography, sharp focus, no people", 232),
    R("sanitizer sachets pack spread on white surface: 10 individual foil sachets fanned out, silver disposable clinical hygiene products — studio product photography, no people", 233),
    R("hand sanitizer sachets 10 pack on white: sealed silver foil individual pouches stacked neatly — disposable instant sanitizer product photography, no people", 235),
  ],
  cotton: [
    R("medical cotton wool pack on pure white background: white fluffy absorbent cotton, unsealed pack showing soft fibre texture — clinical grade physiotherapy consumable, studio product photography, no people", 241),
    R("close-up of medical grade cotton wool on white: white soft fluffy fibres, absorbent clinical cotton — dressing and physiotherapy consumable, sharp focus, no people", 242),
    R("medical cotton roll and pack on white surface: white absorbent cotton wool in clinical grade packaging — physiotherapy dressing product, studio lighting, no people", 243),
    R("medical cotton pack isolated on white: soft white clinical grade cotton wool for dressing and clinical procedures — physiotherapy consumable product photography, no people", 245),
  ],
  medtape: [
    R("micropore medical tape roll on pure white background: white paper adhesive tape on cardboard core, 2.5cm wide — hypoallergenic clinical strapping tape, studio product photography, no people", 251),
    R("close-up of white micropore tape roll on white: paper medical tape showing adhesive layer — hypoallergenic wound dressing tape, sharp focus, no people", 252),
    R("medical micropore tape two rolls on white surface: white hypoallergenic paper tape rolls — clinical physiotherapy consumable, studio lighting, no people", 253),
    R("micropore paper tape roll product shot on white: 5m x 2.5cm white hypoallergenic medical adhesive tape — clinical physiotherapy consumable photography, no people", 255),
  ],
  mask: [
    R("pack of 10 disposable surgical face masks on pure white background: blue 3-ply surgical masks in opened box, individual masks fanned out — medical PPE, studio product photography, no people", 261),
    R("close-up of single 3-ply surgical face mask on white: blue outer layer, white inner soft layer, metal nose wire, ear loops — disposable medical PPE, sharp focus, no people", 262),
    R("surgical face masks product shot on white: multiple blue and white 3-ply disposable masks fanned out — medical grade PPE, studio lighting, no people", 263),
    R("10 disposable surgical face masks fanned out on white background: blue 3-ply medical grade masks in neat arrangement — clinical PPE product photography, no people", 265),
  ],
  gloves: [
    R("pair of blue nitrile examination gloves on pure white background: powder-free latex-free medical grade examination gloves, textured fingertips — clinical PPE, studio product photography, no people", 271),
    R("close-up of nitrile examination glove on white: blue textured surface showing detailed finger texture — medical grade powder-free examination glove, sharp focus, no people", 272),
    R("pair of nitrile gloves flat lay on white surface: blue medical examination gloves showing palm and back — clinical PPE physiotherapy tool, studio lighting, no people", 273),
    R("box of nitrile examination gloves on white background: blue powder-free gloves box with a pair displayed beside it — clinical grade PPE product photography, no people", 275),
  ],
  notes: [
    R("BPT physiotherapy textbook stack on pure white background: anatomy and physiology books with colourful spines, one open showing detailed diagrams — first year medical student study material, studio product photography, no people", 281),
    R("open physiotherapy anatomy textbook on white surface: detailed anatomical diagrams of musculoskeletal system with labels — BPT first year study material, realistic product photo, no people", 282),
    R("stack of BPT physio textbooks on white: anatomy physiology and physiotherapy clinical textbooks stacked — medical student education material, studio lighting, no people", 283),
    R("medical physio textbook and clinical notes on white: printed textbook open beside handwritten notes pages — BPT first year education material product photography, no people", 285),
  ],
  notepad: [
    R("A5 spiral notepad on pure white background: ruled lined pages, blue cover, spiral binding on left side — medical student clinical note-taking notebook, studio product photography, no people", 291),
    R("open A5 spiral notepad on white: clean ruled lines inside and spiral metal binding visible — medical student notebook, realistic sharp focus product photo, no people", 292),
    R("A5 spiral bound notepad product shot on white: blue cover with 80 ruled pages, wire binding — clinical note-taking student notebook, studio lighting, no people", 293),
    R("A5 spiral notepad closed on white background: compact ruled student notebook with wire binding and blue cover — clinical stationery product photography, no people", 295),
  ],
  penset: [
    R("set of 5 ballpoint pens on pure white background: black blue red green purple ink pens fanned out, click-top mechanism, slim design — student stationery, studio product photography, no people", 301),
    R("5 ballpoint pens arranged in fan shape on white: multi-colour ink set, slim design, click retractable mechanism — medical student writing instruments, sharp focus, no people", 302),
    R("pen set five pieces product shot on white: ballpoint pens in different colours arranged side by side — student stationery clinical documentation tools, studio lighting, no people", 303),
    R("multi-colour ballpoint pen set 5 pieces flat lay on white: click-top pens black blue red green purple — student stationery product photography, no people", 305),
  ],
  markerset: [
    R("set of 6 whiteboard markers on pure white background: colourful chisel-tip markers in red blue green black orange purple, caps on, neatly arranged — teaching stationery, studio product photography, no people", 311),
    R("colourful whiteboard markers product shot on white: 6 markers fanned out showing different colours with chisel tips — teaching and presentation stationery, sharp focus, no people", 312),
    R("whiteboard marker set 6 colours on white: red blue green black orange purple markers lined up — clinical teaching stationery product photography, no people", 313),
    R("6 whiteboard markers arranged in arc on white background: multi-colour chisel-tip markers, caps on — hospital teaching stationery product shot, no people", 315),
  ],
  usb: [
    R("silver 16GB USB flash drive on pure white background: compact rectangular USB drive with metal cap, 16GB printed on body, USB-A connector visible — student data storage device, studio product photography, no people", 321),
    R("close-up of 16GB USB flash drive on white: compact metal silver USB stick with cap, storage capacity label — student study material storage device, sharp focus, no people", 322),
    R("USB flash drive 16GB product shot on white: slim silver metal USB drive with cap and without cap showing connector — medical student study data storage, studio lighting, no people", 323),
    R("16GB USB flash drive with cap beside it on white background: compact silver USB stick — student study material storage device product photography, no people", 325),
  ],
  kit4: [
    R("physiotherapy consumables refill kit flat lay on white: ultrasound gel bottle, cotton roll, sanitizer pump bottle, adhesive tape roll — medical consumables product photography, no people", 401),
    R("medical consumables flat lay on white surface: clear ultrasound gel 250ml, white cotton roll, hand sanitizer bottle, white adhesive tape roll — clinical refill kit, studio lighting, no people", 402),
    R("physiotherapy refill consumables on white: ultrasound coupling gel, cotton wool roll, hand pump sanitizer bottle, micropore tape — clinical supplies top view, no people", 403),
    R("medical consumables spread on white background: gel bottle, cotton roll, sanitizer, tape roll — physiotherapy clinical consumables product photography, no people", 405),
  ],
  assessmentpad: [
    R("clinical assessment sheet pad on pure white background: A4 spiral pad with pre-printed physiotherapy assessment forms, green and white cover — medical student documentation tool, studio product photography, no people", 411),
    R("open physiotherapy assessment sheet pad on white: printed ROM measurement forms and patient history template — clinical documentation pad, sharp focus, no people", 412),
    R("assessment sheet pad product shot on white: spiral bound clinical forms notepad with physiotherapy assessment templates — BPT student documentation, studio lighting, no people", 413),
    R("physiotherapy assessment notepad closed on white background: spiral pad with printed clinical forms cover — BPT practical documentation tool, product photography, no people", 415),
  ],
  anatomycharts: [
    R("set of laminated anatomy charts on pure white background: full-colour human body system charts showing musculoskeletal and nervous system — medical student visual reference, studio product photography, no people", 421),
    R("close-up of anatomy chart on white: full-colour laminated chart showing detailed muscle origins and insertions with labels — physiotherapy study reference, sharp focus, no people", 422),
    R("anatomy charts flat lay on white surface: multiple full-colour laminated body system charts fanned out — BPT medical student visual study tools, studio lighting, no people", 423),
    R("laminated anatomy chart product shot on white: full-colour human musculoskeletal system poster with detailed anatomical labels — physiotherapy study reference, no people", 425),
  ],
  flashcards: [
    R("BPT physiotherapy revision flashcards on pure white background: deck of white cards with medical terms on front — compact revision tool, studio product photography, no people", 431),
    R("close-up of physio revision flashcard on white: double-sided card showing anatomy term on front — BPT medical student revision aid, sharp focus, no people", 432),
    R("flashcard deck fanned out on white surface: white double-sided revision cards with physiotherapy topics — BPT student study tool, studio lighting, no people", 433),
    R("physiotherapy flashcards product shot on white: deck of revision cards in holder — medical student compact revision aid, product photography, no people", 435),
  ],
  therapyball: [
    R("inflated blue therapy exercise ball on pure white background: medium-size anti-burst Swiss ball, textured surface — physiotherapy rehabilitation equipment, studio product photography, no people", 441),
    R("close-up of therapy ball surface on white: anti-burst PVC exercise ball textured surface — physiotherapy balance training equipment, sharp focus, no people", 442),
    R("exercise therapy ball on white floor: fully inflated blue Swiss ball — physiotherapy rehabilitation core strengthening equipment, studio lighting, no people", 443),
    R("therapy ball product shot on white: blue anti-burst exercise ball with pump — physiotherapy rehab training equipment, product photography, no people", 445),
  ],
  handgrip: [
    R("hand grip strengthener on pure white background: D-shaped spring grip device with foam handles, adjustable resistance — physiotherapy rehabilitation tool, studio product photography, no people", 451),
    R("close-up of grip strengthener spring mechanism on white: metal coil spring between two ergonomic handles — hand rehabilitation physiotherapy device, sharp focus, no people", 452),
    R("adjustable hand grip strengthener product shot on white: compact D-grip spring device — physiotherapy upper limb rehabilitation tool, studio lighting, no people", 453),
    R("hand grip strengthener isolated on white: spring resistance grip device with foam covered handles — physiotherapy hand strength training tool, no people", 455),
  ],
  tenselectrodes: [
    R("TENS electrodes on pure white background: four self-adhesive rectangular carbon film electrode pads with snap connectors — electrotherapy physiotherapy consumable, studio product photography, no people", 461),
    R("close-up of TENS electrode pad on white: grey self-adhesive carbon electrode showing snap connector and sticky side — electrotherapy consumable, sharp focus, no people", 462),
    R("TENS electrode set flat lay on white: four rectangular self-adhesive pads with lead wires — electrotherapy physiotherapy consumable, studio lighting, no people", 463),
    R("electrotherapy electrodes product shot on white: reusable self-adhesive TENS electrode pads — physiotherapy IFT consumable product photography, no people", 465),
  ],
  lubgel: [
    R("lubricating gel bottle on pure white background: clear pump or flip-cap bottle with water-based therapeutic gel label — physiotherapy massage product, studio product photography, no people", 471),
    R("close-up of lubrication gel bottle on white: clear transparent bottle with flip cap showing gel inside — physiotherapy massage therapy product, sharp focus, no people", 472),
    R("therapeutic lubricating gel standing on white surface: clear bottle with dispensing cap — physiotherapy massage and manual therapy product, studio lighting, no people", 473),
    R("lubrication gel product shot on white: clear water-based gel bottle for physiotherapy massage — manual therapy consumable product photography, no people", 475),
  ],
  scrubs: [
    R("navy blue medical scrubs set on pure white background: v-neck scrub top and drawstring pants on flat lay, two front pockets on top, professional clinical uniform — physiotherapy student apparel, studio product photography, no people", 331),
    R("medical scrub top close-up on white: navy blue v-neck cotton-blend clinical top with two front pockets, neat finish — physiotherapy student uniform, sharp focus, no people", 332),
    R("navy blue scrubs set folded neatly on white surface: v-neck scrub top and matching pants — professional clinical physiotherapy uniform, studio lighting, no people", 333),
    R("ceil blue medical scrubs set flat lay on white: v-neck scrub top and pants — professional clinical uniform for physiotherapy student, product photography, no people", 335),
  ],
  apron: [
    R("white full-length lab apron on white background displayed on hanger: two large front pockets, adjustable neck strap, waist tie strings, clean cotton-polyester blend — medical student laboratory garment, studio product photography, no people", 341),
    R("white lab apron front view on white: full length protective apron with two front pockets and neck strap — medical student physiotherapy lab garment, sharp focus, no people", 342),
    R("white medical lab apron folded neatly on white surface: cotton-polyester blend full length apron with pockets — clinical laboratory protective garment, studio lighting, no people", 343),
    R("white lab apron hanging on hook on white background: full-length clinical protective apron with front pockets — medical student laboratory uniform product photography, no people", 345),
  ],
};

// ── Kits ──────────────────────────────────────────────────────
const KITS = [
  {
    id: "kit-1", type: "kit",
    name: "Physio Curated Kit",
    tagline: "The complete BPT starter bundle",
    price: 2500, originalPrice: 3500,
    badge: "BESTSELLER",
    desc: "The MedVault Physio Curated Kit is the definitive starter bundle for BPT students at SRM. Carefully assembled by physiotherapy professionals, this kit contains every instrument required for your practical labs, ward assessments, and clinical skill-building sessions — from core physio instruments to rehab tools and study essentials. Each item is individually quality-checked before packing. Instead of sourcing 10+ items from multiple vendors, get everything in one order delivered straight to your campus hostel.",
    items: [
      { name: "Goniometer Set", qty: 1, retail: 450 },
      { name: "Reflex Hammer", qty: 1, retail: 150 },
      { name: "Tuning Fork (128 Hz)", qty: 1, retail: 220 },
      { name: "Measuring Tape", qty: 1, retail: 80 },
      { name: "Stethoscope", qty: 1, retail: 799 },
      { name: "Resistance Bands Set", qty: 1, retail: 299 },
      { name: "Anatomy Charts", qty: 1, retail: 349 },
      { name: "USB Drive (16GB)", qty: 1, retail: 299 },
      { name: "Ultrasound Gel", qty: 1, retail: 150 },
      { name: "Assessment Sheet Pad", qty: 1, retail: 199 },
    ],
    stock: 48, images: IMG.kit1,
    features: ["Hospital-grade instruments", "Curated for BPT curriculum", "Delivered to SRM campus", "Quality-checked by MedVault"],
  },
  {
    id: "kit-2", type: "kit",
    name: "Practical Exam Kit",
    tagline: "Core instruments + PPE for practicals",
    price: 1500, originalPrice: 2100,
    badge: "EXAM READY",
    desc: "The Practical Exam Kit covers the core instruments and consumables required for BPT practical examinations. Designed for students who need a compact, exam-ready bundle — clinical assessment tools, PPE essentials, and documentation supplies in one pack. All instruments are clinical-grade, lightweight, and ready for your exam hall.",
    items: [
      { name: "Goniometer Set", qty: 1, retail: 450 },
      { name: "Reflex Hammer", qty: 1, retail: 150 },
      { name: "Tuning Fork (128 Hz)", qty: 1, retail: 220 },
      { name: "Measuring Tape", qty: 1, retail: 80 },
      { name: "Nitrile Gloves (Box)", qty: 1, retail: 150 },
      { name: "Mask Pack", qty: 1, retail: 100 },
      { name: "Assessment Sheet Pad", qty: 1, retail: 199 },
      { name: "Cotton Roll", qty: 1, retail: 79 },
    ],
    stock: 72, images: IMG.kit2,
    features: ["Core exam instruments", "PPE included", "Documentation essentials", "Quick delivery"],
  },
  {
    id: "kit-3", type: "kit",
    name: "Smart Study Kit",
    tagline: "Study essentials bundle",
    price: 800, originalPrice: 1100,
    badge: "STUDY SMART",
    desc: "The Smart Study Kit bundles all the study and hygiene essentials a BPT student needs for a productive semester. Full-colour anatomy charts for visual learning, flashcards for rapid revision, a notebook set for clinical notes, marker pens for study sessions, and disposable masks for ward visits. Everything packed together at a price that makes sense — no need to shop multiple places before the semester starts.",
    items: [
      { name: "Anatomy Charts", qty: 1, retail: 349 },
      { name: "Flashcards", qty: 1, retail: 299 },
      { name: "Notebook Set", qty: 1, retail: 100 },
      { name: "Marker Pens Set", qty: 1, retail: 149 },
      { name: "Mask Pack", qty: 1, retail: 100 },
    ],
    stock: 100, images: IMG.kit3,
    features: ["Visual learning tools", "Rapid revision aids", "Hygiene essentials included", "Great value bundle"],
  },
  {
    id: "kit-4", type: "kit",
    name: "Refill Kit",
    tagline: "Consumables & rehab restocking pack",
    price: 500, originalPrice: 700,
    badge: "REFILL",
    desc: "The MedVault Refill Kit is a curated pack of everyday consumables that need regular restocking throughout your semester. Ultrasound gel, cotton roll, sanitizer, and adhesive tape — all the supplies you'll go through in labs and clinical sessions. Order once, stay stocked. Ideal for students already equipped with instruments who just need their consumables topped up.",
    items: [
      { name: "Ultrasound Gel (250ml)", qty: 1, retail: 150 },
      { name: "Cotton Roll", qty: 1, retail: 79 },
      { name: "Sanitizer Bottle", qty: 1, retail: 120 },
      { name: "Adhesive Tape", qty: 1, retail: 90 },
    ],
    stock: 80, images: IMG.kit4,
    features: ["Everyday consumables", "Refill when you run out", "Compact & practical", "Best-value restocking"],
  },
];

// ── Individual Items ───────────────────────────────────────────
const ITEMS = [
  // CAT001 — Core Physio Instruments
  { id:"i-1",  type:"item", name:"Goniometer Set (3-in-1)",     tagline:"Joint ROM measurement",          price:450, originalPrice:650,  badge:"PHYSIO TOOL",     images:IMG.goniometer,    desc:"A complete 3-piece goniometer set used for measuring joint range of motion (ROM) in physiotherapy assessments. The set includes a large goniometer for major joints like the hip, knee, and shoulder; a standard goniometer for elbow and ankle; and a finger goniometer for small joint measurements. Made from durable plastic with clearly printed degree markings. An absolute must-have for every BPT practical, especially in musculoskeletal physiotherapy sessions.", stock:80 },
  { id:"i-2",  type:"item", name:"Reflex Hammer",                tagline:"Deep tendon reflex testing",      price:150, originalPrice:220,  badge:"NEURO TOOL",      images:IMG.hammer,        desc:"The Taylor percussion hammer is the standard tool for testing deep tendon reflexes in neurological and physiotherapy assessments. Features a triangular rubber head for reliable tendon strike and a stainless steel handle with comfortable grip. Used to test patellar (knee-jerk), Achilles, biceps, triceps, and brachioradialis reflexes. Lightweight and pocket-friendly — essential for neurology practical exams.", stock:95 },
  { id:"i-3",  type:"item", name:"Tuning Fork (128 Hz)",         tagline:"Vibration & hearing tests",       price:220, originalPrice:320,  badge:"NEURO TOOL",      images:IMG.tuningfork,    desc:"A 128 Hz aluminium alloy tuning fork used for assessing vibration sense and conducting Rinne and Weber tests. The 128 Hz frequency is optimal for vibration perception testing on bony prominences such as the medial malleolus, tibial crest, and finger joints. Frequency is stamped on the handle for quick identification. Durable, corrosion-resistant, and required for both neurological and ENT practical assessments in BPT.", stock:60 },
  { id:"i-4",  type:"item", name:"Measuring Tape (150cm)",       tagline:"Body & limb measurement",         price:80,  originalPrice:120,  badge:"MEASUREMENT",     images:IMG.tape,          desc:"A flexible 150cm measuring tape used extensively in physiotherapy for limb girth measurements, postural assessment, anthropometric measurements, and wound sizing. Dual-sided with centimeter markings on one side and inch markings on the other. Made from a soft, non-stretch material that conforms to body contours. Lightweight, rollable, and fits easily in a pocket or pouch — used in nearly every physio practical session.", stock:150 },
  { id:"i-6",  type:"item", name:"Stethoscope",                  tagline:"Dual-head auscultation",          price:799, originalPrice:1299, badge:"MONITORING",      images:IMG.stethoscope,   desc:"A dual-head acoustic stethoscope with a diaphragm for high-frequency sounds (breath, bowel, and normal heart sounds) and a bell for low-frequency sounds (murmurs, S3/S4 heart sounds). Features high acoustic sensitivity, soft-seal ear tips for a comfortable fit, and latex-free tubing. Suitable for cardiac, pulmonary, and abdominal auscultation. A fundamental clinical tool for all BPT students — from first-year anatomy labs to third-year clinical postings.", stock:55 },
  // CAT002 — Practical Exam Kit Items
  { id:"i-17", type:"item", name:"Mask Pack (10 pcs)",           tagline:"3-ply disposable masks",          price:100, originalPrice:149,  badge:"PPE",             images:IMG.mask,          desc:"A pack of 10 three-ply disposable surgical face masks providing protection against respiratory droplets and aerosols during clinical contact. The three-layer construction includes a fluid-resistant outer layer, a filtration middle layer, and a soft inner layer for comfort. Adjustable nose wire ensures a secure fit. Mandatory PPE for ward postings, patient assessments, and practical labs involving close patient contact. Individually stacked and hygienically packed.", stock:300 },
  { id:"i-18", type:"item", name:"Nitrile Gloves (Box)",         tagline:"Powder-free examination gloves",  price:299, originalPrice:399,  badge:"PPE",             images:IMG.gloves,        desc:"A box of powder-free, latex-free nitrile examination gloves providing a secure barrier during patient examination, wound dressing, and clinical procedures. Nitrile material is more puncture-resistant than latex and safe for those with latex allergies. Textured fingertips enhance grip when handling instruments. Available in standard sizes suitable for most students. Required PPE for ward rounds, practical assessments, and any procedure involving physical patient contact.", stock:150 },
  { id:"i-24", type:"item", name:"Assessment Sheet Pad",         tagline:"Clinical documentation forms",    price:199, originalPrice:299,  badge:"STUDY TOOL",      images:IMG.assessmentpad, desc:"A clinical assessment sheet pad with pre-printed forms for recording patient history, ROM measurements, muscle testing grades, postural analysis, and outcome measures — aligned to BPT curriculum practical assessment formats. Perforated sheets for easy removal and submission during practicals. An essential documentation tool for musculoskeletal, neurological, and cardiopulmonary physiotherapy labs.", stock:120 },
  { id:"i-22", type:"item", name:"Marker Pens Set",              tagline:"Whiteboard markers + pens",       price:149, originalPrice:199,  badge:"STATIONERY",      images:IMG.markerset,     desc:"A set of colourful whiteboard markers in multiple colours for study sessions, group learning, whiteboard teaching presentations, and annotating anatomy charts. Chisel-tip design allows both broad strokes for headings and fine lines for detail. Ink is easily wipeable from whiteboards and glass surfaces. Used in physio lab teaching demonstrations, anatomy revision sessions, and group case discussions.", stock:100 },
  // CAT003 — Smart Study Kit Items
  { id:"i-25", type:"item", name:"Anatomy Charts",               tagline:"Full-colour body system charts",  price:349, originalPrice:499,  badge:"STUDY TOOL",      images:IMG.anatomycharts, desc:"A set of full-colour laminated anatomy charts covering the major body systems — musculoskeletal, neurological, and cardiopulmonary. Includes charts for key anatomical landmarks, muscle origins and insertions, nerve distributions, and joint anatomy. Essential visual reference for BPT anatomy labs, revision sessions, and clinical correlations throughout your degree.", stock:80 },
  { id:"i-26", type:"item", name:"Flashcards",                   tagline:"BPT rapid revision cards",        price:299, originalPrice:399,  badge:"REVISION AID",    images:IMG.flashcards,    desc:"A deck of BPT revision flashcards covering key physiotherapy concepts, anatomy landmarks, clinical assessment techniques, and treatment protocols. Double-sided cards with term on front and definition or diagram on reverse. Compact, portable, and ideal for quick revision before practicals, internals, or clinical postings. Structured to match the SRM BPT syllabus across all semesters.", stock:100 },
  { id:"i-20", type:"item", name:"Notebook Set",                 tagline:"Clinical note-taking",            price:100, originalPrice:149,  badge:"STATIONERY",      images:IMG.notepad,       desc:"A spiral-bound ruled notebook set ideal for clinical note-taking, case history recording, practical observations, and everyday class notes. Compact enough to carry in a scrubs pocket or pouch but large enough for detailed case write-ups. Smooth paper surface works well with ballpoint pens, gel pens, and markers. A practical companion for ward rounds, physio labs, and study sessions throughout your BPT degree.", stock:150 },
  { id:"i-21", type:"item", name:"Pen Set (5 pcs)",              tagline:"Everyday writing set",            price:49,  originalPrice:79,   badge:"STATIONERY",      images:IMG.penset,        desc:"A set of 5 smooth-writing ballpoint pens in a mix of ink colours — ideal for clinical documentation, case record writing, annotating study notes, and everyday classroom use. The medium-point tip provides consistent ink flow without smudging. Lightweight barrel with comfortable grip for extended writing sessions during classes and practicals. Pens run out faster than you think during a semester — keep a spare set from day one.", stock:200 },
  { id:"i-23", type:"item", name:"USB Drive (16GB)",             tagline:"Study material storage",          price:299, originalPrice:499,  badge:"UTILITY",         images:IMG.usb,           desc:"A compact 16GB USB flash drive for storing and transferring study material, lecture slides, anatomy videos, and clinical reference documents. Plug-and-play compatible with Windows, Mac, and most smart TVs and projectors. Fast read/write speeds for quick file transfer between devices. The 16GB capacity comfortably holds an entire semester's worth of lecture notes, practical manuals, and recorded lectures.", stock:80 },
  // CAT004 — Rehab & Therapy Tools
  { id:"i-9",  type:"item", name:"Resistance Bands Set",         tagline:"Progressive resistance training", price:299, originalPrice:449,  badge:"REHAB",           images:IMG.band,          desc:"A set of latex-free resistance exercise bands in multiple resistance levels — used for progressive resistance training and rehabilitation exercises in physiotherapy. Suitable for upper and lower limb strengthening — shoulder exercises, knee extension, hip abduction, and wrist flexion/extension. Resistance bands are used across all BPT semesters for exercises like terminal knee extension, clamshell, and theraband shoulder routines. Lightweight, portable, and durable.", stock:120 },
  { id:"i-27", type:"item", name:"Therapy Ball",                 tagline:"Balance & core rehabilitation",   price:549, originalPrice:799,  badge:"REHAB",           images:IMG.therapyball,   desc:"A medium-density anti-burst therapy ball used for balance training, core strengthening, proprioceptive exercises, and rehabilitation in physiotherapy practice. Used in BPT labs for Swiss ball exercises including bridging, prone extensions, seated balance work, and core activation routines. Durable PVC construction with anti-burst technology. Suitable for both clinical use and patient home exercise programs.", stock:40 },
  { id:"i-28", type:"item", name:"Hand Grip Strengthener",       tagline:"Upper limb rehab & strength",     price:299, originalPrice:449,  badge:"STRENGTH TOOL",   images:IMG.handgrip,      desc:"An adjustable spring-resistance hand grip strengthener for progressive upper limb rehabilitation and grip strength training. Adjustable resistance settings to match patient ability and progression. Used in physiotherapy for post-fracture rehab, neurological hand rehabilitation, rheumatoid arthritis management, and musculoskeletal strengthening programs. Compact, portable, and suitable for both clinic and home exercise prescription.", stock:60 },
  { id:"i-11", type:"item", name:"Foam Roller",                  tagline:"Myofascial release & recovery",   price:249, originalPrice:399,  badge:"RECOVERY",        images:IMG.foamroller,    desc:"A high-density EVA foam roller used for myofascial release, self-massage, and muscle recovery in physiotherapy practice. Rolling over tight muscles and trigger points helps improve flexibility, reduce delayed-onset muscle soreness (DOMS), and promote circulation. Used in BPT labs for thoracic spine mobility, IT band rolling, calf and hamstring release, and core activation. Durable, lightweight, and suitable for both clinical use and home exercise programs.", stock:50 },
  { id:"i-29", type:"item", name:"TENS Electrodes",              tagline:"Electrotherapy electrode pads",   price:349, originalPrice:499,  badge:"ELECTROTHERAPY",  images:IMG.tenselectrodes,desc:"A set of reusable self-adhesive TENS/EMS electrode pads compatible with standard ITO-style snap connectors used in most TENS and interferential therapy (IFT) machines. Hypoallergenic adhesive, re-placeable carbon film surface, and washable for multiple clinical sessions. Used extensively in electrotherapy practicals for TENS and IFT application — a consumable every BPT student from second year onwards will need regularly.", stock:80 },
  // CAT005 — Consumables & Refill Kit
  { id:"i-13", type:"item", name:"Ultrasound Gel (250ml)",       tagline:"UST coupling medium",             price:150, originalPrice:220,  badge:"CONSUMABLE",      images:IMG.ultrasoundgel, desc:"A clear, water-based ultrasound coupling gel used as a medium between the ultrasound transducer head and the patient's skin during therapeutic ultrasound (UST) sessions. Ensures optimal acoustic transmission by eliminating air gaps. Non-staining, hypoallergenic, and easy to wipe off. The 250ml bottle is standard for clinical labs and lasts through multiple practical sessions. Required for electrotherapy and UST practicals in BPT second year onwards.", stock:150 },
  { id:"i-15", type:"item", name:"Cotton Roll",                  tagline:"Medical grade cotton wool",       price:79,  originalPrice:119,  badge:"CONSUMABLE",      images:IMG.cotton,        desc:"A roll of medical-grade cotton wool used for wound dressing, surface cleaning, electrode placement padding, and general clinical procedures. Soft, highly absorbent, and lint-free. Used in physiotherapy labs for cleaning skin before electrode application, padding bony prominences during splinting, and general clinical hygiene tasks. Comes sealed to maintain sterility and cleanliness. A basic consumable every BPT student needs in their kit.", stock:180 },
  { id:"i-14", type:"item", name:"Sanitizer Bottle",             tagline:"70% alcohol hand sanitizer",      price:120, originalPrice:179,  badge:"HYGIENE",         images:IMG.sanitizer,     desc:"A pump-dispenser bottle of 70% isopropyl alcohol hand sanitizer for on-the-go hand hygiene during ward rounds, between patient assessments, after handling equipment, or whenever hand washing isn't possible. Compact bottle suitable for carrying in a scrubs pocket or pouch. An essential hygiene item for all clinical and campus practical sessions throughout your BPT degree.", stock:200 },
  { id:"i-16", type:"item", name:"Adhesive Tape",                tagline:"Clinical strapping tape",         price:90,  originalPrice:129,  badge:"CONSUMABLE",      images:IMG.medtape,       desc:"A hypoallergenic paper adhesive tape used for securing wound dressings, fixing electrodes during electrotherapy, bandage strapping, and general clinical taping applications. Gentle on skin, breathable, and easy to tear by hand without scissors. The adhesive holds securely without leaving residue on skin. A standard consumable in all physiotherapy labs — used for TENS/IFT electrode fixation, wound covering, and strapping practice in musculoskeletal practicals.", stock:200 },
  { id:"i-30", type:"item", name:"Lubrication Gel",              tagline:"Massage & manual therapy gel",    price:299, originalPrice:399,  badge:"THERAPEUTIC",     images:IMG.lubgel,        desc:"A water-based lubricating gel used in physiotherapy for manual therapy, therapeutic massage, ultrasound coupling, and electrode fixation. Hypoallergenic, non-staining, and easy to wipe off. Provides the right consistency for myofascial techniques, joint mobilization, and soft tissue massage during physiotherapy practice sessions. Compatible with most ultrasound transducers and TENS/IFT machines.", stock:90 },
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
    desc:"A white full-length lab apron made from a polyester-cotton blend fabric that is easy to clean, resistant to light chemical splashes, and durable for semester-long lab use. Features two spacious front pockets for storing pens, notepads, and small instruments during lab sessions. The adjustable neck strap and back tie ensure a secure, comfortable fit across different body types. Meets SRM's practical lab dress code requirements for anatomy, physiology, and physiotherapy labs. Easy to wash and quick to dry — an essential item for every lab session.",
    sizes:["S","M","L","XL"], sizeNote:"Select based on height. M fits 5'4\"–5'8\".", stock:80, colors:["White"],
    features:["Polyester-cotton blend","Two front pockets","Adjustable neck strap","Easy to clean","SRM compliant"],
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
    images:[AMZ("0323834604"), OL("9780702078491"), GB("8sCOWgEACAAJ"), BK("Ross Wilson Anatomy Physiology Health Illness Elsevier textbook",401)] },

  { id:"b-2",  type:"book", year:"1st Year", subject:"Anatomy",
    name:"Gray's Anatomy", tagline:"Gray H. · Churchill Livingstone",
    price:1249, originalPrice:1499, badge:"1ST YEAR", stock:15,
    desc:"The definitive anatomical reference, Gray's Anatomy is the gold standard for medical and physiotherapy students. The Churchill Livingstone edition provides comprehensive coverage of gross anatomy with detailed illustrations, clinical boxes, and dissection guides. Essential for BPT first-year anatomy lab preparation and long-term clinical reference.",
    images:[AMZ("0443069522"), OL("9780702052309"), GB("CxVqAAAAMAAJ"), BK("Grays Anatomy Churchill Livingstone textbook cover classic medical reference",411)] },

  { id:"b-3",  type:"book", year:"1st Year", subject:"Physiology",
    name:"Textbook of Medical Physiology", tagline:"Guyton A.C. & Hall J.E. · Elsevier",
    price:849, originalPrice:1099, badge:"1ST YEAR", stock:18,
    desc:"Guyton and Hall's Textbook of Medical Physiology is the most widely used physiology textbook in medical and physiotherapy education. Covers all major organ systems with clinical correlations, updated research, and clear mechanistic explanations. The Elsevier edition includes full-colour illustrations and a comprehensive index — essential for BPT first and second year physiology.",
    images:[AMZ("0323597122"), OL("9780323597128"), GB("wqkVAAAAYAAJ"), BK("Guyton Hall Textbook Medical Physiology Elsevier textbook cover",421)] },

  { id:"b-4",  type:"book", year:"1st Year", subject:"Physiology",
    name:"Essentials of Medical Physiology", tagline:"Sembulingam K. · Jaypee",
    price:449, originalPrice:549, badge:"1ST YEAR", stock:22,
    desc:"Sembulingam's Essentials of Medical Physiology is a concise, India-focused physiology text popular among BPT students for its straightforward explanations and exam-oriented approach. The Jaypee edition covers all major physiological systems with relevant clinical applications, making it an ideal companion to Guyton or as a standalone revision resource.",
    images:[AMZ("9352706927"), OL("9789386150950"), GB("YYBhDwAAQBAJ"), BK("Sembulingam Essentials Medical Physiology Jaypee textbook cover",431)] },

  { id:"b-5",  type:"book", year:"1st Year", subject:"Psychology",
    name:"General Psychology", tagline:"Mangal S.K.",
    price:279, originalPrice:349, badge:"1ST YEAR", stock:25,
    desc:"Mangal's General Psychology is the prescribed psychology text for BPT first year, covering fundamental psychological concepts including behaviour, perception, learning, memory, motivation, emotion, and personality. Written in simple language with Indian examples, it helps physiotherapy students understand the psychosocial dimensions of patient care and therapeutic relationships.",
    images:[AMZ("9386245760"), OL("9788121909310"), BK("General Psychology Mangal textbook cover Indian education publisher",441)] },

  { id:"b-6",  type:"book", year:"1st Year", subject:"Sociology",
    name:"An Introduction to Sociology", tagline:"Sachdeva D.R. & Bhushan V.",
    price:229, originalPrice:299, badge:"1ST YEAR", stock:25,
    desc:"Sachdeva and Bhushan's Introduction to Sociology covers the core sociological concepts required in the BPT first-year curriculum: social structure, culture, family, community health, and social determinants of disease. Helps physiotherapy students understand patients in their social context and develop community-oriented clinical practice.",
    images:["https://www.kitabmahalpublishers.com/uploads/product_image/product_9788122507324_1.jpg", OL("9788131512340"), BK("Introduction Sociology textbook Sachdeva Bhushan Indian publisher",451)] },

  // 2nd Year
  { id:"b-7",  type:"book", year:"2nd Year", subject:"Pathology & Microbiology",
    name:"Textbook of Pathology", tagline:"Mohan H. · Jaypee",
    price:649, originalPrice:799, badge:"2ND YEAR", stock:18,
    desc:"Mohan's Textbook of Pathology is the standard pathology reference for BPT second year, providing a comprehensive understanding of disease processes, cellular pathology, inflammation, neoplasia, and organ-specific diseases. The Jaypee edition is widely available in India and includes full-colour histopathology images, relevant clinical correlations, and exam-oriented summaries.",
    images:[AMZ("8180613682"), OL("9789386150394"), GB("F-nRsgEACAAJ"), BK("Mohan Textbook Pathology Jaypee medical textbook cover",461)] },

  { id:"b-8",  type:"book", year:"2nd Year", subject:"Exercise Therapy",
    name:"Principles of Exercise Therapy", tagline:"Gardiner D. · CBS Publishers",
    price:449, originalPrice:549, badge:"2ND YEAR", stock:20,
    desc:"Gardiner's Principles of Exercise Therapy is the core exercise therapy textbook for BPT second year, covering the theoretical and practical foundations of therapeutic exercise including active, passive, resisted, and stretching exercises. Includes principles of strengthening, endurance training, and functional movement — directly applicable to BPT practical lab work.",
    images:[AMZ("8123908938"), OL("9788123910765"), BK("Principles Exercise Therapy Gardiner CBS Publishers textbook cover",471)] },

  { id:"b-9",  type:"book", year:"2nd Year", subject:"Biomechanics",
    name:"Joint Structure and Function", tagline:"Norkin C.C. & Levangie P.K. · F.A. Davis",
    price:749, originalPrice:899, badge:"2ND YEAR", stock:15,
    desc:"Norkin and Levangie's Joint Structure and Function is the definitive biomechanics reference for physiotherapy students, covering articular structure, kinematics, and kinetics of all major joints. Published by F.A. Davis, it bridges anatomy and clinical physiotherapy practice, making it essential for understanding normal and pathological movement in BPT second year.",
    images:[AMZ("0803607105"), OL("9780803623620"), GB("ym7HPQAACAAJ"), BK("Joint Structure Function Norkin Levangie FA Davis textbook cover",481)] },

  { id:"b-10", type:"book", year:"2nd Year", subject:"Pharmacology",
    name:"Essentials of Medical Pharmacology", tagline:"Tripathi K.D. · Jaypee",
    price:549, originalPrice:699, badge:"2ND YEAR", stock:20,
    desc:"Tripathi's Essentials of Medical Pharmacology is the standard pharmacology text used across Indian medical and allied health curricula. Covers all major drug classes with mechanisms of action, indications, contraindications, and clinical uses relevant to physiotherapy practice — including NSAIDs, muscle relaxants, analgesics, and drugs used in neurological and cardiovascular conditions.",
    images:[AMZ("9356964327"), OL("9789389587166"), GB("2gP1DwAAQBAJ"), BK("Tripathi Essentials Medical Pharmacology Jaypee textbook cover",491)] },

  // 3rd Year
  { id:"b-11", type:"book", year:"3rd Year", subject:"Electrotherapy",
    name:"Electrotherapy Explained: Principles and Practice", tagline:"Robertson V. · Elsevier",
    price:649, originalPrice:799, badge:"3RD YEAR", stock:15,
    desc:"Robertson's Electrotherapy Explained is the comprehensive reference for electrotherapy in BPT third year, covering TENS, ultrasound, IFT, shortwave diathermy, LASER, and neuromuscular electrical stimulation. The Elsevier edition includes physiological rationale, evidence-based clinical applications, dosage guidelines, contraindications, and safety protocols — aligned directly to the BPT electrotherapy curriculum.",
    images:[AMZ("0750688432"), OL("9780750688147"), GB("3RcuI8nfJFEC"), BK("Electrotherapy Explained Robertson Elsevier textbook cover",501)] },

  { id:"b-12", type:"book", year:"3rd Year", subject:"General Medicine & Surgery",
    name:"Principles and Practice of Medicine", tagline:"Davidson's · Elsevier",
    price:999, originalPrice:1299, badge:"3RD YEAR", stock:12,
    desc:"Davidson's Principles and Practice of Medicine is the gold-standard internal medicine reference, widely used by physiotherapy students in their third year clinical postings. Covers major medical conditions, their pathophysiology, diagnosis, and management — providing physiotherapy students the medical background needed for evidence-based clinical reasoning in all specialty areas.",
    images:[AMZ("0702083488"), OL("9780702070273"), GB("9x5FEAAAQBAJ"), BK("Davidsons Principles Practice Medicine Elsevier textbook cover",511)] },

  { id:"b-13", type:"book", year:"3rd Year", subject:"Orthopaedics",
    name:"Essential Orthopaedics", tagline:"Maheshwari J. · Jaypee",
    price:549, originalPrice:699, badge:"3RD YEAR", stock:18,
    desc:"Maheshwari's Essential Orthopaedics is the primary orthopaedics reference for BPT third year, covering fractures, dislocations, joint diseases, spinal conditions, and orthopaedic procedures from a clinical perspective. The Jaypee edition is India-specific, with conditions and clinical cases relevant to the Indian population and hospital setting, making it ideal for ward postings.",
    images:[AMZ("9372026654"), OL("9789354651403"), GB("rOtFDwAAQBAJ"), BK("Maheshwari Essential Orthopaedics Jaypee textbook cover India",521)] },

  { id:"b-14", type:"book", year:"3rd Year", subject:"Neurology",
    name:"Neurological Examination in Clinical Practice", tagline:"Bickerstaff E.R.",
    price:449, originalPrice:549, badge:"3RD YEAR", stock:15,
    desc:"Bickerstaff's Neurological Examination in Clinical Practice is the clinical neurology examination guide used by BPT students in their third-year neurology postings. Covers systematic neurological assessment — cranial nerves, motor system, sensory system, reflexes, coordination, and cerebellar function — with practical guidance for examination technique and clinical interpretation.",
    images:[AMZ("086542909X"), OL("9780632013173"), GB("9jtqAAAAMAAJ"), BK("Bickerstaff Neurological Examination Clinical Practice textbook cover",531)] },

  // Final Year
  { id:"b-15", type:"book", year:"Final Year", subject:"Physiotherapy in Orthopaedics",
    name:"Clinical Orthopaedic Rehabilitation", tagline:"Brotzman S.B. · Elsevier",
    price:799, originalPrice:999, badge:"FINAL YEAR", stock:12,
    desc:"Brotzman's Clinical Orthopaedic Rehabilitation is the definitive rehabilitation protocols reference for final-year BPT students and clinical physiotherapists. Provides evidence-based, protocol-driven rehabilitation programs for all major orthopaedic conditions — ACL reconstruction, rotator cuff repair, hip and knee arthroplasty, and sports injuries — aligned to current clinical practice standards.",
    images:[AMZ("0323393705"), OL("9780323393706"), GB("bkXfBQAAQBAJ"), BK("Brotzman Clinical Orthopaedic Rehabilitation Elsevier textbook cover",541)] },

  { id:"b-16", type:"book", year:"Final Year", subject:"Physiotherapy in Neurology",
    name:"Neurological Rehabilitation", tagline:"Umphred D.A. · Mosby",
    price:849, originalPrice:1049, badge:"FINAL YEAR", stock:10,
    desc:"Umphred's Neurological Rehabilitation is the comprehensive neurorehabilitation reference for final-year BPT students, covering neuroplasticity, motor control theories, and rehabilitation approaches for stroke, traumatic brain injury, spinal cord injury, Parkinson's disease, multiple sclerosis, and cerebral palsy. The Mosby edition is internationally recognised and includes evidence-based intervention frameworks.",
    images:[AMZ("032307586X"), OL("9780323172271"), GB("tvMJAAAAQBAJ"), BK("Umphred Neurological Rehabilitation Mosby textbook cover physiotherapy",551)] },

  { id:"b-17", type:"book", year:"Final Year", subject:"Cardio-Respiratory Physiotherapy",
    name:"Physiotherapy for Respiratory and Cardiac Problems", tagline:"Pryor J.A. & Prasad S.A.",
    price:699, originalPrice:849, badge:"FINAL YEAR", stock:12,
    desc:"Pryor and Prasad's Physiotherapy for Respiratory and Cardiac Problems is the key cardiopulmonary physiotherapy reference for BPT final year, covering lung volumes, airway clearance techniques, breathing exercises, cardiac rehabilitation, and physiotherapy management of COPD, asthma, pneumonia, and post-cardiac surgery conditions. Includes evidence-based clinical reasoning frameworks.",
    images:[AMZ("813123634X"), OL("9780443073144"), GB("KBYDAAAACAAJ"), BK("Pryor Prasad Physiotherapy Respiratory Cardiac Problems textbook cover",561)] },

  { id:"b-18", type:"book", year:"Final Year", subject:"Therapeutic Exercise",
    name:"Therapeutic Exercise: Foundations and Techniques", tagline:"Kisner C. & Colby L. · F.A. Davis",
    price:799, originalPrice:999, badge:"FINAL YEAR", stock:10,
    desc:"Kisner and Colby's Therapeutic Exercise is the most comprehensive and widely used therapeutic exercise textbook in physiotherapy education. The F.A. Davis edition covers exercise principles, stretching, strengthening, aerobic conditioning, and condition-specific exercise programs for orthopaedic, neurological, and cardiopulmonary conditions — a cornerstone reference for final-year BPT students and practising physiotherapists.",
    images:[AMZ("080362574X"), OL("9780803658509"), GB("9GxHAAAAYAAJ"), BK("Kisner Colby Therapeutic Exercise Foundations Techniques FA Davis textbook",571)] },

  { id:"b-19", type:"book", year:"Final Year", subject:"Rehabilitation & Community Medicine",
    name:"Preventive and Social Medicine", tagline:"Park K.",
    price:449, originalPrice:549, badge:"FINAL YEAR", stock:20,
    desc:"Park's Preventive and Social Medicine is the standard PSM and community medicine reference for BPT final year, covering epidemiology, public health, nutrition, environmental health, health statistics, and community-based rehabilitation. Provides physiotherapy students with the public health framework needed for community outreach, disability management, and preventive physiotherapy programs.",
    images:["https://prithvibooks.com/wp-content/uploads/2025/01/Parks_Textbook_of_Preventive_and_Social_Medicine_28th_Edition_2025.png", OL("9789389863741"), GB("4D_CzgEACAAJ"), BK("Park Preventive Social Medicine textbook cover India public health",581)] },
];

const ALL_PRODUCTS = [...KITS, ...ITEMS, ...APPAREL, ...BOOK_ITEMS];

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
      background: "linear-gradient(160deg, #0A1628 0%, #0D2D5A 55%, #0A1E3E 100%)",
      padding: "108px 5% 72px", position: "relative", overflow: "hidden",
    }}>
      {/* Subtle grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
      {/* Glow blobs */}
      <div style={{ position: "absolute", top: -100, right: "8%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,87,168,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: "2%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,135,90,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="hero-row" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative" }}>
        <div style={{ flex: "0 0 auto", maxWidth: 540, animation: "fadeUp 0.7s ease both" }}>
          {/* Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,87,168,0.35)", border: "1px solid rgba(0,87,168,0.6)",
            borderRadius: 100, padding: "6px 18px", marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4CAF90", display: "block", boxShadow: "0 0 6px #4CAF90" }} />
            <span style={{ fontSize: 11, color: "#A8D5FF", fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>SRM Campus Delivery</span>
          </div>

          <h1 style={{
            fontWeight: 900, fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1.06,
            color: "#FFFFFF", marginBottom: 22, letterSpacing: "-1px",
          }}>
            Everything a<br />
            <span style={{
              background: "linear-gradient(90deg, #60A5FA, #34D399)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>BPT Student</span><br />
            <span style={{ color: "rgba(255,255,255,0.85)" }}>Needs.</span>
          </h1>

          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", fontWeight: 400, maxWidth: 460, lineHeight: 1.8, marginBottom: 40 }}>
            Physiotherapy instruments, clinical kits, scrubs &amp; study supplies — curated for SRM students and delivered to your hostel in 48 hours.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 48 }}>
            <button onClick={onShop} style={{
              background: "linear-gradient(135deg, #0057A8, #0070D4)",
              color: C.white, border: "none",
              padding: "15px 36px", borderRadius: 10, cursor: "pointer",
              fontWeight: 700, fontSize: 15, letterSpacing: 0.3,
              transition: "all 0.22s", boxShadow: "0 6px 20px rgba(0,87,168,0.45)",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,87,168,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,87,168,0.45)"; }}
            >Browse Kits &#8594;</button>
            <a href={`https://wa.me/918248613274?text=${encodeURIComponent("Hi MedVault, I'd like to place an order")}`} target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.9)", padding: "14px 24px", borderRadius: 10,
              textDecoration: "none", fontWeight: 600, fontSize: 14, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            >
              <span style={{ fontSize: 16 }}>&#128172;</span> Order on WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 36, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 28 }}>
            {[["4,000+", "Students Served"], ["28+", "Products"], ["1 hr", "Delivery"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontWeight: 800, fontSize: 24, color: "#FFFFFF", letterSpacing: "-0.5px" }}>{n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-img" style={{ animation: "fadeUp 0.9s ease 0.18s both" }}>
          <div style={{ position: "relative", animation: "float3d 5s ease-in-out infinite" }}>
            <div style={{ position: "absolute", inset: -24, borderRadius: 32, background: "radial-gradient(ellipse, rgba(0,87,168,0.3) 0%, transparent 70%)", zIndex: 0 }} />
            <img src="/kit.jpg" alt="MedVault Physio Kit" style={{
              position: "relative", zIndex: 1,
              width: "clamp(240px, 28vw, 430px)",
              borderRadius: 22, boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
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
    <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "16px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: "5%", flexWrap: "wrap" }}>
        {[
          ["🚚", "Free delivery above ₹2000"],
          ["✅", "Hospital-grade quality"],
          ["⚡", "48hr campus delivery"],
          ["💬", "WhatsApp ordering"],
          ["🔒", "COD & UPI available"],
        ].map(([ic, lb]) => (
          <div key={lb} style={{ display: "flex", alignItems: "center", gap: 7, color: C.textSub, fontSize: 12.5, fontWeight: 500 }}>
            <span style={{ fontSize: 14 }}>{ic}</span>
            <span>{lb}</span>
          </div>
        ))}
      </div>
    </div>
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
          onMouseEnter={e => { if (active !== t.id) { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}}
          onMouseLeave={e => { if (active !== t.id) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}}
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
        <img src={kit.images[0]} alt={kit.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.45s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} onError={e => e.target.style.display="none"} />
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

// ── BPT Book Catalogue Data ───────────────────────────────────
const BOOKS_DATA = [
  {
    year: "1st Year", icon: "🩺", color: "#0057A8", bg: "#EBF5FF",
    subjects: [
      { name: "Anatomy", books: [
        { num: 1, authors: "Ross & Wilson", title: "Anatomy and Physiology in Health and Illness", publisher: "Elsevier" },
        { num: 2, authors: "Gray H.", title: "Gray's Anatomy", publisher: "Churchill Livingstone" },
      ]},
      { name: "Physiology", books: [
        { num: 3, authors: "Guyton A.C. & Hall J.E.", title: "Textbook of Medical Physiology", publisher: "Elsevier" },
        { num: 4, authors: "Sembulingam K.", title: "Essentials of Medical Physiology", publisher: "Jaypee" },
      ]},
      { name: "Psychology", books: [
        { num: 5, authors: "Mangal S.K.", title: "General Psychology", publisher: "" },
      ]},
      { name: "Sociology", books: [
        { num: 6, authors: "Sachdeva D.R. & Bhushan V.", title: "An Introduction to Sociology", publisher: "" },
      ]},
    ],
  },
  {
    year: "2nd Year", icon: "⚙️", color: "#00875A", bg: "#F0FFF4",
    subjects: [
      { name: "Pathology & Microbiology", books: [
        { num: 7, authors: "Mohan H.", title: "Textbook of Pathology", publisher: "Jaypee" },
      ]},
      { name: "Exercise Therapy", books: [
        { num: 8, authors: "Gardiner D.", title: "Principles of Exercise Therapy", publisher: "CBS Publishers" },
      ]},
      { name: "Biomechanics", books: [
        { num: 9, authors: "Norkin C.C. & Levangie P.K.", title: "Joint Structure and Function", publisher: "F.A. Davis" },
      ]},
      { name: "Pharmacology & Biochemistry", books: [
        { num: 10, authors: "Tripathi K.D.", title: "Essentials of Medical Pharmacology", publisher: "Jaypee" },
      ]},
    ],
  },
  {
    year: "3rd Year", icon: "⚡", color: "#B7791F", bg: "#FFFFF0",
    subjects: [
      { name: "Electrotherapy", books: [
        { num: 11, authors: "Robertson V.", title: "Electrotherapy Explained: Principles and Practice", publisher: "Elsevier" },
      ]},
      { name: "General Medicine & Surgery", books: [
        { num: 12, authors: "Davidson's", title: "Principles and Practice of Medicine", publisher: "Elsevier" },
      ]},
      { name: "Orthopaedics", books: [
        { num: 13, authors: "Maheshwari J.", title: "Essential Orthopaedics", publisher: "Jaypee" },
      ]},
      { name: "Neurology", books: [
        { num: 14, authors: "Bickerstaff E.R.", title: "Neurological Examination in Clinical Practice", publisher: "" },
      ]},
    ],
  },
  {
    year: "Final Year", icon: "🧠", color: "#6B21A8", bg: "#FAF5FF",
    subjects: [
      { name: "Physiotherapy in Orthopaedics", books: [
        { num: 15, authors: "Brotzman S.B.", title: "Clinical Orthopaedic Rehabilitation", publisher: "Elsevier" },
      ]},
      { name: "Physiotherapy in Neurology", books: [
        { num: 16, authors: "Umphred D.A.", title: "Neurological Rehabilitation", publisher: "Mosby" },
      ]},
      { name: "Cardio-Respiratory Physiotherapy", books: [
        { num: 17, authors: "Pryor J.A. & Prasad S.A.", title: "Physiotherapy for Respiratory and Cardiac Problems", publisher: "" },
      ]},
      { name: "Therapeutic Exercise", books: [
        { num: 18, authors: "Kisner C. & Colby L.", title: "Therapeutic Exercise: Foundations and Techniques", publisher: "F.A. Davis" },
      ]},
      { name: "Rehabilitation & Community Medicine", books: [
        { num: 19, authors: "Park K.", title: "Preventive and Social Medicine", publisher: "" },
      ]},
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
      <TrustStrip />

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
