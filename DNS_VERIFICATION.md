# DNS Verification for Loragent Custom Domain

This document records the DNS verification requirements and step-by-step instructions for verifying the custom domain **`loragent.lorapok.tech`** under the **Lorapok** GitHub organization (`_gh-Lorapok-o`).

---

## 📋 Verification Details

| Parameter | Value |
|---|---|
| **Domain Name** | `loragent.lorapok.tech` |
| **Zone / Apex Domain** | `lorapok.tech` |
| **DNS Nameservers** | `mariah.ns.cloudflare.com`<br>`rory.ns.cloudflare.com` |
| **Record Type** | `TXT` |
| **Hostname / Subdomain** | `_gh-Lorapok-o.loragent.lorapok.tech` |
| **Cloudflare Host Input** | `_gh-Lorapok-o.loragent` *(or full hostname)* |
| **TXT Record Content / Value** | `f697b6ac08` |
| **TTL** | `Auto` (or `3600` / 1 hour) |
| **Proxy Status** | DNS Only *(Grey Cloud — standard for TXT records)* |
| **Target Organization** | GitHub Org: `Lorapok` |
| **Cloudflare Record ID** | `c826803ab2b42c0e4b8c541a4692a698` |
| **Status** | ✅ **Active & Propagated** |
| **Issued Date** | October 16, 2026 |
| **Expiration Date** | October 23, 2026 (7-day validity window) |

> [!NOTE]
> The TXT record was deployed via Cloudflare API. Public resolvers (Cloudflare 1.1.1.1, Google 8.8.8.8 / 8.8.4.4) already return the matching verification token `f697b6ac08`.

---

## 🛠️ Step-by-Step Configuration Guide

### 1. Cloudflare DNS Dashboard (Primary Provider)

Since `lorapok.tech` nameservers are hosted on Cloudflare:

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Select the account: **Lorapok Facility** (`f049faaf2f67549f5c58837479596a4a`).
3. Select the zone: **`lorapok.tech`**.
4. In the left sidebar, navigate to **DNS** &rarr; **Records**.
5. Click **Add record**:
   - **Type**: `TXT`
   - **Name**: `_gh-Lorapok-o.loragent`  
     *(Cloudflare will automatically append `.lorapok.tech` to form `_gh-Lorapok-o.loragent.lorapok.tech`)*
   - **Content**: `f697b6ac08`
   - **TTL**: `Auto`
6. Click **Save**.

---

## 🧪 Real-Time Verification & Propagation Check

### Automated Verification Script (Recommended)

Run the built-in Loragent DNS monitoring tool:

```bash
npm run verify:dns
# or directly:
node scripts/check-dns-verification.mjs
```

This script queries 5 global recursive DNS resolvers (Cloudflare 1.1.1.1, Cloudflare 1.0.0.1, Google 8.8.8.8, Google 8.8.4.4, Quad9 9.9.9.9) and Cloudflare's DoH (DNS-over-HTTPS) API to report the exact propagation status.

### Manual CLI Inspection Commands

#### 1. Using `dig` (Linux/macOS)
```bash
# Query default system resolver
dig TXT _gh-Lorapok-o.loragent.lorapok.tech +short

# Query Cloudflare authoritative resolver
dig @1.1.1.1 TXT _gh-Lorapok-o.loragent.lorapok.tech +short

# Query Google DNS resolver
dig @8.8.8.8 TXT _gh-Lorapok-o.loragent.lorapok.tech +short
```

#### 2. Using Cloudflare DNS-over-HTTPS API (curl)
```bash
curl -s -H "accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=_gh-Lorapok-o.loragent.lorapok.tech&type=TXT" | jq
```

#### 3. Using `nslookup` (Cross-Platform)
```bash
nslookup -type=TXT _gh-Lorapok-o.loragent.lorapok.tech 1.1.1.1
```

---

## 🕒 Propagation Timeline

- **Cloudflare Edge Nodes**: Usually updates within **1 to 5 minutes**.
- **Global Public Resolvers (Google, Quad9, ISPs)**: Typically **15 to 30 minutes**.
- **Maximum Worst-Case TTL Propagation**: Up to **72 hours** depending on local ISP DNS caching.

---

## ✅ Completing Verification in GitHub

Once the DNS verification script confirms the record has propagated:

1. Navigate to the GitHub Organization settings:
   - URL: `https://github.com/organizations/Lorapok/settings/domains` (or repository Pages settings).
2. Locate the domain: **`loragent.lorapok.tech`**.
3. Click **Verify** or **Check DNS**.
4. GitHub will query `_gh-Lorapok-o.loragent.lorapok.tech` for the value `f697b6ac08`.
5. Upon successful verification, a green **Verified** badge will appear.

---

## 🚨 Troubleshooting

| Issue | Cause | Resolution |
|---|---|---|
| `NXDOMAIN` / `ENODATA` | Record has not been created yet or entered incorrectly | Check Cloudflare DNS records list for `_gh-Lorapok-o.loragent`. |
| Mismatched hostname | Subdomain entered with duplicated domain (e.g., `_gh-Lorapok-o.loragent.lorapok.tech.lorapok.tech`) | In Cloudflare, enter only `_gh-Lorapok-o.loragent` in the Name field. |
| Verification expired | Passed 7-day window after October 23, 2026 | Re-initiate verification in GitHub to obtain a new challenge token and update the TXT record. |
| Quotation mark issues | Some DNS editors add escaped quotes `\"...\"` | In Cloudflare, enter raw text `f697b6ac08` without wrapping quotation marks. |
