// Adds machines that appear in the client's catalogues but had no product page.
//
// They were showing on the standards pages as "available on request" while being
// required equipment — the Pipe Impact tester by 3 of the 6 standards, the
// Digital Weight Balance by 4.
//
// Only machines with a real photo are added here. The catalogues embed some
// images and merely LINK others, so ESCR, Cold Water Bath and the 2-station
// hydrostatic rig have specs but no picture; adding them would put empty cards
// on the Products grid, so they wait for photos from the client.
//
// Run:  node add-catalogue-products.mjs   (then apply-catalogue-specs.mjs)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PRODUCTS = path.resolve("../frontend/src/data/products.json");
const IMG_DIR = path.resolve("../frontend/public/products");
const SPECS = JSON.parse(fs.readFileSync(path.resolve("_catalogue-specs.json"), "utf-8")).machines;

const NEW = [
  {
    model: "VE-PIT-01",
    slug: "pipe-impact-testing-machine",
    name: "Pipe Impact Testing Machine",
    category: "impact",
    categoryName: "Impact Testing",
    source: "_media/IS12818_image1.jpeg",
    summary:
      "Falling-weight impact tester for PVC and HDPE pipe, with adjustable drop height up to 2000 mm and a 120° V-block sample support.",
    standards: ["IS 4985", "IS 13592", "IS 12818"],
  },
  {
    model: "VE-DWB-01Xi",
    slug: "digital-weight-balance",
    name: "Digital Weight Balance",
    category: "composition-optical",
    categoryName: "Composition & Optical",
    source: "_media/IS12818_image6.jpeg",
    summary:
      "Analytical balance reading to 0.1 mg with an automatic density-calculation program, supplied with a complete specific-gravity tool kit.",
    standards: ["IS 4985", "IS 13592", "IS 12818", "IS 12701"],
  },
];

const manifest = JSON.parse(fs.readFileSync(PRODUCTS, "utf-8"));

for (const item of NEW) {
  if (manifest.products.some((p) => p.slug === item.slug)) {
    console.log(`skip (already present): ${item.slug}`);
    continue;
  }

  const spec = SPECS.find((m) => m.model.toLowerCase() === item.model.toLowerCase());
  if (!spec) {
    console.log(`skip (no specs found): ${item.model}`);
    continue;
  }

  // Match the existing product images: max 1100px, quality 82. The catalogue
  // originals are 1-6 MB, which would undo the earlier 106MB -> 1.1MB work.
  const out = path.join(IMG_DIR, `${item.slug}.jpg`);
  const info = await sharp(path.resolve(item.source))
    .resize(1100, 1100, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);

  manifest.products.push({
    name: item.name,
    slug: item.slug,
    category: item.category,
    categoryName: item.categoryName,
    image: `/products/${item.slug}.jpg`,
    summary: item.summary,
    model: item.model,
    description:
      `${item.summary} Manufactured by Vihaana Engineering, the ${item.name} is built for ` +
      "laboratories, QC departments and R&D centres that demand accurate, repeatable results. " +
      "Robust construction, digital control and compliance with recognised test standards make it " +
      "a dependable choice for polymer, pipe, film and geosynthetic testing.",
    standards: item.standards,
    specifications: spec.specs,
    featured: false,
    price: "On Request",
  });

  console.log(
    `added ${item.slug.padEnd(30)} ${spec.specs.length} spec rows  image ${Math.round(info.size / 1024)} KB`
  );
}

// Keep the per-category counts honest — the Products page prints them.
manifest.categories = manifest.categories.map((c) => ({
  ...c,
  count: manifest.products.filter((p) => p.category === c.slug).length,
}));

fs.writeFileSync(PRODUCTS, JSON.stringify(manifest, null, 2));
console.log(`\nproducts.json now holds ${manifest.products.length} products`);
