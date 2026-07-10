// Local fallback content so the public site renders fully even when the
// backend/database is not running. Mirrors the backend seed data.
export const services = [
  {
    _id: "s1",
    title: "Material Testing Solutions",
    slug: "material-testing-solutions",
    icon: "flask",
    summary:
      "Complete instruments for tensile, impact, thermal and composition testing of plastics and polymers.",
    features: ["Tensile & UTM systems", "Impact & flexural rigs", "Melt-flow & rheology"],
  },
  {
    _id: "s2",
    title: "Turnkey Laboratory Setup",
    slug: "turnkey-laboratory-setup",
    icon: "building",
    summary:
      "End-to-end design and supply of polymer, pipe and geosynthetic testing laboratories.",
    features: ["Lab layout & consulting", "Equipment supply & install", "Standards compliance"],
  },
  {
    _id: "s3",
    title: "Calibration & Servicing",
    slug: "calibration-servicing",
    icon: "wrench",
    summary:
      "On-site calibration, preventive maintenance and spares to keep your instruments accurate.",
    features: ["Traceable calibration", "AMC & preventive service", "Genuine spares"],
  },
  {
    _id: "s4",
    title: "Training & Technical Support",
    slug: "training-technical-support",
    icon: "graduation",
    summary:
      "Operator training and application support so your team gets reliable, repeatable results.",
    features: ["Operator training", "Method development", "Remote & on-site support"],
  },
];

export const certifications = [
  { _id: "c1", title: "ISO 9001:2015 Certified", issuer: "Quality Management System", year: "2015", description: "Quality-assured design and manufacturing processes." },
  { _id: "c2", title: "NABL-Ready Instruments", issuer: "Laboratory Accreditation", year: "", description: "Instruments built to support NABL-accredited laboratories." },
  { _id: "c3", title: "CE Marked", issuer: "European Conformity", year: "", description: "Compliant with applicable safety and EMC directives." },
  { _id: "c4", title: "MSME Registered", issuer: "Government of India", year: "", description: "Registered micro, small & medium enterprise." },
];

export const clients = [
  { _id: "cl1", name: "HDPE Pipe Manufacturers", industry: "Piping" },
  { _id: "cl2", name: "Geomembrane Producers", industry: "Geosynthetics" },
  { _id: "cl3", name: "Polymer Compounders", industry: "Plastics" },
  { _id: "cl4", name: "Government Testing Labs", industry: "Public Sector" },
  { _id: "cl5", name: "Academic & R&D Institutes", industry: "Research" },
  { _id: "cl6", name: "Film & Packaging Units", industry: "Packaging" },
];

export const testimonials = [
  { _id: "t1", name: "R. Sharma", role: "QA Manager", company: "Pipe Manufacturing Co.", rating: 5, message: "The UTM and hydrostatic rigs from Vihana have been rock-solid. Accurate results and dependable after-sales support." },
  { _id: "t2", name: "A. Verma", role: "Lab Head", company: "Geosynthetics Ltd.", rating: 5, message: "Their geomembrane tensile system made our NABL audit smooth. Great build quality and calibration support." },
  { _id: "t3", name: "S. Nair", role: "R&D Engineer", company: "Polymer Research Institute", rating: 5, message: "Melt flow index and OIT apparatus perform exactly to standard. Vihana truly is our testing partner." },
];

export const blogs = [
  {
    _id: "b1",
    title: "Understanding Melt Flow Index (MFI) in Quality Control",
    slug: "understanding-melt-flow-index-mfi-in-quality-control",
    author: "Vihana Engineering",
    excerpt: "Why MFI is the fastest indicator of thermoplastic consistency and how to test it right.",
    content:
      "Melt Flow Index (MFI), measured per ASTM D1238 / ISO 1133, indicates the flow of a molten polymer and is one of the quickest ways to verify batch-to-batch consistency of resins. This article covers test setup, load selection, and common pitfalls.",
    tags: ["MFI", "Quality Control", "ASTM D1238"],
    publishedAt: "2025-03-10",
  },
  {
    _id: "b2",
    title: "Hydrostatic Pressure Testing of HDPE Pipes Explained",
    slug: "hydrostatic-pressure-testing-of-hdpe-pipes-explained",
    author: "Vihana Engineering",
    excerpt: "A practical guide to long-term strength testing of plastic pipes to ISO 1167.",
    content:
      "Hydrostatic pressure testing evaluates the long-term strength of plastic pipes under sustained internal pressure. Following ISO 1167 / ASTM D1598, multi-station rigs allow several specimens to be tested simultaneously at controlled temperature.",
    tags: ["HDPE", "Pipes", "ISO 1167"],
    publishedAt: "2025-02-02",
  },
  {
    _id: "b3",
    title: "Choosing the Right Universal Testing Machine",
    slug: "choosing-the-right-universal-testing-machine",
    author: "Vihana Engineering",
    excerpt: "Capacity, grips, and software — how to match a UTM to your application.",
    content:
      "Selecting a UTM means matching load capacity, crosshead speed, grip type and extensometry to the materials you test. Whether tensile, compression or flexural, the right configuration ensures compliance with ASTM D638 / ISO 527.",
    tags: ["UTM", "Tensile", "Buying Guide"],
    publishedAt: "2025-01-15",
  },
];
