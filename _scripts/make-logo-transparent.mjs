// Produces a transparent-background copy of the logo for use on non-white
// surfaces (currently the light-grey footer).
//
// logo.png is fully opaque on white. On a white header that is invisible, but on
// the #F1F5F9 footer it shows as a pale rectangle around the logo. Same approach
// as the favicon: derive alpha from each pixel's distance from white, then
// un-matte the colour with C = (P - 255(1-a))/a so anti-aliased edges don't keep
// a white blend and halo the letterforms.
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("../frontend/public/logo.png");
const OUT = path.resolve("../frontend/public/logo-transparent.png");

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

let cleared = 0;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const whiteness = Math.min(r, g, b);
  const a = Math.max(0, Math.min(255, Math.round(((255 - whiteness) * 255) / 215)));
  if (a === 0) {
    data[i] = data[i + 1] = data[i + 2] = 0;
    cleared++;
  } else if (a < 255) {
    const af = a / 255;
    data[i] = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - af)) / af)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - af)) / af)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - af)) / af)));
  }
  data[i + 3] = a;
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const pct = ((100 * cleared) / (info.width * info.height)).toFixed(1);
console.log(`logo-transparent.png  ${info.width}x${info.height}  ${pct}% background made transparent`);
