#!/usr/bin/env node

import fs from 'fs';
import os from 'os';
import path from 'path';

import { execSync } from 'child_process';
import { getPin } from '../src/lore/auth/pin-manager.js';

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

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help') {
    console.log(`
🚀 Loragent Email Manager (Cloudflare Email Routing)

Usage:
  loragent-email create <address> [destination]   Create a new email routing rule
  loragent-email list                             List all existing email routing rules
  loragent-email delete <address>                 Delete an email routing rule
  
Examples:
  loragent-email create support@${DOMAIN}
  loragent-email create billing@${DOMAIN} my-other-email@gmail.com
`);
    process.exit(0);
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
        console.error('❌ Failed to fetch rules:', data.errors);
        process.exit(1);
    }

    console.log('📋 Cloudflare Email Routing Rules:');
    for (const rule of data.result) {
        if (rule.matchers && rule.matchers.length > 0 && rule.actions && rule.actions.length > 0) {
            const match = rule.matchers[0].value;
            const action = rule.actions[0];
            const target = (action && action.value) ? action.value[0] : JSON.stringify(action);
            console.log(`   ${rule.enabled ? '✅' : '❌'} ${match} ➡️ ${target}`);
        }
    }
}

async function createRule(address, destination) {
    if (!address.includes('@')) {
        address = `${address}@${DOMAIN}`;
    }
    
    const target = destination || FORWARD_TO;
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/email/routing/rules`;
    
    const payload = {
        matchers: [{ type: 'literal', field: 'to', value: address }],
        actions: [{ type: 'forward', value: [target] }],
        enabled: true,
        name: `Loragent Auto-Generated: ${address}`,
        priority: 0
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'X-Auth-Email': API_EMAIL,
            'X-Auth-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!data.success) {
        console.error('❌ Failed to create rule:', data.errors);
        process.exit(1);
    }

    console.log(`✅ Successfully created email routing rule!`);
    console.log(`   ${address} ➡️ ${target}`);
}

if (command === 'list') {
    listRules().catch(console.error);
} else if (command === 'create') {
    const address = args[1];
    if (!address) {
        console.error(`❌ Please provide an email address to create (e.g., support@${DOMAIN})`);
        process.exit(1);
    }
    createRule(address, args[2]).catch(console.error);
} else if (command === 'delete') {
    const address = args[1];
    if (!address) {
        console.error('❌ Please provide an email address to delete');
        process.exit(1);
    }
    // TODO: implement delete
    console.log(`Deletion not yet implemented. Use Cloudflare Dashboard to delete ${address}.`);
} else {
    console.error(`❌ Unknown command: ${command}`);
    process.exit(1);
}
