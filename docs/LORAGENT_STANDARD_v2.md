# Loragent Universal Agent Standard — v2.0
### Complete specification for agents, skills, steering, rules, MCP, hooks, and plugin packaging

> **Canonical reference.** All 108 agents, all tools, all editors. One document.
> Last revised: 2026-08-29 | Repo: github.com/Maijied/Loragent

---

## 0. The Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AI IDE / Editor Layer                             │
│  Claude Code  Cursor  Kiro  Windsurf  Cline  Roo  Codex  Copilot   │
│  Antigravity  Devin   Zed   Aider     Amp    Jules  JetBrains…     │
└───────────┬──────────┬──────────┬────────────┬────────────┬────────┘
            │ CLAUDE.md│ .mdc     │ .kiro/     │ AGENTS.md  │.windsurfrules
            │ SKILL.md │ rules    │ steering   │            │.clinerules
            │          │          │            │            │.roomodes
            ▼          ▼          ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    loragent-boss  (Entry Point)                      │
│          Routes to one of 4 Formations via loragent_steer           │
├──────────────┬──────────────┬──────────────┬────────────────────────┤
│  AUTO TEAM   │    OFFICE    │    CHELA     │      FREELANCE         │
│  (engineering│  (business)  │  (debugging) │    (specialist)        │
│  + DevOps)   │              │              │                        │
├──────────────┴──────────────┴──────────────┴────────────────────────┤
│              > 5 parallel agents → loragent-spidernet               │
├─────────────────────────────────────────────────────────────────────┤
│  PERMANENT RESIDENTS (never dismissed):                              │
│  boss · spidernet · teacher · watchman · workspace-guard            │
├─────────────────────────────────────────────────────────────────────┤
│                    MCP Server Layer (.mcp.json)                      │
│  loragent-core  github  image-generate-fal  gif-create  deploy-*   │
│  firebase  database-*  browser-automation  slack-notify  git-ops    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. File Type Reference — What Every Editor Reads

| File / Location | Format | Who reads it | Scope | Notes |
|---|---|---|---|---|
| `AGENTS.md` (root) | Plain Markdown, no YAML required | **28+ editors** — Codex, Cursor, Copilot, Gemini CLI, Windsurf, Devin, Aider, Zed, Amp, Jules, JetBrains Junie, Antigravity, … | Project-wide, always | Linux Foundation Agentic AI Foundation standard. Keep under 35 lines. Max 32 KiB total (Codex concatenates root→cwd). |
| `CLAUDE.md` (root) | Markdown, first line `@AGENTS.md` | Claude Code only | Project-wide, always | Imports AGENTS.md, adds Claude-specific memory layers, skill invocation examples, token budget rules. |
| `skills/*/SKILL.md` | Markdown with YAML frontmatter | Claude Code, Codex, Copilot, any SKILL.md-compatible agent | Per-skill, on demand | Anthropic Agent Skills spec. The canonical source of truth for each agent. Invoked as `/loragent:<slug>`. |
| `.kiro/steering/*.md` | Markdown, YAML frontmatter required (first line) | Kiro only | Conditional by `inclusion:` | Three modes: `always` (loaded every session), `fileMatch` + `fileMatchPattern` (loaded when matching file is open), `manual` (referenced with `#slug` in Kiro chat). |
| `.cursor/rules/*.mdc` | Markdown with YAML frontmatter (`description`, `globs`, `alwaysApply`) | Cursor | Glob-scoped or always | `alwaysApply: true` = loaded every request. `globs` = load only when matching file is in context. |
| `.windsurfrules` | Plain Markdown | Windsurf | Always | Full project rules. No YAML. Keep actionable. |
| `.clinerules` | Plain Markdown | Cline | Always | Same as Windsurf — full rules, no YAML. |
| `.roomodes` | JSON (`{ customModes: [...] }`) | Roo Code | Mode-select per session | Each mode: `slug`, `name`, `roleDefinition`, `customInstructions`, `groups`. |
| `.mcp.json` (root) | JSON (`{ mcpServers: {...} }`) | Claude Code, Cursor, Codex, Kiro, most MCP clients | Per-session, configures available tools | The cross-editor connector standard. Every external tool/API is an MCP server entry here. |
| `hooks/hooks.json` | JSON (Loragent hooks schema) | Claude Code (via plugin) | Lifecycle events | `pre_git_commit`, `post_agent_task`, `pre_mcp_tool_call`, `pre_bash_exec`, etc. |
| `.claude-plugin/plugin.json` | JSON | Claude Code plugin marketplace | Package-level | Bundles skills + hooks + .mcp.json as an installable unit. |

