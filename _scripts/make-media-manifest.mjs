// Builds frontend/src/data/media.json — the index behind the admin Media library.
//
// The images are static files in frontend/public. The deployed API can't list
// them (its root directory is backend/, so it never sees the frontend folder),
// so the index is generated at build time instead of served from an endpoint.
//
// Re-run after adding images:  node _scripts/make-media-manifest.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUBLIC = path.resolve("../frontend/public");
const OUT = path.resolve("../frontend/src/data/media.json");
const PRODUCTS = path.resolve("../frontend/src/data/products.json");

// Folders worth showing an editor. Favicons are excluded: they're generated
// assets, never something you'd attach to a product.
const GROUPS = [
  { dir: "products", label: "Product Photos", root: false },
  { dir: "machines", label: "Machine Cutouts", root: false },
  { dir: "slides", label: "Slides", root: false },
  { dir: "", label: "Brand", root: true },
];

const IMAGE_RE = /\.(jpe?g|png|webp|svg)$/i;
const SKIP_ROOT = /^(favicon|apple-touch-icon)/i;

// Map image path -> product that uses it, so the library can show where an
// image is already in use rather than presenting 61 anonymous files.
const manifest = JSON.parse(fs.readFileSync(PRODUCTS, "utf-8"));
const usedBy = new Map();
for (const p of manifest.products) {
  if (p.image) usedBy.set(p.image, p.name);
  usedBy.set(`/machines/${p.slug}.webp`, p.name);
}

const prettyName = (file) =>
  file
    .replace(IMAGE_RE, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const items = [];
for (const group of GROUPS) {
  const dir = group.dir ? path.join(PUBLIC, group.dir) : PUBLIC;
  if (!fs.existsSync(dir)) continue;

  for (const file of fs.readdirSync(dir)) {
    if (!IMAGE_RE.test(file)) continue;
    if (group.root && SKIP_ROOT.test(file)) continue;

    const abs = path.join(dir, file);
    if (!fs.statSync(abs).isFile()) continue;

    const url = group.dir ? `/${group.dir}/${file}` : `/${file}`;
    let width = null, height = null;
    try {
      const meta = await sharp(abs).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;
    } catch {
      // SVGs and anything sharp can't parse still belong in the list.
    }

    items.push({
      url,
      file,
      name: prettyName(file),
      group: group.label,
      bytes: fs.statSync(abs).size,
      width,
      height,
      usedBy: usedBy.get(url) || null,
    });
  }
}

items.sort((a, b) => a.group.localeCompare(b.group) || a.file.localeCompare(b.file));

fs.writeFileSync(
  OUT,
  JSON.stringify({ generatedFrom: "frontend/public", count: items.length, items }, null, 2)
);

const totalKb = Math.round(items.reduce((n, i) => n + i.bytes, 0) / 1024);
console.log(`media.json: ${items.length} images, ${totalKb} KB total`);
for (const g of GROUPS) {
  const n = items.filter((i) => i.group === g.label).length;
  console.log(`  ${g.label.padEnd(16)} ${n}`);
}
console.log(`  linked to a product: ${items.filter((i) => i.usedBy).length}`);
