// Optimises the transparent machine cutouts into small WebP images used by the
// 3-per-view hero carousel cards. (Separate process from @imgly to avoid the
// sharp/libvips version clash.)
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const CUT = path.resolve("_cutouts");
const OUT = path.resolve("../frontend/public/machines");
fs.mkdirSync(OUT, { recursive: true });

const MACHINES = [
  "universal-testing-machine-10-ton",
  "melt-flow-index-mfi-test-apparatus",
  "hydrostatic-pressure-testing-machine-3-station",
  "izod-and-charpy-impact-test-apparatus",
  "dart-impact-testing-machine",
  "hot-air-oven",
  "universal-testing-machine-2-ton",
  "tensile-testing-machine",
  "vicat-softening-point-test-apparatus",
  "two-roll-mill",
  "compression-moulding-press",
  "oxidation-induction-time-oit-test-apparatus",
];

for (const slug of MACHINES) {
  const src = path.join(CUT, `${slug}.png`);
  if (!fs.existsSync(src)) {
    console.log("missing cutout:", slug);
    continue;
  }
  const out = path.join(OUT, `${slug}.webp`);
  const info = await sharp(src)
    .trim({ threshold: 1 })
    .resize({ width: 620, height: 540, fit: "inside", withoutEnlargement: false })
    .webp({ quality: 84 })
    .toFile(out);
  console.log(`machines/${slug}.webp  ${info.width}x${info.height}  ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
}
console.log("Done.");
