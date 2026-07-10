# Deploying the Vihana Engineering website

You want a **public link you can send to people**. The whole public site (all pages,
27 products, images, logo, contact details) works as a static site — no server or
database needed. Pick one of the two options below.

> The `/admin` panel and saving of contact/inquiry forms need a backend + database.
> That's optional and covered at the bottom.

---

## Option A — Fastest, no commands (Netlify Drop) ⚡

Good for getting a shareable link in ~2 minutes.

1. Open **https://app.netlify.com/drop** in your browser.
2. In File Explorer, go to this folder:
   `C:\Users\Admin\job station\frontend\dist`
3. Drag the **`dist`** folder onto the Netlify Drop page.
4. Wait ~20 seconds — Netlify gives you a live link like
   `https://random-name-123.netlify.app`. **That's the link you can send.**
5. (Optional) Sign in with GitHub/email to keep the site and rename it.

To update later: rebuild with `npm run build` (in `frontend`) and drag the new
`dist` folder again.

---

## Option B — Permanent & auto-updating (GitHub + Vercel) ⭐ recommended

The site gets a permanent link and re-deploys automatically every time you push
changes. You already have a GitHub account and the code is committed locally.

### 1. Create an empty repo on GitHub
- Go to **https://github.com/new**
- Repository name: `vihana-engineering` (anything is fine)
- Keep it **Public** or **Private** (your choice)
- **Do NOT** tick "Add a README / .gitignore / license" (the project already has them)
- Click **Create repository**

### 2. Push your code (copy-paste into PowerShell)
Open PowerShell and run these, replacing `YOUR-USERNAME` with your GitHub username:

```powershell
cd "C:\Users\Admin\job station"
git remote add origin https://github.com/YOUR-USERNAME/vihana-engineering.git
git push -u origin main
```

(The first time, a GitHub login window may pop up — sign in to authorize.)

### 3. Deploy on Vercel
- Go to **https://vercel.com** and **Sign up / Log in with GitHub** (free).
- Click **Add New… → Project**.
- Find your `vihana-engineering` repo and click **Import**.
- ⚠️ **Important setting** — set **Root Directory** to **`frontend`**
  (click "Edit" next to Root Directory and choose the `frontend` folder).
- Framework Preset should auto-detect **Vite**. Leave Build Command (`npm run build`)
  and Output Directory (`dist`) as detected.
- Click **Deploy**.
- After ~1 minute you get a link like `https://vihana-engineering.vercel.app`.
  **That's the link to share.** It updates automatically on every `git push`.

---

## Later: making the admin panel + forms work (optional)

The public site above does everything a brochure/catalog site needs. If you also
want the `/admin` login and contact/inquiry forms to save data, deploy the backend:

1. **Database** — create a free cluster at **https://www.mongodb.com/atlas**,
   create a database user, allow network access `0.0.0.0/0`, and copy the
   connection string.
2. **Backend** — on **https://render.com** (free): New → Web Service → connect the
   same GitHub repo → **Root Directory = `backend`**, Build `npm install`,
   Start `npm start`. Add environment variables:
   `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL), `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`. Then in Render's shell run `npm run seed` once.
3. **Connect frontend to backend** — in Vercel → your project → Settings →
   Environment Variables, add `VITE_API_URL = https://your-backend.onrender.com/api`,
   then redeploy.

That's it — the same site will then have a working admin panel and live forms.
