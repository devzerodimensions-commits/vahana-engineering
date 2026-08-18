// SPA deep-link fallback for Render static hosting.
//
// This is a single-page app: the server only really has index.html, and React
// Router draws /contact, /products/... on the client. Render, though, looks for
// a matching FILE on disk, so opening https://…/contact directly (or refreshing
// on it, or following a shared link) returned "Not Found" for every route
// except "/".
//
// Render serves 404.html for unmatched paths, so shipping a copy of index.html
// under that name boots the app and the router then renders the right page.
//
// NOTE: this is the fallback, not the ideal fix. It still responds with HTTP
// 404, which is invisible to visitors but tells crawlers the page is missing —
// bad for SEO. The proper fix is a rewrite rule in the Render dashboard
// (Redirects/Rewrites → Source /*  Destination /index.html  Action Rewrite),
// which serves the same content with a 200. render.yaml already declares that
// rule, but it only applies to Blueprint-managed services and this one was
// created manually. Keep this file until that rule is in place.
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve(process.cwd(), "dist");
const index = resolve(dist, "index.html");
const notFound = resolve(dist, "404.html");

if (!existsSync(index)) {
  console.error("copy-404: dist/index.html not found — did vite build run?");
  process.exit(1);
}

copyFileSync(index, notFound);
console.log("copy-404: wrote dist/404.html (SPA deep-link fallback)");
