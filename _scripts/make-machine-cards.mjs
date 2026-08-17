// Normalises the machine cutouts to a UNIFORM canvas (same size for all, no crop)
// AND cleans the alpha channel to remove any residual semi-transparent studio
// background left by the AI cutout — so the machine background is properly transparent.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const CUT = path.resolve("_cutouts");
const OUT = path.resolve("../frontend/public/machines");
fs.mkdirSync(OUT, { recursive: true });

const CW = 660, CH = 600, MH = 500; // uniform canvas + machine height

// Alpha cleanup: only very-faint pixels below LOW -> fully transparent (removes
// leftover background); anything above HIGH -> fully OPAQUE so the machine's own
// light-coloured surfaces stay solid (not see-through). Smooth edge in between.
const LOW = 45, HIGH = 115, SPAN = HIGH - LOW;

// Keep in sync with make-cutouts.mjs and HeroSlider.jsx (client-chosen order).
const MACHINES = [
  "universal-testing-machine-2-ton",
  "tensile-testing-machine-wst",
  "hydrostatic-pressure-testing-machine-3-station",
  "universal-testing-machine-geomembrane-and-fabric",
  "melt-flow-index-mfi-test-apparatus",
  "carbon-black-content-test-apparatus",
  "oxidation-induction-time-oit-test-apparatus",
  "vicat-softening-point-test-apparatus",
  "emission-flow-variation-test-apparatus",
  "contour-cutter",
  "hot-air-oven",
  "two-roll-mill",
];

for (const slug of MACHINES) {
  const src = path.join(CUT, `${slug}.png`);
  if (!fs.existsSync(src)) {
    console.log("missing cutout:", slug);
    continue;
  }

  // Resize to uniform height, get raw RGBA.
  const { data, info } = await sharp(src)
    .trim({ threshold: 1 })
    .resize({ height: MH, width: CW - 20, fit: "inside", withoutEnlargement: false })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Clean the alpha channel (every 4th byte).
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    data[i] = a <= LOW ? 0 : a >= HIGH ? 255 : Math.round(((a - LOW) * 255) / SPAN);
  }

  const machine = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();

  const left = Math.round((CW - info.width) / 2);
  const top = Math.round((CH - info.height) / 2);

  const out = path.join(OUT, `${slug}.webp`);
  await sharp({
    create: { width: CW, height: CH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: machine, left, top }])
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(out);
  console.log(`machines/${slug}.webp  cleaned (machine ${info.width}x${info.height})`);
}
console.log("Done.");
