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
