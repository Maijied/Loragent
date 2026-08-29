---
description: Loragent ecosystem core rules — orchestration model, hard security boundaries, formation system, MCP tool protocols.
globs: ['**/*']
alwaysApply: true
---

# Loragent — Core Cursor Rules

## Orchestration
- You are in the Loragent ecosystem. Route all multi-step work through `loragent-boss`.
- Invoke specialist agents with `/loragent:<slug>` or `@<agent-slug>`.
- ALL inter-agent communication uses `loragent_steer` MCP — never call agents directly.
- Summon specialists with `loragent_summon_agent`, dismiss after task with `loragent_dismiss_agent`.

## Hard Security Rules
- NEVER output plaintext secrets, tokens, passwords, or private keys in any response.
- NEVER run `rm -rf`, DROP TABLE, DELETE without workspace-guard confirmation.
- ALL credential operations route through `loragent-accounts-specialist` → `secure-cred-vault`.
- Read `.loragent-debug/orchestration-graph.json` before any debugging attempt.

## Code Standards
- TypeScript strict mode for all .ts/.tsx files
- ESLint + Prettier enforced — no manual formatting
- Inline comments on non-obvious logic only
- Test files alongside source (`*.spec.ts`, `*.test.ts`)
- No `console.log` in production code — use the project logger

## Formations (tell boss which to use)
- **Auto**: standard dev work → Tech Director + Backend SE + Frontend SE + SQA + DevOps
- **Office**: business launch → Project Coordinator + Marketing + Publisher + PR
- **Chela**: debugging → Bug Hunter + Shift Engineer + Debugger + Inspector
- **Freelance**: one-shot specialist work → direct agent invocation

## Crash Recovery
If context is lost or agent fails mid-task: `/loragent-watchman continue`
State is saved to `.loragent-debug/watchman-cache.json` automatically.
