---
inclusion: auto
name: lorapok-tools
description: Tool installation, MCP connector usage, image generation, GIF creation, and deployment workflows. Auto-loaded when working with tools, media, or deployments.
---

# Loragent Tool & Connector Protocols

## Tool Installation Protocol (ALWAYS follow this order)

```bash
# 1. Check first — never assume
which <tool> || command -v <tool> || node -e "require('<pkg>')" 2>/dev/null || echo "NOT_FOUND"

# 2. Install by scope (workspace-guard approval for globals)
npx -y <pkg>@latest          # preferred for CLI invocations (zero-install)
npm i --save-dev <pkg>        # project dev dependency
uv pip install <pkg>          # Python (fastest, isolated)

# 3. Verify before proceeding
<tool> --version && echo "OK"
```

**System tool installs require workspace-guard confirmation first.**

## Image Generation

| Use case | Connector | Model | Call |
|---|---|---|---|
| Concept art, hero images | `image-generate-fal` | `fal-ai/flux-pro` | `fal_run_model` |
| Logo design | `image-generate-fal` | `fal-ai/flux-pro` | prompt: "vector logo, flat, clean..." |
| UI mockup backgrounds | `image-generate-fal` | `fal-ai/flux-dev` | faster, lower cost |
| Fallback if Fal down | `image-generate-replicate` | `black-forest-labs/flux-schnell` | `run_model` |

Always store output URL in watchman cache after generation.

## GIF / Animation Creation

```bash
# Require: ffmpeg installed (check first)
ffmpeg -version || (echo "MISSING: install ffmpeg" && exit 1)

# GIF from video source:
ffmpeg -i input.mp4 -vf "fps=12,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output.gif

# Optimize (install gifsicle if needed):
which gifsicle || npm install -g gifsicle-bin
gifsicle --optimize=3 --lossy=80 --colors 128 -o optimized.gif output.gif

# Slack GIF (max 2MB, <640px wide, <10s):
ffmpeg -i input.mp4 -vf "fps=10,scale=480:-1:flags=lanczos" -t 10 -loop 0 slack.gif
```

## Deployment

| Target | Connector | Confirm required | Key command |
|---|---|---|---|
| Vercel | `deploy-vercel` | ✅ production | `vercel deploy --prod` |
| Railway | `deploy-railway` | ✅ production | via MCP tool |
| Docker | `deploy-docker` | ✅ always | `docker build + push + run` |
| Preview | `deploy-vercel` | ❌ preview only | `vercel deploy` (no --prod) |

**Pre-deploy checklist (enforced by `pre-deploy-verify` hook):**
- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] No plaintext secrets in env diff
- [ ] Workspace-guard confirmed for production

## Browser Automation

```javascript
// Playwright via MCP — loragent-browser-automation-expert
// Install: npx playwright install
// Config: use headed: false in CI, headed: true for debug
```

## Connector Auth Reference

| Connector | Required env var | Where to set |
|---|---|---|
| Fal.ai | `FAL_API_KEY` | `.env` (via vault) |
| Replicate | `REPLICATE_API_TOKEN` | `.env` (via vault) |
| Vercel | `VERCEL_TOKEN` | `.env` (via vault) |
| Railway | `RAILWAY_TOKEN` | `.env` (via vault) |
| GitHub | `GITHUB_TOKEN` | `.env` (via vault) |
| Firebase | `FIREBASE_PROJECT_ID` + service account | `.env` (via vault) |

All secrets managed by `loragent-accounts-specialist` → `secure-cred-vault`.
Never echo or log raw values.
