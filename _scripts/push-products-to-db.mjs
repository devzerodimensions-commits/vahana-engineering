// Pushes any product present in products.json but missing from the live
// database, via the REST API.
//
// products.json is the build-time fallback the site ships with; the live site
// reads from Postgres. Adding a product to the file alone leaves it invisible in
// production — the API returned 27 while the file held 29.
//
// Surgical on purpose: `npm run seed` would wipe and reload every table, which is
// fine today but would destroy the client's own edits later.
//
// Usage: node push-products-to-db.mjs <admin-password>
const API = process.env.VE_API || "https://vihaana-engineering-api.onrender.com/api";
const EMAIL = process.env.VE_ADMIN || "admin@vihaanaengineering.com";
const PASSWORD = process.argv[2];

if (!PASSWORD) {
  console.error("Usage: node push-products-to-db.mjs <admin-password>");
  process.exit(1);
}

const { readFileSync } = await import("node:fs");
const local = JSON.parse(readFileSync(new URL("../frontend/src/data/products.json", import.meta.url))).products;

const login = await fetch(`${API}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
}).then((r) => r.json());

if (!login.token) {
  console.error("Login failed:", login.message || login);
  process.exit(1);
}
const auth = { Authorization: `Bearer ${login.token}`, "Content-Type": "application/json" };

// published= so drafts count too; without it a draft would look absent and be
// created a second time.
const remote = await fetch(`${API}/products?published=&limit=200`, { headers: auth }).then((r) => r.json());
const have = new Set((remote.data || []).map((p) => p.slug));
console.log(`database has ${remote.total} products, local file has ${local.length}`);

const byslug = new Map((remote.data || []).map((p) => [p.slug, p]));

// Update existing rows whose specifications drifted from the file. Needed after
// a fix to the extractor: the database already held values with Word picture
// field codes ("… 50 Hz INCLUDEPICTURE \"D:\\Vihaana Photo\\…\"") appended, and
// creating-only would have left those live for ever.
let updated = 0;
for (const p of local) {
  const remoteP = byslug.get(p.slug);
  if (!remoteP) continue;
  const a = JSON.stringify(p.specifications || []);
  const b = JSON.stringify(remoteP.specifications || []);
  if (a === b) continue;
  const res = await fetch(`${API}/products/${remoteP._id}`, {
    method: "PUT",
    headers: auth,
    body: JSON.stringify({ specifications: p.specifications || [], model: p.model || "" }),
  });
  if (res.ok) {
    console.log(`  updated ${p.slug.padEnd(34)} ${(p.specifications || []).length} spec rows`);
    updated++;
  } else {
    console.log(`  FAILED update ${p.slug}: ${res.status}`);
  }
}

let added = 0;
for (const p of local) {
  if (have.has(p.slug)) continue;
  const body = {
    name: p.name,
    category: p.category,
    categoryName: p.categoryName || "",
    image: p.image || "",
    summary: p.summary || "",
    description: p.description || "",
    model: p.model || "",
    standards: p.standards || [],
    specifications: p.specifications || [],
    price: p.price || "On Request",
    featured: Boolean(p.featured),
    published: true,
  };
  const res = await fetch(`${API}/products`, { method: "POST", headers: auth, body: JSON.stringify(body) });
  const out = await res.json();
  if (res.status === 201) {
    console.log(`  created ${p.slug.padEnd(32)} ${(p.specifications || []).length} spec rows`);
    added++;
  } else {
    console.log(`  FAILED  ${p.slug}: ${out.message || res.status}`);
  }
}

const after = await fetch(`${API}/products?limit=200`).then((r) => r.json());
console.log(`\n${added} created. Database now serves ${after.total} products.`);
