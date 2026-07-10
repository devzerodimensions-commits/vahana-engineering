// Prepares product image assets + a shared products manifest.
// - Copies the logo and 27 product photos into frontend/public
// - Renames files to clean URL slugs
// - Emits frontend/src/data/products.json (also used by the backend seed)
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = "C:/Users/Admin/Desktop/Vihaana Engineering";
const PROD_SRC_DIR = path.join(SRC_DIR, "Vihaana Machine Photo");
const ROOT = "C:/Users/Admin/job station";
const PUBLIC = path.join(ROOT, "frontend/public");
const PROD_IMG_DIR = path.join(PUBLIC, "products");
const DATA_DIR = path.join(ROOT, "frontend/src/data");

fs.mkdirSync(PROD_IMG_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[''"()]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Category definitions with the testing standards each family covers.
const CATEGORIES = {
  "universal-tensile": {
    name: "Universal & Tensile Testing",
    blurb:
      "Precision tensile, compression and universal test frames for plastics, films, tapes, geomembranes and welded joints.",
    standards: ["ASTM D638", "ASTM D882", "ISO 527", "IS 13360"],
  },
  impact: {
    name: "Impact Testing",
    blurb:
      "Instruments that measure toughness and impact resistance of polymers and films under sudden load.",
    standards: ["ASTM D256", "ASTM D1709", "ISO 179", "ISO 180"],
  },
  "melt-flow": {
    name: "Melt Flow & Rheology",
    blurb:
      "Melt flow index and flow-variation apparatus for quality control of thermoplastic resins.",
    standards: ["ASTM D1238", "ISO 1133"],
  },
  "thermal-ageing": {
    name: "Thermal & Ageing",
    blurb:
      "Ovens, baths and chambers for conditioning, thermal ageing, softening point and oxidation-induction testing.",
    standards: ["ASTM D1525", "ISO 306", "ASTM D3895", "ISO 11357"],
  },
  "composition-optical": {
    name: "Composition & Optical",
    blurb:
      "Apparatus to determine carbon-black content, ash content and optical opacity of polymer compounds.",
    standards: ["ASTM D1603", "ISO 6964", "ASTM D2244"],
  },
  "pressure-pipe": {
    name: "Pressure & Pipe Testing",
    blurb:
      "Hydrostatic pressure rigs for long-term and short-term strength testing of pipes and fittings.",
    standards: ["ASTM D1598", "ISO 1167", "IS 4984"],
  },
  "specimen-prep": {
    name: "Specimen Preparation & Cutters",
    blurb:
      "Notch cutters and contour cutters that prepare accurate, standard-compliant test specimens.",
    standards: ["ISO 2818", "ASTM D4703"],
  },
  "moulding-processing": {
    name: "Moulding & Processing",
    blurb:
      "Laboratory presses, mills and extrusion plant for compounding and preparing test sheets and films.",
    standards: ["ASTM D4703", "ISO 293"],
  },
};

// source filename (no extension) -> { name, category, summary }
const PRODUCTS = {
  "'V' Notch Cutter for HDPE Pipe": {
    name: "V-Notch Cutter for HDPE Pipe",
    category: "specimen-prep",
    summary:
      "Cuts precise V-notches in HDPE pipe specimens for notched-pipe and slow-crack-growth testing.",
  },
  "Ash Content Tester (Muffle Furnace)": {
    name: "Ash Content Tester (Muffle Furnace)",
    category: "thermal-ageing",
    summary:
      "High-temperature muffle furnace for determining ash and filler content of polymers by incineration.",
  },
  "Blown Film Extrusion Plant  Laboratory Model": {
    name: "Blown Film Extrusion Plant – Laboratory Model",
    category: "moulding-processing",
    summary:
      "Compact lab-scale blown-film line for producing trial films and studying processability of resins.",
  },
  "Carbon Black Content Test Appartus": {
    name: "Carbon Black Content Test Apparatus",
    category: "composition-optical",
    summary:
      "Determines carbon-black content of polyethylene compounds by pyrolysis in an inert atmosphere.",
  },
  "Compression Moudling Press": {
    name: "Compression Moulding Press",
    category: "moulding-processing",
    summary:
      "Heated hydraulic press for moulding standard test sheets and plaques from thermoplastic granules.",
  },
  "Contour Cutter": {
    name: "Contour Cutter",
    category: "specimen-prep",
    summary:
      "Cuts dumbbell and contour test specimens cleanly from moulded sheets for tensile testing.",
  },
  "Cooling Chamber": {
    name: "Cooling Chamber",
    category: "thermal-ageing",
    summary:
      "Controlled low-temperature chamber for conditioning specimens prior to impact and brittleness tests.",
  },
  "Dart Impact Testing Machine": {
    name: "Dart Impact Testing Machine",
    category: "impact",
    summary:
      "Free-falling dart apparatus measuring the impact failure weight of plastic films and sheeting.",
  },
  "Emission Flow Variation Test Apparatus": {
    name: "Emission Flow Variation Test Apparatus",
    category: "melt-flow",
    summary:
      "Evaluates flow-rate variation of thermoplastics to monitor batch-to-batch consistency.",
  },
  "Hot Air Oven": {
    name: "Hot Air Oven",
    category: "thermal-ageing",
    summary:
      "Forced-air oven for drying, curing and heat-ageing of polymer specimens at set temperatures.",
  },
  "Hot Oil Bath": {
    name: "Hot Oil Bath",
    category: "thermal-ageing",
    summary:
      "Stirred oil bath giving stable high-temperature conditioning for reversion and thermal tests.",
  },
  "Hot Water Bath": {
    name: "Hot Water Bath",
    category: "thermal-ageing",
    summary:
      "Thermostatically controlled water bath for conditioning and immersion testing of specimens.",
  },
  "Humidity Chamber": {
    name: "Humidity Chamber",
    category: "thermal-ageing",
    summary:
      "Temperature and humidity controlled chamber for conditioning and environmental ageing of materials.",
  },
  "Hydrostatic Pressure Testing Machine - 3 Station": {
    name: "Hydrostatic Pressure Testing Machine – 3 Station",
    category: "pressure-pipe",
    summary:
      "Three-station rig for long-term hydrostatic strength and burst testing of plastic pipes.",
  },
  "IzodCharpy Impact Test Apparatus": {
    name: "Izod & Charpy Impact Test Apparatus",
    category: "impact",
    summary:
      "Pendulum impact tester for Izod and Charpy notched-bar toughness measurement of plastics.",
  },
  "Melt Flow Index Test Apparatus": {
    name: "Melt Flow Index (MFI) Test Apparatus",
    category: "melt-flow",
    summary:
      "Extrusion plastometer measuring melt mass-flow rate (MFR) and volume-flow rate (MVR) of resins.",
  },
  "Opacity Test Apparatus": {
    name: "Opacity Test Apparatus",
    category: "composition-optical",
    summary:
      "Measures light transmission and opacity of pipes and films for carbon-black dispersion checks.",
  },
  "Oxidation Induction Time Test Apparatus": {
    name: "Oxidation Induction Time (OIT) Test Apparatus",
    category: "thermal-ageing",
    summary:
      "Determines oxidation induction time of polyolefins to assess antioxidant/stabiliser levels.",
  },
  "Sheet Moulding Press": {
    name: "Sheet Moulding Press",
    category: "moulding-processing",
    summary:
      "Hydraulic heated platen press for preparing uniform moulded sheets for downstream testing.",
  },
  "Tensile Testing Machine Tape & Fabric": {
    name: "Tensile Testing Machine – Tape & Fabric",
    category: "universal-tensile",
    summary:
      "Tensile tester configured for tapes, woven fabrics and technical textiles with grip options.",
  },
  "Tensile Testing Machine-WST": {
    name: "Tensile Testing Machine – WST",
    category: "universal-tensile",
    summary:
      "Weld-strength tensile tester for evaluating butt-fusion and electrofusion joints in pipes.",
  },
  "Tensile Testing Machine": {
    name: "Tensile Testing Machine",
    category: "universal-tensile",
    summary:
      "Motorised tensile tester for tensile strength, elongation and yield of plastics and elastomers.",
  },
  "Two Roll Mill": {
    name: "Two Roll Mill",
    category: "moulding-processing",
    summary:
      "Laboratory two-roll mixing mill for compounding polymers, masterbatches and rubber blends.",
  },
  "Universal Testing Machine-10 Ton": {
    name: "Universal Testing Machine – 10 Ton",
    category: "universal-tensile",
    summary:
      "10-ton (100 kN) computerised universal testing machine for tension, compression and flexure.",
  },
  "Universal Testing Machine-2 Ton": {
    name: "Universal Testing Machine – 2 Ton",
    category: "universal-tensile",
    summary:
      "2-ton (20 kN) computerised universal testing machine for plastics, films and small components.",
  },
  "Universal Testing Machine-Geomembrane fabric": {
    name: "Universal Testing Machine – Geomembrane & Fabric",
    category: "universal-tensile",
    summary:
      "UTM configured for geomembranes, geotextiles and fabrics with wide-width grips and extensometry.",
  },
  "Vicat Softening Point Test Apparatus": {
    name: "Vicat Softening Point Test Apparatus",
    category: "thermal-ageing",
    summary:
      "Determines Vicat softening temperature (VST) and heat-deflection behaviour of thermoplastics.",
  },
};

const files = fs.readdirSync(PROD_SRC_DIR).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

// Logo (lives in the parent folder, not the photo subfolder)
const logoSrc = fs.readdirSync(SRC_DIR).find((f) => /logo/i.test(f));
if (logoSrc) {
  fs.copyFileSync(path.join(SRC_DIR, logoSrc), path.join(PUBLIC, "logo.png"));
  console.log("logo -> public/logo.png");
}

const products = [];
let missing = [];
for (const [base, meta] of Object.entries(PRODUCTS)) {
  const match = files.find((f) => f.replace(/\.(jpg|jpeg|png)$/i, "") === base);
  const slug = slugify(meta.name);
  const imageFile = `${slug}.jpg`;
  if (match) {
    fs.copyFileSync(path.join(PROD_SRC_DIR, match), path.join(PROD_IMG_DIR, imageFile));
  } else {
    missing.push(base);
  }
  const cat = CATEGORIES[meta.category];
  products.push({
    name: meta.name,
    slug,
    category: meta.category,
    categoryName: cat.name,
    image: `/products/${imageFile}`,
    summary: meta.summary,
    description:
      `${meta.summary} Manufactured by Vihana Engineering, the ${meta.name} is built for ` +
      `laboratories, QC departments and R&D centres that demand accurate, repeatable results. ` +
      `Robust construction, digital control and compliance with recognised test standards make it ` +
      `a dependable choice for polymer, pipe, film and geosynthetic testing.`,
    standards: cat.standards,
    featured: false,
    price: "On Request",
  });
}

// mark a few flagship products as featured for the homepage
const featuredSlugs = new Set([
  slugify("Universal Testing Machine – 10 Ton"),
  slugify("Melt Flow Index (MFI) Test Apparatus"),
  slugify("Izod & Charpy Impact Test Apparatus"),
  slugify("Hydrostatic Pressure Testing Machine – 3 Station"),
  slugify("Vicat Softening Point Test Apparatus"),
  slugify("Dart Impact Testing Machine"),
]);
for (const p of products) if (featuredSlugs.has(p.slug)) p.featured = true;

const categories = Object.entries(CATEGORIES).map(([key, c]) => ({
  slug: key,
  name: c.name,
  blurb: c.blurb,
  standards: c.standards,
  count: products.filter((p) => p.category === key).length,
}));

const manifest = { categories, products };
fs.writeFileSync(path.join(DATA_DIR, "products.json"), JSON.stringify(manifest, null, 2));

console.log(`Copied ${products.length - missing.length}/${products.length} product images.`);
if (missing.length) console.log("MISSING:", missing);
console.log(`Wrote manifest: ${products.length} products, ${categories.length} categories.`);
