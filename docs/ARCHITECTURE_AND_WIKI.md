# 📚 Loragent Master Wiki & Universal Architecture Manual

> **Lorapok Labs Official Technical Reference & Operations Manual**  
> *Universal 224-Agent Virtual Software Firm, Hub-and-Spoke Topology & Multi-IDE Orchestration System*  
> **Version:** 2.0.0 | **Catalog Size:** 250 Items (224 Agents, 20 MCPs, 6 Squad Formations) | **Protocol:** LLDP-5

---

## 📑 Table of Contents

1. [System Overview & Key Metrics](#1-system-overview--key-metrics)
2. [LLDP 5-Layer Architecture](#2-lldp-5-layer-architecture)
3. [The 6 Squad Formations](#3-the-6-squad-formations)
4. [Master CLI Commands & Tooling](#4-master-cli-commands--tooling)
5. [Universal PC Discovery & Stack Analyzer](#5-universal-pc-discovery--stack-analyzer)
6. [Web Ingest & Artifact Factory Pipeline](#6-web-ingest--artifact-factory-pipeline)
7. [MCP Server Registry & Cloudflare Edge](#7-mcp-server-registry--cloudflare-edge)
8. [Zero-Trust Security & Pre-Push Encryption](#8-zero-trust-security--pre-push-encryption)
9. [Multi-IDE Synchronization & Compatibility](#9-multi-ide-synchronization--compatibility)
10. [Verification, Telemetry & Watchman Recovery](#10-verification-telemetry--watchman-recovery)

---

## 1. System Overview & Key Metrics

Loragent is an autonomous virtual software engineering and operations firm. Operating on a **Hub-and-Spoke topology**, `loragent-boss` serves as the central intelligent routing hub, dynamically summoning specialists and dissolving context to operate within strict token budgets.

```mermaid
graph TD
    User([User Request / Slash Command]) --> Boss[loragent-boss / Orchestrator]
    Boss --> Teacher[loragent-teacher (Requirements Clarifier)]
    Teacher --> Formations{Select Formation Squad}
    
    Formations -->|Software Engineering| AutoTeam[Auto Team Squad Matrix]
    Formations -->|Business & PR| Office[Enterprise Office Squad]
    Formations -->|Debugging & RCA| Chela[Chela Debugger Squad]
    Formations -->|Specialized Solo| Freelance[Freelance Domain Experts]
    Formations -->|DAG Workflows| Spidernet[Spidernet Parallel DAG]
    Formations -->|Session Recovery| Observer[Watchman Recovery & Cache]

    AutoTeam --> MCP[Native & Edge MCP Server JSON-RPC]
    Office --> MCP
    Chela --> MCP
    Freelance --> MCP
    Spidernet --> MCP
    Observer --> MCP
```

### 📊 Ecosystem Inventory Matrix
* **Total Marketplace Items**: **250**
* **Autonomous Agents & Skills**: **224**
* **Native Model Context Protocol (MCP) Servers**: **20**
* **Formation Squad Presets**: **6**
* **Supported IDEs**: Cursor, Claude Code, Antigravity/Gemini, Windsurf, VS Code, Roo Code, Cline, Kiro.
* **Test Suites**: **44 Passing Suites (100% Green)**.

---

## 2. LLDP 5-Layer Architecture

The codebase adheres strictly to the **Lorapok Labs Design Pattern (LLDP)**:

| Layer | Directory | Purpose | Core Files & Modules |
|---|---|---|---|
| **FACE** | `face/cli/` | User-facing Command Line Interface (Commander.js), Autopilot triggers, interactive prompts | `face/cli/index.js`<br>`face/cli/commands/*.js`<br>`face/cli/autopilot.js` |
| **PULSE** | `pulse/daemon/` | Background processes, file watchers, process heartbeats, and state synchronizers | `pulse/daemon/state-watcher.js` |
| **LORE** | `lore/` | Domain intelligence, PC discovery, project tech stack analysis, and data models | `lore/services/pc-discovery.js`<br>`lore/services/project-analyzer.js`<br>`lore/models/agent.js` |
| **PORT** | `port/mcp/` | External communication, stdio JSON-RPC MCP server, Cloudflare Workers MCP edge gateway | `port/mcp/server.js`<br>`port/mcp-cloudflare/src/index.js` |
| **LOOM** | `loom/` | Dependency Injection container, multi-agent steering, DAG orchestration, and workflows | `loom/di.js`<br>`loom/steer/`<br>`loom/workflows/` |

---

## 3. The 6 Squad Formations

Loragent organizes its 224 agents into 6 specialized operational formations stored in `formations/*.json`:

```
formations/
├── auto-team.json            # Software engineering squad
├── office.json               # Business, marketing, legal, PR squad
├── freelance-isolation.json  # Specialist solo experts
├── chela-debugger.json       # RCA, bug triage, VCS repair squad
├── observer-recovery.json    # Watchman state cache & fault tolerance
└── orchestrator.json         # Spidernet parallel DAG coordinator
```

### 1. 🟢 Auto Team Matrix (`auto-team.json`)
* **Lead Agent:** `loragent-tech-director`
* **Core Squad:** `loragent-backend-se`, `loragent-frontend-se`, `loragent-sqa`, `loragent-devops`, `loragent-cicd-specialist`, `loragent-chorki`.
* **Objective:** Full-stack software architecture, API design, biological UI/UX, automated testing, and CI/CD pipelines.

### 2. 🏢 Enterprise Office Matrix (`office.json`)
* **Lead Agent:** `loragent-project-coordinator`
* **Core Squad:** `loragent-project-manager`, `loragent-marketing-strategy-manager`, `loragent-publisher`, `loragent-pr-specialist`, `loragent-hr`, `loragent-sales-executive`.
* **Objective:** Product roadmaps, launch PR, copy generation, marketing strategies, and store submissions.

### 3. 🔧 Freelance Isolation (`freelance-isolation.json`)
* **Lead Agent:** `loragent-boss`
* **Specialists:** 140+ targeted experts (`loragent-3d-designer`, `loragent-logo-designer`, `loragent-fastapi`, `loragent-wrangler-specialist`, `loragent-rust-expert`, etc.).
* **Objective:** Single-responsibility tasks loaded on-demand and dismissed immediately to conserve tokens.

### 4. 🔴 Chela Debugging Protocol (`chela-debugger.json`)
* **Lead Agent:** `loragent-bug-hunter`
* **Core Squad:** `loragent-shift-engineer`, `loragent-git-specialist`, `loragent-debugger`, `loragent-inspector`.
* **Objective:** Deep telemetry parsing, regression debugging, VCS conflicts, and root cause analysis (RCA).

### 5. 👁️ Observer & Recovery Protocol (`observer-recovery.json`)
* **Lead Agent:** `loragent-watchman`
* **Core Squad:** `loragent-workspace-guard`, `loragent-token-sniper`, `loragent-cache-collector`.
* **Objective:** Checkpointing session state in `.loragent-debug/watchman-cache.json`, AST context pruning, and crash recovery.

### 6. 🕸️ Spidernet DAG Matrix (`orchestrator.json`)
* **Lead Agent:** `loragent-spidernet`
* **Core Squad:** `loragent-teacher`, `loragent-boss`, `loragent-pipeline-checker`.
* **Objective:** Non-linear Directed Acyclic Graph (DAG) task execution and parallel agent workflows.

---

## 4. Master CLI Commands & Tooling

Loragent provides a unified CLI available globally via `loragent` or `node face/cli/index.js`:

```bash
# ── Asset Discovery & System Inventory ───────────────────────
loragent discover                     # Scans PC for all AI assets & writes pc-inventory.json
loragent discover --json              # Outputs raw JSON inventory

# ── Tech Stack Analysis & Squad Recommendation ───────────────
loragent analyze .                    # Analyzes current workspace
loragent analyze /path/to/project     # Analyzes target directory
loragent analyze https://github.com/org/repo  # Clones & analyzes remote repo

# ── Universal IDE Mirror Synchronization ─────────────────────
loragent sync                         # Synchronizes MCP, skills, rules to all IDEs

# ── Web Ingest & Artifact Generation ─────────────────────────
node scripts/ingest-url.js --url https://docs.stripe.com
node scripts/generate-artifact.js --type skill --name loragent-stripe
node scripts/generate-artifact.js --type bundle --spec ./specs/my-spec.json

# ── Marketplace & Roster Management ─────────────────────────
node scripts/generate-marketplace.js  # Updates registry/marketplace.json & AGENT_INDEX.md
node scripts/enrich-skills.js --compile --mirrors  # Compiles all IDE mirrors

# ── Autopilot & Server ───────────────────────────────────────
loragent autopilot "Build a REST API with authentication"
loragent server                       # Starts native stdio MCP server
```

---

## 5. Universal PC Discovery & Stack Analyzer

### `PCDiscovery` Engine (`lore/services/pc-discovery.js`)
Scans 12+ root locations across the machine, parsing:
* `SKILL.md` frontmatter from `.gemini/config/`, `.cursor/`, `.claude/`, `.agents/`, `.kiro/`, `.skills/`, `.codeium/`.
* `mcp.json` / `mcp_config.json` JSON-RPC tool endpoints.
* `.mdc` rules, `AGENTS.md`, `.cursorrules`, `.clinerules`, `.windsurfrules`.
* `.roomodes` custom mode configurations.
* Outputs consolidated telemetry to `registry/pc-inventory.json`.

### `ProjectAnalyzer` Engine (`lore/services/project-analyzer.js`)
Automatically inspects:
* **Node/TS:** `package.json`, `tsconfig.json` $\rightarrow$ React, Vue, Next.js, Express, Fastify, Tailwind, Prisma, Vitest.
* **Python:** `requirements.txt`, `pyproject.toml`, `Pipfile` $\rightarrow$ FastAPI, Django, Flask.
* **Rust:** `Cargo.toml` $\rightarrow$ Rust microservices and native modules.
* **PHP:** `composer.json` $\rightarrow$ Laravel framework and package dependencies.
* **Cloud & Infra:** `Dockerfile`, `docker-compose.yml`, `wrangler.toml`, `wrangler.jsonc` $\rightarrow$ Docker, Cloudflare Workers.

---

## 6. Web Ingest & Artifact Factory Pipeline

### `scripts/ingest-url.js`
1. **Fetch**: Retrieves HTML / Markdown / API definitions from any remote URL.
2. **Analyze**: Extracts tools, parameters, CLI commands, prerequisites, and authentication models via Claude API (with deterministic fallback parser).
3. **Generate**: Emits standard `SKILL.md`, `mcp-fragment.json`, `.kiro/steering/<slug>.md`, and `.cursor/rules/<slug>.mdc`.
4. **Register**: Auto-indexes the newly created artifact into `registry/marketplace.json`.

### `scripts/generate-artifact.js`
Generates artifacts conforming to `templates/artifact-spec.schema.json` across 7 modes:
* `skill` — Full SKILL.md with 7 standardized sections.
* `agent` — Agent specification with execution matrix.
* `mcp` — Standalone MCP connector definition.
* `steering` — Kiro IDE `#` steering rule.
* `rule` — Cursor `.mdc` rule.
* `formation` — Squad preset JSON.
* `bundle` — Complete artifact package.

---

## 7. MCP Server Registry & Cloudflare Edge

Loragent exposes all tools through the **Model Context Protocol (MCP)**:

### Local stdio Server (`port/mcp/server.js`)
```json
{
  "mcpServers": {
    "loragent-core": {
      "command": "node",
      "args": ["/mnt/NewVolume/Personal_Projects/loragent/port/mcp/server.js"],
      "env": {
        "LORAGENT_WORKSPACE": "/mnt/NewVolume/Personal_Projects/loragent"
      }
    }
  }
}
```

### Core MCP Tools Exposed
* `loragent_list_agents` — Query agents by formation, category, layer, or tags.
* `loragent_summon_agent` — Mounts specialist instructions dynamically into context.
* `loragent_dismiss_agent` — Unmounts specialist when task finishes.
* `loragent_steer` — Formal, logged handoff between pipeline agents.
* `loragent_trigger_hook` — Executes lifecycle events (`pre-commit`, `check-done`, `post-task`).
* `loragent_watchman_save` — Checkpoints execution context and step state.
* `loragent_get_state` — Retrieves active formation and error telemetry.

---

## 8. Zero-Trust Security & Pre-Push Encryption

Loragent strictly enforces a **Zero-Trust Plaintext Secret Policy**:
* **Vault Storage**: All machine credentials and API tokens are secured via the TiTi Cryptographic Vault (`cred`).
* **Pre-Commit Security Guard**: [`scripts/git-protect-hook.sh`](file:///mnt/NewVolume/Personal_Projects/cred/scripts/git-protect-hook.sh) intercepts commits, blocking unencrypted `.env`, `credentials.json`, `.pem`, and private keys.
* **Pre-Push Minification & Encryption Engine**: [`scripts/protect-and-minify.mjs`](file:///mnt/NewVolume/Personal_Projects/cred/scripts/protect-and-minify.mjs) minifies code and seals it in AES-256-GCM / 6D Hyperchaotic `.titi.enc` binary containers prior to remote push.
* **Local Plain Source Protection**: Clean source code remains safely stored in `.local_plain_backup` under `.gitignore` protection.

---

## 9. Multi-IDE Synchronization & Compatibility

When running `loragent sync` or `node scripts/universal-sync.js`, the platform synchronizes assets across all major AI code editors:

| Editor | Mirror Location | Asset Types |
|---|---|---|
| **Cursor** | `.cursor/rules/*.mdc`, `.cursor/mcp.json`, `~/.cursor/` | Rules, MCP servers |
| **Claude Code / Desktop** | `CLAUDE.md`, `~/.claude/skills/`, `claude_desktop_config.json` | Skills, MCP config |
| **Antigravity / Gemini** | `~/.gemini/config/skills/`, `~/.gemini/config/mcp_config.json` | Skills, MCP servers |
| **Windsurf** | `.windsurfrules`, `~/.codeium/windsurf/mcp_config.json` | Rules, MCP servers |
| **Cline** | `.clinerules`, `cline_mcp_settings.json` | Rules, MCP servers |
| **Roo Code** | `.roomodes` (7 custom autonomous modes) | Custom Modes |
| **Kiro** | `.kiro/steering/*.md` | Steering Directives |

---

## 10. Verification, Telemetry & Watchman Recovery

* **Watchman Cache**: State continuously journaled to `.loragent-debug/watchman-cache.json`.
* **Session Resume**: `/loragent-watchman continue` restores the exact pending step without token loss.
* **Orchestration Graph**: Error state matrix tracked in `.loragent-debug/orchestration-graph.json`.
* **Automated Verification**: `npm test` runs 44 automated test suites validating specifications, schemas, formations, hooks, and SDK components.

---
*Lorapok Labs © 2026 — Universal Multi-Agent Ecosystem*