---

## 2. YAML Frontmatter Schema (SKILL.md)

Every `SKILL.md` file starts with this frontmatter block. All fields are authoritative — the compile script reads these to generate all editor-specific mirror files.

```yaml
---
name: loragent-<slug>              # kebab-case, matches folder name
description: >-                    # CRITICAL: write as a trigger condition.
  One dense paragraph: what this agent does and WHEN to invoke it.
  "Invoke when: [condition]. Do NOT invoke when: [condition]."
  This exact text is what auto-discovery uses in Claude Code / Codex.
version: 2.0.0
license: MIT
formation: auto                    # auto | office | chela | freelance | observer | orchestrator
layer: face                        # face | pulse | lore | port | loom | cross
tags:
  - lorapok
  - loragent
  - <domain-tag>
connectors:                        # MCP servers this agent is allowed to call (from .mcp.json)
  - loragent-core
  - github
  - image-generate-fal
allowed_tools:                     # Specific tool names within those MCP servers
  - loragent_summon_agent
  - loragent_steer
  - fal_run_model
requires_confirmation: false       # true if agent can trigger production/destructive operations
can_spawn_subagents: false         # true for boss and spidernet only
cost_tier: low                     # low | medium | high (guides boss on lazy-loading priority)
---
```

**Description field best practices:**
- Start with what it produces, not what it is: "Generates X" not "An agent that generates X"
- Include the trigger condition: "Invoke when: <condition>. Do NOT invoke when: <condition>"
- This is the field auto-discovery uses — treat it as a search query, not a title

---

## 3. LLDP Architecture Layer Reference

Every agent declares its layer. Layer determines which standards apply and which other agents it interacts with.

| Layer | Domain | Key agents | Standards applied |
|---|---|---|---|
| **FACE** | UI, components, visual output, animations | `frontend-se`, `ui-ux-professional`, `3d-designer`, `animator`, `responsive-system-designer` | Biological UI, dark-space palette, Framer Motion, accessibility, glassmorphic |
| **PULSE** | Real-time services, WebSockets, event streams, daemons | `backend-se` (ws parts), `devops`, `cache-collector` | High-availability patterns, event-driven, queue-based |
| **LORE** | Data, databases, AI/ML, knowledge, documents | `database-designer`, `ai-communicator`, `mathematician`, `algorithm-implementer` | Data integrity, schema-first, parameterized queries only |
| **PORT** | APIs, integrations, auth, payments, webhooks | `backend-se`, `api-chef`, `paymentguy`, `authentication-engineer`, `localization-expert` | REST/GraphQL contracts, typed requests, rate limiting, CORS |
| **LOOM** | Infrastructure, CI/CD, containers, cloud, deployment | `devops`, `docman`, `k8-expert`, `cloud-specialist`, `vercel-expert`, `railway-expert` | IaC, multi-stage Docker, non-root containers, health checks |
| **cross** | Orchestration, security, state, meta-agents | `boss`, `spidernet`, `watchman`, `workspace-guard`, `teacher`, `gold-collector` | Applies all layers' hard rules |

---

## 4. Formation System

### 4.1 Auto Team (Engineering)
```
loragent-boss
  └─► loragent-tech-director  (architecture + task breakdown)
        ├─► loragent-backend-se    (APIs, DB, PORT layer)
        ├─► loragent-frontend-se   (UI, FACE layer)
        └─► loragent-sqa           (testing + validation)
              └─► loragent-devops  (CI/CD, LOOM layer)
```

