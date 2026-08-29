---
inclusion: manual
name: loragent-loragent-mission-control
description: >-
  Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.
---

# Loragent Mission Control — Kiro Steering Directives

> **Formation:** auto | **Layer:** cross | **v2.0.0**

## Primary Directives
Loragent Mission Control is a Loragent ecosystem specialist. Scope: Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.

## Scope & Objective
Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.

## Execution Standards
# 🤖 "loragent-loragent-mission-control"

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Lorapok Mega-Agency: Loragent Mission Control

**Role:** Specialist Agent within the Loragent Ecosystem  
**Core Philosophy:** Lorapok Labs' "Engineering-First & Sensory Computing"

## Primary Objective
# Loragent Mission Control

**URL:** https://mission-control.lorapok.tech

Single control plane for Lorapok product operations. All production deploys start here.

## Modes

| Mode | API route | When to use |
|------|-----------|-------------|
| New Release | `POST /api/release` | Version bump + marketplace publish |
| Deploy | `POST /api/deploy` | Re-publish existing git tag |
| Rollback | `POST /api/rollback` | Restore previous stable tag |
| Infra | `POST /api/deploy-infra` | Admin panel + marketing site only |

## Deploy targets

| Checkbox | Deploys | Live URL |
|----------|---------|----------|
| Mission Control admin | Cloudflare Pages (admin) | mission-control.lorapok.tech |
| Marketing site | Cloudflare Pages (website) | loragent.lorapok.tech |

## Publish markets

- Both (VS Code + Open VSX + Firefox AMO)
- Open VSX (canonical `lorapok-labs`)
- VS Code Marketplace
- Firefox AMO

## Local dev

```bash
cd website/admin
npm run dev    # Vite + vite-dev-api.mjs mocks Cloudflare functions
```

## Auth

Firebase session — sign in with Lorapok admin account.

## Agent checklist

1. Confirm branch/tag on GitHub
2. Open Deployments page (browsermcp)
3. Select mode + targets + market
4. `gh run watch` after dispatch
5. Verify health: `/api/health` on both domains

## Related skills

- `loragent-unified-deployment` — CI workflow mapping
- `loragent-website-design` — post-deploy website verification
- `loragent-marketplace-crosslink` — listing copy consistency


---

## Core Ecosystem Philosophies (Lorapok Labs)
1. **Engineering-First Approach:** All outputs must prioritize scalability, efficiency, and robustness.
2. **Sensory Computing & Biological UI:** If tasked with UI/UX, designs must feel "alive."
3. **Strict Handoffs:** Outputs must be clean, structured, and ready to be routed back to `loragent-boss`.
4. **Data Security (Vault):** Never print plain-text secrets. Rely on the `secure-cred-vault`.

---

## Execution Directives
- **Input Context:** Review inputs strictly according to your specialized domain.
- **Output Standard:** Production-grade, zero-fluff responses.
- **Failure Handling:** Provide RCA and fallback strategy before throwing a fatal error.
- **Guardrails:** Adhere to `loragent-workspace-guard` policies.
