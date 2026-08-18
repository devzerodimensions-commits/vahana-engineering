// Builds the favicon set from the "VE" monogram at the top of the company logo.
// The full logo includes the VIHAANA wordmark and tagline, which turn to mush at
// 16px, so we isolate just the mark.
//
// The crop is derived, not hard-coded: take the top slice of the logo (above the
// wordmark), then find the tight bounding box of every non-white pixel in it.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("../frontend/public/logo.png");
const OUT = path.resolve("../frontend/public");

const meta = await sharp(SRC).metadata();
console.log(`logo: ${meta.width}x${meta.height}  channels=${meta.channels}  alpha=${meta.hasAlpha}`);

// The wordmark starts a little under 40% down; take the top 38% to be safe.
const sliceH = Math.round(meta.height * 0.38);
const { data, info } = await sharp(SRC)
  .extract({ left: 0, top: 0, width: meta.width, height: sliceH })
  .flatten({ background: "#ffffff" })
  .raw()
  .toBuffer({ resolveWithObject: true });

// Tight bbox of anything that isn't near-white.
let minX = info.width, minY = info.height, maxX = -1, maxY = -1;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    const isInk = data[i] < 235 || data[i + 1] < 235 || data[i + 2] < 235;
    if (isInk) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const w = maxX - minX + 1, h = maxY - minY + 1;
console.log(`VE mark bbox: x=${minX} y=${minY} ${w}x${h}`);

// Square it up with a little breathing room so the mark isn't jammed to the edge.
const pad = Math.round(Math.max(w, h) * 0.10);
const side = Math.max(w, h) + pad * 2;
const mark = await sharp(SRC)
  .extract({ left: minX, top: minY, width: w, height: h })
  .toBuffer();

// Master: transparent background, so it sits well on light or dark browser UI.
const master = await sharp({
  create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: await sharp(mark).ensureAlpha().toBuffer(), gravity: "center" }])
  .png()
  .toBuffer();

for (const size of [16, 32, 48, 192, 512]) {
  const file = path.join(OUT, `favicon-${size}.png`);
  await sharp(master).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toFile(file);
  console.log(`  favicon-${size}.png`);
}

// Apple touch icon: iOS ignores transparency and composites on black, so give it
// a solid white background and inset the mark.
const appleInner = Math.round(180 * 0.72);
await sharp({ create: { width: 180, height: 180, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
  .composite([{ input: await sharp(master).resize(appleInner, appleInner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(), gravity: "center" }])
  .png()
  .toFile(path.join(OUT, "apple-touch-icon.png"));
console.log("  apple-touch-icon.png (180x180, white bg)");

// Preview sheet so the result can be eyeballed at real sizes.
const previewCells = [];
for (const size of [16, 32, 48]) {
  const s = await sharp(master).resize(size, size).png().toBuffer();
  previewCells.push(await sharp({ create: { width: 80, height: 80, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
    .composite([{ input: s, gravity: "center" }]).png().toBuffer());
  previewCells.push(await sharp({ create: { width: 80, height: 80, channels: 4, background: { r: 30, g: 41, b: 59, alpha: 1 } } })
    .composite([{ input: s, gravity: "center" }]).png().toBuffer());
}
await sharp({ create: { width: 80 * previewCells.length, height: 80, channels: 3, background: "#888888" } })
  .composite(previewCells.map((input, i) => ({ input, left: i * 80, top: 0 })))
  .png()
  .toFile("_favicon-preview.png");

fs.writeFileSync(path.join(OUT, "favicon.png"), await sharp(master).resize(512, 512).png().toBuffer());
console.log("  favicon.png (512 master)");
console.log("preview -> _scripts/_favicon-preview.png");
