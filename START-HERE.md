# Start here

You have four guides. Read them in this order, and only when you need them:

| File | When |
|---|---|
| **START-HERE.md** | now — getting the files onto GitHub |
| **MIGRATE.md** | next — pointing genzehub.ai at GitHub, retiring Netlify |
| **APIS.md** | after it is live — connecting payments, backend, email |
| **README.md** | reference — what is real vs preview, config explained |

---

## What you are looking at

```
index.html        the hub — genzehub.ai
fx/               GENZE FX — genzehub.ai/fx
assets/           logos and mascot
config.js         ← the only file you normally edit
apps-script.gs    paste into Google Sheets later (APIS.md)
keygen.js         licence key generator
CNAME             tells GitHub your domain is genzehub.ai
.nojekyll         stops GitHub reprocessing your HTML
netlify.toml      ignored by GitHub, harmless
```

**Do not rename anything.** `index.html` must be called that, and `fx` must stay `fx`,
or the URLs change.

---

## Step 1 — Unzip it properly

Download `genzehub.zip` and unzip it.

You should end up with a folder where `index.html` sits **directly inside**, next to
`config.js` and the `fx` folder. If you open the folder and see another folder with the same
name, go one level deeper — that inner one is the real thing.

This is the single most common thing people get wrong. Get it right here and the rest is easy.

---

## Step 2 — Create the repository

1. Go to **github.com** and sign in (create an account if you have none — free)
2. Click the **+** top right → **New repository**
3. Repository name: `genzehub`
4. Select **Public** — Pages needs a paid plan for private repos
5. Leave every checkbox unticked. Do **not** add a README
6. **Create repository**

You now have an empty repo with a page saying "Quick setup".

---

## Step 3 — Upload the files

**Option A — browser only. No terminal. Recommended if you have not used git.**

1. On that Quick setup page, click **uploading an existing file**
2. Open your unzipped folder in a file window
3. Select **everything inside it** — Ctrl+A — and drag it all onto the browser
   - Drag the *contents*, not the folder itself
   - Folders are preserved, so `fx` and `assets` come across intact
4. Wait for every file to finish listing. `fx/index.html` and `assets/…png` should appear
5. Scroll down, type `first upload` in the message box, click **Commit changes**

> Windows and Mac hide files starting with a dot, so `.nojekyll` may not be selected.
> That is fine — nothing here needs it. If you want it anyway: on Windows press
> **Ctrl+Shift+H** to show hidden files, on Mac **Cmd+Shift+.**

**Option B — git, if you already use it**

Open a terminal inside the unzipped folder:

```bash
git init
git add .
git commit -m "GenzeHub"
git branch -M main
git remote add origin https://github.com/YOURNAME/genzehub.git
git push -u origin main
```

If it asks for a password, GitHub no longer accepts account passwords. Generate a token:
Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new,
tick `repo`, copy it, and paste that as the password.

---

## Step 4 — Check the upload

Look at your repo page. You should see:

- `index.html`
- `config.js`
- a folder called `fx`
- a folder called `assets`

Click into `fx` — it should contain `index.html`, `dashboard.html`, `affiliate.html`.

If `fx` is missing, you dragged the wrong thing. Delete the repo and redo Step 3.

---

## Step 5 — Switch Pages on

1. In your repo, click **Settings** (top bar)
2. Click **Pages** in the left sidebar
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)**
4. **Save**

Wait two minutes and refresh. A link appears at the top:
`https://YOURNAME.github.io/genzehub/`

**Open it.** Click every link — the nav, GENZE FX, both dashboards, ZDex, Z Launch.

Your site is now live on the internet. Your domain is still on Netlify and still working, so
nobody has noticed anything. Nothing is at risk yet.

---

## Do I ever need a terminal?

No. Every step of getting live and running this business is browser-only:

| Task | Where |
|---|---|
| Upload files | GitHub web uploader |
| Turn on Pages | GitHub Settings |
| DNS records | your registrar's website |
| Custom domain | GitHub Settings |
| Edit `config.js` later | pencil icon on GitHub, edit, commit |
| Check DNS spread | **whatsmydns.net** — enter genzehub.ai, look for the four GitHub IPs |
| Google Apps Script | browser |
| Lemon Squeezy | browser |
| Generate licence keys | **keygen.html** — open it from your own computer |

MIGRATE.md shows `dig` and `curl` commands for checking DNS. Ignore them and use
whatsmydns.net instead — same information.

`keygen.js` is the terminal version of the key generator. You do not need it; `keygen.html`
does the same thing in your browser and produces identical keys. Keep `keygen.html` on your
computer and do not upload it — `.gitignore` already tells git to skip it.

---

## Step 6 — Now go to MIGRATE.md

That covers pointing genzehub.ai here and safely deleting the Netlify site.

**Do not delete Netlify before then.** The order in that guide exists so your domain is never
pointing at nothing.

---

## If you get stuck

Tell me the exact error text or what you see on screen. "It says X" is fixable in one reply.
"It didn't work" takes five.
