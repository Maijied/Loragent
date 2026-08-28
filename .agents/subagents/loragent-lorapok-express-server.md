---
name: "loragent-lorapok-express-server"
description: "Skill for Express REST API in server.js, model guards, sessions, and packages/sdk consumers."
---

# 🤖 "loragent-lorapok-express-server"

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Lorapok Mega-Agency: Lorapok Express Server

**Role:** Specialist Agent within the Loragent Ecosystem  
**Core Philosophy:** Lorapok Labs' "Engineering-First & Sensory Computing"

## Primary Objective
# Lorapok Express Server Skill

## Overview

`server.js` exposes the Lorapok REST API (default port `3847`) for web and multi-client apps via `@lorapok/sdk`.

## Real endpoints

| Method | Route | Notes |
|--------|-------|-------|
| GET | `/health` | Status + version |
| GET | `/api/models?view=usable\|paid\|all` | Validated catalog views |
| POST | `/api/models/refresh` | Bypass cache + clear failures |
| POST | `/api/chat` | Requires `message`; optional `model` (guarded) |
| POST | `/api/generate` | Code generation |
| POST | `/api/analyze` | Analyze code |
| POST | `/api/debug` | Debug code |
| GET | `/api/files`, `/api/files/tree`, `/api/files/read` | Workspace |
| POST | `/api/files/generate` | Generate into file |
| GET/POST | `/api/git/*` | Git status/branches/log/commit |
| POST | `/agent/single`, `/agent/multi` | Agent runs |
| GET/PUT | `/api/settings` | Settings; PUT model guarded |
| DELETE | `/api/sessions/:sessionId` | Session cleanup |

## Rules

- Never serve models via raw `getAllKnownModels()` alone
- Use `canSelectModel` before accepting client model IDs
- Log with `lib/logger`; CORS via `CORS_ORIGIN`
- Document contracts in `Docs/api/REST.md` and `Docs/api/MODELS.md`
- Add/adjust tests in `tests/api.test.js`

## Adding an endpoint

1. Validate body/query → call agent/service → JSON response  
2. Prefer `asyncHandler` + `sendError`  
3. Update Docs + express skill + api tests  


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
