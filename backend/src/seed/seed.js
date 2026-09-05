import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import prisma from "../config/db.js";
import { hashPassword } from "../controllers/authController.js";
import slugify from "../utils/slugify.js";

// The 27 products and 8 categories are read from the same file the public site
// bundles, so the database starts as an exact copy of what is already live.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(__dirname, "../../../frontend/src/data/products.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

const SERVICES = [
  {
    title: "Material Testing Solutions",
    icon: "flask",
    summary: "Complete instruments for tensile, impact, thermal and composition testing of plastics and polymers.",
    features: ["Tensile & UTM systems", "Impact & flexural rigs", "Melt-flow & rheology"],
  },
  {
    title: "Turnkey Laboratory Setup",
    icon: "building",
    summary: "End-to-end design and supply of polymer, pipe and geosynthetic testing laboratories.",
    features: ["Lab layout & consulting", "Equipment supply & install", "Standards compliance"],
  },
  {
    title: "Calibration & Servicing",
    icon: "wrench",
    summary: "On-site calibration, preventive maintenance and spares to keep your instruments accurate.",
    features: ["Traceable calibration", "AMC & preventive service", "Genuine spares"],
  },
  {
    title: "Training & Technical Support",
    icon: "graduation",
    summary: "Operator training and application support so your team gets reliable, repeatable results.",
    features: ["Operator training", "Method development", "Remote & on-site support"],
  },
];

const CERTIFICATIONS = [
  { title: "ISO 9001:2015 Certified", issuer: "Quality Management System", year: "2015", description: "Quality-assured design and manufacturing processes." },
  { title: "NABL-Ready Instruments", issuer: "Laboratory Accreditation", year: "", description: "Instruments built to support NABL-accredited laboratories." },
  { title: "CE Marked", issuer: "European Conformity", year: "", description: "Compliant with applicable safety and EMC directives." },
  { title: "MSME Registered", issuer: "Government of India", year: "", description: "Registered micro, small & medium enterprise." },
];

const CLIENTS = [
  { name: "HDPE Pipe Manufacturers", industry: "Piping" },
  { name: "Geomembrane Producers", industry: "Geosynthetics" },
  { name: "Polymer Compounders", industry: "Plastics" },
  { name: "Government Testing Labs", industry: "Public Sector" },
  { name: "Academic & R&D Institutes", industry: "Research" },
  { name: "Film & Packaging Units", industry: "Packaging" },
];

const TESTIMONIALS = [
  { name: "R. Sharma", role: "QA Manager", company: "Pipe Manufacturing Co.", rating: 5, message: "The UTM and hydrostatic rigs from Vihaana have been rock-solid. Accurate results and dependable after-sales support." },
  { name: "A. Verma", role: "Lab Head", company: "Geosynthetics Ltd.", rating: 5, message: "Their geomembrane tensile system made our NABL audit smooth. Great build quality and calibration support." },
  { name: "S. Nair", role: "R&D Engineer", company: "Polymer Research Institute", rating: 5, message: "Melt flow index and OIT apparatus perform exactly to standard. Vihaana truly is our testing partner." },
];

const importData = async () => {
  console.log("Clearing existing tables…");
  // Order matters only if foreign keys are added later; sequential keeps it safe.
  await prisma.product.deleteMany();
  await prisma.testingCategory.deleteMany();
  await prisma.service.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.client.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.user.deleteMany();

  const email = (process.env.ADMIN_EMAIL || "admin@vihaanaengineering.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME || "Administrator",
      email,
      password: await hashPassword(password),
      role: "admin",
    },
  });
  console.log(`Admin user created: ${email}`);

  await prisma.testingCategory.createMany({
    data: manifest.categories.map((c, i) => ({
      name: c.name,
      slug: c.slug || slugify(c.name),
      blurb: c.blurb || "",
      standards: c.standards || [],
      order: i,
    })),
  });
  console.log(`Testing categories: ${manifest.categories.length}`);

  await prisma.product.createMany({
    data: manifest.products.map((p, i) => ({
      name: p.name,
      slug: p.slug || slugify(p.name),
      category: p.category,
      categoryName: p.categoryName || null,
      image: p.image || "",
      summary: p.summary || "",
      description: p.description || "",
      model: p.model || "",
      standards: p.standards || [],
      specifications: p.specifications || [],
      price: p.price || "On Request",
      featured: Boolean(p.featured),
      published: true,
      order: i,
    })),
  });
  console.log(`Products: ${manifest.products.length}`);

  await prisma.service.createMany({
    data: SERVICES.map((s, i) => ({ ...s, slug: slugify(s.title), order: i })),
  });
  await prisma.certification.createMany({
    data: CERTIFICATIONS.map((c, i) => ({ ...c, order: i })),
  });
  await prisma.client.createMany({ data: CLIENTS.map((c, i) => ({ ...c, order: i })) });
  await prisma.testimonial.createMany({
    data: TESTIMONIALS.map((t, i) => ({ ...t, order: i })),
  });
  console.log(
    `Services: ${SERVICES.length}  Certifications: ${CERTIFICATIONS.length}  Clients: ${CLIENTS.length}  Testimonials: ${TESTIMONIALS.length}`
  );

  // Sanity check: the model numbers the product pages and PDFs print. The old
  // Mongoose schema had no `model` field and would have dropped all of these.
  const withModel = await prisma.product.count({ where: { NOT: { model: "" } } });
  console.log(`Products carrying a model number: ${withModel}`);

  console.log("\nSeed complete.");
};

const destroyData = async () => {
  await prisma.product.deleteMany();
  await prisma.testingCategory.deleteMany();
  await prisma.service.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.client.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.user.deleteMany();
  console.log("All data destroyed.");
};

const run = async () => {
  try {
    if (process.argv.includes("--destroy")) await destroyData();
    else await importData();
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

run();
