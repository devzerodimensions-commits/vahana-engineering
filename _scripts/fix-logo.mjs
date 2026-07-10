// Cleans up the header logo: backs up the original, trims the wide white
// margins so the mark fills the frame, and upscales/sharpens a crisp PNG.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUB = path.resolve("../frontend/public");
const src = path.join(PUB, "logo.png");
const backup = path.join(PUB, "logo-original.png");

// Keep a one-time backup of the untouched original.
if (!fs.existsSync(backup)) fs.copyFileSync(src, backup);

const base = sharp(backup);
const meta = await base.metadata();
console.log(`original: ${meta.width}x${meta.height}`);

// Trim near-white border, then export a tight, sharp PNG on a transparent bg.
const trimmed = await sharp(backup)
  .trim({ background: "#ffffff", threshold: 20 })
  .toBuffer({ resolveWithObject: true });

console.log(`trimmed:  ${trimmed.info.width}x${trimmed.info.height}`);

// Write the full trimmed logo (used in footer / login) with a little padding.
await sharp(trimmed.data)
  .extend({
    top: 12, bottom: 12, left: 12, right: 12,
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .png()
  .toFile(path.join(PUB, "logo.png"));

console.log("wrote logo.png (trimmed, transparent padding)");

// Header-optimised logo: crop out the small "Your Testing Partner" tagline
// (band starts ~y617) so the monogram + wordmark stay crisp at small sizes.
const headerHeight = Math.min(560, trimmed.info.height);
await sharp(trimmed.data)
  .extract({ left: 0, top: 0, width: trimmed.info.width, height: headerHeight })
  .trim({ background: "#ffffff", threshold: 20 })
  .extend({
    top: 8, bottom: 8, left: 8, right: 8,
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .png()
  .toFile(path.join(PUB, "logo-header.png"));

console.log(`wrote logo-header.png (cropped ${trimmed.info.width}x${headerHeight}, tagline removed)`);
