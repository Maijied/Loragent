# Cloudflare Email Routing Automation Guide for AI Agents

A complete blueprint for AI agents and developers to configure, automate, and manage custom domain email forwarding (e.g. `support@yourdomain.com ➔ personal@gmail.com`) using Cloudflare Email Routing API and secure credential injection.

---

## 1. Architectural Overview

```
[ Incoming Email to user@yourdomain.com ]
                 │
                 ▼
  [ Cloudflare Email Routing Engine ]
  (Validates MX / SPF DNS records)
                 │
                 ▼
  [ Cloudflare Routing Rules Matrix ]
  (Rule match: to == user@yourdomain.com)
                 │
                 ▼
  [ Forward Action ➔ personal@gmail.com ]
  (Delivered to verified destination address)
```

---

## 2. Prerequisites & Cloudflare Setup

Before interacting with the API, the following one-time requirements must be configured in Cloudflare:

### A. Domain & Zone ID
1. Add your custom domain (e.g. `yourdomain.com`) to Cloudflare DNS.
2. Retrieve your **Zone ID** from Cloudflare Dashboard (Overview page &rarr; right sidebar &rarr; **Zone ID**).

### B. Cloudflare DNS MX & SPF Records
Cloudflare automatically manages or requires these DNS records for Email Routing:
- **MX Records**:
  - `isaac.mx.cloudflare.net` (Priority 13)
  - `linda.mx.cloudflare.net` (Priority 57)
  - `amir.mx.cloudflare.net` (Priority 98)
- **SPF TXT Record**:
  - `v=spf1 include:_spf.mx.cloudflare.net ~all`

### C. Verified Destination Addresses
Cloudflare requires destination emails (e.g., `personal@gmail.com`) to be verified once:
1. In Cloudflare Dashboard: **Email** &rarr; **Email Routing** &rarr; **Destination addresses**.
2. Add the destination email and click the verification link sent to that inbox.

### D. Cloudflare API Credentials
Generate an API Token or use Global API Key:
- **API Token** with permissions: `Zone.Email Routing Rules:Edit`, `Zone.Zone:Read`
- Or **Global API Key** + **Cloudflare Account Email**.

---

## 3. Secure Credential Storage

Never store credentials in plaintext. Inject via environment variables or a local encrypted vault:

| Variable | Description | Example |
|---|---|---|
| `CLOUDFLARE_ZONE_ID` | Cloudflare DNS Zone ID | `a1b2c3d4e5f6...` |
| `CLOUDFLARE_API_KEY` | Cloudflare Global API Key or Token | `9a8b7c6d5e...` |
| `CLOUDFLARE_API_EMAIL` | Account Email (if using API Key) | `admin@yourdomain.com` |
| `CLOUDFLARE_DOMAIN` | Custom Domain | `yourdomain.com` |
| `CLOUDFLARE_FORWARD_TO`| Default Verified Destination Email | `personal@gmail.com` |

---

## 4. Complete Node.js Automation Script (`email-manager.js`)

Copy this script into any project to create, list, and delete email routing rules programmatically:

```javascript
#!/usr/bin/env node
/**
 * Cloudflare Email Routing CLI & Automation Script
 * =================================================
 * Enables programmatic management of custom domain email routing.
 *
 * Usage:
 *   node email-manager.js list
 *   node email-manager.js create support@yourdomain.com [dest@gmail.com]
 *   node email-manager.js delete support@yourdomain.com
 */

const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const API_KEY = process.env.CLOUDFLARE_API_KEY;
const API_EMAIL = process.env.CLOUDFLARE_API_EMAIL;
const DOMAIN = process.env.CLOUDFLARE_DOMAIN || 'yourdomain.com';
const DEFAULT_DESTINATION = process.env.CLOUDFLARE_FORWARD_TO;

if (!ZONE_ID || !API_KEY || (!API_EMAIL && !API_KEY.startsWith('Bearer'))) {
  console.error('❌ Error: Missing Cloudflare credentials in environment variables.');
  console.error('Please export CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_KEY, and CLOUDFLARE_API_EMAIL.');
  process.exit(1);
}

const authHeaders = API_KEY.startsWith('Bearer')
  ? { 'Authorization': API_KEY, 'Content-Type': 'application/json' }
  : { 'X-Auth-Email': API_EMAIL, 'X-Auth-Key': API_KEY, 'Content-Type': 'application/json' };

const BASE_URL = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/email/routing/rules`;