### 4.2 Office (Business)
```
loragent-boss
  └─► loragent-project-coordinator
        ├─► loragent-marketing-strategy-manager
        ├─► loragent-publisher
        └─► loragent-pr-specialist
```

### 4.3 Chela (Debugging)
```
loragent-boss
  └─► loragent-bug-hunter          (locate bug via orchestration graph)
        └─► loragent-shift-engineer  (apply minimal fix)
              └─► loragent-debugger  (verify + regression test)
                    └─► loragent-inspector  (RCA report)
```

### 4.4 Freelance (Specialist)
```
loragent-boss ─► [specific agent]  (direct invocation, no formation)
Examples: loragent-image-generate, loragent-3d-designer, loragent-logo-designer
```

### 4.5 Spidernet (Parallel ≥5 agents)
```
loragent-boss ─► loragent-spidernet ─► [DAG of agents running in parallel]
Spidernet manages dependency resolution, parallel execution, and result aggregation.
```

---

## 5. MCP Server Registry — All Connectors

Full config: `.mcp.json` at repo root. Summary:

| Server key | npm package / command | Purpose | Env vars needed | Confirm? |
|---|---|---|---|---|
| `loragent-core` | `node src/mcp/server.js` | Summon/dismiss/steer/hook/watchman | `FIREBASE_*` | No |
| `github` | `@modelcontextprotocol/server-github` | Repos, issues, PRs, Actions | `GITHUB_TOKEN` | No |
| `filesystem` | `@modelcontextprotocol/server-filesystem` | File read/write | — | No |
| `image-generate-fal` | `fal-mcp` | Flux Pro/Dev image generation | `FAL_API_KEY` | No |
| `image-generate-replicate` | `replicate-mcp` | Fallback image/video generation | `REPLICATE_API_TOKEN` | No |
| `gif-create` | `ffmpeg-mcp` | GIF/video processing (needs system ffmpeg) | — | No |
| `browser-automation` | `@playwright/mcp@latest` | E2E testing, scraping, screenshots | — | No |
| `deploy-vercel` | `@vercel/mcp-adapter` | Vercel deployments | `VERCEL_TOKEN` | **Yes (prod)** |
| `deploy-railway` | `railway-mcp` | Railway deployments | `RAILWAY_TOKEN` | **Yes (prod)** |
| `deploy-docker` | `docker-mcp` | Docker build/push/run | `DOCKER_*` | **Yes** |
| `database-postgres` | `@modelcontextprotocol/server-postgres` | PostgreSQL queries | `DATABASE_URL` | No |
| `database-mysql` | `mysql-mcp-server` | MySQL/MariaDB | `DB_HOST/USER/PASS` | No |
| `firebase-admin` | `firebase-mcp` | Firebase hivemind sync | `FIREBASE_*` | No |
| `slack-notify` | `@modelcontextprotocol/server-slack` | Team notifications | `SLACK_BOT_TOKEN` | No |
| `email-send` | `resend-mcp` | Transactional email | `RESEND_API_KEY` | No |
| `openapi-caller` | `@modelcontextprotocol/server-openapi-client` | Generic REST API calls | — | No |
| `git-ops` | `git-mcp` | Git operations | `GIT_AUTHOR_*` | **Yes (push)** |
| `web-search` | `@modelcontextprotocol/server-brave-search` | Web research | `BRAVE_API_KEY` | No |
| `skills-loader` | `skills-mcp -s ./skills` | Expose SKILL.md as MCP tools | — | No |

**To add a new connector:**
1. Add entry to `.mcp.json`
2. Add env var placeholder to `.env.example`
3. Store actual secret via `loragent-accounts-specialist` → `secure-cred-vault`
4. Add to `connectors:` frontmatter of any agent that uses it
5. Run `node scripts/enrich-skills.js --compile --mirrors` to propagate

---

## 6. Hook System

Hooks in `hooks/hooks.json` fire on Claude Code lifecycle events. Active hooks:

