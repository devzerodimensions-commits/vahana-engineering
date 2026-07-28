// Normalises the machine cutouts to a UNIFORM canvas so they all display at the
// same height & size (no crop) in the hero carousel. Each machine is scaled to a
// fixed height and centred on an identical transparent canvas.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const CUT = path.resolve("_cutouts");
const OUT = path.resolve("../frontend/public/machines");
fs.mkdirSync(OUT, { recursive: true });

// Uniform canvas: every output image is exactly CW x CH, machine height = MH.
const CW = 660, CH = 600, MH = 500;

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
  // Scale machine to a uniform height (fit inside so very wide ones don't overflow).
  const m = await sharp(src)
    .trim({ threshold: 1 })
    .resize({ height: MH, width: CW - 20, fit: "inside", withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });

  const w = m.info.width, h = m.info.height;
  const left = Math.round((CW - w) / 2);
  const top = Math.round((CH - h) / 2);

  const out = path.join(OUT, `${slug}.webp`);
  await sharp({
    create: { width: CW, height: CH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: m.data, left, top }])
    .webp({ quality: 86 })
    .toFile(out);
  console.log(`machines/${slug}.webp  ${CW}x${CH} (machine ${w}x${h})`);
}
console.log("Done.");
