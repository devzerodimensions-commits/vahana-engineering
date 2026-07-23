// Builds hero banners from FREE stock photos (Pexels — free commercial use):
// full-bleed industrial/precision-engineering scenes with a subtle brand
// (navy) overlay + red baseline accent. TEXT-FREE.
// Output: frontend/public/banners/*.jpg
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../frontend/public");
const STOCK = path.resolve("_stock2");
const OUT = path.join(PUB, "banners");
fs.mkdirSync(OUT, { recursive: true });

const W = 1600, H = 560;

// chosen stock images (source file in _stock2) -> output banner name
const BANNERS = [
  { file: "banner-1", src: "hero1.jpg" }, // CNC machining with red accent
  { file: "banner-2", src: "hero2.jpg" }, // engineer at control panel
  { file: "banner-3", src: "hero3.jpg" }, // engineer working on machine
  { file: "banner-4", src: "hero4.jpg" }, // precision drilling
  { file: "banner-5", src: "hero5.jpg" }, // CNC machining closeup
];

// Brand overlay: cinematic navy vignette (stronger bottom-left) + red baseline.
const overlaySvg = () => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ov" x1="0" y1="1" x2="0.65" y2="0.1">
      <stop offset="0" stop-color="#0C1642" stop-opacity="0.72"/>
      <stop offset="0.5" stop-color="#0F1A4D" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#0F1A4D" stop-opacity="0.06"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#16256B" fill-opacity="0.12"/>
  <rect width="${W}" height="${H}" fill="url(#ov)"/>
  <!-- refined brand corner accents -->
  <polygon points="0,0 130,0 0,130" fill="#16256B"/>
  <polygon points="0,0 68,0 0,68" fill="#E11F27"/>
  <polygon points="${W},${H} ${W - 130},${H} ${W},${H - 130}" fill="#16256B"/>
  <polygon points="${W},${H} ${W - 68},${H} ${W},${H - 68}" fill="#E11F27"/>
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#E11F27"/>
</svg>`;

for (const b of BANNERS) {
  const src = path.join(STOCK, b.src);
  if (!fs.existsSync(src)) {
    console.log("MISSING", b.src);
    continue;
  }
  const base = await sharp(src)
    .resize({ width: W, height: H, fit: "cover", position: "attention" })
    .toBuffer();

  const out = path.join(OUT, `${b.file}.jpg`);
  await sharp(base)
    .composite([{ input: Buffer.from(overlaySvg()), left: 0, top: 0 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
  console.log(`banners/${b.file}.jpg  ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
}
console.log("Done.");
