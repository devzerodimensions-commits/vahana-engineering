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

// ---------------------------------------------------------------------------
// Alpha hole repair.
// @imgly sometimes mistakes a machine's own cream/white panels for the light
// studio background and erases them, leaving the machine looking hollow (the
// Contour Cutter came out 34% see-through). The RGB underneath survives — only
// the alpha is zeroed — so we can repair it by flood-filling the background in
// from the image border: any transparent area NOT reachable from the border is
// an interior hole and gets made opaque again.
//
// ONLY safe for solid-cabinet machines. Open-frame machines (Two Roll Mill,
// Emission Flow, Geomembrane UTM, Carbon Black) have real enclosed gaps you are
// meant to see through, and filling those would wrongly seal them shut.
const FILL_HOLES = new Set([
  "contour-cutter",
  "vicat-softening-point-test-apparatus",
  "melt-flow-index-mfi-test-apparatus",
]);

async function repairAlpha(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const THR = 32;
  const seen = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    const i = y * W + x;
    if (!seen[i] && data[i * 4 + 3] < THR) { seen[i] = 1; stack.push(i); }
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const i = stack.pop(), x = i % W, y = (i / W) | 0;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }
  let filled = 0;
  for (let i = 0; i < W * H; i++) {
    if (data[i * 4 + 3] < THR && !seen[i]) { data[i * 4 + 3] = 255; filled++; }
  }
  const buf = await sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  return { buf, filled };
}

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

  // Repair erased panels first (solid-cabinet machines only).
  let input = src;
  if (FILL_HOLES.has(slug)) {
    const { buf, filled } = await repairAlpha(src);
    input = buf;
    console.log(`  hole-repair: ${slug} — refilled ${filled} px`);
  }

  // Resize to uniform height, get raw RGBA.
  const { data, info } = await sharp(input)
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
