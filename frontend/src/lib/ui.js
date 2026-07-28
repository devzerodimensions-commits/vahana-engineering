// Maps category/service slugs to icon names from the Icon component.
export const categoryIcon = (slug) =>
  ({
    "universal-tensile": "gauge",
    impact: "shield",
    "melt-flow": "flask",
    "thermal-ageing": "test",
    "composition-optical": "layers",
    "pressure-pipe": "target",
    "specimen-prep": "wrench",
    "moulding-processing": "building",
  }[slug] || "test");

export const serviceIcon = (icon) =>
  ({
    flask: "flask",
    building: "building",
    wrench: "wrench",
    graduation: "graduation",
  }[icon] || "check");

// Icon for an "industry we serve" card, chosen from the client's industry/name.
export const industryIcon = (industry = "", name = "") => {
  const s = `${industry} ${name}`.toLowerCase();
  if (/pip|hdpe|pressure/.test(s)) return "gauge";
  if (/geo|membrane|synthetic/.test(s)) return "layers";
  if (/polymer|plastic|compound|resin/.test(s)) return "flask";
  if (/govern|public|lab/.test(s)) return "building";
  if (/academ|research|r&d|institute|univ/.test(s)) return "graduation";
  if (/film|packag/.test(s)) return "briefcase";
  return "target";
};
