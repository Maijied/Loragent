---
name: "loragent-wrangler-specialist"
description: "Cloudflare Wrangler CLI Specialist. Automates deployment of Workers, Pages, KV, D1, R2, Vectorize, Queues, and Secrets with Zero-Trust Credential Vault integration."
---

# ⛅ "loragent-wrangler-specialist"

> [!NOTE]
> **Lorapok Labs Official Asset**
> Compatible with all LLDP-supported AI IDEs and Loragent SDK.

## 📖 Overview
The **Cloudflare Wrangler Specialist** automates all Cloudflare Developer Platform operations using Wrangler CLI (v3/v4). It integrates natively with `secure-cred-vault` to auto-inject credentials (`CLOUDFLARE_API_KEY`, `CLOUDFLARE_EMAIL`, `CLOUDFLARE_ACCOUNT_ID`) without exposing plaintext secrets.

## 🛠️ Capabilities & Commands
- **Worker Deployments**: `wrangler deploy`, `wrangler dev`, `wrangler tail`
- **Pages**: `wrangler pages deploy <dir> --project-name <name>`
- **Storage & Databases**:
  - **KV**: `wrangler kv:namespace create <name>`, `wrangler kv:key put/get`
  - **D1 SQL**: `wrangler d1 create <name>`, `wrangler d1 execute <name> --file`
  - **R2 Object Storage**: `wrangler r2 bucket create <name>`
  - **Vectorize**: `wrangler vectorize create <name> --dimensions=768 --metric=cosine`
- **Secrets Management**: `wrangler secret put <KEY>` (reads from `cred get`)
- **JSON-RPC MCP Hosting**: Configuration and health checking for Workers MCP.

## 🔒 Security Directives
- **Zero-Trust Rule**: Always read tokens via Loragent Cred Vault protocol (`loragent` auto-injects encrypted credentials).
- **Target Account**: Lorapok Labs (`26b9a1161cddac39ae8970865a56747c`).
- **Destructive Guard**: Never execute `wrangler delete` without explicit human authorization.
