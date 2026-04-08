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
const PH = (prompt, seed, model = "flux-realism") =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=700&height=500&nologo=true&seed=${seed}&model=${model}&enhance=true`;
const R = (p, s) => PH(p, s, "flux-realism");
const F = (p, s) => PH(p, s, "flux");

const IMG = {
  kit1: [
    "/kit.jpg",
    R("overhead flat lay of physiotherapy student kit: transparent plastic goniometer, chrome Taylor reflex hammer, silver tuning fork, black stethoscope, LED penlight, resistance band, rolled yoga mat, myospaz gel tube, measuring tape, physio textbook arranged neatly on white surface, studio lighting, sharp focus", 11),
    R("BPT physiotherapy kit contents spread out on white table: goniometer set three pieces, knee hammer, 128hz tuning fork, measuring tape, pen torch, dual head stethoscope, green resistance band — all clearly visible, clean product photography", 12),
    F("open navy blue physiotherapy case with compartments showing goniometer, reflex hammer, tuning fork, stethoscope, pen torch organised inside, clinical setting, realistic", 13),
    R("physiotherapy instruments neatly arranged in a row on white background: transparent goniometer, triangular rubber reflex hammer, silver tuning fork, black stethoscope, chrome penlight, resistance band, realistic product photo", 14),
    R("first year BPT student kit flat lay top view: all instruments labeled goniometer stethoscope hammer tuning fork tape torch yoga mat band, clean white background, studio product photography", 15),
  ],
  kit2: [
    R("five physiotherapy examination instruments flat lay on white: transparent plastic goniometer, Taylor reflex hammer with triangular rubber head, 128Hz tuning fork silver, fabric measuring tape 150cm, chrome LED pen torch — arranged neatly, studio lighting, sharp product photo", 21),
    R("physiotherapy practical exam kit five tools: goniometer, knee percussion hammer, tuning fork, inch tape, penlight — top view on white background, realistic clinical instruments", 22),
    F("compact physio exam kit five instruments arranged on clean white surface: goniometer, reflex hammer, tuning fork, measuring tape coiled, led penlight — professional flat lay photography", 23),
    R("BPT practical exam instruments displayed on wooden surface: transparent goniometer with degree markings, chrome Taylor hammer, aluminium tuning fork, soft measuring tape, silver penlight — realistic product shot", 24),
    R("physiotherapy five core clinical instruments on white — clear goniometer protractor device, triangular headed reflex hammer, U-shaped 128hz tuning fork, rolled inch tape, LED torch pen — clean studio product photography", 25),
  ],
  kit3: [
    R("student smart study kit flat lay on white desk: A5 spiral notepad open, five ballpoint pens fanned out, colourful whiteboard markers, silver 16GB USB drive, small sanitizer foil sachets, blue surgical face masks — top view clean product photography", 31),
    R("medical student study essentials arranged on white: spiral A5 notebook, ballpoint pen set, multi-colour whiteboard markers, USB flash drive, hand sanitizer sachets, disposable surgical masks — minimal flat lay studio lighting", 32),
    F("smart study bundle stationery flat lay: spiral notepad, pens, markers, USB drive, sanitizer sachets, mask pack neatly arranged, realistic studio product photography", 33),
    R("BPT student stationery and hygiene kit: open A5 notepad with ruled lines, 5 pens, marker set, compact USB drive, individual sanitizer sachets, face masks — top view white background", 34),
    R("study kit items spread on clean white surface: spiral-bound A5 notebook, pen set, markers, silver USB drive, sanitizer sachets, surgical face mask pack — bright studio product photography", 35),
  ],
  goniometer: [
    "/products/goniometer.jpg",
    R("close-up of transparent plastic medical goniometer showing angle markings 0 to 360 degrees, two measurement arms, pivot joint — physiotherapy joint range of motion tool, white background", 102),
    R("physiotherapy goniometer set three sizes: large goniometer, standard goniometer, small finger goniometer laid side by side on white, transparent plastic with printed degree scale, realistic product shot", 103),
    F("physiotherapist using large transparent goniometer to measure patient knee joint angle, clinical setting, realistic photo", 104),
    R("medical goniometer close up: transparent semicircular protractor body with degree markings, two white plastic arms extending from pivot — physiotherapy assessment tool, white background studio", 105),
  ],
  hammer: [
    "/products/knee-hammer.jpg",
    R("close-up of Taylor reflex hammer head: triangular shaped black rubber striking surface attached to chrome handle — medical neurology diagnostic instrument, white background, sharp focus", 112),
    R("medical reflex hammer full product shot: slim chrome handle, triangular rubber percussion head, stainless steel finish — isolated on white seamless background, studio lighting", 113),
    F("doctor tapping patient patellar tendon with Taylor reflex hammer, knee jerk reflex test, clinical examination room, realistic photo", 114),
    R("neurological reflex hammer flat lay on white: Taylor type with triangular rubber head and metal handle, accurate product photography, clinical quality", 115),
  ],
  tuningfork: [
    "/products/tuning-fork.jpg",
    R("close-up of 128Hz aluminium medical tuning fork showing the two vibrating prongs and handle with frequency markings — vibration sense testing tool, white background, realistic product photo", 122),
    R("medical tuning fork lying on white surface showing U-shaped prongs and long silver handle — aluminium alloy construction, 128 Hz, physiotherapy neurological diagnostic tool, studio lighting", 123),
    F("physiotherapist applying vibrating tuning fork to patient ankle medial malleolus for vibration sense testing, clinical neurological exam, realistic", 124),
    R("128Hz tuning fork and reflex hammer together on white background — standard neurological examination instruments, clinical product photography", 125),
  ],
  tape: [
    "/products/inch-tape.jpg",
    R("close-up of flexible medical measuring tape partially unrolled showing clear centimetre graduations and numbers — limb circumference measurement tool, white background, sharp focus", 132),
    R("physiotherapy measuring tape 150cm laid flat showing full length on white surface, dual sided centimetre and inch scale, soft flexible material — clinical assessment tool", 133),
    F("physiotherapist measuring patient calf circumference with flexible measuring tape, limb girth assessment, clinical setting", 134),
    R("medical cloth measuring tape coiled on white background: 150cm dual scale flexible tape for limb and body measurement, physiotherapy clinical tool, studio lighting", 135),
  ],
  pentorch: [
    "/products/pen-torch.jpg",
    R("close-up of medical penlight pen torch showing LED bulb end and pupil gauge scale printed along chrome body — neurological examination tool, white background sharp focus", 142),
    R("medical LED pen torch and pen torch cap side by side on white: chrome finish, pupil gauge on barrel, bright beam — clinical diagnostic instrument, studio lighting", 143),
    F("doctor shining pen torch into patient pupil for pupillary light reflex examination, clinical neurological assessment, realistic", 144),
    R("two chrome medical pen torches on white background: LED penlights with pocket clips and pupil gauge scales — diagnostic examination instruments, product photography", 145),
  ],
  stethoscope: [
    "/products/stethoscope.jpg",
    R("close-up of stethoscope chest piece on white: silver rim, flat diaphragm membrane, bell on reverse side — medical auscultation instrument, sharp focus realistic photo", 152),
    R("black stethoscope coiled in circle on white surface: dual-head chest piece diaphragm and bell clearly visible, soft sealing ear tips, flexible tubing — clinical instrument product shot", 153),
    F("medical student wearing black stethoscope around neck in clinical setting, professional uniform, realistic", 154),
    R("stethoscope ear tips close-up on white background: soft silicone seal ear tips attached to metal binaural spring headset — medical acoustic instrument component, product photography", 155),
  ],
  sphygmo: [
    "/products/sphygmomanometer.jpg",
    R("close-up of aneroid BP gauge dial on white: circular mercury-free manometer showing mmHg markings, needle indicator, chrome bezel — manual blood pressure measurement instrument, sharp focus", 162),
    R("sphygmomanometer complete set on white: folded BP cuff, gauge dial, hand pump bulb with control valve — clinical blood pressure monitoring kit, studio lighting realistic", 163),
    F("physiotherapy student measuring blood pressure of patient using aneroid sphygmomanometer and stethoscope, clinical practical session, realistic", 164),
    R("manual blood pressure cuff unrolled on white background: grey fabric cuff with velcro, connected to aneroid gauge and rubber bulb pump — BP measurement device, product photography", 165),
  ],
  yogamat: [
    "/products/yoga-mat.jpg",
    R("yoga mat rolled up tightly on white background: teal/green colour, carry strap around it, textured anti-slip surface visible — physiotherapy rehabilitation exercise mat, sharp product photo", 172),
    R("yoga mat unrolled flat on white floor: 6mm thick teal exercise mat showing full surface texture and non-slip bottom — physiotherapy rehab mat top view, studio lighting", 173),
    F("physiotherapy student performing therapeutic exercise on green yoga mat on clinic floor, stretching routine, realistic clinical setting", 174),
    R("yoga exercise mat close-up on white: thick 6mm foam with textured teal surface and dotted anti-slip backing — physiotherapy rehabilitation equipment, product photography", 175),
  ],
  band: [
    R("green latex resistance exercise band on white background: flat loop band medium resistance, smooth elastic texture — physiotherapy strength training rehabilitation tool, studio product photography", 181),
    R("resistance band stretched between two hands on white background: medium resistance green latex exercise band — physiotherapy upper limb strengthening tool, realistic product photo", 182),
    R("resistance band coiled flat on white surface: green latex loop exercise band for physiotherapy rehabilitation — strength training tool, studio lighting sharp focus", 183),
    F("physiotherapist guiding patient in resistance band exercise for knee rehabilitation, clinical setting, realistic photo", 184),
    R("set of resistance exercise bands on white: green medium resistance, yellow light, red heavy — different strengths for physiotherapy rehab, flat lay product photography", 185),
  ],
  dynamometer: [
    "/products/dynamometer.jpg",
    R("close-up of digital hand dynamometer display showing grip strength reading in kg on LCD screen — physiotherapy strength measurement clinical tool, white background sharp focus", 192),
    R("grip strength dynamometer full product shot on white: hand grip ergonomic device with digital display, chrome and black finish — physiotherapy assessment instrument, studio lighting", 193),
    F("physiotherapy student gripping dynamometer with maximum force for grip strength measurement test, clinical assessment, realistic", 194),
    R("hand grip dynamometer isolated on white: compact ergonomic design with digital display for force reading in kilograms — muscle strength measurement physiotherapy tool", 195),
  ],
  foamroller: [
    R("EVA foam roller on white background: cylindrical 30cm long 15cm diameter foam roller, textured grid surface, dark teal colour — physiotherapy myofascial release recovery tool, studio product photography", 201),
    R("foam roller close-up showing textured grid EVA surface — high density physiotherapy myofascial release equipment, white background sharp focus product shot", 202),
    R("foam roller lying on white surface: cylindrical high density EVA foam, textured outer surface, solid construction — muscle recovery physiotherapy rehabilitation tool, studio lighting", 203),
    F("physiotherapy student using foam roller on thoracic spine for myofascial release on clinic floor, realistic clinical setting", 204),
    R("foam roller upright on white background: solid cylindrical EVA foam exercise roller textured surface — physiotherapy muscle recovery equipment product photography", 205),
  ],
  myospaz: [
    R("Myospaz topical gel tube on white background: white and blue plastic tube with printed label 'Myospaz Gel', screw cap, muscle relaxant topical analgesic physiotherapy product — studio product photography", 211),
    R("close-up of Myospaz gel tube cap and label on white background: physiotherapy muscle relaxant topical gel, cream-coloured tube with blue cap — clinical therapeutic product, sharp focus", 212),
    R("muscle relaxant gel tube isolated on white: Myospaz topical analgesic gel tube standing upright, blue and white packaging — physiotherapy therapeutic product, studio lighting", 213),
    F("physiotherapist applying topical muscle relaxant gel on patient's lower back for localised muscle spasm relief, clinical treatment, realistic", 214),
    R("Myospaz gel tube product shot on white: white squeezable tube with cap, muscle relaxant label, physiotherapy topical application — clean background studio photography", 215),
  ],
  ultrasoundgel: [
    R("ultrasound gel bottle 250ml on white background: clear squeeze bottle with flip cap, blue label 'Ultrasound Gel', transparent aqua-coloured gel inside — physiotherapy UST coupling medium, studio product photography", 221),
    R("close-up of 250ml ultrasound coupling gel bottle: clear plastic squeeze bottle with blue label — physiotherapy therapeutic ultrasound coupling medium, white background sharp focus", 222),
    R("ultrasound gel bottle standing on white surface: 250ml clear bottle with flip cap, gel visible through translucent body — physiotherapy UST session consumable, studio lighting", 223),
    F("physiotherapist applying clear ultrasound gel on patient shoulder before therapeutic ultrasound treatment, clinical physiotherapy session, realistic", 224),
    R("ultrasound gel 250ml flat lay on white: clear squeeze bottle with label alongside ultrasound transducer head — physiotherapy coupling medium product photography", 225),
  ],
  sanitizer: [
    R("hand sanitizer sachets on white background: individual foil sachets in a pack of 10, silver packaging with sanitizer label, single-dose disposable — clinical hygiene product, studio product photography", 231),
    R("close-up of hand sanitizer individual sachet packet on white: small foil single-dose sanitizer pouch, 70% alcohol, clinical hygiene — product photography sharp focus", 232),
    R("sanitizer sachets pack spread on white surface: 10 individual foil sachets fanned out, clinical disposable hygiene products — studio product photography", 233),
    F("healthcare student opening hand sanitizer sachet before clinical procedure, hygiene protocol, realistic clinical setting", 234),
    R("hand sanitizer sachets 10 pack on white: sealed silver foil individual pouches stacked — disposable instant sanitizer clinical hygiene product photography", 235),
  ],
  cotton: [
    R("medical cotton wool pack on white background: white fluffy absorbent cotton, unsealed pack showing soft fibre texture — clinical grade physiotherapy consumable, studio product photography", 241),
    R("close-up of medical grade cotton wool: white soft fluffy fibres, absorbent clinical cotton — dressing and physiotherapy procedure consumable, white background sharp focus", 242),
    R("medical cotton roll and pack on white surface: white absorbent cotton wool, clinical grade packaging — physiotherapy dressing wound care product, studio lighting", 243),
    F("physiotherapy student using medical cotton for electrode placement during TENS treatment on patient arm, clinical practical, realistic", 244),
    R("medical cotton pack isolated on white: soft white clinical grade cotton wool for dressing and clinical procedures — physiotherapy consumable product photography", 245),
  ],
  medtape: [
    R("micropore medical tape roll on white background: white paper adhesive tape on cardboard core, 2.5cm wide — hypoallergenic clinical strapping bandage tape, studio product photography", 251),
    R("close-up of white micropore tape roll on white: paper medical tape showing adhesive side and non-woven surface — hypoallergenic wound dressing strapping tape, sharp focus", 252),
    R("medical micropore tape two rolls on white surface: white hypoallergenic paper tape rolls — clinical wound dressing electrode fixation physiotherapy consumable, studio lighting", 253),
    F("physiotherapist applying white micropore tape to secure electrode pad on patient forearm during electrotherapy, clinical physiotherapy session, realistic", 254),
    R("micropore paper tape roll product shot on white: 5m x 2.5cm white hypoallergenic medical adhesive tape — clinical physiotherapy consumable photography", 255),
  ],
  mask: [
    R("pack of 10 disposable surgical face masks on white background: blue 3-ply surgical masks in opened box showing neat stack, with individual masks fanned out — medical PPE, studio product photography", 261),
    R("close-up of single 3-ply surgical face mask on white: blue outer layer, white inner soft layer, metal nose wire at top, ear loops — disposable medical PPE, sharp focus product photo", 262),
    R("surgical face mask product shot on white: blue and white 3-ply disposable mask fully displayed with ear loops spread — medical grade PPE, studio lighting", 263),
    F("BPT student wearing surgical face mask in clinical ward during physiotherapy practical session, professional setting, realistic", 264),
    R("10 disposable surgical face masks fanned out on white background: blue 3-ply medical grade masks — clinical PPE product photography", 265),
  ],
  gloves: [
    R("pair of blue nitrile examination gloves on white background: powder-free latex-free medical grade examination gloves, textured fingertips, natural hand shape — clinical PPE, studio product photography", 271),
    R("close-up of nitrile examination glove on white: blue textured surface showing detailed finger texture and flexible material — medical grade powder-free examination glove, sharp focus", 272),
    R("pair of nitrile gloves product shot on white surface: blue medical examination gloves laid flat showing palm and back — clinical PPE physiotherapy practical tool, studio lighting", 273),
    F("physiotherapy student wearing blue nitrile gloves during patient contact assessment in clinical setting, realistic", 274),
    R("box of nitrile examination gloves on white background: blue powder-free gloves with a pair displayed — clinical grade PPE medical consumable product photography", 275),
  ],
  notes: [
    R("BPT physiotherapy textbook stack on white background: anatomy and physiology books with colourful spines, one open showing detailed diagrams and text — first year medical student study material, studio product photography", 281),
    R("open physiotherapy anatomy textbook on white surface showing detailed anatomical diagrams of musculoskeletal system with labels — BPT first year study material, realistic product photo", 282),
    R("stack of BPT physio textbooks on white: anatomy physiology and physiotherapy clinical textbooks stacked — medical student education material, studio lighting", 283),
    F("BPT student studying physio textbook notes at desk in hostel room, highlighted textbook open, realistic study scene", 284),
    R("medical student notes and textbook on white: physio anatomy notes handwritten alongside printed textbook — BPT first year education material product photography", 285),
  ],
  notepad: [
    R("A5 spiral notepad on white background: ruled lined pages, blue cover, spiral binding on left side, pen laying on top — medical student clinical note-taking notebook, studio product photography", 291),
    R("open A5 spiral notepad on white showing clean ruled lines inside and spiral metal binding — medical student notebook, realistic sharp focus product photo", 292),
    R("A5 spiral bound notepad product shot on white: blue cover with 80 ruled pages, wire binding — clinical note-taking student notebook, studio lighting", 293),
    F("BPT student writing clinical case notes in A5 spiral notepad during physiotherapy practical session, realistic", 294),
    R("A5 spiral notepad closed on white background: compact 14x21cm ruled student notebook with wire binding — clinical note taking stationery product photography", 295),
  ],
  penset: [
    R("set of 5 ballpoint pens on white background: black blue red green purple ink pens fanned out, click-top mechanism, slim design — clinical writing student stationery, studio product photography", 301),
    R("5 ballpoint pens arranged in fan shape on white: multi-colour ink set, slim design, click retractable mechanism — medical student clinical writing instruments, sharp focus", 302),
    R("pen set five pieces product shot on white: ballpoint pens in different colours side by side — student stationery clinical documentation tools, studio lighting", 303),
    F("BPT student writing clinical notes with ballpoint pen in notepad, desk study scene, realistic", 304),
    R("multi-colour ballpoint pen set 5 pieces on white: click-top ballpoint pens black blue red green purple — student stationery product photography", 305),
  ],
  markerset: [
    R("set of 6 whiteboard markers on white background: colourful chisel-tip markers in red blue green black orange purple, caps on, neatly arranged — teaching hospital stationery, studio product photography", 311),
    R("colourful whiteboard markers product shot on white: 6 markers fanned out showing different colours with chisel tips — teaching and presentation stationery, sharp focus", 312),
    R("whiteboard marker set 6 colours on white: red blue green black orange purple markers lined up — clinical teaching hospital stationery product photography studio lighting", 313),
    F("medical teacher using colourful whiteboard markers to draw anatomy diagram on whiteboard for BPT students, teaching scene, realistic", 314),
    R("6 whiteboard markers arranged in arc on white background: multi-colour chisel-tip markers — hospital teaching stationery product shot", 315),
  ],
  usb: [
    R("silver 16GB USB flash drive on white background: compact rectangular USB drive with metal cap, 16GB printed on body, USB-A connector visible — student data storage device, studio product photography", 321),
    R("close-up of 16GB USB flash drive on white: compact metal silver USB stick with cap, storage capacity label — student study material storage device, sharp focus product shot", 322),
    R("USB flash drive 16GB product shot on white: slim silver metal USB drive cap off showing USB connector — medical student study data storage, studio lighting", 323),
    F("BPT student inserting USB drive into laptop to access lecture notes and study material, hostel study desk, realistic", 324),
    R("16GB USB flash drive with cap and without cap on white background: compact silver USB stick — student study material storage device product photography", 325),
  ],
  scrubs: [
    R("navy blue medical scrubs set on white background: v-neck scrub top and drawstring pants, two front pockets on top, professional clinical uniform — physiotherapy student apparel, studio product photography", 331),
    R("medical scrub top close-up on white: navy blue v-neck cotton-blend clinical top with two front pockets, neat finish — physiotherapy student uniform, sharp focus product shot", 332),
    R("navy blue scrubs set folded neatly on white surface: v-neck scrub top and matching pants — professional clinical physiotherapy uniform, studio lighting", 333),
    F("young BPT physiotherapy student wearing navy blue scrubs in clinical corridor at SRM hospital, professional look, realistic", 334),
    R("ceil blue medical scrubs set on white: v-neck scrub top and pants, professional clinical uniform for physiotherapy student — product photography studio", 335),
  ],
  apron: [
    R("white full-length lab apron on white background displayed on hanger: two large front pockets, adjustable neck strap, waist tie strings, clean cotton-polyester blend — medical student laboratory protective garment, studio product photography", 341),
    R("white lab apron front view on white: full length protective apron with two front pockets and neck strap visible — medical student physiotherapy lab garment, sharp focus product shot", 342),
    R("white medical lab apron folded neatly on white surface: cotton-polyester blend full length apron with pockets — clinical laboratory protective garment, studio lighting", 343),
    F("BPT student wearing white full-length lab apron in physiotherapy anatomy laboratory, professional clinical setting, realistic", 344),
    R("white lab apron hanging on hook on white background: full-length clinical protective apron with front pockets — medical student laboratory uniform product photography", 345),
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
    desc: "The MedVault Physio Curated Kit is the definitive starter bundle for first-year BPT students at SRM. Carefully assembled by physiotherapy professionals, this kit contains every instrument required for your practical labs, ward assessments, and clinical skill-building sessions. Each item is individually quality-checked before packing. Instead of hunting down 10 different items from multiple vendors, get everything in one order — delivered straight to your campus hostel. Valued at ₹2,946 if purchased separately, you save over ₹900 with this bundle.",
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
    desc: "The Practical Exam Kit contains the five core instruments required for BPT practical examinations. Designed for students who already own a basic set but need key assessment tools — or for anyone who wants a compact, exam-ready bundle without the full kit price. All instruments are clinical-grade, lightweight, and easy to carry to your exam hall. Goniometer for ROM testing, knee hammer for reflex assessment, tuning fork for vibration sense, inch tape for measurements, and LED pen torch for neurological exam — everything your examiner will look for.",
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
    desc: "The Smart Study Kit bundles all the stationery and hygiene essentials a BPT student needs for a productive semester. An A5 spiral notepad for clinical notes, a 5-piece pen set, a whiteboard marker set for study sessions, a 16GB USB drive to carry lecture slides and study material, sanitizer sachets for on-the-go hand hygiene during practicals, and disposable masks for ward visits. Everything packed together at a price that makes sense — no need to shop five different places before the semester starts.",
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
  { id:"i-1",  type:"item", name:"Goniometer Set (3-in-1)",     tagline:"Joint ROM measurement",       price:450, originalPrice:650,  badge:"PHYSIO TOOL",   images:IMG.goniometer,   desc:"A complete 3-piece goniometer set used for measuring joint range of motion (ROM) in physiotherapy assessments. The set includes a large goniometer for major joints like the hip, knee, and shoulder; a standard goniometer for elbow and ankle; and a finger goniometer for small joint measurements. Made from durable plastic with clearly printed degree markings. An absolute must-have for every BPT practical, especially in musculoskeletal physiotherapy sessions.", stock:80 },
  { id:"i-2",  type:"item", name:"Knee Hammer",                  tagline:"Reflex testing",               price:150, originalPrice:220,  badge:"NEURO TOOL",    images:IMG.hammer,       desc:"The Taylor percussion (knee) hammer is the standard tool for testing deep tendon reflexes in neurological and physiotherapy assessments. Features a triangular rubber head for reliable tendon strike and a stainless steel handle with comfortable grip. Used to test patellar (knee-jerk), Achilles, biceps, triceps, and brachioradialis reflexes. Lightweight and pocket-friendly — essential for neurology practical exams.", stock:95 },
  { id:"i-3",  type:"item", name:"Tuning Fork (128 Hz)",         tagline:"Vibration & hearing tests",    price:220, originalPrice:320,  badge:"NEURO TOOL",    images:IMG.tuningfork,   desc:"A 128 Hz aluminium alloy tuning fork used for assessing vibration sense and conducting Rinne and Weber tests. The 128 Hz frequency is optimal for vibration perception testing on bony prominences such as the medial malleolus, tibial crest, and finger joints. Frequency is stamped on the handle for quick identification. Durable, corrosion-resistant, and required for both neurological and ENT practical assessments in BPT.", stock:60 },
  { id:"i-4",  type:"item", name:"Inch Tape (150cm)",            tagline:"Body & limb measurement",     price:80,  originalPrice:120,  badge:"MEASUREMENT",   images:IMG.tape,         desc:"A flexible 150cm (60 inch) measuring tape used extensively in physiotherapy for limb girth measurements, postural assessment, anthropometric measurements, and wound sizing. Dual-sided with centimeter markings on one side and inch markings on the other. Made from a soft, non-stretch material that conforms to body contours. Lightweight, rollable, and fits easily in a pocket or pouch — used in nearly every physio practical session.", stock:150 },
  { id:"i-5",  type:"item", name:"Pen Torch (LED)",              tagline:"Pupil & oral exam",            price:120, originalPrice:180,  badge:"DIAGNOSTIC",    images:IMG.pentorch,     desc:"A bright LED pen torch with a pupil gauge printed on the barrel — the standard diagnostic tool for pupillary reflex testing, oral cavity examination, and general clinical assessment. Features a replaceable battery, chrome finish for durability, and a pocket clip for easy carry. The LED provides a focused, consistent beam ideal for assessing pupil size and light response. Required for neurological and general clinical practicals.", stock:110 },
  { id:"i-6",  type:"item", name:"Stethoscope",                  tagline:"Dual-head auscultation",       price:799, originalPrice:1299, badge:"MONITORING",    images:IMG.stethoscope,  desc:"A dual-head acoustic stethoscope with a diaphragm for high-frequency sounds (breath, bowel, and normal heart sounds) and a bell for low-frequency sounds (murmurs, S3/S4 heart sounds). Features high acoustic sensitivity, soft-seal ear tips for a comfortable fit, and latex-free tubing. Suitable for cardiac, pulmonary, and abdominal auscultation. A fundamental clinical tool for all BPT students — from first-year anatomy labs to third-year clinical postings.", stock:55 },
  { id:"i-7",  type:"item", name:"Sphygmomanometer",             tagline:"Blood pressure monitor",       price:499, originalPrice:799,  badge:"DIAGNOSTIC",    images:IMG.sphygmo,      desc:"A manual aneroid sphygmomanometer for blood pressure measurement — an essential skill for all healthcare students. Features a calibrated aneroid gauge, an inflatable cuff with Velcro fastening, and a hand bulb with control valve. Used in combination with a stethoscope for accurate systolic and diastolic BP readings. Required for cardiopulmonary physiotherapy practicals, vitals assessment, and clinical postings. Durable, portable, and accurate at the clinical level.", stock:40 },
  { id:"i-8",  type:"item", name:"Yoga Mat (6mm)",               tagline:"Exercise & rehabilitation",    price:349, originalPrice:499,  badge:"REHAB",         images:IMG.yogamat,      desc:"A 6mm thick, non-slip yoga mat used for therapeutic exercise, stretching, balance training, and rehabilitation sessions in BPT labs. The anti-skid surface provides stability on clinic floors, while the cushioning protects joints during floor exercises. Lightweight with a carry strap, easy to roll and store. Used in therapeutic exercise labs for exercises like bridging, prone press-ups, stretching routines, and core strengthening — an everyday requirement in BPT practical sessions.", stock:40 },
  { id:"i-9",  type:"item", name:"Resistance Band",              tagline:"Strength & rehab training",    price:180, originalPrice:260,  badge:"REHAB",         images:IMG.band,         desc:"A medium-resistance latex-free exercise band used for progressive resistance training and rehabilitation exercises in physiotherapy. Suitable for upper and lower limb strengthening — shoulder exercises, knee extension, hip abduction, and wrist flexion/extension. Resistance bands are used across all BPT semesters for exercises like terminal knee extension, clamshell, and theraband shoulder routines. Lightweight, portable, and durable — replace when it shows signs of wear.", stock:120 },
  { id:"i-10", type:"item", name:"Dynamometer",                  tagline:"Grip & muscle force",          price:699, originalPrice:1299, badge:"STRENGTH TOOL", images:IMG.dynamometer,  desc:"A hand grip dynamometer used to measure grip strength and muscle force output — a standard outcome measure in physiotherapy. Displays force in kilograms or pounds with a digital readout. Used to quantify hand strength before and after rehabilitation, assess neurological muscle weakness, and track treatment progress. Required for musculoskeletal and neurological physiotherapy practical assessments. Calibrated for clinical accuracy and designed to fit all hand sizes.", stock:35 },
  { id:"i-11", type:"item", name:"Foam Roller / Micropod",       tagline:"Myofascial release",           price:249, originalPrice:399,  badge:"RECOVERY",      images:IMG.foamroller,   desc:"A high-density EVA foam roller used for myofascial release, self-massage, and muscle recovery in physiotherapy practice. Rolling over tight muscles and trigger points helps improve flexibility, reduce delayed-onset muscle soreness (DOMS), and promote circulation. Used in BPT labs for thoracic spine mobility, IT band rolling, calf and hamstring release, and core activation. Durable, lightweight, and suitable for both clinical use and home exercise programs.", stock:50 },
  { id:"i-12", type:"item", name:"Myospaz Gel",                  tagline:"Muscle relaxant gel",          price:299, originalPrice:399,  badge:"THERAPEUTIC",   images:IMG.myospaz,      desc:"Myospaz is a topical muscle relaxant and analgesic gel used in physiotherapy for localised muscle spasm relief, joint pain, and soft tissue discomfort. Applied directly to the affected area, it works through transdermal absorption to relax tight muscles and reduce pain. Widely used in physiotherapy clinics during manual therapy, soft tissue massage, and post-exercise recovery. Required in musculoskeletal physiotherapy labs and recommended for student kits by SRM faculty.", stock:90 },
  { id:"i-13", type:"item", name:"Ultrasound Gel (250ml)",       tagline:"UST coupling medium",          price:99,  originalPrice:149,  badge:"CONSUMABLE",    images:IMG.ultrasoundgel,desc:"A clear, water-based ultrasound coupling gel used as a medium between the ultrasound transducer head and the patient's skin during therapeutic ultrasound (UST) sessions. Ensures optimal acoustic transmission by eliminating air gaps. Non-staining, hypoallergenic, and easy to wipe off. The 250ml bottle is standard for clinical labs and lasts through multiple practical sessions. Required for electrotherapy and UST practicals in BPT second year onwards.", stock:150 },
  { id:"i-14", type:"item", name:"Sanitizer Sachets (10 pcs)",   tagline:"Instant hand sanitizer",      price:49,  originalPrice:79,   badge:"HYGIENE",       images:IMG.sanitizer,    desc:"A pack of 10 single-dose disposable hand sanitizer sachets containing 70% isopropyl alcohol. Each sachet is individually sealed for hygiene and convenience — tear open, use, and discard. Ideal for use during ward rounds, between patient assessments, after handling equipment, or whenever hand washing isn't possible. Compact enough to carry in a pocket or pouch. An essential hygiene item for all clinical and campus practical sessions.", stock:200 },
  { id:"i-15", type:"item", name:"Cotton Pack",                  tagline:"Medical grade cotton",         price:79,  originalPrice:119,  badge:"CONSUMABLE",    images:IMG.cotton,       desc:"A pack of medical-grade cotton wool used for wound dressing, surface cleaning, electrode placement padding, and general clinical procedures. Soft, highly absorbent, and lint-free. Used in physiotherapy labs for cleaning skin before electrode application, padding bony prominences during splinting, and general clinical hygiene tasks. Comes in a sealed pack to maintain sterility and cleanliness. A basic consumable every BPT student needs in their kit.", stock:180 },
  { id:"i-16", type:"item", name:"Micropore Tape",               tagline:"Hypoallergenic strapping",     price:49,  originalPrice:79,   badge:"CONSUMABLE",    images:IMG.medtape,      desc:"A white hypoallergenic micropore paper tape used for securing wound dressings, fixing electrodes during electrotherapy, bandage strapping, and general clinical taping applications. Gentle on skin, breathable, and easy to tear by hand without scissors. The adhesive holds securely without leaving residue on skin. A standard consumable in all physiotherapy labs — used for TENS/IFT electrode fixation, wound covering, and strapping practice in musculoskeletal practicals.", stock:200 },
  { id:"i-17", type:"item", name:"Face Mask (10 pcs)",           tagline:"3-ply disposable mask",        price:49,  originalPrice:79,   badge:"PPE",           images:IMG.mask,         desc:"A pack of 10 three-ply disposable surgical face masks providing protection against respiratory droplets and aerosols during clinical contact. The three-layer construction includes a fluid-resistant outer layer, a filtration middle layer, and a soft inner layer for comfort. Adjustable nose wire ensures a secure fit. Mandatory PPE for ward postings, patient assessments, and practical labs involving close patient contact. Individually stacked and hygienically packed.", stock:300 },
  { id:"i-18", type:"item", name:"Nitrile Gloves (pair)",        tagline:"Examination gloves",           price:79,  originalPrice:119,  badge:"PPE",           images:IMG.gloves,       desc:"A pair of powder-free, latex-free nitrile examination gloves providing a secure barrier during patient examination, wound dressing, and clinical procedures. Nitrile material is more puncture-resistant than latex and safe for those with latex allergies. Textured fingertips enhance grip when handling instruments. Available in standard sizes suitable for most students. Required PPE for ward rounds, practical assessments, and any procedure involving physical patient contact.", stock:250 },
  { id:"i-19", type:"item", name:"Physio Books",                 tagline:"BPT syllabus notes",           price:299, originalPrice:450,  badge:"EDUCATION",     images:IMG.notes,        desc:"A curated set of first-year BPT study notes covering the core subjects: anatomy, physiology, and introductory physiotherapy concepts — all aligned to the SRM BPT curriculum. Written in a student-friendly format with diagrams, key terms, and clinical correlations. Ideal as a quick reference before practicals, a revision guide before internals, or a foundation text for students who want a structured starting point. Prepared and reviewed by BPT faculty for syllabus accuracy.", stock:30 },
  { id:"i-20", type:"item", name:"Notepad (A5)",                 tagline:"Clinical note-taking",         price:79,  originalPrice:119,  badge:"STATIONERY",    images:IMG.notepad,      desc:"An A5 spiral-bound notepad with 80 ruled pages, ideal for clinical note-taking, case history recording, practical observations, and everyday class notes. The A5 format is compact enough to carry in a scrubs pocket or pouch but large enough for detailed case write-ups. Smooth paper surface works well with ballpoint pens, gel pens, and markers. A practical companion for ward rounds, physio labs, and study sessions throughout your BPT degree.", stock:150 },
  { id:"i-21", type:"item", name:"Pen Set (5 pcs)",              tagline:"Everyday writing set",         price:49,  originalPrice:79,   badge:"STATIONERY",    images:IMG.penset,       desc:"A set of 5 smooth-writing ballpoint pens in a mix of ink colours — ideal for clinical documentation, case record writing, annotating study notes, and everyday classroom use. The medium-point tip provides consistent ink flow without smudging. Lightweight barrel with comfortable grip for extended writing sessions during classes and practicals. Pen up and run out faster than you think during a semester — keep a spare set in your kit from day one.", stock:200 },
  { id:"i-22", type:"item", name:"Markers Set",                  tagline:"Whiteboard markers",           price:149, originalPrice:199,  badge:"STATIONERY",    images:IMG.markerset,    desc:"A set of colourful whiteboard markers in multiple colours for study sessions, group learning, whiteboard teaching presentations, and annotating charts. Chisel-tip design allows both broad strokes for headings and fine lines for detail. Ink is easily wipeable from whiteboards and glass surfaces. Used in physio lab teaching demonstrations, anatomy revision sessions, and group case discussions. The multi-colour set helps colour-code anatomy diagrams and clinical flowcharts.", stock:100 },
  { id:"i-23", type:"item", name:"USB Drive (16GB)",             tagline:"Study material storage",       price:299, originalPrice:499,  badge:"UTILITY",       images:IMG.usb,          desc:"A compact 16GB USB flash drive for storing and transferring study material, lecture slides, anatomy videos, and clinical reference documents. Plug-and-play compatible with Windows, Mac, and most smart TVs and projectors. Fast read/write speeds for quick file transfer between devices. The 16GB capacity comfortably holds an entire semester's worth of lecture notes, practical manuals, and recorded lectures. Small enough to attach to a keychain or carry in a pencil pouch.", stock:80 },
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
