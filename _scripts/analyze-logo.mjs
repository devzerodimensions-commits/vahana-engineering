// Finds horizontal content bands (separated by white gaps) in the logo so we
// can crop out the small tagline for a header-optimised version.
import sharp from "sharp";
import path from "node:path";

const src = path.resolve("../frontend/public/logo-original.png");
const { data, info } = await sharp(src)
  .trim({ background: "#ffffff", threshold: 20 })
  .flatten({ background: "#ffffff" })
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
console.log(`trimmed content: ${width}x${height}, channels=${channels}`);

// For each row, count "ink" pixels (noticeably non-white).
const rowInk = new Array(height).fill(0);
for (let y = 0; y < height; y++) {
  let ink = 0;
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r < 235 || g < 235 || b < 235) ink++;
  }
  rowInk[y] = ink / width; // fraction of row that is ink
}

// Segment into bands where ink fraction exceeds a small threshold.
const TH = 0.02;
const bands = [];
let start = -1;
for (let y = 0; y < height; y++) {
  const on = rowInk[y] > TH;
  if (on && start < 0) start = y;
  if (!on && start >= 0) { bands.push([start, y - 1]); start = -1; }
}
if (start >= 0) bands.push([start, height - 1]);

console.log("bands (y0-y1, height, %h):");
bands.forEach(([a, b]) =>
  console.log(`  ${a}-${b}  h=${b - a + 1}  (${(((b - a + 1) / height) * 100).toFixed(1)}%)`)
);
