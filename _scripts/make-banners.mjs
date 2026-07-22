// Builds hexaplast-style hero banners: a clean CUTOUT machine (transparent PNG)
// floating on a premium navy background with a soft shadow + brand accents.
// TEXT-FREE. Output: frontend/public/banners/*.jpg
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../frontend/public");
const CUT = path.resolve("_cutouts");
const OUT = path.join(PUB, "banners");
fs.mkdirSync(OUT, { recursive: true });

const W = 1600, H = 600;
const MAXW = 980, MAXH = 470; // machine max size

const BANNERS = [
  { file: "banner-utm", slug: "universal-testing-machine-10-ton" },
  { file: "banner-mfi", slug: "melt-flow-index-mfi-test-apparatus" },
  { file: "banner-hydro", slug: "hydrostatic-pressure-testing-machine-3-station" },
  { file: "banner-impact", slug: "izod-and-charpy-impact-test-apparatus" },
  { file: "banner-dart", slug: "dart-impact-testing-machine" },
  { file: "banner-oven", slug: "hot-air-oven" },
];

// Premium navy background with a soft central spotlight + brand accents. No text.
const bgSvg = () => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1C2F80"/><stop offset="0.55" stop-color="#16256B"/><stop offset="1" stop-color="#0E1846"/>
    </linearGradient>
    <radialGradient id="spot" cx="50%" cy="44%" r="52%">
      <stop offset="0" stop-color="#3C55B5" stop-opacity="0.55"/><stop offset="1" stop-color="#3C55B5" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#spot)"/>
  <g stroke="#ffffff" stroke-opacity="0.05">
    ${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="${H}"/>`).join("")}
    ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 80}" x2="${W}" y2="${i * 80}"/>`).join("")}
  </g>
  <circle cx="1470" cy="90" r="240" fill="#E11F27" opacity="0.10"/>
  <!-- brand corner triangles -->
  <polygon points="0,0 300,0 0,150" fill="#E11F27" opacity="0.9"/>
  <polygon points="0,0 165,0 0,85" fill="#26398F"/>
  <polygon points="${W},${H} ${W - 300},${H} ${W},${H - 150}" fill="#E11F27" opacity="0.9"/>
  <polygon points="${W},${H} ${W - 165},${H} ${W},${H - 85}" fill="#26398F"/>
  <rect x="0" y="${H - 7}" width="${W}" height="7" fill="#E11F27"/>
</svg>`;

const shadowSvg = (w) => Buffer.from(`
<svg width="${w}" height="90" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="s" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#000" stop-opacity="0.45"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient></defs>
  <ellipse cx="${w / 2}" cy="45" rx="${w / 2}" ry="42" fill="url(#s)"/>
</svg>`);

for (const b of BANNERS) {
  const cutPath = path.join(CUT, `${b.slug}.png`);
  // Trim transparent border, then fit into the machine box.
  const m = await sharp(cutPath)
    .trim({ threshold: 1 })
    .resize({ width: MAXW, height: MAXH, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer({ resolveWithObject: true });

  const mw = m.info.width, mh = m.info.height;
  const left = Math.round((W - mw) / 2);
  const top = Math.round((H - mh) / 2 - 18);

  // Soft ground shadow under the machine.
  const shW = Math.round(mw * 0.8);
  const shadow = await sharp(shadowSvg(shW)).png().toBuffer();
  const shLeft = Math.round((W - shW) / 2);
  const shTop = Math.min(top + mh - 30, H - 90);

  const out = path.join(OUT, `${b.file}.jpg`);
  await sharp(Buffer.from(bgSvg()))
    .composite([
      { input: shadow, left: shLeft, top: shTop },
      { input: m.data, left, top },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
  console.log(`banners/${b.file}.jpg  machine ${mw}x${mh}  ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
}
console.log("Done.");
