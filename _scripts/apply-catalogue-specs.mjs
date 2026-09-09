// Merges the full specifications extracted from the client's catalogues into
// frontend/src/data/products.json.
//
// The site's spec tables were summarised rather than complete — the Carbon Black
// apparatus carried 13 rows against the catalogue's 19, missing End closures,
// Pre/Post treatment attachments, Timer and Timer range, with "Effective furnace
// size" folded into the "Furnace" row. This replaces them with what the
// catalogue actually says.
//
// Matching is strict, as in make-standards.mjs: model number, or an exact
// normalised name. Nothing is guessed — a wrong spec sheet on a product page is
// worse than no spec sheet.
//
// Run:  node extract-specs.py   (first)
//       node apply-catalogue-specs.mjs
import fs from "node:fs";
import path from "node:path";

const PRODUCTS = path.resolve("../frontend/src/data/products.json");
const SPECS = path.resolve("_catalogue-specs.json");

const manifest = JSON.parse(fs.readFileSync(PRODUCTS, "utf-8"));
const { machines } = JSON.parse(fs.readFileSync(SPECS, "utf-8"));

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(test|testing|apparatus|machine|tester|system|digital|the)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Verified by reading both names — same reasoning as the standards mapping.
const OVERRIDES = {
  "ve-ttm-02-wst": "tensile-testing-machine-wst",
  "ve-cnct-01": "contour-cutter",
  "k-emfvt-01": "emission-flow-variation-test-apparatus",
};

// Strong match: the product's own model number, or a verified override.
const byModel = (machine) => {
  const model = machine.model.toLowerCase();
  if (OVERRIDES[model]) return manifest.products.find((p) => p.slug === OVERRIDES[model]) || null;
  return manifest.products.find((p) => (p.model || "").toLowerCase() === model) || null;
};

// Weak match: identical names. Only trusted when nothing stronger claimed the
// product — three different tensile machines (TTM-01xi, TTM-01LC, UTM-01xi) are
// all just called "Tensile Testing Machine".
const byName = (machine) => {
  const key = norm(machine.name);
  return manifest.products.find((p) => norm(p.name) === key) || null;
};

const changes = [];
const unmatched = [];
const collisions = [];
const claimed = new Map(); // slug -> model that owns it

// Pass 1: model matches. Done first so the product's own model wins the page.
// Running a single pass let a name match overwrite a model match, and the
// Tensile page ended up with whichever machine happened to be processed last.
for (const machine of machines) {
  const product = byModel(machine);
  if (!product) continue;
  const before = (product.specifications || []).length;
  product.specifications = machine.specs; // the manufacturer's own document wins
  if (!product.model) product.model = machine.model;
  claimed.set(product.slug, machine.model);
  changes.push({ slug: product.slug, name: product.name, before, after: machine.specs.length, model: machine.model, how: "model" });
}

// Pass 2: name matches, but never over a product already claimed by its model.
for (const machine of machines) {
  if (byModel(machine)) continue;
  const product = byName(machine);
  if (!product) {
    unmatched.push(machine);
    continue;
  }
  if (claimed.has(product.slug)) {
    collisions.push({ machine, product, owner: claimed.get(product.slug) });
    continue;
  }
  const before = (product.specifications || []).length;
  product.specifications = machine.specs;
  if (!product.model) product.model = machine.model;
  claimed.set(product.slug, machine.model);
  changes.push({ slug: product.slug, name: product.name, before, after: machine.specs.length, model: machine.model, how: "name" });
}

fs.writeFileSync(PRODUCTS, JSON.stringify(manifest, null, 2));

console.log("Updated products:");
for (const c of changes.sort((a, b) => b.after - b.before - (a.after - a.before))) {
  const delta = c.after - c.before;
  const flag = c.before === 0 ? "NEW " : delta > 0 ? `+${delta}` : delta === 0 ? " = " : `${delta}`;
  console.log(`  ${flag.padStart(4)}  ${String(c.before).padStart(2)} -> ${String(c.after).padStart(2)} rows  ${c.model.padEnd(15)} ${c.name}`);
}

if (collisions.length) {
  console.log(`\n${collisions.length} machines share a product page and were NOT applied:`);
  for (const c of collisions) {
    console.log(`  ${c.machine.model.padEnd(15)} would overwrite "${c.product.name}" (owned by ${c.owner})`);
  }
  console.log("  -> these are separate machines with no page of their own.");
}

console.log(`\n${changes.length} products updated, ${unmatched.length} catalogue machines not on the site:`);
for (const m of unmatched) console.log(`  ${m.model.padEnd(15)} ${m.name}`);

const still = manifest.products.filter((p) => !(p.specifications || []).length);
console.log(`\n${still.length} products still without specifications (not covered by these catalogues):`);
for (const p of still) console.log(`  ${p.name}`);
