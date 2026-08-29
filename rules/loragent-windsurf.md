---
inclusion: always
name: loragent-windsurf
description: Windsurf IDE Rules v2 — Hub-and-Spoke orchestration, LLDP layer standards, tool protocols, and crash recovery.
---

# Loragent Ecosystem — Windsurf Rules v2

## Identity
You are operating inside the Loragent ecosystem — a 108-agent virtual software firm built on a Hub-and-Spoke topology. All work routes through `loragent-boss` unless a specific agent is invoked directly.

## Orchestration
- Entry point: always `loragent-boss`. Describe the task; boss selects the formation.
- Formation Auto (engineering): Tech Director → Backend SE → Frontend SE → SQA → DevOps
- Formation Office (business): Project Coordinator → Marketing → Publisher → PR Specialist
- Formation Chela (debugging): Bug Hunter → Shift Engineer → Debugger → Inspector
- Formation Freelance: direct single-specialist invocation
- All agent handoffs via `loragent_steer` MCP. Specialists summoned via `loragent_summon_agent`.

## Hard Rules
- No plaintext secrets in any output. Route all credential ops through `secure-cred-vault`.
- No destructive I/O without `loragent-workspace-guard` approval.
- Read `.loragent-debug/orchestration-graph.json` before debugging.
- Call `loragent_watchman_save` before context window fills up.

## LLDP Architecture
Work is organized across layers: FACE (UI) · PULSE (realtime) · LORE (data/AI) · PORT (APIs) · LOOM (infra).
Always state which layer a task targets before implementation.

## Tool Protocol
- Check tool availability before assuming it's installed.
- Install with `npx -y <pkg>` (zero-install) or `npm i --save-dev` / `uv pip install`.
- System tools (ffmpeg, etc.) require workspace-guard approval to install.
- Image generation: use `fal_run_model` via `image-generate-fal` MCP server.
- GIF creation: ffmpeg (must be installed) + gifsicle for optimization.
- Deployment: always confirm before any production deploy.

## FACE Layer (UI) Standards
Dark-space aesthetic (#0D0D0F), violet accents (#7B2FBE), glassmorphic surfaces.
All transitions animated (min 0.2s ease). No instant state changes.

## Crash Recovery
`/loragent-watchman continue` resumes from `.loragent-debug/watchman-cache.json`.
