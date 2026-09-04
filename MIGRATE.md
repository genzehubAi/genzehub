# Netlify → GitHub Pages, on genzehub.ai

**Read this first: do NOT delete the Netlify site yet.**

You build the new home, prove it works, switch the domain over, and only *then* delete the old
one. If you delete first, your domain points at nothing while you set up GitHub — and the
gap can last hours because DNS is slow to spread. Old thing stays running until the new thing
is proven. That is the rule for every migration you will ever do.

---

## Step 1 — Find out how your DNS is set up

This decides everything later, so check it before you touch anything.

Log in to your **domain registrar** (wherever you bought genzehub.ai) and find the
**nameservers** setting.

- **Nameservers say something like `dns1.p01.nsone.net` / anything with "netlify"**
  → you are on **Netlify DNS**. Netlify controls your records. Path A below.
- **Nameservers are your registrar's own** (e.g. `ns1.namecheap.com`, `ns1.godaddy.com`)
  → you are on **external DNS**. Your registrar controls the records. Path B below.

Write down which one you are. You will need it at Step 4.

---

## Step 2 — Put the files on GitHub

Unzip the download. Open a terminal **inside** the folder — the one where `index.html` sits
next to `config.js`, `fx/` and `assets/`.

```bash
git init
git add .
git commit -m "GenzeHub"
git branch -M main
```

Go to github.com → **New repository**:
- Name: `genzehub`
- **Public** (Pages needs a paid plan for private repos)
- Do **not** tick "Add a README" — you already have one

Then, using the URL GitHub shows you:

```bash
git remote add origin https://github.com/YOURNAME/genzehub.git
git push -u origin main
```

Refresh GitHub. Your files should be listed, including the `fx` folder.

> If git asks for a password: GitHub stopped accepting account passwords. Use a
> **personal access token** (Settings → Developer settings → Personal access tokens →
> Tokens (classic) → Generate, tick `repo`) and paste that as the password.

---

## Step 3 — Turn Pages on and check it works

Repo → **Settings** → **Pages** (left sidebar).

- Source: **Deploy from a branch**
- Branch: **main**, folder: **/ (root)**
- **Save**

Wait two minutes, refresh. You will get a link like
`https://YOURNAME.github.io/genzehub/`.

**Open it and click through everything** — the nav, the FX page, both dashboards, ZDex. Every
link in this build is relative, so it all works from a subfolder. Your domain is still on
Netlify and still up; nobody sees this yet.

Do not continue until this preview is correct.

---

## Step 4 — Point the domain at GitHub

### Path A — you are on Netlify DNS

Easiest is to hand DNS back to your registrar.

1. In your **registrar**, set nameservers back to the registrar's own defaults
   (usually a "use default nameservers" option)
2. Wait — this one can take a few hours to spread
3. Then follow Path B

*Or* leave DNS with Netlify and just edit the records there: Netlify → **Domains** →
genzehub.ai → delete the existing A record, add the four GitHub A records from Path B.
This works and is faster, but you stay dependent on a Netlify account you are trying to leave.
I would move back to the registrar.

### Path B — you are on external DNS

At your registrar's DNS records page:

**Delete first:**
- Any **A** record on `@` (this is Netlify's `75.2.60.5`)
- Any **CNAME** on `www` pointing to `*.netlify.app`
- Any parking / forwarding / redirect entry

**Leave alone:** MX records, TXT records for email (SPF/DKIM). Those are your inbox.

**Then add:**

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `YOURNAME.github.io` |

All four A records. They are GitHub's four servers — if one goes down your site stays up.

---

## Step 5 — Tell GitHub the domain is yours

Repo → **Settings → Pages → Custom domain** → type `genzehub.ai` → **Save**.

The `CNAME` file in your repo already contains `genzehub.ai`, so this should match instantly.

- **Green tick** → good.
- **"Domain does not resolve"** → DNS has not spread yet. Normal. Wait 30 minutes, press
  Save again. Repeat. This is not an error, it is patience.

Then wait for the padlock. GitHub issues a free certificate automatically. When **Enforce
HTTPS** stops being greyed out, tick it. Usually under an hour; occasionally several.

### Watch it happen

```bash
dig genzehub.ai +short
```
Once this prints the four GitHub IPs instead of `75.2.60.5`, the switch has landed.

```bash
curl -I https://genzehub.ai
```
Look for `HTTP/2 200` and a `server: GitHub.com` header.

---

## Step 6 — Only now, delete Netlify

Check all of these on `https://genzehub.ai` first:

- [ ] Padlock, no certificate warning
- [ ] Nav shows **GENZE FX** first, in green
- [ ] Gold **GENZE FX — $78** button in the hero
- [ ] `genzehub.ai/fx` loads
- [ ] `genzehub.ai/fx/dashboard.html` loads
- [ ] `genzehub.ai/fx/affiliate.html` loads
- [ ] ZDex badge says **Live**
- [ ] Z Launch cards have thin 8px bars, not giant blocks
- [ ] Works on your phone

All ticked? Netlify → your site → **Site configuration → General → Delete this site**.

Then keep pushing changes the easy way:

```bash
git add .
git commit -m "what changed"
git push
```

Live in about a minute, every time.

---

## Errors you are likely to hit

**"Both www and apex are unverified"** — you added the records but GitHub has not rechecked.
Remove the custom domain, save, add it back, save.

**Site loads but has no styling** — `.nojekyll` is missing. It is in this folder; make sure it
got committed (`git status` will not show it if it is already tracked; `ls -a` to confirm it
exists).

**404 on genzehub.ai/fx** — the `fx` folder did not get pushed. Check the repo on github.com.
If it is missing, `git add fx/` and push again.

**Certificate stuck for hours** — usually a leftover DNS record. Run `dig genzehub.ai +short`
and confirm you see *only* the four GitHub IPs. Anything else means something was not deleted.

**Old site still showing** — browser cache. Ctrl+Shift+R, or open a private window.

**"Domain is already taken by another repository"** — the domain is still attached to a
different GitHub repo of yours. Find it and clear its custom domain field first.
