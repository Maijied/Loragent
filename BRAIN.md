# 🧠 Loragent System Brain & State Registry

> **Lorapok Labs Official System State Record**  
> Last Updated: 2026-08-29 • System Architecture: LLDP v1.0.0

---

## 1. 📊 Ecosystem Metrics
- **Total Registered Agents:** 167 Agents
- **Functional Categories:** 22 Categories
- **Dynamic Formation Modes:** 4 Formations (`auto-team`, `office`, `freelance`, `chela`)
- **Unit Test Suite:** 11 Tests Passing (`tests/loragent-email.test.js`, `tests/sdk.test.js`)
- **Cloudflare Edge Worker:** Active (`https://mcp.lorapk-labs.workers.dev`)
- **SDK Package:** `loragent` (`sdk/index.js`, `sdk/client.js`, `sdk/boss.js`, `sdk/chorki.js`, `sdk/index.d.ts`)

---

## 2. 🏗️ LLDP Module Map
| Layer | Directory | Status | Primary Responsibilities |
|---|---|---|---|
| **FACE** | `face/cli/` | Verified | Commander.js CLI, slash command entrypoints, autopilot CLI |
| **PULSE** | `pulse/daemon/` | Verified | StateWatcher background daemon, telemetry heartbeat |
| **LORE** | `lore/models/` | Verified | Agent, Engine, and Platform data models, Chorki autonomous engine |
| **PORT** | `port/mcp/` & `port/mcp-cloudflare/` | Verified | Stdio and Cloudflare Edge MCP JSON-RPC 2.0 / SSE server |
| **LOOM** | `loom/` | Verified | Dependency injection container, workflows, `check-done` verification hook |

---

## 3. 🌀 Chorki Autopilot & Verification Hook Pipeline
- **Continuous Loop Engine:** `loragent-chorki` (`sdk/chorki.js`, `lore/models/engine.js`, `face/cli/autopilot.js`)
- **Verification Hook:** `.agents/hooks/check-done.js` and `.agents/hooks/check-done.sh`
- **Enforcement:** Verifies workspace files, runs automated test suites, checks syntax and builds before marking any autopilot task as complete.

---

## 4. 🔐 Zero-Trust Security Enclave
- **Credential Backend:** GnuPG AES-256 encrypted vault (`/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg`)
- **PIN Protocol:** `src/lore/auth/pin-manager.js` with auto-passphrase enclave.
- **Workspace Guard:** Destructive command protection active (`loragent-workspace-guard`).
