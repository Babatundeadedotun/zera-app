# Deploying ZERA XII to Netlify (frontend + backend, no separate hosting)

This project now deploys entirely on Netlify — the customer site AND the admin backend both
live on the same Netlify site. The backend runs as a **Netlify Function** (serverless), which
means there's no separate server to host, pay for, or manage anywhere else.

You still need MongoDB Atlas, Cloudinary, and a Gmail App Password (these are external services,
not "hosting" — every app needs a database and an email sender somewhere).

---

## Why not just drag-and-drop the `dist` folder like before?

Netlify's drag-and-drop deploy is **static files only** — it has no build step, so it can't
bundle the `netlify/functions/` folder that runs your login/database logic. To include the
backend function, Netlify needs to actually run a build. The two ways to do that:

1. **Netlify CLI from your computer** (what we're doing here) — no GitHub needed.
2. Connect your GitHub repo in the Netlify UI (fully automatic on every push, but requires Git).

---

## One-time setup

### 1. Install the Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Log in (opens a browser window once)

```bash
netlify login
```

### 3. Create the Cloudinary "unsigned upload preset"

Product photos now upload directly from the browser to Cloudinary (not through the server),
which needs one preset set up:

1. Go to your Cloudinary Dashboard → click the **gear icon** (Settings) → **Upload** tab.
2. Scroll to **Upload presets** → click **Add upload preset**.
3. Set **Signing Mode** to **Unsigned**.
4. (Recommended, keeps it locked down) Under the same preset:
   - Set **Folder** to `zeraxii-products` and enable "Use filename or externally defined Public ID".
   - Under **Allowed formats**, list only `jpg,png,jpeg,webp`.
   - Set a **Max file size** (e.g. 8 MB).
5. Save, and copy the preset's name (e.g. `zeraxii_unsigned` or whatever Cloudinary auto-names it).

### 4. Link your project to a Netlify site

```bash
cd ZERA_XII/app
netlify init
```

Choose **"Create & configure a new site"** (or link to an existing one if you already made one
in the Netlify dashboard). When asked about build settings, confirm:
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

(These are already set in `netlify.toml`, so `netlify init` should detect them automatically.)

---

## Set your environment variables

Two sets of variables are needed — one for the **frontend build** (`VITE_...`, gets baked into
the static files) and one for the **backend function** (read at runtime, never exposed to the
browser).

Run these from inside the `app` folder (replace every placeholder value with your real one):

```bash
# --- Frontend (safe to be public) ---
netlify env:set VITE_CLOUDINARY_CLOUD_NAME "your-cloud-name"
netlify env:set VITE_CLOUDINARY_UPLOAD_PRESET "zeraxii_unsigned"
netlify env:set VITE_API_URL ""

# --- Backend / function (kept private) ---
netlify env:set MONGODB_URI "mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/zeraxii?retryWrites=true&w=majority"
netlify env:set JWT_SECRET "some-long-random-string"
netlify env:set ADMIN_EMAIL "aderinwaleblessing@gmail.com"
netlify env:set ADMIN_DEFAULT_PASSWORD "ZeraXII-Welcome2026"
netlify env:set GMAIL_USER "aderinwaleblessing@gmail.com"
netlify env:set GMAIL_APP_PASSWORD "your-16-char-app-password"
netlify env:set CLOUDINARY_CLOUD_NAME "your-cloud-name"
netlify env:set CLOUDINARY_API_KEY "your-api-key"
netlify env:set CLOUDINARY_API_SECRET "your-api-secret"
```

(You can also set all of these visually instead: Netlify dashboard → your site → **Site
configuration → Environment variables → Add a variable**.)

Generate a good `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Deploy

**Draft preview first** (get a temporary URL to check everything works):
```bash
netlify deploy
```

**Then go live** on your real site URL:
```bash
netlify deploy --prod
```

Both commands run `npm run build` for you, upload `dist/`, and bundle `netlify/functions/` —
frontend and backend deploy together, every time, from one command.

---

## Verify it worked

1. Open your live site URL → the customer page should look normal.
2. Visit `https://your-site.netlify.app/api/health` → you should see:
   ```json
   {"status":"ok","service":"ZERA XII API (Netlify Function)"}
   ```
   If you get a Netlify 404 page instead, the function didn't deploy — check that
   `netlify.toml` was picked up (re-run `netlify init` if unsure) and re-deploy.
3. Go to `https://your-site.netlify.app/admin/login` and log in with
   `ADMIN_EMAIL` / `ADMIN_DEFAULT_PASSWORD` — same first-login flow as local testing.
4. Try uploading a product with a photo — you should see it appear on the live customer page.

---

## Redeploying after future changes

Every time you make changes locally:

```bash
cd app
netlify deploy --prod
```

That's the whole workflow from now on — no separate server to redeploy, restart, or maintain.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `/api/health` returns Netlify's own 404 page | The function wasn't bundled. Confirm `netlify.toml` has `functions = "netlify/functions"` and re-run `netlify deploy --prod`. |
| Function logs show `Cannot find package 'X'` | That dependency is missing from `app/package.json` — the function bundler only installs what's listed there (Netlify doesn't look inside `server/`). Add it and redeploy. |
| Product upload fails with a Cloudinary error | Check `VITE_CLOUDINARY_CLOUD_NAME` / `VITE_CLOUDINARY_UPLOAD_PRESET` (frontend) are set correctly and that the preset's Signing Mode is **Unsigned**. |
| Login/upload works locally but not on the live site | Your Netlify env vars are probably missing or different from your local `.env` — re-check with `netlify env:list`. |
| Changes don't show up after `netlify deploy --prod` | Hard-refresh the browser tab (Netlify's CDN caches aggressively) or check the deploy actually succeeded in the terminal output. |

To view live function logs while testing: `netlify functions:log api` (or check the "Functions"
tab in the Netlify dashboard for your site).
