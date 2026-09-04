# Connecting the APIs — what to do, in order

Your site is live. This is the order to connect things, cheapest and fastest first.
Each one is independent — do one, ship it, do the next.

---

## Already connected, nothing to do

**DexScreener** powers the ZDex table. No key, no account, no cost. Check the badge on your
live site says **Live** with a timestamp. If it says *Sample data*, your token has no pool yet
— that resolves itself the moment you add liquidity.

---

## 1. Google Apps Script — your backend  ·  free  ·  10 minutes

Makes `.z` reservations and affiliate applications actually save somewhere.
This is the highest-value thing you can connect today, because names and emails are the only
asset that compounds while everything else is unfinished.

Full steps are in `GO-LIVE.md`, Lesson 6. The one thing people get wrong: when deploying,
**Who has access must be "Anyone"** — not "Anyone with a Google account".

```js
formEndpoint: 'https://script.google.com/macros/s/AKfyc.../exec',
```

---

## 2. Lemon Squeezy — payments  ·  ~5% + 50¢  ·  30 minutes

Two products at $78 and $198, copy the buy links in.

```js
checkout: {
  trader: 'https://yourstore.lemonsqueezy.com/buy/xxxxxxxx',
  desk:   'https://yourstore.lemonsqueezy.com/buy/yyyyyyyy'
}
```

There is no API key involved — the site just redirects, and Lemon Squeezy handles the card.
Use their test mode to run a fake purchase before you tell anyone.

---

## 3. Helius — Solana RPC  ·  free tier  ·  20 minutes

This is the one that automates GENZE payments. Right now you watch Solscan by hand and email
keys. Helius gives you a real RPC endpoint plus webhooks.

1. helius.dev → sign up → **API keys → create**
2. You get `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
3. Add to `config.js`:

```js
rpc: 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY',
```

**What it buys you.** Set up a webhook on your `treasury` wallet. When GENZE lands, Helius
POSTs the transaction to a URL you choose — point it at your Apps Script, match the memo to
the buyer, and the key can be emailed automatically. That is the difference between a manual
process and a business that runs while you sleep.

Free tier is generous for this. Do not put the key anywhere secret-sensitive — RPC keys in
client-side code are normal and Helius lets you restrict them by domain in the dashboard.

---

## 4. Resend or Postmark — sending email  ·  free tier  ·  20 minutes

Apps Script can send mail through your Gmail, but it caps at around 100/day and lands in spam
more often. When you are selling, use a proper sender.

Resend's free tier covers 3,000 emails a month. You verify `genzehub.ai` by adding DNS records
(SPF and DKIM — your registrar again), then send from `support@genzehub.ai`. Call it from Apps
Script with `UrlFetchApp.fetch`.

Do this before your first paid sale, not after. A licence key that lands in spam is a refund
request.

---

## Things no API can fix

**Z Launch** needs a deployed Solana program that mints tokens and runs a bonding curve. There
is no API you can plug in. Two honest routes:

- **Integrate an existing launchpad** — Raydium LaunchLab or Meteora both have SDKs. You build
  the interface and the `.z` attribution layer, they handle the token mechanics and the
  security. Weeks, not months, and no audit bill.
- **Write your own program** — full control, but budget for an audit before it touches real
  money. Unaudited launchpad code holding user funds is how projects die.

I would take the first route. Your differentiator is the `.z` name on every coin, not the
bonding curve maths — that part is a commodity.

**.z names on-chain.** Your register is currently a Google Sheet, which is real but custodial.
For actual on-chain minting, look at **SNS subdomain registrars** before building anything:
buy `genze.sol`, create a subdomain registrar from your SNS profile, and you can issue
`hasnat.genze.sol` subdomains to users' own wallets. You set the pricing tiers, SNS takes a
small cut, and it works today with an existing SDK. Two caveats worth knowing: subdomain
support across wallets is patchy compared to top-level names, and the parent owner (you) can
transfer subdomains without the holder's signature — which is convenient for moderation but
does mean "you hold it, not us" needs care in how you word it.

If you want `.z` as a genuine top-level namespace rather than a subdomain, AllDomains supports
custom on-chain TLDs. Worth a comparison before you commit.

**Encrypted chat and live streaming** are infrastructure projects, not integrations. Chat needs
key exchange, a relay and storage. Streaming needs a media provider like Livepeer or Mux, and
it costs real money per viewer-hour. Both are quarters of work. Leave the Preview badges on.

---

## Order I would actually do it

1. Apps Script — today, free, unlocks email capture
2. Lemon Squeezy — this week, unlocks revenue
3. Resend — before the first sale, so keys arrive
4. Helius — once manual key delivery starts annoying you
5. SNS subdomains — when you have enough reservations to justify it
6. Launchpad integration — after all of the above is boring and stable
