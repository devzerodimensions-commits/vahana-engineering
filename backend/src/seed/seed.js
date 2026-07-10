import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

import User from "../models/User.js";
import Product from "../models/Product.js";
import TestingCategory from "../models/TestingCategory.js";
import Service from "../models/Service.js";
import Blog from "../models/Blog.js";
import Client from "../models/Client.js";
import Testimonial from "../models/Testimonial.js";
import Gallery from "../models/Gallery.js";
import Certification from "../models/Certification.js";
import Job from "../models/Job.js";
import slugify from "../utils/slugify.js";

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
  { name: "R. Sharma", role: "QA Manager", company: "Pipe Manufacturing Co.", rating: 5, message: "The UTM and hydrostatic rigs from Vihana have been rock-solid. Accurate results and dependable after-sales support." },
  { name: "A. Verma", role: "Lab Head", company: "Geosynthetics Ltd.", rating: 5, message: "Their geomembrane tensile system made our NABL audit smooth. Great build quality and calibration support." },
  { name: "S. Nair", role: "R&D Engineer", company: "Polymer Research Institute", rating: 5, message: "Melt flow index and OIT apparatus perform exactly to standard. Vihana truly is our testing partner." },
];

const BLOGS = [
  {
    title: "Understanding Melt Flow Index (MFI) in Quality Control",
    excerpt: "Why MFI is the fastest indicator of thermoplastic consistency and how to test it right.",
    content: "Melt Flow Index (MFI), measured per ASTM D1238 / ISO 1133, indicates the flow of a molten polymer and is one of the quickest ways to verify batch-to-batch consistency of resins. This article covers test setup, load selection, and common pitfalls.",
    tags: ["MFI", "Quality Control", "ASTM D1238"],
  },
  {
    title: "Hydrostatic Pressure Testing of HDPE Pipes Explained",
    excerpt: "A practical guide to long-term strength testing of plastic pipes to ISO 1167.",
    content: "Hydrostatic pressure testing evaluates the long-term strength of plastic pipes under sustained internal pressure. Following ISO 1167 / ASTM D1598, multi-station rigs allow several specimens to be tested simultaneously at controlled temperature.",
    tags: ["HDPE", "Pipes", "ISO 1167"],
  },
  {
    title: "Choosing the Right Universal Testing Machine",
    excerpt: "Capacity, grips, and software — how to match a UTM to your application.",
    content: "Selecting a UTM means matching load capacity, crosshead speed, grip type and extensometry to the materials you test. Whether tensile, compression or flexural, the right configuration ensures compliance with ASTM D638 / ISO 527.",
    tags: ["UTM", "Tensile", "Buying Guide"],
  },
];

const JOBS = [
  {
    title: "Service & Calibration Engineer",
    department: "Service",
    location: "Ahmedabad, Gujarat",
    type: "Full-time",
    experience: "2-4 years",
    description: "Install, calibrate and service testing instruments at customer sites across India.",
    responsibilities: ["On-site installation & commissioning", "Preventive maintenance & calibration", "Customer training"],
    requirements: ["Diploma/BE in Mechanical or Instrumentation", "Willingness to travel", "Good communication"],
  },
  {
    title: "Sales Engineer - Testing Instruments",
    department: "Sales",
    location: "Remote / India",
    type: "Full-time",
    experience: "1-3 years",
    description: "Drive sales of material testing equipment to labs and manufacturers.",
    responsibilities: ["Lead generation & demos", "Preparing quotations", "Relationship management"],
    requirements: ["Engineering background preferred", "B2B sales experience", "Self-motivated"],
  },
  {
    title: "Design Engineer (R&D)",
    department: "Engineering",
    location: "Ahmedabad, Gujarat",
    type: "Full-time",
    experience: "3-5 years",
    description: "Design and improve mechanical testing instruments using CAD and standards knowledge.",
    responsibilities: ["Mechanical design in CAD", "Prototyping & validation", "Standards compliance"],
    requirements: ["BE/ME Mechanical", "SolidWorks/AutoCAD", "Knowledge of ASTM/ISO test methods"],
  },
];

const importData = async () => {
  console.log("Clearing existing collections…");
  await Promise.all([
    User.deleteMany(),
    Product.deleteMany(),
    TestingCategory.deleteMany(),
    Service.deleteMany(),
    Blog.deleteMany(),
    Client.deleteMany(),
    Testimonial.deleteMany(),
    Gallery.deleteMany(),
    Certification.deleteMany(),
    Job.deleteMany(),
  ]);

  // Admin user
  await User.create({
    name: process.env.ADMIN_NAME || "Administrator",
    email: process.env.ADMIN_EMAIL || "admin@vihaanaengineering.com",
    password: process.env.ADMIN_PASSWORD || "Admin@12345",
    role: "admin",
  });
  console.log("Admin user created.");

  // Testing categories
  await TestingCategory.insertMany(
    manifest.categories.map((c, i) => ({
      name: c.name,
      slug: c.slug,
      blurb: c.blurb,
      standards: c.standards,
      order: i,
    }))
  );

  // Products (use save() so slug hooks run) with order + featured
  for (let i = 0; i < manifest.products.length; i++) {
    const p = manifest.products[i];
    await Product.create({ ...p, order: i });
  }

  // Gallery from product images
  await Gallery.insertMany(
    manifest.products.slice(0, 18).map((p, i) => ({
      title: p.name,
      image: p.image,
      category: p.categoryName,
      order: i,
    }))
  );

  await Service.insertMany(SERVICES.map((s, i) => ({ ...s, slug: slugify(s.title), order: i })));
  await Certification.insertMany(CERTIFICATIONS.map((c, i) => ({ ...c, order: i })));
  await Client.insertMany(CLIENTS.map((c, i) => ({ ...c, order: i })));
  await Testimonial.insertMany(TESTIMONIALS.map((t, i) => ({ ...t, order: i })));
  await Blog.insertMany(BLOGS.map((b) => ({ ...b, slug: slugify(b.title) })));
  for (const j of JOBS) await Job.create(j);

  console.log(
    `Seeded: ${manifest.products.length} products, ${manifest.categories.length} categories, ` +
      `${SERVICES.length} services, ${BLOGS.length} blogs, ${TESTIMONIALS.length} testimonials, ` +
      `${CERTIFICATIONS.length} certifications, ${CLIENTS.length} clients, ${JOBS.length} jobs.`
  );
};

const destroyData = async () => {
  await Promise.all([
    User.deleteMany(),
    Product.deleteMany(),
    TestingCategory.deleteMany(),
    Service.deleteMany(),
    Blog.deleteMany(),
    Client.deleteMany(),
    Testimonial.deleteMany(),
    Gallery.deleteMany(),
    Certification.deleteMany(),
    Job.deleteMany(),
  ]);
  console.log("All data destroyed.");
};

const run = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vihana_engineering";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`Connected to ${uri}`);
    if (process.argv.includes("--destroy")) await destroyData();
    else await importData();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`Seed failed: ${err.message}`);
    console.error("Make sure MongoDB is running or MONGO_URI points to a reachable database.");
    process.exit(1);
  }
};

run();
