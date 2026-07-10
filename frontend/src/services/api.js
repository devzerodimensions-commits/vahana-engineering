import axios from "axios";
import manifest from "../data/products.json";
import * as fb from "../data/fallback.js";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({ baseURL, timeout: 8000 });

// Attach JWT (set by the admin login) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ve_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- Fallback datasets (used when the API is unreachable) -------------------
const localProducts = manifest.products.map((p) => ({ _id: p.slug, ...p }));
const localCategories = manifest.categories.map((c) => ({ _id: c.slug, ...c }));
const localGallery = manifest.products.slice(0, 18).map((p, i) => ({
  _id: `g${i}`,
  title: p.name,
  image: p.image,
  category: p.categoryName,
}));

// Try the API; on any network/DB failure — or a response that doesn't match
// this API's contract ({ success, data }) — resolve with local data instead.
// The contract check also guards against an unrelated server answering on the
// same host/port during development.
const withFallback = async (request, fallbackValue) => {
  try {
    const res = await request();
    const payload = res?.data?.data;
    if (payload === undefined) throw new Error("Unexpected API response shape");
    return payload;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[api] falling back to local data:", err?.message || err);
    }
    return fallbackValue;
  }
};

// ---- Public content ---------------------------------------------------------
export const getProducts = (params = {}) =>
  withFallback(() => api.get("/products", { params }), filterLocalProducts(params));

export const getProduct = (slug) =>
  withFallback(
    () => api.get(`/products/${slug}`),
    localProducts.find((p) => p.slug === slug) || null
  );

export const getCategories = () =>
  withFallback(() => api.get("/testing-categories"), localCategories);

export const getServices = () => withFallback(() => api.get("/services"), fb.services);
export const getBlogs = () => withFallback(() => api.get("/blogs"), fb.blogs);
export const getBlog = (slug) =>
  withFallback(() => api.get(`/blogs/${slug}`), fb.blogs.find((b) => b.slug === slug) || null);
export const getTestimonials = () => withFallback(() => api.get("/testimonials"), fb.testimonials);
export const getClients = () => withFallback(() => api.get("/clients"), fb.clients);
export const getGallery = () => withFallback(() => api.get("/gallery"), localGallery);
export const getCertifications = () =>
  withFallback(() => api.get("/certifications"), fb.certifications);

// ---- Form submissions -------------------------------------------------------
export const submitContact = (payload) =>
  api.post("/contacts", payload).then((r) => r.data);
export const submitInquiry = (payload) =>
  api.post("/inquiries", payload).then((r) => r.data);

// ---- Local helpers ----------------------------------------------------------
function filterLocalProducts(params) {
  let list = [...localProducts];
  if (params.category) list = list.filter((p) => p.category === params.category);
  if (params.featured) list = list.filter((p) => p.featured);
  if (params.q) {
    const q = params.q.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
    );
  }
  return list;
}

export default api;
