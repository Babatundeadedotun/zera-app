# ZERA XII — Local Testing Guide (Step by Step)

Follow these in order. Two terminals total: one for the backend, one for the frontend.

---

## Part 1 — One-time account setup (do this first)

You need a few free accounts before anything will fully work. This only takes about 15 minutes.

### 1a. MongoDB Atlas (database)

1. Go to https://www.mongodb.com/cloud/atlas/register and sign up (free).
2. Create a free "M0" cluster (any region is fine).
3. When prompted to create a database user, set a username + password — **write these down**.
4. Under **Network Access**, click "Add IP Address" → choose "Allow Access from Anywhere" (`0.0.0.0/0`) — fine for local testing.
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the real values, and add `/zeraxii` before the `?` so it points to a database named zeraxii:
   ```
   mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/zeraxii?retryWrites=true&w=majority
   ```
   Keep this string handy for Part 2.

### 1b. Cloudinary (image storage)

1. Go to https://cloudinary.com/users/register/free and sign up.
2. On your Dashboard homepage you'll immediately see:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "reveal")
3. Keep these 3 values handy.

### 1c. Cloudinary unsigned upload preset (needed for photo uploads to work)

Product photos upload straight from the browser to Cloudinary, which needs one preset:

1. On your Cloudinary Dashboard, click the **gear icon** (Settings) → **Upload** tab.
2. Scroll to **Upload presets** → click **Add upload preset**.
3. Set **Signing Mode** to **Unsigned**.
4. (Recommended) Set **Folder** to `zeraxii-products`, and under **Allowed formats** list only
   `jpg,png,jpeg,webp`.
5. Save, and copy the preset's name shown at the top (e.g. `ml_default` or whatever you named it).

### 1d. Gmail App Password (for reset-code emails)

