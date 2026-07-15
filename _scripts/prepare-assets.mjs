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

// Technical specifications transcribed from the IS 4984 Product Catalogue.
// Keyed by product slug. Attaches model no., accurate standards and a spec table.
const S = (label, value) => ({ label, value });
const SPECS = {
  "melt-flow-index-mfi-test-apparatus": {
    model: "VE-MFI-01",
    standards: ["ASTM D1238", "IS 2530"],
    specs: [
      S("Model No.", "VE-MFI-01"),
      S("Reference Standards", "ASTM D1238, IS 2530"),
      S("Test Method", "A"),
      S("System", "Digital"),
      S("Temperature Controller", "Microprocessor-based double-display digital PID controller"),
      S("Temperature Range", "Ambient to 300 °C"),
      S("Temperature Resolution", "0.1 °C"),
      S("Accuracy", "± 0.1 °C"),
      S("Timer Range", "0.1 to 999.59 minute (0.1 min resolution)"),
      S("Weight Lifting / Cutting", "Manual"),
      S("Accessories", "Orifice (die), piston, orifice cleaner & ejector, cylinder cleaner, extrudate cutter, forceps, dead weights 2.16 kgf & 5.00 kgf (other weights optional)"),
      S("Finish", "Powder coated"),
      S("Power Supply", "230 V AC, single phase, 50 Hz"),
    ],
  },
  "carbon-black-content-test-apparatus": {
    model: "VE-CBC-01",
    specs: [
      S("Model No.", "VE-CBC-01"),
      S("System", "Digital"),
      S("Heating Element", "1000 W element wound on ceramic tube"),
      S("Temperature Controller", "Microprocessor-based double-display digital PID controller"),
      S("Temperature Range", "Ambient to 800 °C"),
      S("Least Count", "1 °C"),
      S("Accuracy", "± 5 °C or better"),
      S("Furnace", "Dual insulation; effective size Ø30 mm × 300 mm"),
      S("Pyrolysing Chamber", "Heat-resistant quartz glass tube"),
      S("Sample Holder", "Quartz boat Ø12 mm × 75 mm"),
      S("Insulation", "100 mm triple-layer cera-wool"),
      S("Accessories", "Quartz tube, quartz/ceramic boat, gas-washing bottle with trap head & MS stand, desiccator, boat pulling rod, test chemicals"),
      S("Power Supply", "230 V AC, single phase, 50 Hz"),
    ],
  },
  "hot-air-oven": {
    model: "VE-HAO-01",
    specs: [
      S("Model No.", "VE-HAO-01"),
      S("Internal Chamber", '18" × 18" × 18" (45 × 45 × 45 cm)'),
      S("System", "Digital"),
      S("Temperature Controller", "Microprocessor-based double-display digital PID controller"),
      S("Heating", "High-grade nichrome wire in side & bottom ribs for uniform temperature"),
      S("Air Circulation", "Aluminium blower (top / back)"),
      S("Temperature Range", "Ambient to 250 °C"),
      S("Accuracy", "± 0.5 °C or better"),
      S("Insulation", "75 mm glass-wool"),
      S("Construction", "Inner SS 304; outer CRC sheet, powder coated"),
      S("Power Supply", "230 V AC, single phase, 50 Hz"),
    ],
  },
  "hydrostatic-pressure-testing-machine-3-station": {
    model: "VE-HYD-03",
    specs: [
      S("Model No.", "VE-HYD-03"),
      S("Stations", "3 (three)"),
      S("Outlets", "9 (nine) — 3 per station"),
      S("Pressure Range", "0.00 to 60.0 kg/cm²"),
      S("Pressure Resolution", "0.01 kg/cm²"),
      S("Time Range", "999.59 hours (1 min resolution)"),
      S("Hydraulic Circuit", "Corrosion-free SS 304 tubing & fittings"),
      S("Compressed Air", "Min. 3.0 kg/cm² from compressor"),
      S("Pressure System", "Hydro-pneumatic reciprocating pump (single)"),
      S("Finish", "Powder coated"),
      S("Power Supply", "230 V AC, single phase, 50 Hz"),
    ],
  },
  "hot-water-bath": {
    model: "VE-WB-02-H",
    specs: [
      S("Model No.", "VE-WB-02-H"),
      S("Inner Chamber", '48" × 36" × 18" (L × W × H)'),
      S("System", "Digital"),
      S("Temperature Controller", "Microprocessor-based double-display digital PID controller"),
      S("Heating", "High-efficiency SS tubular heating system"),
      S("Water Circulation", "Mono-block pump"),
      S("Temperature Range", "Ambient to 90 °C"),
      S("Least Count / Accuracy", "0.1 °C / ± 1 °C or better"),
      S("Insulation", "50 mm glass-wool"),
      S("Construction", "Inner SS 304; outer CRC sheet, powder coated"),
      S("Power Supply", "440 V AC, three phase, 50 Hz"),
    ],
  },
  "cooling-chamber": {
    model: "VE-CWB-02-H",
    specs: [
      S("Model No.", "VE-CWB-02-H"),
      S("Inner Chamber", '50" × 60" × 24"'),
      S("System", "Digital"),
      S("Temperature Controller", "Microprocessor-based double-display digital PID controller"),
      S("Cooling", "Reputed-make compressor unit"),
      S("Water Circulation", "Submersible pump"),
      S("Temperature Range", "Ambient to 20 °C"),
      S("Least Count / Accuracy", "0.1 °C / ± 1 °C or better"),
      S("Insulation", "50 mm"),
      S("Construction", "Inner SS 304; outer CRC sheet, powder coated"),
      S("Power Supply", "440 V AC, three phase, 50 Hz"),
    ],
  },
  "oxidation-induction-time-oit-test-apparatus": {
    model: "VE-OIT-01",
    standards: ["IS 4984", "ASTM D3895"],
    specs: [
      S("Model No.", "VE-OIT-01"),
      S("Method", "Differential Thermal Analyzer (DTA)"),
      S("Reference Standards", "IS 4984, ASTM D3895"),
      S("System", "Windows-based software; PC connectivity via RS-232; graphical reports"),
      S("Temperature Controller", "Microprocessor PID; shows process temp & Delta T"),
      S("Range", "Ambient to 300 °C (0.1 °C resolution)"),
      S("Accuracy", "± 0.5 °C"),
      S("Rate of Temperature Rise", "20 °C/min & 2 °C/min"),
      S("Gas Flow Control", "Gas regulator + rotameters"),
      S("Max. Test Time", "0 to 300 minutes"),
      S("Accessories", "50 aluminium pans, specimen holder; Indium & Tin for calibration"),
      S("Cooling", "Barrel cooling via circulated water"),
      S("Power Supply", "230 V AC, single phase, 50 Hz"),
    ],
  },
  "tensile-testing-machine": {
    model: "VE-UTM-01xi",
    specs: [
      S("Model No.", "VE-UTM-01xi"),
      S("Test Capacity", "2000 kgf / 20 kN"),
      S("System", "Digital with computer interface; 4-line LCD (load, extension, speed, test type)"),
      S("Drive", "Double ball-screw & nut assembly, reputed-make gear motor"),
      S("Test Jaws", "Vice-type tensile jaws"),
      S("Load Cell", "'S-type', reputed make — kg / N / MPa"),
      S("Cross-head Travel", "800 mm"),
      S("Displacement Accuracy", "0.1 mm"),
      S("Speed", "Variable via frequency-controlled AC drive"),
      S("Software / Connectivity", "Windows-based software; RS-232; graphical printouts"),
      S("Safety", "Limit-switch & software load/extension limits, emergency stop, auto-reverse"),
      S("Power Supply", "440 V AC, three phase, 50 Hz"),
    ],
  },
  "sheet-moulding-press": {
    model: "VE-SMP-01",
    specs: [
      S("Model No.", "VE-SMP-01"),
      S("Application", "Density-test specimen preparation"),
      S("Model", "Rigid floor-standing"),
      S("Sample Mould", "Rectangular spacer-frame; 100 × 120 × 4 mm PE sheet (other sizes optional)"),
      S("Platen Type", "Twin-plate with heating & cooling"),
      S("Heating", "Industrial flat heaters in both plates"),
      S("Temperature Controller", "Microprocessor-based double-display digital PID controller"),
      S("Temperature Range", "Ambient to 200 °C"),
      S("Working Pressure", "Up to 150 kg/cm² via 16-ton hydraulic jack"),
      S("Finish", "Powder coated"),
      S("Power Supply", "230 V AC, single phase, 50 Hz"),
    ],
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
  const detail = SPECS[slug];
  products.push({
    name: meta.name,
    slug,
    category: meta.category,
    categoryName: cat.name,
    image: `/products/${imageFile}`,
    summary: meta.summary,
    model: detail?.model || "",
    description:
      `${meta.summary} Manufactured by Vihana Engineering, the ${meta.name} is built for ` +
      `laboratories, QC departments and R&D centres that demand accurate, repeatable results. ` +
      `Robust construction, digital control and compliance with recognised test standards make it ` +
      `a dependable choice for polymer, pipe, film and geosynthetic testing.`,
    // Prefer the catalogue's specific reference standards when available.
    standards: detail?.standards || cat.standards,
    specifications: detail?.specs || [],
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
