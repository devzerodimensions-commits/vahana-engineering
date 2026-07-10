// Declarative config for the admin CRUD screens.
// Each resource maps to a backend endpoint and a set of editable fields.
// field types: text | textarea | number | checkbox | select | tags | image

export const resources = {
  products: {
    label: "Products",
    api: "products",
    icon: "layers",
    columns: ["name", "categoryName", "featured", "published"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "category", label: "Category Slug", type: "text", help: "e.g. universal-tensile" },
      { key: "categoryName", label: "Category Name", type: "text" },
      { key: "image", label: "Image URL", type: "image" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "standards", label: "Standards", type: "tags" },
      { key: "price", label: "Price", type: "text" },
      { key: "order", label: "Order", type: "number" },
      { key: "featured", label: "Featured", type: "checkbox" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
  "testing-categories": {
    label: "Testing Categories",
    api: "testing-categories",
    icon: "test",
    columns: ["name", "count", "order"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "blurb", label: "Blurb", type: "textarea" },
      { key: "standards", label: "Standards", type: "tags" },
      { key: "order", label: "Order", type: "number" },
    ],
  },
  services: {
    label: "Services",
    api: "services",
    icon: "wrench",
    columns: ["title", "order", "published"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "icon", label: "Icon", type: "select", options: ["flask", "building", "wrench", "graduation"] },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "features", label: "Features", type: "tags" },
      { key: "order", label: "Order", type: "number" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
  blogs: {
    label: "Blog Posts",
    api: "blogs",
    icon: "quote",
    columns: ["title", "author", "published"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "author", label: "Author", type: "text" },
      { key: "image", label: "Image URL", type: "image" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "content", label: "Content", type: "textarea", rows: 8 },
      { key: "tags", label: "Tags", type: "tags" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
  clients: {
    label: "Clients",
    api: "clients",
    icon: "building",
    columns: ["name", "industry"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "industry", label: "Industry", type: "text" },
      { key: "website", label: "Website", type: "text" },
      { key: "logo", label: "Logo URL", type: "image" },
      { key: "order", label: "Order", type: "number" },
    ],
  },
  testimonials: {
    label: "Testimonials",
    api: "testimonials",
    icon: "star",
    columns: ["name", "company", "rating"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "message", label: "Message", type: "textarea", required: true },
      { key: "rating", label: "Rating (1-5)", type: "number" },
      { key: "order", label: "Order", type: "number" },
    ],
  },
  gallery: {
    label: "Gallery",
    api: "gallery",
    icon: "layers",
    columns: ["title", "category"],
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "image", label: "Image URL", type: "image", required: true },
      { key: "category", label: "Category", type: "text" },
      { key: "order", label: "Order", type: "number" },
    ],
  },
  certifications: {
    label: "Certifications",
    api: "certifications",
    icon: "shield",
    columns: ["title", "issuer", "year"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "file", label: "File / Certificate URL", type: "text" },
    ],
  },
};

// Navigation groups for the admin sidebar.
export const contentNav = [
  "products",
  "testing-categories",
  "services",
  "blogs",
  "gallery",
  "certifications",
  "clients",
  "testimonials",
];

export default resources;
