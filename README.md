# GenzeHub — what is real, and what you do next

One repo, one domain. Follow the steps in order.

```
/                  index.html      the hub — token, ZDex, Z Launch, .z names
/fx/               index.html      GENZE FX — the gold scalper
/fx/dashboard.html                 buyer's licence dashboard
/fx/affiliate.html                 affiliate dashboard
config.js                          ← the only file you normally edit
assets/                            logos and mascot, cached by the browser
netlify.toml                       only used if you deploy to Netlify
apps-script.gs                     paste into Google, gives you a free backend
keygen.js                          licence key generator (Node)
GO-LIVE.md                         ← start here: step-by-step deployment
APIS.md                            which APIs to connect, in order
CNAME / .nojekyll                  GitHub Pages plumbing
```

---

## Read this first: what is genuinely working

Being clear about this protects you. You are running a token next to a paid product, and a
page that *pretends* a feature works is what turns an unhappy customer into a real problem.

### Working for real, right now
| Feature | How it works |
|---|---|
| **ZDex live market data** | Real Solana pairs from DexScreener, refreshed every 45s. Real prices, volume, liquidity. Badge reads **Live** with a timestamp, or **Sample data** if the feed is unreachable. |
| **GENZE contract address** | Reads your mint from `config.js`, click to copy. |
| **.z name check + reservation** | Real availability check against your own register, real reservation written to your Google Sheet. |
| **Affiliate applications** | Real rows written to your sheet, real inbox. |
| **Card / USDT checkout** | Redirects to your hosted payment link with email and affiliate code attached. |
| **GENZE payment** | Fetches the live token price, computes the amount, opens Phantom via Solana Pay with everything pre-filled. |
| **Wallet connect** | Real Phantom / Solflare connection. |
| **Break-even calculator** | Real maths, no fakery. |
| **Licence keys** | `keygen.js` produces keys your EA verifies offline. |

### Still simulated — and now labelled "Preview" on the page
| Feature | What it actually needs |
|---|---|
| **Z Launch** | A deployed Solana program that creates mints and bonding curves. Weeks of work plus an audit. |
| **Tweet-to-buy** | A backend, X API access, and custody of user funds. The most heavily regulated thing on your roadmap — do it last, with a lawyer. |
| **Encrypted chat** | Real infrastructure: key exchange, message relay, storage. Months, not weeks. |
| **Live streaming** | Media servers, or a provider like Livepeer or Mux. Expensive to run. |
| **Affiliate dashboard numbers** | Currently the `MOCK` object. Needs the backend to count real conversions. |
| **Automatic licence delivery** | You email keys by hand today. Fine to about fifty customers. |

`showPreviewBadges: true` in `config.js` puts a **Preview** badge on anything simulated. Turn
it off for a feature only once that feature is genuinely wired. Leaving it on costs you
nothing and is the difference between a prototype and a claim you cannot back.

---

## Step 1 — Go live (20 minutes)

**Host on GitHub Pages.** Netlify is the better platform in most ways, but its free tier moved
to a credit model — roughly 15 GB of bandwidth a month, and when you run out **the site goes
offline until the next billing cycle**. No throttling, no grace period. On the day your token
goes live and a Telegram post lands, that is exactly when it would happen. GitHub Pages has a
soft 100 GB limit and emails you instead of pulling the site down. For a launch, staying up
beats every other feature.

`netlify.toml` is included anyway, so if you outgrow Pages you can switch in ten minutes.

```bash
git init
git add .
git commit -m "GenzeHub"
git branch -M main
git remote add origin https://github.com/YOURNAME/genzehub.git
git push -u origin main
```

On GitHub: **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save.**
Two minutes later you are live at `yourname.github.io/genzehub`.

### Pointing genzehub.ai at it

An apex domain cannot use a CNAME record, so it needs A records. At your DNS provider, add:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `yourname.github.io` |

Delete any existing A record or parking-page record on `@` first, or your registrar's holding
page will keep winning. Leave MX records alone — those are your email and have nothing to do
with this.

Then in **Settings → Pages → Custom domain**, type `genzehub.ai` and save. The `CNAME` file in
this repo already contains it, so GitHub will recognise it. Wait for the certificate to issue —
usually under an hour, occasionally a few — then tick **Enforce HTTPS**.

Check it worked:

```bash
dig genzehub.ai +short          # should return the four GitHub IPs
curl -I https://genzehub.ai     # should return HTTP/2 200
```

If Pages says "domain does not resolve", the DNS has not propagated yet. Wait and re-save.

### If you prefer Netlify anyway

Drag this folder onto app.netlify.com, or connect the repo. Then add one A record `@` →
`75.2.60.5` and a CNAME `www` → `yoursite.netlify.app`. Watch your credit usage in the
dashboard, and add a card before launch day so the site cannot go dark.

---

## Step 2 — Verify the market feed (5 minutes)

Open this in a browser with your mint on the end:

```
https://api.dexscreener.com/latest/dex/tokens/9dZ47ThduxiUg2Cjh18hvstrrM5Xm9RrNRAh93Jhgtsr
```

- **JSON with a `pairs` array** → ZDex is live, nothing to do.
- **Empty `pairs`** → you have not added liquidity yet. Expected before launch.
- **An error, or a demand for a key** → set `genzeUsdPrice` in `config.js` manually and keep
  it updated. The site works either way.