| Hook name | Trigger | Action | Blocking? |
|---|---|---|---|
| `pre-commit` | `pre_git_commit` | SQA lint + tests | Yes — blocks commit on fail |
| `post-task-watchman-save` | `post_agent_task` | Save state to watchman cache | No |
| `pre-deploy-verify` | `pre_mcp_tool_call` (deploy-*) | Build check + human confirm | Yes — blocks deploy on fail |
| `secret-leak-guard` | `pre_agent_output` | Scan for secret patterns | Yes — blocks output on match |
| `destructive-io-guard` | `pre_bash_exec` | Match destructive patterns | Yes — requires confirm |
| `token-budget-alert` | `context_token_threshold` | Alert at 75%, save at 90% | No (alert) / No (save) |
| `post-image-generate` | `post_mcp_tool_call` (image-*) | Cache URL + optional Slack | No |
| `post-deploy-notify` | `post_mcp_tool_call` (deploy-*) | Slack deploy notification | No |

---

## 7. Plugin Packaging

The Loragent ecosystem ships as an installable Claude Code plugin. Structure:

```
loragent/
├── .claude-plugin/
│   └── plugin.json        # name, version, description, author
├── skills/                # all SKILL.md files — auto-exposed as /loragent:<slug>
│   └── <slug>/SKILL.md
├── hooks/
│   └── hooks.json         # lifecycle hooks
├── .mcp.json              # connector registry shipped with the plugin
└── AGENTS.md / CLAUDE.md  # project instructions (not plugin components themselves)
```

**To install (user side):**
```
# Via Claude Code plugin marketplace (when published):
/plugin install loragent@Maijied

# Via direct repo install:
/plugin install github:Maijied/Loragent
```

**Marketplace distribution** (for publishing all 3 repos as one bundle):
Create `lorapok-marketplace` repo with `.claude-plugin/marketplace.json` listing each repo as a plugin source.

---

## 8. Tool Installation Standards

Every agent that needs an external tool follows this **check → install → verify** protocol before use:

```bash
# Step 1: Check (never assume availability)
command -v <tool> 2>/dev/null && echo "FOUND" || echo "NOT_FOUND"
node -e "require('<pkg>')" 2>/dev/null && echo "FOUND" || echo "NOT_FOUND"

# Step 2: Install (choose correct scope)
npx -y <pkg>@latest [args]         # zero-install — preferred for CLI tools
npm install --save-dev <pkg>        # project dev dep
npm install --save <pkg>            # project prod dep
npm install -g <pkg>                # global — requires workspace-guard approval
uv pip install <pkg>                # Python (preferred over pip)
pip install --user <pkg>            # Python fallback
composer require <vendor>/<pkg>     # PHP
apt-get install -y <pkg>            # system — requires workspace-guard approval
brew install <pkg>                  # system macOS — requires workspace-guard

# Step 3: Verify
<tool> --version && echo "READY" || (echo "INSTALL FAILED — cannot continue" && exit 1)
```

**Common tool → install reference:**

| Tool | Install | Verify |
|---|---|---|
| ffmpeg | `apt-get install -y ffmpeg` OR `brew install ffmpeg` | `ffmpeg -version` |
| gifsicle | `apt-get install -y gifsicle` OR `npx -y gifsicle-bin` | `gifsicle --version` |
| Vercel CLI | `npm i -g vercel` | `vercel --version` |
| Railway CLI | `npm i -g @railway/cli` | `railway --version` |
| Playwright | `npx playwright install` | `npx playwright --version` |
| Docker | system package | `docker --version` |
| uv (Python) | `curl -LsSf https://astral.sh/uv/install.sh | sh` | `uv --version` |

---

## 9. Cross-Editor Setup Checklist

Run this once per repo to set up all editor support:

```bash
# 1. Start MCP server (required for loragent MCP tools)
node src/mcp/server.js &

# 2. Install the skills-mcp so any MCP client can load SKILL.md files
npm install -g skills-mcp

# 3. Enrich all agents (first time or after adding new agents)
node scripts/enrich-skills.js --extract
# [review reports/agents.manifest.json — fill in human-review fields]
node scripts/enrich-skills.js --compile --mirrors  # writes SKILL.md + Kiro + Cursor mirrors
node scripts/enrich-skills.js --agent-index        # regenerate AGENT_INDEX.md + agent-index.json

# 4. Validate all agents pass schema
node scripts/enrich-skills.js --validate

# 5. Commit everything
git add -A
git commit -m "chore: apply Loragent Universal Standard v2 — all agents enriched"
git push
```

