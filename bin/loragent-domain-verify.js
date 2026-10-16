#!/usr/bin/env node
/**
 * @file bin/loragent-domain-verify.js
 * Loragent GitHub Custom Domain Verification Tool
 *
 * Automates creating, auditing, querying, and verifying DNS TXT records
 * for GitHub custom domains and organization-approved domain verification (_gh-*-o).
 *
 * Usage:
 *   loragent-domain-verify check <hostname> [expectedToken]
 *   loragent-domain-verify create <hostname> <token> [domain]
 *   loragent-domain-verify auto-verify <hostname> <token> [domain]
 *   loragent-domain-verify list [domain]
 *   loragent-domain-verify delete <recordId|hostname> [domain]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dns from 'node:dns/promises';
import { getPinSync } from '../src/lore/auth/pin-manager.js';
import { decryptVault } from '../scripts/lib/cred-vault-gpg.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DEFAULT_ZONE_ID = '0c39bc637ec21e2aaace918b0c9ba5c1'; // lorapok.tech
const DEFAULT_DOMAIN = 'lorapok.tech';

function getCloudflareCredentials() {
  if (process.env.CLOUDFLARE_API_KEY && process.env.CLOUDFLARE_API_EMAIL) {
    return {
      email: process.env.CLOUDFLARE_API_EMAIL,
      key: process.env.CLOUDFLARE_API_KEY,
      zoneId: process.env.CLOUDFLARE_ZONE_ID || DEFAULT_ZONE_ID,
      source: 'environment'
    };
  }

  const pin = getPinSync();
  if (!pin) {
    throw new Error('Cleared authorization PIN not found. Provide CRED_PASSPHRASE or configure .cred-vault-passphrase.');
  }

  const vault = decryptVault(pin);
  if (!vault) {
    throw new Error('Failed to decrypt credential vault with resolved authorization PIN.');
  }

  const email = vault?.cursor?.cloudflare_account_email || 'mdshuvo40@gmail.com';
  const legacyTxt = vault?.legacy?.plaintext_credentials_txt_2026_08_16 || '';
  let cfKey = null;

  for (const line of legacyTxt.split('\n')) {
    if (line.trim().startsWith('cloudflare')) {
      cfKey = line.includes('=') ? line.split('=')[1].trim() : line.split(':')[1].trim();
      break;
    }
  }

  if (!cfKey) {
    throw new Error('Cloudflare access key not found in decrypted credential vault.');
  }

  const zoneId = vault?.cursor?.cloudflare_zone_lorapok_tech || DEFAULT_ZONE_ID;

  return {
    email,
    key: cfKey,
    zoneId,
    source: 'titi-vault'
  };
}

async function cfRequest(endpoint, { method = 'GET', body = null } = {}) {
  const creds = getCloudflareCredentials();
  const url = `https://api.cloudflare.com/client/v4${endpoint}`;
  const options = {
    method,
    headers: {
      'X-Auth-Email': creds.email,
      'X-Auth-Key': creds.key,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json();
  if (!data.success) {
    const msg = data.errors?.map(e => `[${e.code}] ${e.message}`).join(', ') || 'Unknown error';
    throw new Error(`Cloudflare API error: ${msg}`);
  }
  return data;
}

export async function checkPropagation(hostname, expectedValue = null) {
  const resolvers = [
    { name: 'Cloudflare (1.1.1.1)', ip: '1.1.1.1' },
    { name: 'Cloudflare Secondary (1.0.0.1)', ip: '1.0.0.1' },
    { name: 'Google (8.8.8.8)', ip: '8.8.8.8' },
    { name: 'Google Secondary (8.8.4.4)', ip: '8.8.4.4' },
    { name: 'Quad9 (9.9.9.9)', ip: '9.9.9.9' }
  ];

  const results = [];

  for (const resolver of resolvers) {
    const r = new dns.Resolver();
    r.setServers([resolver.ip]);
    try {
      const records = await r.resolveTxt(hostname);
      const flat = records.flat();
      const matched = expectedValue ? flat.some(v => v.trim() === expectedValue.trim()) : flat.length > 0;
      results.push({ name: resolver.name, status: matched ? 'MATCH' : 'MISMATCH', values: flat, ok: matched });
    } catch (err) {
      results.push({ name: resolver.name, status: 'PENDING', code: err.code || err.message, values: [], ok: false });
    }
  }

  // Also query Cloudflare DoH
  try {
    const dohRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=TXT`, {
      headers: { accept: 'application/dns-json' }
    });
    const dohData = await dohRes.json();
    const answers = (dohData.Answer || []).filter(a => a.type === 16).map(a => a.data?.replace(/^"|"$/g, ''));
    const matched = expectedValue ? answers.some(v => v.trim() === expectedValue.trim()) : answers.length > 0;
    results.push({ name: 'Cloudflare DoH API', status: matched ? 'MATCH' : (answers.length > 0 ? 'MISMATCH' : 'PENDING'), values: answers, ok: matched });
  } catch (err) {
    results.push({ name: 'Cloudflare DoH API', status: 'ERROR', code: err.message, values: [], ok: false });
  }

  return results;
}

export async function createRecord(hostname, content, zoneId = DEFAULT_ZONE_ID) {
  const payload = {
    type: 'TXT',
    name: hostname,
    content: content.trim(),
    ttl: 3600,
    comment: 'GitHub domain verification via Loragent'
  };

  const res = await cfRequest(`/zones/${zoneId}/dns_records`, {
    method: 'POST',
    body: payload
  });

  return res.result;
}

export async function listRecords(zoneId = DEFAULT_ZONE_ID) {
  const res = await cfRequest(`/zones/${zoneId}/dns_records?type=TXT&per_page=100`);
  return res.result;
}

export async function deleteRecord(recordIdOrHostname, zoneId = DEFAULT_ZONE_ID) {
  let id = recordIdOrHostname;
  if (!/^[a-f0-9]{32}$/.test(recordIdOrHostname)) {
    const records = await listRecords(zoneId);
    const target = records.find(r => r.name.toLowerCase() === recordIdOrHostname.toLowerCase());
    if (!target) throw new Error(`Record with hostname "${recordIdOrHostname}" not found.`);
    id = target.id;
  }
  const res = await cfRequest(`/zones/${zoneId}/dns_records/${id}`, { method: 'DELETE' });
  return res.result;
}

// CLI Execution
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  console.log(`
🛡️  Loragent GitHub Domain Verifier CLI
=======================================
Automates DNS TXT record deployment and global propagation verification.

Usage:
  node bin/loragent-domain-verify.js check <hostname> [token]
  node bin/loragent-domain-verify.js create <hostname> <token> [zoneId]
  node bin/loragent-domain-verify.js auto-verify <hostname> <token> [zoneId]
  node bin/loragent-domain-verify.js list [zoneId]
  node bin/loragent-domain-verify.js delete <id|hostname> [zoneId]

Examples:
  node bin/loragent-domain-verify.js check _gh-Lorapok-o.loragent.lorapok.tech f697b6ac08
  node bin/loragent-domain-verify.js create _gh-Lorapok-o.loragent.lorapok.tech f697b6ac08
  node bin/loragent-domain-verify.js auto-verify _gh-Lorapok-o.loragent.lorapok.tech f697b6ac08
`);
  process.exit(0);
}

(async () => {
  try {
    if (command === 'check') {
      const hostname = args[1];
      const token = args[2] || null;
      if (!hostname) {
        console.error('❌ Error: hostname is required (e.g. _gh-Lorapok-o.loragent.lorapok.tech)');
        process.exit(1);
      }
      console.log(`📡 Probing DNS propagation for ${hostname}...`);
      const results = await checkPropagation(hostname, token);
      let passed = 0;
      results.forEach(r => {
        const icon = r.status === 'MATCH' ? '✅' : (r.status === 'MISMATCH' ? '⚠️ ' : '⏳');
        console.log(`  ${icon} ${r.name.padEnd(28)} [${r.status}] ${r.values.length ? JSON.stringify(r.values) : (r.code || 'Pending')}`);
        if (r.ok) passed++;
      });
      console.log(`\nResult: ${passed}/${results.length} resolvers matched.`);
      process.exit(passed > 0 ? 0 : 1);
    } else if (command === 'create') {
      const hostname = args[1];
      const token = args[2];
      const zoneId = args[3] || DEFAULT_ZONE_ID;
      if (!hostname || !token) {
        console.error('❌ Error: hostname and token are required.');
        process.exit(1);
      }
      console.log(`⏳ Creating TXT record on Cloudflare for ${hostname}...`);
      const record = await createRecord(hostname, token, zoneId);
      console.log(`✅ Record successfully created! ID: ${record.id}`);
      console.log(`   Host:    ${record.name}`);
      console.log(`   Content: ${record.content}`);
      console.log(`   TTL:     ${record.ttl}`);
    } else if (command === 'list') {
      const zoneId = args[1] || DEFAULT_ZONE_ID;
      const records = await listRecords(zoneId);
      console.log(`\n📋 TXT Records in zone ${zoneId} (${records.length} found):`);
      records.forEach(r => {
        console.log(` • ${r.name.padEnd(45)} -> ${r.content.slice(0, 35)}... (ID: ${r.id})`);
      });
    } else if (command === 'delete') {
      const target = args[1];
      const zoneId = args[2] || DEFAULT_ZONE_ID;
      if (!target) {
        console.error('❌ Error: ID or hostname is required to delete.');
        process.exit(1);
      }
      console.log(`⏳ Deleting record ${target}...`);
      const res = await deleteRecord(target, zoneId);
      console.log(`✅ Deleted record ID: ${res.id}`);
    } else if (command === 'auto-verify') {
      const hostname = args[1];
      const token = args[2];
      const zoneId = args[3] || DEFAULT_ZONE_ID;
      if (!hostname || !token) {
        console.error('❌ Error: hostname and token are required.');
        process.exit(1);
      }
      console.log(`🚀 Step 1: Deploying TXT record to Cloudflare...`);
      const record = await createRecord(hostname, token, zoneId);
      console.log(`✅ Created record ID: ${record.id}`);

      console.log(`\n⏳ Step 2: Waiting for initial propagation (5 seconds)...`);
      await new Promise(r => setTimeout(r, 5000));

      console.log(`\n📡 Step 3: Verifying propagation...`);
      const results = await checkPropagation(hostname, token);
      let passed = 0;
      results.forEach(r => {
        const icon = r.status === 'MATCH' ? '✅' : '⏳';
        console.log(`  ${icon} ${r.name.padEnd(28)} [${r.status}]`);
        if (r.ok) passed++;
      });

      console.log(`\n✅ Verification deployment complete! Record is live on ${passed}/${results.length} tested resolvers.`);
    } else {
      console.error(`Unknown command "${command}". Run with --help for usage.`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Execution Error: ${err.message}`);
    process.exit(1);
  }
})();