1. Go to https://myaccount.google.com/security and turn on **2-Step Verification** if it isn't already on.
2. Go to https://myaccount.google.com/apppasswords
3. Name it "ZERA XII" and click Create.
4. Copy the 16-character password shown (spaces don't matter). Keep it handy.

---

## Part 2 — Unzip and set up the backend

Open a terminal.

```bash
# 1. Unzip the project (adjust path to wherever you downloaded it)
unzip ZERA_XII.zip -d ZERA_XII
cd ZERA_XII/server

# 2. Install backend dependencies
npm install

# 3. Create your real .env file from the template
cp .env.example .env
```

Now open `server/.env` in any text editor and fill in:

```
MONGODB_URI=<the connection string from step 1a>
JWT_SECRET=<any long random string — see the comment in the file for a command that generates one>
ADMIN_EMAIL=aderinwaleblessing@gmail.com
ADMIN_DEFAULT_PASSWORD=<pick any temporary password, e.g. ZeraXII-Welcome2026>
GMAIL_USER=<the gmail address you generated the app password for>
GMAIL_APP_PASSWORD=<the 16-character app password from step 1d>
CLOUDINARY_CLOUD_NAME=<from step 1b>
CLOUDINARY_API_KEY=<from step 1b>
CLOUDINARY_API_SECRET=<from step 1b>
CLIENT_URL=http://localhost:5173
```

Save the file, then start the backend:

```bash
npm run dev
```

**Watch the terminal.** You should see:

```
[ZERA XII] Connected to MongoDB
============================================================
 ZERA XII admin account created for the first time.
 Login email:    aderinwaleblessing@gmail.com
 Temp password:  ZeraXII-Welcome2026
 She will be required to set a new password on first login.
============================================================
[ZERA XII] API server running on http://localhost:5000
```

✅ **Checkpoint:** open http://localhost:5000/api/health in your browser — you should see:
```json
{"status":"ok","service":"ZERA XII API"}
```
If you see this, the backend is working. Leave this terminal running and open a **new terminal** for the frontend.

---

## Part 3 — Set up the frontend

```bash
cd ZERA_XII/app
npm install
cp .env.example .env
```

Open `app/.env` and fill in the Cloudinary values from step 1b/1c:

```
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=<from step 1b>
VITE_CLOUDINARY_UPLOAD_PRESET=<the preset name from step 1c>
```

Then start it:

```bash
npm run dev
```

Terminal will print something like:
```
  Local:   http://localhost:5173/
```

Open that URL in your browser.

---

## Part 4 — Test each feature

### 4a. Customer page still works normally
- Browse products, open a product, close it, use the search icon, scroll through sections.
- Confirm it looks and behaves exactly like before.

### 4b. Dark theme toggle
1. Click the **moon icon** next to the Search icon in the navbar.
2. Confirm the whole site switches to a dark burgundy background with cream/champagne text, gold accents stay gold.
3. Click the **sun icon** to switch back to light.
4. Refresh the page — confirm it remembers your last choice (saved in your browser).

### 4c. WhatsApp order button with photo preview
1. Click into any product → click **"Order on WhatsApp."**
2. It opens WhatsApp Web/App with a pre-filled message that now ends with a product photo link.
3. Send the message to yourself/test number — WhatsApp should render a photo preview of that link a few seconds after sending (this preview generation is done by WhatsApp itself, not instant).

### 4d. Admin — first login + forced password reset
1. Go to **http://localhost:5173/admin/login**
2. Log in with:
   - Email: `aderinwaleblessing@gmail.com`
   - Password: whatever you set as `ADMIN_DEFAULT_PASSWORD`
3. You should be automatically redirected to a **"Set Your Password"** screen.
4. Enter a new password (8+ characters) twice, submit.
5. You land on the **Admin Dashboard**.

✅ **Checkpoint:** log out (top-right button) and log back in with your **new** password — the old temp password should no longer work.

### 4e. Admin — upload a new product
1. From the dashboard, fill in: Product Name, Category, (optional) Product ID, Short Description, Full Description, Price.
2. Click the upload box and choose a photo (JPG/PNG). The photo uploads directly to Cloudinary from your browser first (you'll briefly see "Uploading photo..." on the button), then the product details are saved.
3. Click **"Add Item to Store."**
4. You should see a green success message, and the item appears in the **"Items You've Added"** list on the right.
5. Open a **new browser tab** → go to http://localhost:5173/ → your new product appears on the customer page automatically within about 15 seconds (the page checks for updates periodically, and also instantly whenever you switch back to that tab), or immediately on manual refresh.

### 4f. Admin — edit a product
1. On the dashboard, click the **pencil icon** next to any item in "Items You've Added."
2. The form above switches to "Edit Item" and pre-fills with that product's details, and its current photo shows as the preview.
3. Change the name, price, description, or category — or leave the photo alone (it stays as-is) or click the upload box to replace it.
4. Click **"Save Changes."**
5. Open your customer page tab — within about 15 seconds (or immediately on refresh/re-focus) the change appears automatically, no manual reload needed.
6. Click **"Cancel Edit"** any time to go back to the empty "Add a New Item" form.

### 4g. Admin — delete a product
1. Click the trash icon next to the item you just added.
2. Confirm the browser popup.
3. Check the customer page tab — the item disappears automatically within ~15 seconds, or immediately on refresh/re-focus.

### 4h. Admin — forgot password flow
1. Log out of the dashboard.
2. On the login page, click **"Forgot your password?"**
3. Enter `aderinwaleblessing@gmail.com` (or whatever `GMAIL_USER`/`ADMIN_EMAIL` you set) → submit.
4. Check that inbox for an email titled **"Your ZERA XII Admin Password Reset Code"** — copy the 6-digit code.
5. Enter the code on the page → submit.
6. Enter a new password twice → submit.
7. You're redirected to the login page — log in with the new password to confirm it worked.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Backend terminal shows `MongoDB connection failed` | Double-check `MONGODB_URI`, and that your IP is allowed in Atlas Network Access |
| New products don't show on customer page | Make sure the backend is still running — the site falls back to just the original catalog if it can't reach the API |
| "Image upload is not configured yet" | Set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` in `app/.env`, then restart `npm run dev` (Vite only reads `.env` on startup) |
| Upload fails with a Cloudinary error mentioning the preset | Double-check the preset's **Signing Mode is "Unsigned"** in your Cloudinary Dashboard, and that the preset name in `.env` matches exactly |
| Reset code email never arrives | Check spam folder; double-check `GMAIL_USER` + `GMAIL_APP_PASSWORD` (must be an App Password, not your normal Gmail password) |
| `/admin/login` shows a blank page or 404 on refresh | Only happens after deploying to Netlify without `netlify.toml` — locally with `npm run dev` this won't happen |
| Admin dashboard says "Session expired" | Your login token expires after 7 days — just log in again |

Once everything above works locally, follow **`netlify-deployment-guide.md`** to put it live on
Netlify (frontend + backend together, no separate server hosting needed).