// 1. List All Active Routing Rules
async function listRules() {
  const res = await fetch(BASE_URL, { headers: authHeaders });
  const data = await res.json();
  if (!data.success) throw new Error(data.errors.map(e => e.message).join(', '));
  return data.result;
}

// 2. Create a Forwarding Rule
async function createRule(customAddress, destinationAddress = DEFAULT_DESTINATION) {
  const fullAddress = customAddress.includes('@') ? customAddress : `${customAddress}@${DOMAIN}`;

  const body = {
    name: `Rule: ${fullAddress}`,
    enabled: true,
    priority: 0,
    matchers: [{ type: 'literal', field: 'to', value: fullAddress }],
    actions: [{ type: 'forward', value: [destinationAddress] }]
  };

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.errors.map(e => e.message).join(', '));
  return data.result;
}

// 3. Delete a Forwarding Rule
async function deleteRule(ruleId) {
  const res = await fetch(`${BASE_URL}/${ruleId}`, {
    method: 'DELETE',
    headers: authHeaders
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.errors.map(e => e.message).join(', '));
  return data.result;
}

// CLI Command Parser
const args = process.argv.slice(2);
const command = args[0];

(async () => {
  try {
    if (command === 'list') {
      const rules = await listRules();
      console.log(`\n📬 Active Email Routing Rules for ${DOMAIN}:`);
      rules.forEach(r => {
        const from = r.matchers?.[0]?.value || 'any';
        const to = r.actions?.[0]?.value?.join(', ') || 'drop';
        const id = r.tag || r.id;
        console.log(` • [${r.enabled ? 'ACTIVE' : 'DISABLED'}] ${from} ➔ ${to} (ID: ${id})`);
      });
      console.log();
    } else if (command === 'create') {
      const addr = args[1];
      const dest = args[2] || DEFAULT_DESTINATION;
      if (!addr) {
        console.error('❌ Please specify the email address to create (e.g. support@yourdomain.com)');
        process.exit(1);
      }
      console.log(`⏳ Creating forwarding rule: ${addr} ➔ ${dest}...`);
      const rule = await createRule(addr, dest);
      console.log(`✅ Rule created! ID: ${rule.tag || rule.id}\n`);
    } else if (command === 'delete') {
      const target = args[1];
      if (!target) {
        console.error('❌ Please specify the email address or rule ID to delete');
        process.exit(1);
      }
      const rules = await listRules();
      const rule = rules.find(r => r.id === target || r.tag === target || r.matchers?.[0]?.value === target || r.matchers?.[0]?.value === `${target}@${DOMAIN}`);
      if (!rule) {
        console.error(`❌ No rule found matching "${target}"`);
        process.exit(1);
      }
      console.log(`⏳ Deleting rule: ${rule.tag || rule.id}...`);
      await deleteRule(rule.tag || rule.id);
      console.log(`✅ Rule deleted successfully!\n`);
    } else {
      console.log(`
Cloudflare Email Routing CLI
Usage:
  node email-manager.js list
  node email-manager.js create <address> [destination]
  node email-manager.js delete <address|id>
`);
    }
  } catch (err) {
    console.error(`❌ API Error: ${err.message}`);
    process.exit(1);
  }
})();
```

---

## 5. Step-by-Step Execution Plan for Any AI Agent

When an AI agent is asked to configure email routing in a new project:

1. **Step 1: Check Cloudflare Environment Credentials**:
   - Verify `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_API_KEY`, and `CLOUDFLARE_API_EMAIL` exist in `.env` or vault.
2. **Step 2: Place the Script**:
   - Save the script to `bin/email-manager.js` or `scripts/email-manager.js`.
3. **Step 3: Test Connection**:
   - Run `node bin/email-manager.js list` to confirm Cloudflare API authentication.
4. **Step 4: Create Desired Addresses**:
   - Run `node bin/email-manager.js create support@domain.com`
   - Run `node bin/email-manager.js create admin@domain.com`
5. **Step 5: Verify Deliverability**:
   - Send a test email from an external account (e.g. Gmail or Outlook) to `support@domain.com`.
   - Confirm delivery to the destination inbox.
