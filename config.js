/* ============================================================================
   GENZEHUB — the only file you normally need to edit.
   Both genzehub.ai and genzehub.ai/fx read from this.
   Anything left empty makes that feature announce itself as not-yet-connected
   instead of pretending to work.
   ============================================================================ */
window.GENZE = {

  /* ---------- IDENTITY ---------- */
  mint: '9dZ47ThduxiUg2Cjh18hvstrrM5Xm9RrNRAh93Jhgtsr',  // GENZE SPL mint
  treasury: '',        // Solana wallet that RECEIVES payments. Required for token payment.
  domain: 'https://genzehub.ai',

  /* ---------- FORMS & DATA ----------
     One Google Apps Script URL handles: .z reservations, FX signups,
     affiliate applications, and name-availability checks.
     Deploy apps-script.gs (see README step 3) and paste the /exec URL here. */
  formEndpoint: '',

  /* ---------- FX PRICING (USD) ---------- */
  prices: { trader: 78, desk: 198 },
  discount: 0.33,          // affiliate promo code
  tokenDiscount: 0.50,     // paying in GENZE
  stackDiscounts: false,   // false = best single discount applies, never both
  affiliateRate: 0.25,     // your commission per paid licence

  /* ---------- HOSTED CHECKOUT ----------
     Stripe Payment Link, Lemon Squeezy buy-link, Gumroad, Paddle — any of them. */
  checkout: { trader: '', desk: '' },

  /* ---------- SOLANA RPC (optional) ----------
     Free key from helius.dev. Only needed when you automate GENZE payment
     confirmation — the Solana Pay link works without it. */
  rpc: '',

  /* ---------- MARKET DATA ----------
     DexScreener is free and needs no key. If it ever starts refusing,
     set genzeUsdPrice manually and the site keeps working. */
  dexApi: 'https://api.dexscreener.com/latest/dex',
  genzeUsdPrice: null,     // manual fallback, e.g. 0.0004

  /* Mints shown in the ZDex table. First one should be GENZE.
     These are real Solana mints — swap in whatever you want listed. */
  watchlist: [
    '9dZ47ThduxiUg2Cjh18hvstrrM5Xm9RrNRAh93Jhgtsr',  // GENZE
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',  // BONK
    'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',  // WIF
    'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',   // JUP
    '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',  // RAY
    'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3'   // PYTH
  ],

  /* ---------- HONESTY SWITCH ----------
     true  = features that are still simulated wear a "Preview" badge.
     Leave this ON until the feature is genuinely wired. It is the difference
     between a prototype and a misleading claim. */
  showPreviewBadges: true
};
