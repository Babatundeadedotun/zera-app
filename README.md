# ZERA XII — Setup Guide

This project has two parts:

```
ZERA_XII/
├── app/       ← the React/Vite frontend (untouched design) + a Netlify serverless backend
│   └── netlify/functions/   ← the admin login & product API, deployed WITH the frontend
└── server/    ← the same backend as a plain Node/Express app, for local development
                 (and as an option if you ever want to self-host instead of using Netlify)
```

**You do not need to host a server anywhere separately.** The backend (admin login, product
uploads, database access) runs as a **Netlify Function** — it deploys together with your
frontend from one `netlify deploy` command. `server/` exists purely so you can run everything
locally with fast `npm run dev` — it is not required for production.

Your original customer-facing site still works exactly as it did before — same design, same
layout, same experience. Nothing existing was changed or removed. What was added:

1. **`/admin` dashboard** — private login for the store owner to add, edit, and delete products
   (with photos), which instantly appear on the customer page. No more editing source code.
2. **WhatsApp order message now includes the product photo link**, so it shows a picture preview
   in the chat (see the "important note" below — this is a WhatsApp platform limitation, explained).
3. **Dark theme toggle** — a moon/sun icon in the navbar next to Search and Cart. Light theme is
   your original cream/burgundy look; dark theme swaps to a dark burgundy background with
   champagne/cream text, same layout.

---

## 1. Accounts you need (all free)

| Service | What it's for | Get it at |
|---|---|---|
| MongoDB Atlas | stores the admin login + uploaded products | [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) |
| Cloudinary | stores product photos (uploaded directly from the browser) | [cloudinary.com](https://cloudinary.com) |
| Gmail App Password | sends the "forgot password" reset code emails | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |
| Netlify + Netlify CLI | hosts everything, frontend + backend | [netlify.com](https://netlify.com), `npm install -g netlify-cli` |

These are the only "hosting" you need — MongoDB/Cloudinary/Gmail are services every app like this
relies on regardless of where the code runs; Netlify hosts the actual site and backend code.

---

## 2. Local development (test everything on your computer first)

**Backend** (in one terminal):
```bash
cd server
npm install
cp .env.example .env
# fill in server/.env with your real MongoDB/Cloudinary/Gmail values
npm run dev
```
Runs on `http://localhost:5000`. First boot prints the admin's one-time temporary password.

**Frontend** (in a second terminal):
```bash
cd app
npm install
cp .env.example .env
# fill in app/.env - see the Cloudinary unsigned preset step below, it's required
npm run dev
```
Open the printed localhost URL. Admin dashboard: `http://localhost:5173/admin/login`.

**One extra one-time step (needed for both local dev and production):** product photo uploads
go straight from the browser to Cloudinary, which needs an "unsigned upload preset." Full steps
are in **`netlify-deployment-guide.md`** under "Create the Cloudinary unsigned upload preset" —
do that once, then put the cloud name + preset name into `app/.env` as
`VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.

For a full click-by-click walkthrough of testing every feature locally, see
**`local-testing-guide.md`**.

---

## 3. How the admin dashboard works

1. Go to `/admin/login`, sign in with `aderinwaleblessing@gmail.com` and the temporary password
   (printed by the backend on first boot, or set via `ADMIN_DEFAULT_PASSWORD`).
2. First login forces a **"Set Your Password"** screen — she picks a real password there.
3. She can **add** a product (name, category, ID, descriptions, price, photo) — it appears on
   the live customer page automatically. The customer page checks for changes every ~15 seconds
   and instantly whenever someone switches back to that browser tab, so adds/edits/deletes all
   show up without anyone needing to hard-refresh.
4. She can **edit** anything she's added — pencil icon, form pre-fills, change what's needed
   (photo optional to replace), save.
5. She can **delete** anything she's added.
6. **Forgot password?** — email → 6-digit code → new password, all from the login page.

All passwords are hashed with bcrypt — the real password is never stored, only its hash.

---

## 4. Important note about the WhatsApp photo feature

**WhatsApp's chat-link system (`wa.me`) can only pre-fill text — it cannot attach an actual image
file automatically.** No website can do this; it's a restriction on WhatsApp's side. The closest
working alternative — and what's built in — is that the message text includes a direct link to
the product photo, and WhatsApp automatically shows a photo preview of that link once the message
is sent.

---

## 5. Deploying to production — Netlify only, no separate server

Full step-by-step commands are in **`netlify-deployment-guide.md`**. Short version:

```bash
npm install -g netlify-cli
netlify login
cd app
netlify init
netlify env:set MONGODB_URI "..."
netlify env:set JWT_SECRET "..."
netlify env:set ADMIN_EMAIL "aderinwaleblessing@gmail.com"
netlify env:set ADMIN_DEFAULT_PASSWORD "..."
netlify env:set GMAIL_USER "..."
netlify env:set GMAIL_APP_PASSWORD "..."
netlify env:set CLOUDINARY_CLOUD_NAME "..."
netlify env:set CLOUDINARY_API_KEY "..."
netlify env:set CLOUDINARY_API_SECRET "..."
netlify env:set VITE_CLOUDINARY_CLOUD_NAME "..."
netlify env:set VITE_CLOUDINARY_UPLOAD_PRESET "..."
netlify env:set VITE_API_URL ""
netlify deploy --prod
```

That single `netlify deploy --prod` builds the frontend AND bundles the backend function
together, every time. No Render/Railway/VPS, no separate deploy step for a server.

*(If you'd genuinely rather run a traditional standalone Node server instead of Netlify
Functions — e.g. to self-host on your own VPS — `server/` plus the included `render.yaml` still
work for that; see the comments in `server/render.yaml`. Most people won't need this.)*

---

## 6. What was NOT touched

- Every existing page, section, product card, layout, animation, and the original light theme
  color values are all exactly as they were.
- The original hard-coded product catalog (`app/src/data/products.ts`) is untouched — those
  products still show up exactly as before. Admin-uploaded products now appear alongside them
  automatically.
- The existing "Order on WhatsApp" message wording is unchanged — only a photo link was appended.
