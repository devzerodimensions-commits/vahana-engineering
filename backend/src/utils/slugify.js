// Converts a string into a URL-friendly slug.
export const slugify = (str = "") =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"()]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default slugify;
