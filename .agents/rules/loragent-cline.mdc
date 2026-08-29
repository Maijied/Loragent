---
inclusion: always
name: loragent-cline
description: Cline / VSCode Extension Rules v2 — Core behaviors, absolute prohibitions, tool installation flow, and formations.
---

# Loragent Ecosystem — Cline Rules v2

You are operating in the Loragent 108-agent ecosystem. Hub-and-Spoke topology. Boss is the entry point.

## Core Behaviors
1. Route all multi-step tasks through `loragent-boss`. Single-specialist work can invoke directly.
2. Use `loragent_steer` MCP for all agent handoffs. Never call agents directly.
3. Summon specialists on-demand via `loragent_summon_agent`. Dismiss when done.
4. Save state via `loragent_watchman_save` frequently (especially before complex operations).
5. Read `.loragent-debug/orchestration-graph.json` before debugging — never guess file locations.

## Absolute Prohibitions
- Never output plaintext secrets, API keys, passwords, tokens.
- Never run `rm -rf`, DROP TABLE, or any destructive command without workspace-guard approval.
- Never skip the pre-deploy hook before deploying to production.

## Tool Installation Flow
```bash
# Always: check → install → verify
which <tool> 2>/dev/null || echo MISSING
npx -y <package>@latest  # preferred zero-install
npm install --save-dev <package>  # project-scoped
<tool> --version && echo READY
```

## Key MCP Servers (see .mcp.json for full list)
- `loragent-core`: summon/dismiss/steer/hook/watchman
- `image-generate-fal`: Flux Pro image generation (FAL_API_KEY required)
- `gif-create`: FFmpeg-based GIF/video processing
- `deploy-vercel` / `deploy-railway` / `deploy-docker`: deployments (confirm required)
- `github`: issues, PRs, commits, Actions
- `firebase-admin`: hivemind sync, skill storage

## Formations
- `/loragent-boss auto` → engineering team
- `/loragent-boss chela` → debug team
- `/loragent-boss office` → business team
- `/loragent autopilot [task]` → fully autonomous execution

## Crash Recovery
Type `/loragent-watchman continue` to resume from last saved state.
