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

