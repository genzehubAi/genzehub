#!/usr/bin/env node
/**
 * GENZE FX — licence key generator
 *
 * Keys are derived offline from your secret + the buyer's MT5 account number.
 * The EA recomputes the same value and compares. No server call needed, which
 * means the EA keeps working if your site is down.
 *
 * Usage:
 *   node keygen.js 12345678            -> live key for account 12345678
 *   node keygen.js 12345678 --demo     -> demo key
 *   node keygen.js --batch accounts.txt
 *
 * IMPORTANT: change SECRET before you sell anything, and never commit it.
 * Put it in an environment variable in real use:  GENZE_SECRET=... node keygen.js 123
 */

const crypto = require('crypto');

const SECRET = process.env.GENZE_SECRET || 'CHANGE-ME-BEFORE-LAUNCH';

function keyFor(account, demo = false) {
  const tag = demo ? 'DEMO' : 'LIVE';
  const h = crypto
    .createHmac('sha256', SECRET)
    .update(`${tag}|${String(account).trim()}`)
    .digest('hex')
    .toUpperCase();
  const body = h.slice(0, 12).match(/.{4}/g).join('-');
  return `GZFX-${demo ? 'D' : 'L'}-${body}`;
}

function verify(key, account) {
  const demo = key.startsWith('GZFX-D-');
  return key.trim().toUpperCase() === keyFor(account, demo);
}

const args = process.argv.slice(2);

if (SECRET === 'CHANGE-ME-BEFORE-LAUNCH') {
  console.error('\n  ⚠  You are using the default secret. Set GENZE_SECRET before selling.\n');
}

if (args[0] === '--batch') {
  const lines = require('fs').readFileSync(args[1], 'utf8').split('\n').filter(Boolean);
  lines.forEach(a => console.log(`${a.trim()},${keyFor(a)}`));
} else if (args[0] === '--verify') {
  console.log(verify(args[1], args[2]) ? 'VALID' : 'INVALID');
} else if (args[0]) {
  const demo = args.includes('--demo');
  console.log(keyFor(args[0], demo));
} else {
  console.log(`
GENZE FX keygen

  node keygen.js <account>              live key
  node keygen.js <account> --demo       demo key
  node keygen.js --batch accounts.txt   one key per line, CSV out
  node keygen.js --verify <key> <acct>  check a key

Set your secret first:  export GENZE_SECRET="a-long-random-string"
`);
}

module.exports = { keyFor, verify };
