// Produces the inner-page title banner from the sourced photo.
//
// Source: Pexels photo 16442863 — "scientist operates a precision testing
// machine". Pexels licence: free for commercial use, no attribution required.
// Chosen over the alternatives because the subject is an actual materials
// testing machine, which is what Vihaana manufactures.
//
// Deliberately saved under a NEW filename rather than overwriting
// page-banner.jpg: the CDN caches static assets by URL (s-maxage=300) and we
// already hit stale-cache trouble with the favicons, where the same filename
// kept serving old bytes.
import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("_cand-testing-machine.jpg");
const OUT = path.resolve("../frontend/public/page-banner-testing.jpg");

// Wide and short — the header is ~3.2:1 at desktop. 1920 wide covers large
// screens; anything more is wasted bytes for a background image sat behind a scrim.
const meta = await sharp(SRC).metadata();
const info = await sharp(SRC)
  .resize(1920, 600, { fit: "cover", position: "centre" })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(OUT);

console.log(`source : ${meta.width}x${meta.height}`);
console.log(`banner : ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB  -> ${path.basename(OUT)}`);
