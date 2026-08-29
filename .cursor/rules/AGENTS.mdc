---
name: loragent-claude-memory
description: Claude Code extended memory layer and enterprise orchestration directives for the Loragent ecosystem.
---

# Loragent — Claude Code Extended Memory & Enterprise Orchestration

> [!NOTE]
> **Lorapok Labs Official Asset**
> Compatible with all LLDP-supported AI IDEs (Antigravity, Cursor, Claude Code, Windsurf, Roo, VS Code).

## 🧠 Memory Architecture (3-Layer)

**Layer 1 — Project Root** (`CLAUDE.md` + `AGENTS.md`): Always loaded. Core directives, slash commands, hard rules.

**Layer 2 — Agent Skills** (`skills/*/SKILL.md`, `agents/*/SKILL.md`): Loaded on demand via `/loragent:<slug>` or `@<slug>`. Each file is scoped to one role. Do not load all 174 at once.

**Layer 3 — Session State** (`.loragent-debug/watchman-cache.json`): Ephemeral. Resume with `/loragent-watchman continue`.

## 🔄 Auto Memory Notes Pipeline
When you write a significant solution, new pattern, or novel fix:
1. Do NOT forget it — hand it to `loragent-gold-collector` for extraction.
2. Gold Collector scrubs PII/secrets and emits an abstract `idea.md`.
3. `loragent-skill-creator` writes a new `SKILL.md` from the idea.
4. `loragent-database-updater` pushes to Firebase hivemind.

## 🔒 Tool Permissions & Execution Standards

| MCP Tool | Permission | When |
|---|---|---|
| `loragent_summon_agent` | auto | Boss needs a specialist |
| `loragent_dismiss_agent` | auto | Specialist task complete |
| `loragent_steer` | auto | Agent-to-agent handoff |
| `loragent_trigger_hook` | auto | Lifecycle events |
| `loragent_watchman_save` | auto | State checkpoint |
| `loragent_image_generate` | auto | Creative/visual tasks |
| `loragent_deploy` | **confirm** | Any deployment action |
| `loragent_git_push` | **confirm** | Remote git operations |
| Destructive bash (`rm -rf`, drops) | **BLOCK** | Always — route to workspace-guard |

## 🪝 Lifecycle Hooks
Hooks defined in `hooks/hooks.json` and `.agents/hooks/hooks.json`. Active:
- `pre-commit` → `loragent-sqa` lint + type-check
- `post-task` → `loragent-watchman` state save
- `pre-deploy` → `loragent-devops` build verification
- `check-done` → `loragent-chorki` continuous autopilot verification

## ⚡ Skills Invocation Examples
```bash
/loragent:boss           # activate orchestrator, describe your task
/loragent:image-generate # generate image via Fal.ai/Replicate
/loragent:gif-create     # create animated GIF via FFmpeg
/loragent:deploy         # deploy to Vercel/Railway/Docker
/loragent:tools-install  # install npm/pip/composer packages
/loragent:watchman       # crash recovery / resume session
```

## 📉 Progressive Disclosure (Token Budget)
When total skill context would exceed 40K tokens:
1. Keep only `boss`, `watchman`, `workspace-guard`, `spidernet`, `teacher` resident.
2. All others must be summoned/dismissed per task.
3. `loragent-cache-collector` prunes stale context automatically.

---

## 1. Dynamic Orchestration Engine
The `loragent-boss` serves as the central intelligent routing hub. Upon receiving user input, the `loragent-teacher` strictly normalizes requirements. The Boss then synthesizes the optimal execution matrix:

