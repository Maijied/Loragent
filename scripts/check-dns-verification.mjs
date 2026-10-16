#!/usr/bin/env node
/**
 * @file check-dns-verification.mjs
 * Loragent DNS Propagation & Verification Checker for GitHub Custom Domain
 *
 * Verifies TXT record propagation across primary global DNS resolvers.
 * Target: _gh-Lorapok-o.loragent.lorapok.tech -> f697b6ac08
 */

import dns from 'node:dns/promises';

const CONFIG = {
  hostname: '_gh-Lorapok-o.loragent.lorapok.tech',
  expectedValue: 'f697b6ac08',
  domain: 'lorapok.tech',
  expiryDate: '2026-10-23T09:23:47Z',
  resolvers: [
    { name: 'Cloudflare (1.1.1.1)', ip: '1.1.1.1' },
    { name: 'Cloudflare Secondary (1.0.0.1)', ip: '1.0.0.1' },
    { name: 'Google (8.8.8.8)', ip: '8.8.8.8' },
    { name: 'Google Secondary (8.8.4.4)', ip: '8.8.4.4' },
    { name: 'Quad9 (9.9.9.9)', ip: '9.9.9.9' }
  ]
};

console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║  🔍 LORAGENT GITHUB DOMAIN DNS VERIFICATION MONITOR                           ║
║  Host: ${CONFIG.hostname.padEnd(61)} ║
║  Target Value: ${CONFIG.expectedValue.padEnd(55)} ║
║  Expires: ${CONFIG.expiryDate.padEnd(60)} ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

async function checkResolver(resolver) {
  const r = new dns.Resolver();
  r.setServers([resolver.ip]);

  try {
    const records = await r.resolveTxt(CONFIG.hostname);
    const flat = records.flat();
    const matched = flat.some(val => val.trim() === CONFIG.expectedValue);

    return {
      name: resolver.name,
      status: matched ? 'MATCH' : 'MISMATCH',
      values: flat,
      ok: matched
    };
  } catch (err) {
    return {
      name: resolver.name,
      status: 'NOT_FOUND',
      code: err.code || err.message,
      values: [],
      ok: false
    };
  }
}

async function checkCloudflareDoH() {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(CONFIG.hostname)}&type=TXT`,
      { headers: { accept: 'application/dns-json' } }
    );
    const data = await res.json();
    const answers = (data.Answer || [])
      .filter(a => a.type === 16)
      .map(a => a.data?.replace(/^"|"$/g, ''));
    const matched = answers.some(val => val.trim() === CONFIG.expectedValue);

    return {
      name: 'Cloudflare DoH (API)',
      status: matched ? 'MATCH' : (answers.length > 0 ? 'MISMATCH' : 'NOT_FOUND'),
      values: answers,
      ok: matched
    };
  } catch (err) {
    return {
      name: 'Cloudflare DoH (API)',
      status: 'ERROR',
      code: err.message,
      values: [],
      ok: false
    };
  }
}

async function run() {
  console.log('📡 Testing DNS propagation across global recursive resolvers...\n');

  const tasks = [...CONFIG.resolvers.map(r => checkResolver(r)), checkCloudflareDoH()];
  const results = await Promise.all(tasks);

  let anyMatched = false;
  results.forEach(res => {
    let icon = '⏳';
    let detail = '';

    if (res.status === 'MATCH') {
      icon = '✅';
      detail = `[OK] Matches "${CONFIG.expectedValue}"`;
      anyMatched = true;
    } else if (res.status === 'MISMATCH') {
      icon = '⚠️ ';
      detail = `[Mismatch] Found: ${JSON.stringify(res.values)}`;
    } else {
      detail = `[Pending] Record not found yet (${res.code || 'NXDOMAIN/ENODATA'})`;
    }

    console.log(`  ${icon} ${res.name.padEnd(30)} ${detail}`);
  });

  console.log('\n────────────────────────────────────────────────────────────────────────────────');
  if (anyMatched) {
    console.log('🎉 Record has begun propagating! You can proceed to GitHub Organization settings');
    console.log('   and click "Verify" on your custom domain.');
  } else {
    console.log('ℹ️  The record is not yet active on checked DNS resolvers.');
    console.log('   1. Ensure the TXT record is saved in Cloudflare Dashboard.');
    console.log('   2. Subdomain input: "_gh-Lorapok-o.loragent"');
    console.log('   3. TXT Value:       "f697b6ac08"');
    console.log('   4. Cloudflare DNS updates typically take 1-5 minutes to broadcast.');
    console.log('   Run `npm run verify:dns` to test again.');
  }
  console.log('────────────────────────────────────────────────────────────────────────────────\n');
}

run();