**Per-editor one-time setup:**

| Editor | Config needed | Notes |
|---|---|---|
| Claude Code | Add `.mcp.json` to project | `claude mcp add loragent-core node src/mcp/server.js` |
| Cursor | `.cursor/rules/*.mdc` auto-read | Run `--mirrors` to generate; restart Cursor |
| Kiro | `.kiro/steering/*.md` auto-read | Run `--mirrors` to generate |
| Windsurf | `.windsurfrules` auto-read | Replace existing with v2 file |
| Cline | `.clinerules` auto-read | Replace existing with v2 file |
| Roo Code | `.roomodes` auto-read | Replace existing with v2 file |
| Codex | `AGENTS.md` auto-read | Already in place |
| Devin / Aider / Zed / Amp | `AGENTS.md` auto-read | Already in place |

---

## 10. Slash Command Reference

| Command | Effect | Formation triggered |
|---|---|---|
| `/loragent-boss auto` | Force Auto Team | Tech Director → Backend → Frontend → SQA → DevOps |
| `/loragent-boss office` | Force Office | Coordinator → Marketing → Publisher → PR |
| `/loragent-boss chela` | Force Chela debug | Bug Hunter → Shift Engineer → Debugger → Inspector |
| `/loragent autopilot [task]` | Fully autonomous | Boss selects formation, runs to completion |
| `/loragent-teacher clarify` | Requirements phase | Teacher interviews user before boss routes |
| `/loragent-inspector rca` | Root cause analysis | Inspector produces structured RCA report |
| `/loragent-watchman continue` | Crash recovery | Resume from `.loragent-debug/watchman-cache.json` |
| `/loragent:image-generate` | Direct skill invoke | Fal.ai image generation |
| `/loragent:gif-create` | Direct skill invoke | FFmpeg GIF creation |
| `/loragent:deploy` | Direct skill invoke | Deploy to Vercel/Railway/Docker |
| `/loragent:tools-install` | Direct skill invoke | Install missing tools/packages |
| `/loragent:<slug>` | Direct skill invoke | Any skill by slug |

---

## 11. Security Architecture

### Credential Flow (Zero-Trust Vault)
```
Agent needs secret
    │
    ▼
loragent-accounts-specialist
    │
    ▼
secure-cred-vault (reads from .env / OS keychain / secret manager)
    │
    ▼
Returns secret to agent IN-MEMORY only — never logged, never in output
    │
    ▼
workspace-guard secret-leak-guard hook scans all output — blocks if pattern matched
```

### Workspace Guard Intercept Levels

| Risk | Examples | Action |
|---|---|---|
| 🔴 CRITICAL | `rm -rf`, DROP TABLE, `git push --force` | Block + typed confirmation required |
| 🟠 HIGH | Production deploy, global npm install, bulk delete | Warn + confirm |
| 🟡 MEDIUM | System package install, `git rebase` on shared | Log + confirm |
| 🟢 LOW | Everything else | Proceed |

---

## 12. Adding a New Agent — Workflow

1. Create `skills/<new-slug>/SKILL.md` using `AGENT_TEMPLATE.md` as source
2. Fill all frontmatter fields, especially `description` (trigger condition), `formation`, and `layer`
3. Write §§1–6 following the template sections
4. Add any new MCP connectors to `.mcp.json` + `.env.example`
5. Run `node scripts/enrich-skills.js --validate` — fix any errors
6. Run `node scripts/enrich-skills.js --compile --mirrors` — generates Kiro + Cursor mirrors
7. Run `node scripts/enrich-skills.js --agent-index` — updates `AGENT_INDEX.md`
8. Register in `agent-index.json` (auto-done by `--agent-index`)
9. If the agent belongs in a formation, update `loragent-boss`'s §4 formation logic
10. Commit: `git commit -m "feat(agent): add loragent-<slug>"`
