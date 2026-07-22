// Generates lightweight, web-optimised hero-slider images from the full-res
// product photos (which are 3-6 MB each — far too heavy for a hero slider).
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../frontend/public");
const SRC = path.join(PUB, "products");
const OUT = path.join(PUB, "slides");
fs.mkdirSync(OUT, { recursive: true });

// Curated, visually strong machines for the hero slider.
const SLIDES = [
  "universal-testing-machine-10-ton",
  "melt-flow-index-mfi-test-apparatus",
  "izod-and-charpy-impact-test-apparatus",
  "hydrostatic-pressure-testing-machine-3-station",
  "dart-impact-testing-machine",
  "tensile-testing-machine",
];

for (const slug of SLIDES) {
  const src = path.join(SRC, `${slug}.jpg`);
  if (!fs.existsSync(src)) {
    console.log("MISSING", slug);
    continue;
  }
  const out = path.join(OUT, `${slug}.jpg`);
  const info = await sharp(src)
    .resize({ width: 1400, height: 900, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out);
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`slides/${slug}.jpg  ${info.width}x${info.height}  ${kb}KB`);
}
console.log("Done.");
