#!/usr/bin/env node

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { getPin } from '../src/lore/auth/pin-manager.js';

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === '--help' || command === '-h') {
    console.log(`
🚀 Loragent Email Manager (Cloudflare Email Routing)

Usage:
  loragent-email create <address> [destination]   Create a new email routing rule
  loragent-email list                             List all existing email routing rules
  loragent-email delete <address>                 Delete an email routing rule
  
Examples:
  loragent-email create support@lorapok.tech
  loragent-email create billing@lorapok.tech my-other-email@gmail.com
`);
    process.exit(0);
}

async function getSecure(vaultPath) {
    const pin = await getPin();
    if (pin) {
        process.env.CRED_PASSPHRASE = pin;
    }
    
    try {
        return execSync(`cred get ${vaultPath} 2>/dev/null`, { encoding: 'utf8' }).trim();
    } catch {
        return null;
    }
}

const ZONE_ID = (await getSecure('cloudflare zone_id')) || (await getSecure('cursor cloudflare_zone_lorapok_tech'));
const API_KEY = (await getSecure('cloudflare api_key')) || (await getSecure('cursor cloudflare_global_api_key_ROTATE_ME'));
const API_EMAIL = (await getSecure('cloudflare api_email')) || (await getSecure('cursor cloudflare_account_email'));
const FORWARD_TO = (await getSecure('cloudflare forward_to')) || (await getSecure('cursor mail_forward_to'));
const DOMAIN = (await getSecure('cloudflare domain')) || 'lorapok.tech';

if (!ZONE_ID || !API_KEY || !API_EMAIL) {
    console.error('❌ Missing required Cloudflare credentials in the Secure Cred Vault.');
    console.error('👉 You MUST set these using the `cred` CLI command:');
    console.error('   cred set "cloudflare zone_id"');
    console.error('   cred set "cloudflare api_key"');
    console.error('   cred set "cloudflare api_email"');
    process.exit(1);
}

async function listRules() {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/email/routing/rules`;
    const response = await fetch(url, {
        headers: {
            'X-Auth-Email': API_EMAIL,
            'X-Auth-Key': API_KEY,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.errors.map(e => e.message).join(', '));
    }
    return data.result;
}

async function createRule(customAddress, destinationAddress = FORWARD_TO) {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/email/routing/rules`;
    
    // Ensure full address
    const fullAddress = customAddress.includes('@') ? customAddress : `${customAddress}@${DOMAIN}`;

    const body = {
        actions: [{ type: "forward", value: [destinationAddress] }],
        matchers: [{ field: "to", type: "literal", value: fullAddress }],
        name: `Loragent Rule: ${fullAddress}`,
        enabled: true,
        priority: 0
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'X-Auth-Email': API_EMAIL,
            'X-Auth-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!data.success) {
        throw new Error(data.errors.map(e => e.message).join(', '));
    }
    return data.result;
}

async function deleteRule(ruleId) {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/email/routing/rules/${ruleId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'X-Auth-Email': API_EMAIL,
            'X-Auth-Key': API_KEY,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.errors.map(e => e.message).join(', '));
    }
    return data.result;
}

try {
    if (command === 'list') {
        const rules = await listRules();
        console.log(`\n📬 Active Email Routing Rules for ${DOMAIN}:`);
        rules.forEach(r => {
            const matcher = r.matchers?.[0]?.value || 'any';
            const forward = r.actions?.[0]?.value?.join(', ') || 'drop';
            console.log(` - [${r.enabled ? 'ACTIVE' : 'DISABLED'}] ${matcher} ➔ ${forward} (ID: ${r.tag || r.id})`);
        });
    } else if (command === 'create') {
        const address = args[1];
        const dest = args[2] || FORWARD_TO;
        if (!address) {
            console.error('❌ Error: Please specify the email address to create (e.g. support or support@lorapok.tech)');
            process.exit(1);
        }
        console.log(`⏳ Creating forward rule for ${address} ➔ ${dest}...`);
        const rule = await createRule(address, dest);
        console.log(`✅ Forward rule created successfully! ID: ${rule.tag || rule.id}`);
    } else if (command === 'delete') {
        const address = args[1];
        if (!address) {
            console.error('❌ Error: Please specify the email address or rule ID to delete');
            process.exit(1);
        }
        const rules = await listRules();
        const rule = rules.find(r => r.tag === address || r.id === address || r.matchers?.[0]?.value === address || r.matchers?.[0]?.value === `${address}@${DOMAIN}`);
        if (!rule) {
            console.error(`❌ Error: No rule found matching "${address}"`);
            process.exit(1);
        }
        console.log(`⏳ Deleting rule ${rule.tag || rule.id}...`);
        await deleteRule(rule.tag || rule.id);
        console.log(`✅ Rule deleted successfully!`);
    } else {
        console.error(`❌ Unknown command: "${command}". Run "loragent-email help" for usage.`);
        process.exit(1);
    }
} catch (err) {
    console.error(`❌ API Error: ${err.message}`);
    process.exit(1);
}
