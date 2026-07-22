// Builds clean, TEXT-FREE hero banners: a subtle branded background with the
// machine photo feathered (soft edges) and centred. No headings, no buttons.
// Output: frontend/public/banners/*.jpg
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../frontend/public");
const SRC = path.join(PUB, "products");
const OUT = path.join(PUB, "banners");
fs.mkdirSync(OUT, { recursive: true });

const W = 1600, H = 600;

// Centred area for the machine.
const AREA = { x: 380, y: 55, w: 840, h: 490 };

const BANNERS = [
  { file: "banner-utm", image: "universal-testing-machine-10-ton" },
  { file: "banner-mfi", image: "melt-flow-index-mfi-test-apparatus" },
  { file: "banner-hydro", image: "hydrostatic-pressure-testing-machine-3-station" },
  { file: "banner-impact", image: "izod-and-charpy-impact-test-apparatus" },
  { file: "banner-dart", image: "dart-impact-testing-machine" },
  { file: "banner-oven", image: "hot-air-oven" },
];

// Subtle, premium, text-free background with brand accents.
const bgSvg = () => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eef2f8"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="1" stop-color="#e8edf5"/>
    </linearGradient>
    <radialGradient id="spot" cx="50%" cy="46%" r="55%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- faint grid -->
  <g stroke="#16256B" stroke-opacity="0.04">
    ${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="${H}"/>`).join("")}
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 80}" x2="${W}" y2="${i * 80}"/>`).join("")}
  </g>
  <!-- soft centre spotlight -->
  <rect width="${W}" height="${H}" fill="url(#spot)"/>
  <!-- brand corner accents (navy + red angles, no text) -->
  <polygon points="0,0 300,0 0,150" fill="#16256B" opacity="0.9"/>
  <polygon points="0,0 170,0 0,90" fill="#E11F27"/>
  <polygon points="${W},${H} ${W - 300},${H} ${W},${H - 150}" fill="#16256B" opacity="0.9"/>
  <polygon points="${W},${H} ${W - 170},${H} ${W},${H - 90}" fill="#E11F27"/>
  <!-- thin red baseline -->
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="#E11F27" opacity="0.9"/>
</svg>`;

const featherMask = (w, h) => Buffer.from(`
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="f" cx="50%" cy="50%" r="62%">
    <stop offset="0" stop-color="#fff" stop-opacity="1"/>
    <stop offset="0.72" stop-color="#fff" stop-opacity="1"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </radialGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#f)"/>
</svg>`);

for (const b of BANNERS) {
  const photoPath = path.join(SRC, `${b.image}.jpg`);
  const photo = await sharp(photoPath)
    .resize({ width: AREA.w, height: AREA.h, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .toBuffer({ resolveWithObject: true });

  const mask = await sharp(featherMask(photo.info.width, photo.info.height)).png().toBuffer();
  const feathered = await sharp(photo.data)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const left = Math.round(AREA.x + (AREA.w - photo.info.width) / 2);
  const top = Math.round(AREA.y + (AREA.h - photo.info.height) / 2);

  const out = path.join(OUT, `${b.file}.jpg`);
  await sharp(Buffer.from(bgSvg()))
    .composite([{ input: feathered, left, top }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log(`banners/${b.file}.jpg  ${W}x${H}  ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
}
console.log("Done.");
