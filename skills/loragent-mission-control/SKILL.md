---
name: loragent-mission-control
description: Operate Lorapok Mission Control admin panel — deployments, notices, mailbox, marketplace sync, and infra-only publishes.
---

# Loragent Mission Control

**URL:** https://cursor-dev.lorapok.tech

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
| Mission Control admin | Cloudflare Pages (admin) | cursor-dev.lorapok.tech |
| Marketing site | Cloudflare Pages (website) | cursor.lorapok.tech |

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
