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

const MACHINES = [
  "universal-testing-machine-10-ton",
  "melt-flow-index-mfi-test-apparatus",
  "hydrostatic-pressure-testing-machine-3-station",
  "izod-and-charpy-impact-test-apparatus",
  "dart-impact-testing-machine",
  "hot-air-oven",
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
