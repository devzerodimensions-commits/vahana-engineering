// Builds professional hero BANNERS (designed graphics, not bare photos):
// navy brand background + geometric accents + headline text + the machine
// photo on a clean white panel. Output: frontend/public/banners/*.jpg
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../frontend/public");
const SRC = path.join(PUB, "products");
const OUT = path.join(PUB, "banners");
fs.mkdirSync(OUT, { recursive: true });

const W = 1600, H = 600;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Panel (white card) that holds the machine photo — right side.
const PANEL = { x: 900, y: 70, w: 620, h: 460, pad: 28 };

const BANNERS = [
  {
    file: "banner-utm",
    image: "universal-testing-machine-10-ton",
    eyebrow: "VIHANA ENGINEERING · YOUR TESTING PARTNER",
    title: ["Universal Testing", "Machines"],
    sub: "Tensile, compression & flexural testing — up to 10 Ton.",
  },
  {
    file: "banner-mfi",
    image: "melt-flow-index-mfi-test-apparatus",
    eyebrow: "PLASTIC TESTING MACHINERY · MFG. & EXPORTER",
    title: ["Melt Flow Index", "Testers"],
    sub: "MFR / MVR measurement to ASTM D1238 & ISO 1133.",
  },
  {
    file: "banner-hydro",
    image: "hydrostatic-pressure-testing-machine-3-station",
    eyebrow: "VIHANA ENGINEERING · YOUR TESTING PARTNER",
    title: ["Hydrostatic Pressure", "Testing"],
    sub: "Long-term strength & burst testing of HDPE pipes.",
  },
  {
    file: "banner-impact",
    image: "izod-and-charpy-impact-test-apparatus",
    eyebrow: "PLASTIC TESTING MACHINERY · MFG. & EXPORTER",
    title: ["Impact Testing", "Solutions"],
    sub: "Izod, Charpy & dart-impact toughness testing.",
  },
];

const svg = (b) => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1A2E7A"/>
      <stop offset="0.55" stop-color="#16256B"/>
      <stop offset="1" stop-color="#0F1A4D"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- faint grid -->
  <g stroke="#ffffff" stroke-opacity="0.05">
    ${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="${H}"/>`).join("")}
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 80}" x2="${W}" y2="${i * 80}"/>`).join("")}
  </g>

  <!-- brand triangle accents (from the logo motif) -->
  <polygon points="0,600 190,600 95,470" fill="#E11F27" opacity="0.9"/>
  <polygon points="150,600 340,600 245,470" fill="#26398F"/>
  <circle cx="1500" cy="70" r="220" fill="#E11F27" opacity="0.10"/>

  <!-- left red accent bar -->
  <rect x="90" y="238" width="64" height="6" rx="3" fill="#E11F27"/>

  <!-- text -->
  <text x="92" y="150" fill="#9FB0E8" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="3">${esc(b.eyebrow)}</text>
  <text x="90" y="300" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="800">${esc(b.title[0])}</text>
  <text x="90" y="372" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="800">${esc(b.title[1])}</text>
  <text x="92" y="430" fill="#D7DEF5" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400">${esc(b.sub)}</text>

  <!-- CTA pill -->
  <rect x="92" y="470" width="230" height="54" rx="27" fill="#E11F27"/>
  <text x="207" y="504" fill="#ffffff" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">Explore Products</text>

  <!-- white photo panel -->
  <rect x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.w}" height="${PANEL.h}" rx="20" fill="#ffffff" filter="url(#shadow)"/>
</svg>`;

for (const b of BANNERS) {
  const base = Buffer.from(svg(b));
  const photoPath = path.join(SRC, `${b.image}.jpg`);
  const innerW = PANEL.w - PANEL.pad * 2;
  const innerH = PANEL.h - PANEL.pad * 2;

  const photo = await sharp(photoPath)
    .resize({ width: innerW, height: innerH, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .toBuffer({ resolveWithObject: true });

  const left = Math.round(PANEL.x + PANEL.pad + (innerW - photo.info.width) / 2);
  const top = Math.round(PANEL.y + PANEL.pad + (innerH - photo.info.height) / 2);

  const out = path.join(OUT, `${b.file}.jpg`);
  await sharp(base)
    .composite([{ input: photo.data, left, top }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`banners/${b.file}.jpg  ${W}x${H}  ${kb}KB`);
}
console.log("Done.");
