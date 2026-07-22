// Builds premium hero BANNERS: brand-navy background with an angled light
// panel on the right, into which the machine photo is feathered (soft edges)
// so it blends seamlessly (no hard white box). Headline + CTA on the left.
// Output: frontend/public/banners/*.jpg
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../frontend/public");
const SRC = path.join(PUB, "products");
const OUT = path.join(PUB, "banners");
fs.mkdirSync(OUT, { recursive: true });

const W = 1600, H = 600;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Machine placement area (inside the light panel on the right).
const AREA = { x: 900, y: 70, w: 620, h: 470 };

const BANNERS = [
  {
    file: "banner-utm",
    image: "universal-testing-machine-10-ton",
    eyebrow: "VIHANA ENGINEERING · YOUR TESTING PARTNER",
    title: ["Engineering Excellence", "in Material Testing"],
    sub: "Universal testing machines up to 10 Ton — tensile, compression & flexural.",
  },
  {
    file: "banner-mfi",
    image: "melt-flow-index-mfi-test-apparatus",
    eyebrow: "PLASTIC TESTING MACHINERY · MFG. & EXPORTER",
    title: ["Melt Flow Index", "Testers"],
    sub: "Accurate MFR / MVR measurement to ASTM D1238 & ISO 1133.",
  },
  {
    file: "banner-hydro",
    image: "hydrostatic-pressure-testing-machine-3-station",
    eyebrow: "VIHANA ENGINEERING · YOUR TESTING PARTNER",
    title: ["Hydrostatic Pressure", "Testing Systems"],
    sub: "Long-term strength & burst testing of HDPE pipes — multi-station.",
  },
  {
    file: "banner-impact",
    image: "izod-and-charpy-impact-test-apparatus",
    eyebrow: "PLASTIC TESTING MACHINERY · MFG. & EXPORTER",
    title: ["Complete Impact", "Testing Solutions"],
    sub: "Izod, Charpy & dart-impact toughness testing for plastics & films.",
  },
];

// Background + angled light panel + text (composited UNDER the machine).
const bgSvg = (b) => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1B2E7C"/><stop offset="0.55" stop-color="#16256B"/><stop offset="1" stop-color="#0F1A4D"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e7ebf3"/><stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g stroke="#ffffff" stroke-opacity="0.05">
    ${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="${H}"/>`).join("")}
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 80}" x2="${W}" y2="${i * 80}"/>`).join("")}
  </g>
  <circle cx="1480" cy="90" r="240" fill="#E11F27" opacity="0.08"/>
  <!-- angled light panel (right) -->
  <polygon points="880,0 ${W},0 ${W},${H} 800,${H}" fill="url(#panel)"/>
  <polygon points="852,0 880,0 800,${H} 772,${H}" fill="#E11F27"/>
  <!-- brand triangles bottom-left -->
  <polygon points="0,600 180,600 90,478 " fill="#E11F27" opacity="0.9"/>
  <polygon points="140,600 320,600 230,478" fill="#26398F"/>
  <!-- text -->
  <rect x="92" y="196" width="60" height="6" rx="3" fill="#E11F27"/>
  <text x="94" y="150" fill="#9FB0E8" font-family="Arial, sans-serif" font-size="19" font-weight="700" letter-spacing="3">${esc(b.eyebrow)}</text>
  <text x="90" y="258" fill="#ffffff" font-family="Arial, sans-serif" font-size="52" font-weight="800">${esc(b.title[0])}</text>
  <text x="90" y="320" fill="#ffffff" font-family="Arial, sans-serif" font-size="52" font-weight="800">${esc(b.title[1])}</text>
  <text x="94" y="374" fill="#D7DEF5" font-family="Arial, sans-serif" font-size="22">${esc(b.sub)}</text>
  <rect x="92" y="410" width="224" height="52" rx="26" fill="#E11F27"/>
  <text x="204" y="443" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" font-weight="700">Explore Products</text>
</svg>`;

// Soft elliptical feather mask so the photo edges melt into the light panel.
const featherMask = (w, h) => Buffer.from(`
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="f" cx="50%" cy="50%" r="62%">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.72" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#f)"/>
</svg>`);

for (const b of BANNERS) {
  const photoPath = path.join(SRC, `${b.image}.jpg`);

  // Resize machine to fit the area, keep its studio background.
  const photo = await sharp(photoPath)
    .resize({ width: AREA.w, height: AREA.h, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .toBuffer({ resolveWithObject: true });

  // Feather its edges to transparent.
  const mask = await sharp(featherMask(photo.info.width, photo.info.height)).png().toBuffer();
  const feathered = await sharp(photo.data)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const left = Math.round(AREA.x + (AREA.w - photo.info.width) / 2);
  const top = Math.round(AREA.y + (AREA.h - photo.info.height) / 2);

  const out = path.join(OUT, `${b.file}.jpg`);
  await sharp(Buffer.from(bgSvg(b)))
    .composite([{ input: feathered, left, top }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log(`banners/${b.file}.jpg  ${W}x${H}  ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
}
console.log("Done.");
