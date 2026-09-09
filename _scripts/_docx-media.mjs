// Dumps word/media/* out of the three .docx catalogues.
//
// The first sweep only looked at the .doc files. A .docx is a zip and stores
// its pictures as ordinary files under word/media/, at full resolution — no
// carving needed, and no 160px link-preview problem.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const SRC = String.raw`C:\Users\Admin\Desktop\Vihaana Engineering\wetransfer_pfa_2026-09-08_0639`;
const OUT = path.resolve("_docx-media");
fs.mkdirSync(OUT, { recursive: true });

for (const f of fs.readdirSync(SRC).filter((f) => f.endsWith(".docx"))) {
  const tag = f.replace(/[^A-Za-z0-9]+/g, "").slice(0, 12);
  const dest = path.join(OUT, tag);
  fs.mkdirSync(dest, { recursive: true });
  // Expand-Archive refuses anything not named .zip, so go straight to the
  // .NET ZipFile class, which only cares about the actual container format.
  execSync(
    `powershell -NoProfile -Command "Add-Type -A System.IO.Compression.FileSystem; ` +
      `[IO.Compression.ZipFile]::ExtractToDirectory('${path.join(SRC, f)}','${dest}')"`,
    { stdio: "pipe" }
  );
  const media = path.join(dest, "word", "media");
  const files = fs.existsSync(media) ? fs.readdirSync(media) : [];
  console.log(`${f.slice(0, 44).padEnd(46)} ${files.length} media files`);
}