1. **Auto Team Matrix**: For standard software architecture. Delegates exclusively to `loragent-tech-director`, `loragent-backend-se`, `loragent-frontend-se`, `loragent-sqa`, and `loragent-cicd-specialist`.
2. **Enterprise Office Matrix**: For full-scale business initialization. Delegates to `loragent-project-coordinator`, `loragent-marketing-strategy-manager`, `loragent-publisher`, and `loragent-pr-specialist`.
3. **Freelance Isolation**: For highly specialized singular workflows. Delegates to specific domain experts (e.g., `loragent-logo-designer`, `loragent-3d-designer`, `loragent-wrangler-specialist`).
4. **Chela Debugging Protocol**: For mission-critical bug hunting and VCS resolution. Delegates to `loragent-bug-hunter`, `loragent-shift-engineer`, and `loragent-git-specialist`.

## 2. Global Telemetry & Self-Improvement Loop
- **Continuous Learning**: All structural mutations, prompt optimizations, and anomaly resolutions MUST be transmitted to the centralized Firebase telemetry layer.
- **The Telemetry Synchronizer**: `loragent-database-updater` aggregates successful workflows and synchronizes them to the Firebase global state.
- **Collective Memory Retrieval**: Before initiating complex architectural changes, agents MUST query the Firebase collective memory repository to retrieve historical telemetry and prevent regression.

## 3. MCP Lazy-Loading & Context Pruning
- **Summon**: To preserve optimal token bandwidth, only the Core Operations Matrix remains resident. The Boss MUST strictly utilize the `loragent_summon_agent` MCP to load specialized agents into memory on-demand.
- **Dismiss**: Upon task completion, agents MUST be explicitly unmounted via `loragent_dismiss_agent`.
- **Steer**: Agents MUST utilize the `loragent_steer` MCP for strict, logged handoffs.
- **Hooks**: Agents MUST utilize the `loragent_trigger_hook` MCP to execute lifecycle events (e.g., `pre-commit`, `deploy-retry`, `check-done`) securely.
- **State**: The `loragent_get_state` MCP MUST be queried to verify the current execution context.

## 4. Enterprise Professionalism & Security Compliance
- **Strict Handoffs**: Sub-agents MUST return structured payloads directly to the Boss. Unauthorized cross-agent communication is prohibited.
- **Zero-Trust Credential Vault**: Credentials are stored with AES-256 machine-encryption in `.env` and injected into child processes dynamically. Emitting plaintext secrets is a critical violation.
- **Cache Optimization (Token Sniper)**: `loragent-cache-collector` utilizes AST pruning and diff-only memory compression to minimize token burn and accelerate processing.
- **Workspace Guard**: The `loragent-workspace-guard` continuously monitors and blocks destructive I/O operations (e.g., `rm -rf`, `wrangler delete`, `gh repo delete`, `az group delete`) lacking explicit user authorization.

## 5. Agnostic Framework Compatibility
- The Loragent protocols are framework-agnostic. Distributions via NPM, PIP, or Composer are natively supported. Full interoperability with Claude Code, Cursor, Codex, Windsurf, and Antigravity IDEs is guaranteed.

## 6. Command Directives (Slash Commands)
Loragent exposes advanced routing directives. The `loragent-watchman` maintains an active execution cache for fault tolerance.
- **/loragent-watchman continue**: Resumes execution from the precise `.loragent-debug/watchman-cache.json` state.
- **/loragent-boss auto**: Forces the Auto-Team matrix initialization.
- **/loragent-boss chela**: Forces the Chela Debugging protocol.
- **/loragent-teacher clarify**: Mandates a strict requirements-gathering phase.
- **/loragent-inspector rca**: Initiates a comprehensive Root Cause Analysis.
- **/loragent autopilot [task description]**: The universal automation entrypoint. It iteratively invokes `steer` and `summon` MCP tools and validates completion with `check-done`.

## 7. Global Debugging & Orchestration Graph
- **Orchestration Mapping**: The `loragent-watchman` persistently updates a real-time structural map and active error state matrix at `.loragent-debug/orchestration-graph.json`.
- **First-Step Debugging Directive**: Before attempting anomaly resolution, agents MUST parse `.loragent-debug/orchestration-graph.json` to extract exact file paths and error telemetry. Heuristic guessing of file locations is strictly forbidden.
