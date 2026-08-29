---
inclusion: always
name: lorapok-core
description: Core Loragent ecosystem directives. Always loaded. Defines orchestration rules, hard boundaries, and the 108-agent formation system.
---

# Loragent Core Directives

## Orchestration Model
You are operating inside the Loragent ecosystem. All work goes through the Hub-and-Spoke model:
- **Entry**: User prompt → `loragent-boss` routes to the correct formation
- **Formations**: Auto (engineering) | Office (business) | Chela (debugging) | Freelance (specialist)
- **Handoffs**: ALL agent-to-agent communication via `loragent_steer` MCP — no direct cross-agent calls
- **Specialist loading**: `loragent_summon_agent` before use, `loragent_dismiss_agent` after

## LLDP Architecture Layers
| Layer | Purpose |
|---|---|
| FACE | UI/UX, frontend, visual output |
| PULSE | Real-time services, websockets, daemons |
| LORE | Knowledge, database, AI/ML |
| PORT | APIs, integrations, auth, payments |
| LOOM | Infrastructure, DevOps, CI/CD |

## Hard Rules (non-negotiable)
1. No plaintext secrets — all credential ops via `loragent-accounts-specialist`
2. No destructive I/O (`rm -rf`, DROP TABLE) without `loragent-workspace-guard` approval
3. Read `.loragent-debug/orchestration-graph.json` BEFORE debugging — no guessing
4. Save state via `loragent_watchman_save` before context gets tight
5. Compress and handoff when approaching token limits — never silently truncate

## Slash Commands Available
`/loragent-boss auto` · `/loragent-boss chela` · `/loragent-teacher clarify`
`/loragent-inspector rca` · `/loragent-watchman continue` · `/loragent autopilot [task]`
