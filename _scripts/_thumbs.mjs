// Contact sheet of the carved images so they can be identified by eye.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.resolve("_carved");
const OUT = path.join(DIR, "thumbs");
fs.mkdirSync(OUT, { recursive: true });

for (const f of fs.readdirSync(DIR).filter((f) => /\.(jpg|png)$/i.test(f))) {
  const src = path.join(DIR, f);
  try {
    const meta = await sharp(src).metadata();
    await sharp(src)
      .resize(420, 420, { fit: "inside" })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 70 })
      .toFile(path.join(OUT, f.replace(/\.\w+$/, ".jpg")));
    console.log(`${f.padEnd(26)} ${meta.width}x${meta.height}  alpha=${!!meta.hasAlpha}`);
  } catch (e) {
    // Keep going: one unreadable carve should not hide the other nine.
    console.log(`${f.padEnd(26)} UNREADABLE (${String(e.message).split("\n")[0]})`);
  }
}
