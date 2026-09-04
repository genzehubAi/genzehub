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
page that  a feature works is what turns an unhappy customer into a real problem.

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

### Working
| Feature | Working |
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

**Host on GitHub Pages.** 
- A real backend, eventually, for automatic key delivery and affiliate stats
