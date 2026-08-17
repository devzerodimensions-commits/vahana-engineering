// AI-removes the studio background from each machine photo and saves a clean,
// trimmed transparent PNG cutout (like the reference site's hero images).
// NOTE: do NOT import our sharp here — @imgly bundles its own sharp/libvips and
// loading two versions in one process crashes. Trimming happens in make-banners.
import { removeBackground } from "@imgly/background-removal-node";
import fs from "node:fs";
import path from "node:path";

const SRC_REL = "../frontend/public/products"; // relative path (imgly rejects C:\ absolute)
const OUT = path.resolve("_cutouts");
fs.mkdirSync(OUT, { recursive: true });

// Keep in sync with make-machine-cards.mjs and HeroSlider.jsx (client-chosen order).
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
  const srcRel = `${SRC_REL}/${slug}.jpg`;
  const out = path.join(OUT, `${slug}.png`);
  if (fs.existsSync(out)) {
    console.log("skip (exists):", slug);
    continue;
  }
  console.log("cutting:", slug, "…");
  const blob = await removeBackground(srcRel);
  const buf = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(out, buf); // raw transparent PNG; trimmed later
  console.log("  ->", path.relative(process.cwd(), out), (buf.length / 1024).toFixed(0) + "KB");
}
console.log("Done.");
