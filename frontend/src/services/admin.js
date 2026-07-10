import api from "./api.js";

// ---- Auth -------------------------------------------------------------------
export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("ve_token", data.token);
  localStorage.setItem("ve_user", JSON.stringify(data.user));
  return data.user;
};

export const logout = () => {
  localStorage.removeItem("ve_token");
  localStorage.removeItem("ve_user");
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("ve_user"));
  } catch {
    return null;
  }
};

export const fetchMe = () => api.get("/auth/me").then((r) => r.data.user);
export const getStats = () => api.get("/stats").then((r) => r.data.data);

// ---- Generic resource CRUD (admin) -----------------------------------------
// Reads pass ?published= so admins see drafts too.
export const resource = (name) => ({
  list: (params = {}) =>
    api.get(`/${name}`, { params: { published: "", limit: 200, ...params } }).then((r) => r.data.data),
  get: (idOrSlug) => api.get(`/${name}/${idOrSlug}`).then((r) => r.data.data),
  create: (body) => api.post(`/${name}`, body).then((r) => r.data.data),
  update: (id, body) => api.put(`/${name}/${id}`, body).then((r) => r.data.data),
  remove: (id) => api.delete(`/${name}/${id}`).then((r) => r.data),
});
