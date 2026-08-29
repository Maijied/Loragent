# 🧠 Loragent System Brain & State Registry

> **Lorapok Labs Official System State Record**  
> Last Updated: 2026-08-29 • System Architecture: LLDP v1.0.0

---

## 1. 📊 Ecosystem Metrics
- **Total Registered Agents:** 170 Agents
- **Functional Categories:** 22 Categories
- **Dynamic Formation Modes:** 4 Formations (`auto-team`, `office`, `freelance`, `chela`)
- **Unit Test Suite:** 15 Tests Passing (`tests/loragent-email.test.js`, `tests/sdk.test.js`)
- **Cloudflare Edge Worker:** Active (`https://mcp.lorapk-labs.workers.dev`) — 170 agents & MCP tools
- **SDK Package:** `loragent` (`sdk/index.js`, `sdk/client.js`, `sdk/boss.js`, `sdk/chorki.js`, `sdk/tools/cli-runner.js`, `sdk/durable/checkpoint.js`, `sdk/telemetry/tracer.js`)

---

## 2. 🏗️ LLDP Module Map
| Layer | Directory | Status | Primary Responsibilities |
|---|---|---|---|
| **FACE** | `face/cli/` | Verified | Commander.js CLI, slash command entrypoints, autopilot CLI |
| **PULSE** | `pulse/daemon/` | Verified | StateWatcher background daemon, telemetry heartbeat & tracing |
| **LORE** | `lore/models/` | Verified | Agent, Engine, and Platform data models, Chorki autonomous engine |
| **PORT** | `port/mcp/` & `port/mcp-cloudflare/` | Verified | Stdio and Cloudflare Edge MCP JSON-RPC 2.0 / SSE server, CLI tool runners |
| **LOOM** | `loom/` | Verified | Dependency injection container, durable checkpoints, `check-done` verification hook |

---

## 3. 🛠️ Platform Tool Runners & Safe CLI Execution
- **Automated Tool Runner:** `sdk/tools/cli-runner.js` (`executeCLI`)
- **Auto-Vault Credential Injection:** Automatically extracts `CLOUDFLARE_API_KEY`, `CLOUDFLARE_EMAIL`, `CLOUDFLARE_ACCOUNT_ID`, `GH_TOKEN`, and `NPM_TOKEN` from `cred` vault without exposing plaintext secrets.
- **Destructive Command Interceptor:** Enforces `loragent-workspace-guard` policies to prevent unauthorized file or database destructions.

---

## 4. 🌀 Chorki Autopilot & Durable Checkpointing
- **Continuous Loop Engine:** `loragent-chorki` (`sdk/chorki.js`, `lore/models/engine.js`, `face/cli/autopilot.js`)
- **Durable Checkpointing:** `sdk/durable/checkpoint.js` (`LoragentCheckpointEngine`) with step-level persistence and time-travel recovery.
- **Verification Hook:** `.agents/hooks/check-done.js` and `.agents/hooks/check-done.sh`
- **Observability:** `sdk/telemetry/tracer.js` (`LoragentTracer`) OpenTelemetry-compatible span tracker.

---

## 5. 🔐 Zero-Trust Security Enclave
- **Credential Backend:** GnuPG AES-256 encrypted vault (`/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg`)
- **PIN Protocol:** `src/lore/auth/pin-manager.js` with auto-passphrase enclave.
- **Workspace Guard:** Destructive command protection active (`loragent-workspace-guard`).