---

## Step 3 — Your free backend (10 minutes)

This is what makes name reservations and affiliate applications real. It costs nothing.

1. Go to **sheets.new**, name the spreadsheet "GenzeHub"
2. **Extensions → Apps Script**, delete the placeholder code
3. Paste in all of `apps-script.gs`, save
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** ← must be Anyone, or the site cannot reach it
5. Authorise when Google asks. It warns you about an unverified app — it is your own script.
6. Copy the `/exec` URL into `config.js`:

```js
formEndpoint: 'https://script.google.com/macros/s/AKfyc.../exec',
```

Push, then reserve a name on your own site to test. A row should appear in the sheet within
seconds. The script creates its own tabs: `names`, `signups`, `affiliates`, `orders`.

For an email on every submission, uncomment the `MailApp.sendEmail` line near the bottom of
the script and put your address in.

---

## Step 4 — Take money (30 minutes)

A static site can never touch a card number — there is no server to hold a secret key. You
send buyers to a checkout page the payment company hosts. That is not a workaround; it is
how everyone does it.

**Use Lemon Squeezy.** They are merchant of record, so they handle VAT and sales tax in every
country you sell into. Fees are ~5% + 50¢ against Stripe's 2.9% + 30¢, and that difference
buys you not registering for tax in forty jurisdictions.

1. lemonsqueezy.com → create a store
2. **Products → New** → digital product → **$78** → "GENZE FX — Trader licence"
3. Repeat at **$198** for "Desk licence"
4. Copy each **Buy link** into `config.js`:

```js
checkout: {
  trader: 'https://yourstore.lemonsqueezy.com/buy/xxxxxxxx',
  desk:   'https://yourstore.lemonsqueezy.com/buy/yyyyyyyy'
}
```

5. Set the post-purchase redirect to `https://genzehub.ai/fx/dashboard.html`

The site appends `prefilled_email` and `client_reference_id` (the affiliate code), so every
payout row in your Lemon Squeezy export tells you which affiliate earned it. That is your
attribution system until you build a real one.

### Delivering the key
```bash
export GENZE_SECRET="a-long-random-string-you-invent-once-and-never-change"
node keygen.js 12345678
# GZFX-L-81E0-E51B-F6D8
```

Email it. By hand is fine for the first fifty customers. Automate when the manual work
actually starts hurting, not before.

---

## Step 5 — Accept GENZE (10 minutes)

Set your receiving wallet in `config.js`:

```js
treasury: 'YourSolanaWalletAddressHere',
```

Done. When a buyer picks GENZE, the site fetches the price, computes the token amount, and
opens their wallet with the transfer ready. The memo carries the plan and their email so you
can match the payment.

Confirm the transfer on Solscan, then run `keygen.js`. Manual, but real.

---

## Step 6 — Make the affiliate dashboard real

In `fx/affiliate.html`, replace the `MOCK` object with a fetch to your Apps Script:

```js
fetch(G.formEndpoint + '?action=stats&code=' + CONFIG.code)
```

You will need to extend `apps-script.gs` to count rows by referral code — about twenty lines
once you have real conversions to count. Until then the dashboard shows the *shape* of the
data. Do not send affiliates to it as though the numbers were theirs.

---

## The order I would do things in

1. **Today:** push, DNS, verify the feed. A live URL beats a perfect one you cannot share.
2. **Today:** Apps Script. Now you collect names and emails — the only asset that compounds
   while everything else is unfinished.
3. **This week:** Lemon Squeezy, plus the key check inside the EA. Now you have revenue.
4. **Next:** whatever the first fifty customers actually complain about. They will tell you
   what to build, and it will not be what you expect.
5. **Later, carefully:** Z Launch, then chat, then streaming. Tweet-to-buy last, or never.

---

## Three things worth being careful about

**Thin liquidity and the 50% discount interact badly.** 2 SOL against 2M tokens is a shallow
pool — a few hundred dollars moves the price meaningfully. The site prices in USD and converts
at market rate, so someone can nudge the price and buy licences for a fraction of $8.49. Until
the pool is deep enough that a small trade cannot move it, set `genzeUsdPrice` manually rather
than trusting the live feed.

**Never describe the token in terms of returns.** "Investors start getting good returns" is
the sentence that reclassifies a utility token as an investment offering — in Finland where
GenzeHub is registered, and in the UAE where you operate. The site says "not an investment, no
promise of value"; keep every Telegram message consistent with that. Your real pitch is
strong on its own: 50% off everything, and a name you own outright.

**Drop "world's first and most stable security layer in the history of blockchain."** It is
unverifiable, competitors will pull it apart, and it makes your true claims sound like
marketing. What you are building is genuinely good, and the site says it plainly: keys tied to
a .z name you hold in your own wallet, so identity is verified on-chain instead of taken on
trust. Ship that sentence — it is stronger because it is true.

---

## Still outstanding

- Terms and Privacy pages, drafted properly. Trading software plus a token attracts more
  scrutiny than either alone.
- Protected hosting for `GENZEFX.ex5` and the broker presets
- A support inbox a human reads
- A real backend, eventually, for automatic key delivery and affiliate stats
