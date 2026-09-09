import fs from "node:fs";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
} from "docx";

const NAVY = "16256B", RED = "E11F27", GRAY = "64748B";

const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 260, after: 140 }, children: [new TextRun({ text: t, bold: true, color: NAVY, font: "Arial", size: 30 })] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 }, children: [new TextRun({ text: t, bold: true, color: RED, font: "Arial", size: 24 })] });
const P = (t, opts = {}) => new Paragraph({ spacing: { after: 90 }, children: [new TextRun({ text: t, font: "Arial", size: 21, ...opts })] });
const Bullet = (t) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [new TextRun({ text: t, font: "Arial", size: 21 })] });

const border = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" };
const borders = { top: border, bottom: border, left: border, right: border };
const cell = (text, { header = false, w = 4680 } = {}) =>
  new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 110, right: 110 },
    shading: header ? { fill: NAVY, type: ShadingType.CLEAR, color: "auto" } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 20, bold: header, color: header ? "FFFFFF" : "1E293B" })] })],
  });
const twoColTable = (rows, widths = [3200, 6160]) =>
  new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((r, i) =>
      new TableRow({ children: [cell(r[0], { header: i === 0, w: widths[0] }), cell(r[1], { header: i === 0, w: widths[1] })] })),
  });

const changes = [
  ["1. Initial build", "Full MERN website generated from the AI website prompt (.docx): React + Vite + Tailwind frontend, Node + Express + Mongoose backend, JWT admin panel, REST API, 27 real product photos wired in across 8 testing categories."],
  ["2. Real contact details", "Added from the business card: Mr. Chirag Pawar (Business Head), +91 70960 11126, info@vihaanaengineering.com, www.vihaanaengineering.com, Vatva-Ahmedabad address; 'Manufacturer & Exporter of Plastic Testing Machinery'."],
  ["3. Logo", "Removed duplicate text beside logo; fixed size/clarity; enlarged; finally used the full logo including the 'Your Testing Partner' tagline line."],
  ["4. Technical specifications", "Added full spec tables + model numbers to 9 machines from the IS 4984 Product Catalogue (MFI, Carbon Black, Hot Air Oven, Hydrostatic 3-Station, Hot Water Bath, Cooling Chamber, OIT, Tensile, Sheet Moulding Press)."],
  ["5. Indian Standards", "Changed all test standards from American/International (ASTM / ISO) to Indian Standards (IS / BIS) across every product, category and page (ISO 9001 quality certification kept as-is)."],
  ["6. Pages removed", "Removed Careers, Testing (standalone), Gallery and Blog pages — from nav, routes, admin and data."],
  ["7. Hero section", "Many design iterations; finalised as a 4-per-view machine carousel: transparent machine cutouts (AI background removal + alpha cleanup for proper transparency), uniform sizing (no crop), scroll one-by-one, light-gray background, no text, no shadow, arrows."],
  ["8. Page title banners", "Replaced the solid blue page-title background with the supplied industrial banner image."],
  ["9. Product images fix", "Fixed cropping (object-contain, uniform aligned boxes on grid + detail page) and optimised images from ~106 MB to ~1.1 MB — fixing garbled rendering and slow loading."],
  ["10. Download Catalogue", "Added a 'Download Catalogue' button on every product page that generates a branded PDF datasheet (image, model, specs, standards, contact) fully client-side."],
  ["11. Animated stats", "Stats numbers (25+, 15+, 500+, 8) now count up from 0 when scrolled into view."],
  ["12. Industries We Serve", "Redesigned from plain pills to clean icon cards with hover effects."],
  ["13. Navbar polish", "Larger logo, taller header, and bigger menu link text."],
  ["14. Select Language", "Added a native Google Translate 'Select Language' dropdown (full 249-language list) in the header + mobile menu, styled clean."],
];

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 21 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "VIHAANA ENGINEERING", bold: true, color: NAVY, font: "Arial", size: 48 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "Your Testing Partner", italics: true, color: RED, font: "Arial", size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 260 }, children: [new TextRun({ text: "Website Development Log & Summary", bold: true, color: "334155", font: "Arial", size: 28 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RED, space: 6 } }, children: [new TextRun({ text: "Manufacturer & Exporter of Plastic Testing Machinery", color: GRAY, font: "Arial", size: 20 })] }),

      H1("1. Project Overview"),
      P("A professional, fully responsive corporate website for Vihaana Engineering — a manufacturer and exporter of plastic / polymer material-testing machinery. The site showcases 27 testing instruments across 8 testing domains, with a dynamic admin panel, product catalogue, inquiry forms, and multi-language support."),

      H1("2. Technology Stack"),
      twoColTable([
        ["Layer", "Technology"],
        ["Frontend", "React 18, Vite, Tailwind CSS, React Router, Axios"],
        ["Backend", "Node.js, Express, MongoDB, Mongoose"],
        ["Auth", "JWT + bcrypt, role-based admin access"],
        ["PDF / Extras", "jsPDF (product catalogue PDF), Google Translate (languages)"],
        ["Hosting", "GitHub + Render (frontend static site)"],
      ]),

      H1("3. Website Structure"),
      P("Public pages:", { bold: true }),
      Bullet("Home — hero machine slider, testing domains, featured products, why-us, services, testimonials, industries served, animated stats, CTA"),
      Bullet("About, Products (+ product detail with specs & Download Catalogue), Services, Certifications, Contact"),
      P("Admin panel (/admin):", { bold: true }),
      Bullet("Secure login, dashboard analytics, CRUD for products, categories, services, certifications, clients, testimonials"),
      Bullet("Inbox for product inquiries and contact messages"),

      H1("4. Development / Change Log"),
      P("The following changes were carried out during development (in order):"),
      twoColTable([["Change", "Details"], ...changes], [2600, 6760]),

      H1("5. Deployment"),
      twoColTable([
        ["Item", "Value"],
        ["GitHub repo", "github.com/devzerodimensions-commits/vahana-engineering"],
        ["Live site", "https://vahana-engineering.onrender.com"],
        ["Deploy method", "Push to GitHub 'main' -> Render -> Manual Deploy -> Deploy latest commit"],
        ["Admin login", "admin@vihaanaengineering.com / Admin@12345 (needs backend + MongoDB seeded)"],
      ]),

      H1("6. Important Notes"),
      Bullet("9 of the 27 products have full technical spec tables (taken from the IS 4984 Product Catalogue). The other 18 have descriptions + standards; their specs were not in the supplied document."),
      Bullet("Brand colours: Navy #16256B, Red #E11F27. Tagline: 'Your Testing Partner'."),
      Bullet("Social media links in the footer/top bar are still placeholders — to be updated when available."),
      Bullet("The admin panel and contact/inquiry form saving require the backend + MongoDB (local or Atlas) running and seeded; the public site works standalone with bundled data."),

      new Paragraph({ spacing: { before: 320 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Vihaana Engineering  |  info@vihaanaengineering.com  |  +91 70960 11126  |  www.vihaanaengineering.com", color: GRAY, font: "Arial", size: 18 })] }),
    ],
  }],
});

const out = "C:/Users/Admin/Desktop/Vihaana-Engineering-Website-Development-Log.docx";
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log("Wrote:", out, (buf.length / 1024).toFixed(0) + "KB"); });
