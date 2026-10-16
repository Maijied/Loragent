---
name: loragent-github-domain-verifier
description: Autonomous GitHub custom domain, organization verification (_gh-*-o), and Cloudflare DNS automation specialist with multi-resolver propagation checking.
---

# 🤖 loragent-github-domain-verifier

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Loragent GitHub Domain Verifier

Automates and verifies custom domains, apex domains, and organization-approved domain verification challenges (`_gh-<org>-o`) for GitHub Pages and GitHub Enterprise/Organization settings. Integrates directly with Cloudflare DNS API using zero-trust credential vault encryption and validates global propagation across recursive resolvers.

## Verification Workflow

```
[ GitHub Domain Challenge (Hostname + Token) ]
                       │
                       ▼
   [ loragent-domain-verify / Cloudflare DNS API ]
 (Extracts zone & authenticates via TiTi Vault PIN)
                       │
                       ▼
       [ TXT Record Deployed to Cloudflare ]
  (_gh-<org>-o.<subdomain>.<domain> -> <challenge_token>)
                       │
                       ▼
   [ Multi-Resolver Global Propagation Audit ]
(Cloudflare 1.1.1.1, Google 8.8.8.8, Quad9 9.9.9.9, DoH)
                       │
                       ▼
    [ GitHub Verification Ready & Auto-Confirm ]
```

## CLI Commands

```bash
# Check propagation of existing record
node bin/loragent-domain-verify.js check _gh-Lorapok-o.loragent.lorapok.tech f697b6ac08

# Deploy TXT record to Cloudflare DNS
node bin/loragent-domain-verify.js create _gh-Lorapok-o.loragent.lorapok.tech f697b6ac08

# Complete end-to-end deploy & verification
node bin/loragent-domain-verify.js auto-verify _gh-Lorapok-o.loragent.lorapok.tech f697b6ac08

# List active TXT verification records
node bin/loragent-domain-verify.js list

# Remove expired verification token
node bin/loragent-domain-verify.js delete _gh-Lorapok-o.loragent.lorapok.tech
```

## Credential & Security Architecture

- **Zero-Trust PIN Manager:** In-memory authorization PIN resolution via `src/lore/auth/pin-manager.js` and `.cred-vault-passphrase`.
- **Vault Decryption:** Transient decryption of symmetric AES-256 vault (`credentials.json.gpg`) without writing plaintext to disk.
- **Scope Isolation:** Cloudflare DNS management scope restricted to target zone (`lorapok.tech`).

## Troubleshooting & Verification Matrix

| Error / Symptom | Root Cause | Fix Protocol |
|---|---|---|
| `ENODATA` / `NXDOMAIN` | Record not yet submitted or cached negative response | Run `check` against Cloudflare primary `1.1.1.1` and flush resolver cache. |
| Verification Token Expired | GitHub token validity passed 7 days | Re-issue verification code on GitHub and execute `create` with new token. |
| Cloudflare Auth Error | Missing API credentials or expired OAuth scope | Ensure vault is unlocked with master PIN or export `CLOUDFLARE_API_KEY` and `CLOUDFLARE_API_EMAIL`. |
| Subdomain Duplication | Full FQDN repeated in host field | Cloudflare auto-appends zone; enter subdomain prefix or use CLI tool to format automatically. |

## Related Specialists
- `loragent-deploy`
- `loragent-cloudflare-mail-master`
- `loragent-accounts-specialist`
- `loragent-workspace-guard`
