# Vihaana Engineering Website — Handoff / Continuation Notes

> Read this first when continuing the project in a new session. It captures the full
> current state so work can resume without re-discovery.

## What this is
Corporate website for **Vihaana / Vihaana Engineering** — manufacturer & exporter of
**plastic / polymer material-testing machinery** (UTM, MFI, impact, hydrostatic, ovens,
Vicat, OIT, etc.). 27 products across 8 testing domains.

- **Folder:** `C:\Users\Admin\job station\`
- **Frontend:** `frontend/` — React 18 + Vite + Tailwind v3 + React Router + Axios
- **Backend:** `backend/` — Node + Express + MongoDB + Mongoose + JWT admin
- **Brand:** navy `#16256B`, red `#E11F27`, tagline **"Your Testing Partner"**

## Live deployment
- **GitHub:** https://github.com/devzerodimensions-commits/vahana-engineering
- **Live site (Render static site):** https://vahana-engineering.onrender.com
- **Deploy flow:** `git push origin main` → then in Render, open the **`vahana-engineering`**
  service → **Manual Deploy → Deploy latest commit**.
  ⚠️ Render **auto-deploy is OFF** (GitHub repo-access warning), so a manual deploy is needed
  every time. The user does this step.
- **Render build settings:** Root Directory `frontend`, Build `npm install && npm run build`,
  Publish `dist`, plus a Redirects/Rewrites rule `Source /*  →  Destination /index.html`
  (Rewrite) for SPA routing.

## Working commands (Windows / git-bash)
Always prepend Node to PATH: `export PATH="/c/Program Files/nodejs:$PATH"`.
```bash
cd "C:/Users/Admin/job station/frontend" && npm run build     # build
# commit + push (use this identity):
git -c user.email="akash@zerodimensions.in" -c user.name="Akash" commit -q -m "..."
git push origin main
```
Preview: `.claude/launch.json` config **`vihana-frontend`** (port 5173) via the preview tool.
**Preview is headless & throttled** — screenshots often time out, and timers /
requestAnimationFrame / IntersectionObserver don't fire. Verify via DOM `eval`; animations
(stats counter, Google Translate) only run in a real browser. To view live, open
`http://localhost:5173/` with `Start-Process`.

## Real contact details (from business card — already in `frontend/src/data/site.js`)
- Mr. **Chirag Pawar** (Business Head) · **+91 70960 11126**
- **info@vihaanaengineering.com** · **www.vihaanaengineering.com**
- Vatva, Ahmedabad, Gujarat. Social links = still placeholders (`#`).

## Key decisions / current state
- **Standards = Indian (IS / BIS)** everywhere (client wanted Indian, not ASTM/ISO). ISO 9001
  quality certification is kept (it's a company cert, not a test method).
- **Removed pages:** Careers, Testing (standalone), Gallery, Blog. Nav = Home · About ·
  Products · Services · Contact.
- **Hero** (`components/HeroSlider.jsx`): 4-per-view (resp. 2 / 1) carousel of **transparent
  machine cutouts** on a **light-gray** background, uniform size (no crop), scroll one-by-one,
  **no text, no shadow, no dots**, arrows only.
- Header shows the **full logo** `/logo.png` (with "Your Testing Partner" tagline). Larger
  logo + taller header + bigger nav links.
- **"Select Language"** = native Google Translate widget (full list) in navbar + mobile menu
  (`components/GoogleTranslate.jsx`, CSS in `index.css`).
- Product detail page has a **"Download Catalogue"** button → branded PDF datasheet via jsPDF
  (`lib/pdf.js`, dynamically imported / code-split).
- Product images use `object-contain` (no crop) in uniform boxes on grid + detail.
- Stats count-up animation: `components/ui/Counter.jsx`.
- "Industries We Serve" = icon cards (`industryIcon` in `lib/ui.js`).

## Data & asset pipeline (`_scripts/` — has its own node_modules with `sharp` + `@imgly`)
- `prepare-assets.mjs` → copies + **resizes** product photos (max 1100px, quality 82) from
  `Desktop/Vihaana Engineering/Vihaana Machine Photo/` into `frontend/public/products/`, and
  writes `frontend/src/data/products.json` (the single source; also used by backend seed &
  frontend fallback). **Product images were 106 MB → 1.1 MB** (fixed garbled/slow images).
- `make-cutouts.mjs` → **@imgly AI background removal** → `_cutouts/*.png`. Pass a RELATIVE
  path to `removeBackground` (absolute `C:\` is parsed as a URL protocol and fails).
- `make-machine-cards.mjs` → normalises cutouts to a uniform **660×600** canvas + **alpha
  cleanup (LOW=45, HIGH=115)** so the machine's own light surfaces stay opaque while leftover
  background becomes transparent → `frontend/public/machines/*.webp` (the hero uses these).
- `make-banners.mjs`, `generate-doc.mjs` (chat/development-log Word doc) also present.
- **Gotcha:** never `import sharp` in the same process that uses `@imgly` (libvips version
  clash → ERR_DLOPEN). Keep removal and sharp steps in separate scripts.
- Gitignored: `_scripts/_cutouts _stock _stock2 _ref` and all `node_modules`.

## Admin panel
`/admin/login` — needs the **backend + MongoDB** running & seeded. Seed creates admin
`admin@vihaanaengineering.com` / `Admin@12345`. Backend: `cd backend; npm i; cp .env.example
.env; npm run seed; npm run dev`. MongoDB isn't on PATH — a portable `mongod` exists at
`C:\Users\Admin\mongodb80\...`. Backend/admin/forms are optional; the public site works
standalone via bundled `products.json` + `fallback.js`.

## Known pending / possible next tasks
- **18 of 27 products have no spec table** (their specs weren't in the IS 4984 catalogue doc).
  If the client provides specs for the rest, add them to `SPECS` in `prepare-assets.mjs`,
  re-run it, rebuild, push.
- Real **social-media links** to replace placeholders in `site.js`.
- Everything else per the change log in `Vihaana-Engineering-Website-Development-Log.docx`
  (on the Desktop).
