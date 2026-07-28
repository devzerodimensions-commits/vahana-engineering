import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { site } from "../data/site.js";

const NAVY = [22, 37, 107];
const RED = [225, 31, 39];
const DARK = [30, 41, 59];
const GRAY = [100, 116, 139];

// Load an image URL into a JPEG dataURL (+ natural size) via canvas.
function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0);
        resolve({ dataUrl: c.toDataURL("image/jpeg", 0.92), w: img.naturalWidth, h: img.naturalHeight });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// Generates and downloads a branded PDF datasheet for a product.
export async function downloadProductPdf(product) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 40;

  // ---- Header ----
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 96, "F");
  doc.setFillColor(...RED);
  doc.rect(0, 96, W, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("VIHANA ENGINEERING", M, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...RED);
  doc.text("Your Testing Partner", M, 58);
  doc.setTextColor(205, 214, 240);
  doc.setFontSize(8);
  doc.text("Manufacturer & Exporter of Plastic Testing Machinery", M, 72);

  doc.setFontSize(8.5);
  doc.setTextColor(232, 236, 250);
  const rx = W - M;
  doc.text(site.phone, rx, 38, { align: "right" });
  doc.text(site.email, rx, 52, { align: "right" });
  doc.text(site.website, rx, 66, { align: "right" });

  let y = 128;

  // ---- Product image ----
  const imgBoxW = 200, imgBoxH = 155;
  const imgData = await loadImage(product.image);
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(M, y, imgBoxW, imgBoxH, 6, 6, "FD");
  if (imgData) {
    const r = Math.min((imgBoxW - 16) / imgData.w, (imgBoxH - 16) / imgData.h);
    const iw = imgData.w * r, ih = imgData.h * r;
    doc.addImage(imgData.dataUrl, "JPEG", M + (imgBoxW - iw) / 2, y + (imgBoxH - ih) / 2, iw, ih);
  }

  // ---- Title block ----
  const tx = M + imgBoxW + 22;
  const tw = W - tx - M;
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  const nameLines = doc.splitTextToSize(product.name, tw);
  doc.text(nameLines, tx, y + 20);
  let ty = y + 20 + nameLines.length * 20 + 4;
  if (product.model) {
    doc.setFontSize(10.5);
    doc.setTextColor(...RED);
    doc.setFont("helvetica", "bold");
    doc.text(`Model: ${product.model}`, tx, ty);
    ty += 17;
  }
  if (product.categoryName) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...GRAY);
    doc.text(product.categoryName, tx, ty);
    ty += 16;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...DARK);
  doc.text(`Price: ${product.price || "On Request"}`, tx, ty);

  y = Math.max(y + imgBoxH, ty) + 26;

  // ---- Description ----
  const desc = product.description || product.summary || "";
  if (desc) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const dl = doc.splitTextToSize(desc, W - 2 * M);
    doc.text(dl, M, y);
    y += dl.length * 13.5 + 12;
  }

  // ---- Standards ----
  if (product.standards?.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text("Applicable Standards", M, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(product.standards.join("    |    "), M, y);
    y += 18;
  }

  // ---- Specifications table ----
  if (product.specifications?.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text("Technical Specifications", M, y);
    autoTable(doc, {
      startY: y + 8,
      head: [["Specification", "Details"]],
      body: product.specifications.map((s) => [s.label, s.value]),
      styles: { fontSize: 9, cellPadding: 5, textColor: DARK, lineColor: [226, 232, 240], lineWidth: 0.5 },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 251] },
      columnStyles: { 0: { cellWidth: 175, fontStyle: "bold", textColor: NAVY }, 1: { cellWidth: W - 2 * M - 175 } },
      margin: { left: M, right: M, bottom: 80 },
    });
  }

  // ---- Footer ----
  const fy = H - 62;
  doc.setFillColor(...NAVY);
  doc.rect(0, fy, W, 62, "F");
  doc.setFillColor(...RED);
  doc.rect(0, fy, W, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(`${site.contactPerson} (${site.contactPersonRole})`, M, fy + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(214, 221, 245);
  doc.text(site.addressLong, M, fy + 36, { maxWidth: W - 2 * M });
  doc.setFontSize(8.5);
  doc.text(`${site.phone}   |   ${site.email}   |   ${site.website}`, M, fy + 51);

  doc.save(`${product.slug || "product"}-vihana-engineering.pdf`);
}

export default downloadProductPdf;
