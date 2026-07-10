# Vihana Engineering — Corporate Website (MERN)

A professional, fully responsive corporate website for **Vihana Engineering** —
*Your Testing Partner* — a manufacturer of material-testing instruments for
plastics, polymers, pipes, films and geosynthetics.

Built with the **MERN** stack exactly as specified:

| Layer      | Tech                                                        |
| ---------- | ----------------------------------------------------------- |
| Frontend   | React 18 · Vite · Tailwind CSS · React Router · Axios       |
| Backend    | Node.js · Express · MongoDB · Mongoose                      |
| Auth       | JWT + bcrypt, role-based access (admin / editor / viewer)   |

The site ships with **27 real product photos** (wired in from the supplied
`Vihaana Machine Photo` folder) across 8 testing domains, plus a full **dynamic
admin panel** with CRUD for products, testing categories, services, blogs,
gallery, certifications, clients, testimonials, careers, and an inbox for
inquiries and contact messages.

> ✅ **The frontend runs on its own** using bundled fallback data, so you can
> preview the whole site without a database. Connect the backend + MongoDB to
> make it fully dynamic and enable the admin panel.

---

## Project structure

```
job station/
├── frontend/                 # React + Vite + Tailwind
│   ├── public/
│   │   ├── logo.png          # Vihana Engineering logo
│   │   └── products/         # 27 product photos (auto-slugged)
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ProductCard, UI, ErrorBoundary…
│   │   ├── pages/            # Home, About, Products, Services, Blog, Contact…
│   │   ├── admin/            # Login, Dashboard, ResourceManager, Inbox…
│   │   ├── services/         # api.js (Axios + fallback), admin.js
│   │   ├── data/             # products.json (shared manifest) + fallback.js
│   │   ├── context/          # AuthContext
│   │   └── hooks/ · lib/
│   └── package.json
│
├── backend/                  # Express + Mongoose REST API
│   ├── src/
│   │   ├── models/           # 12 Mongoose schemas
│   │   ├── controllers/      # factory (generic CRUD) + auth + stats
│   │   ├── routes/           # resourceRouter + index
│   │   ├── middleware/       # auth (JWT + roles), error handling
│   │   ├── seed/seed.js      # seeds admin user + all content
│   │   ├── config/db.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── _scripts/prepare-assets.mjs   # (re)generates product images + manifest
└── README.md
```

---

## Quick start

### 1. Frontend (works standalone)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Every public page works immediately using the
bundled product data and images.

### 2. Backend + database (makes it dynamic + enables admin)

You need MongoDB. Either:

- **Local:** install MongoDB Community Server and it will listen on
  `mongodb://127.0.0.1:27017`, **or**
- **Free cloud:** create a free cluster at
  [MongoDB Atlas](https://www.mongodb.com/atlas) and copy the connection string.

Then:

```bash
cd backend
npm install
cp .env.example .env        # then edit .env
```

Edit `backend/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/vihana_engineering   # or your Atlas URI
JWT_SECRET=<a long random string>
ADMIN_EMAIL=admin@vihaanaengineering.com
ADMIN_PASSWORD=Admin@12345
```

Seed the database (creates the admin user + all content, including the 27
products) and start the API:

```bash
npm run seed      # populate MongoDB
npm run dev       # start API on http://localhost:5000
```

The Vite dev server proxies `/api` → `http://localhost:5000`, so once the
backend is running the frontend automatically switches from bundled data to
live database data.

### 3. Admin panel

Go to **http://localhost:5173/admin/login** and sign in with the seeded
credentials:

```
Email:    admin@vihaanaengineering.com
Password: Admin@12345
```

From there you can manage all content, view dashboard analytics, and read
inquiries / contact messages.

---

## Features

**Public site**
- Home with hero, testing domains, featured products, why-us, services,
  testimonials and CTA
- Products listing with category filter + search, and rich product detail pages
  with an inline "Request a Quote" inquiry form
- Testing Categories, Services, Gallery (with lightbox), Certifications, Blog +
  articles, Careers (with openings), Contact (with form)
- SEO-friendly meta tags, responsive design, floating WhatsApp button

**Admin panel**
- Secure JWT login, protected routes, role-based access
- Dashboard analytics (content counts, alerts, recent activity)
- Generic CRUD manager for 9 content types
- Inbox for product inquiries (with status workflow) and contact messages

**Backend API**
- REST architecture, generic CRUD controller factory, pagination + search
- Mongoose models with slugs, validation and timestamps
- Central error handling, CORS, request logging
- Boots even if MongoDB is unreachable (returns clear 503s) so the app never
  hard-crashes

---

## Regenerating product images / data

The 27 product images and the shared `frontend/src/data/products.json` manifest
are produced by:

```bash
node _scripts/prepare-assets.mjs
```

It reads the source photos from `Desktop/Vihaana Engineering/Vihaana Machine
Photo`, copies them into `frontend/public/products/` with clean URL slugs, and
rebuilds the manifest used by both the frontend fallback and the backend seed.

---

## Deployment (free hosting)

Frontend and backend deploy **separately**:

- **Frontend** → [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
  - Build command: `npm run build`, output dir: `dist`
  - Set `VITE_API_URL` to your deployed backend URL, e.g. `https://api.yoursite.com/api`
- **Backend** → [Render](https://render.com) / [Railway](https://railway.app) free tier
  - Start command: `npm start`
  - Set env vars: `MONGO_URI` (Atlas), `JWT_SECRET`, `CLIENT_URL` (your frontend origin), admin vars
  - Run the seed once (Render shell): `npm run seed`

---

## Notes / TODO before going live

- Real contact details (Mr. Chirag Pawar · +91 70960 11126 · info@vihaanaengineering.com ·
  Vatva, Ahmedabad) are already set in `frontend/src/data/site.js`. Add the real
  **social media links** when available.
- Change the default admin password after first login.
- Add real specifications, brochures (PDF) and client logos via the admin panel.
