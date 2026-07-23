// Premium full-width hero banners: ONE big machine cutout per slide on a clean,
// elegant light background with a soft realistic shadow + subtle brand accents.
// TEXT-FREE. Output: frontend/public/banners/*.jpg
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../frontend/public");
const CUT = path.resolve("_cutouts");
const OUT = path.join(PUB, "banners");
fs.mkdirSync(OUT, { recursive: true });

const W = 1600, H = 560;
const MAXW = 940, MAXH = 495;
const CX = W / 2, CY = 248; // focal centre behind the machine

const BANNERS = [
  { file: "banner-utm", slug: "universal-testing-machine-10-ton" },
  { file: "banner-mfi", slug: "melt-flow-index-mfi-test-apparatus" },
  { file: "banner-hydro", slug: "hydrostatic-pressure-testing-machine-3-station" },
  { file: "banner-impact", slug: "izod-and-charpy-impact-test-apparatus" },
  { file: "banner-vicat", slug: "vicat-softening-point-test-apparatus" },
  { file: "banner-oven", slug: "hot-air-oven" },
];

// Premium light background: soft spotlight + concentric focus rings behind the
// machine (fills the space elegantly), with refined brand accents. No text.
const bgSvg = () => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eaeff8"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="44%" r="46%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="0.55" stop-color="#dbe6f7" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#dbe6f7" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- concentric focus rings (precision motif) -->
  <g fill="none" stroke="#16256B">
    <circle cx="${CX}" cy="${CY}" r="210" stroke-opacity="0.07" stroke-width="2"/>
    <circle cx="${CX}" cy="${CY}" r="320" stroke-opacity="0.05" stroke-width="2"/>
    <circle cx="${CX}" cy="${CY}" r="440" stroke-opacity="0.035" stroke-width="2"/>
  </g>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>
  <!-- refined corner accents -->
  <polygon points="0,0 128,0 0,128" fill="#16256B"/>
  <polygon points="0,0 66,0 0,66" fill="#E11F27"/>
  <polygon points="${W},${H} ${W - 128},${H} ${W},${H - 128}" fill="#16256B"/>
  <polygon points="${W},${H} ${W - 66},${H} ${W},${H - 66}" fill="#E11F27"/>
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#E11F27"/>
</svg>`;

const shadowSvg = (w) => Buffer.from(`
<svg width="${w}" height="80" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="s" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#0F1A4D" stop-opacity="0.32"/><stop offset="1" stop-color="#0F1A4D" stop-opacity="0"/>
  </radialGradient></defs>
  <ellipse cx="${w / 2}" cy="40" rx="${w / 2}" ry="36" fill="url(#s)"/>
</svg>`);

for (const b of BANNERS) {
  const cutPath = path.join(CUT, `${b.slug}.png`);
  const m = await sharp(cutPath)
    .trim({ threshold: 1 })
    .resize({ width: MAXW, height: MAXH, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer({ resolveWithObject: true });

  const mw = m.info.width, mh = m.info.height;
  const left = Math.round((W - mw) / 2);
  const top = Math.round((H - mh) / 2 - 16);

  const shW = Math.round(mw * 0.82);
  const shadow = await sharp(shadowSvg(shW)).png().toBuffer();
  const shLeft = Math.round((W - shW) / 2);
  const shTop = Math.min(top + mh - 26, H - 80);

  const out = path.join(OUT, `${b.file}.jpg`);
  await sharp(Buffer.from(bgSvg()))
    .composite([
      { input: shadow, left: shLeft, top: shTop },
      { input: m.data, left, top },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(out);
  console.log(`banners/${b.file}.jpg  machine ${mw}x${mh}  ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
}
console.log("Done.");
