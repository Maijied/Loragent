# Loragent v2.0 — Universal Agent Management, Auto-Discovery & Ingestion System

> **Goal**: Evolve Loragent into a fully autonomous CLI-driven platform that can **discover** agents across your entire PC, **ingest** external projects via URL to auto-generate custom agents, **secure** all credentials via a centralized vault, and provide **professional-grade documentation** for installation and publishing.

---

## 1. System Architecture & New Directory Structure

The Loragent repository will be restructured to cleanly separate the core framework from its content (agents, skills, rules, MCPs).

```text
loragent/                              # Root
├── face/                              # FACE Layer — User Interface
│   └── cli/
│       ├── index.js                   # Main CLI entry (commander)
│       ├── commands/                  # CLI command implementations
│       │   ├── create.js              # loragent create agent|skill|mcp|rule
│       │   ├── sync.js                # loragent sync (global push/pull)
│       │   ├── discover.js            # [NEW] loragent discover (PC-wide scan)
│       │   ├── analyze.js             # [NEW] loragent analyze <URL>
│       │   ├── install.js             # loragent install (into a workspace)
│       │   └── server.js              # loragent server (start MCP)
│       └── templates/                 # Scaffolding templates (.hbs)
├── pulse/                             # PULSE Layer — Background Processes
│   └── daemon/
│       └── state-watcher.js           # Background state monitor
├── lore/                              # LORE Layer — Domain Logic
│   ├── models/                        # Domain models (Agent, Skill, Rule, MCP, Source)
│   ├── auth/                          # [NEW] Secure Cred Vault integration
│   └── ingest/                        # [NEW] URL analysis and AST generation
├── port/                              # PORT Layer — External Interfaces
│   └── mcp/
│       └── server.js                  # MCP server exposing Loragent tools
├── loom/                              # LOOM Layer — Orchestration & DI
│   ├── di.js                          # Dependency injection container
│   ├── automations/                   # Automated workflows
│   └── steer/                         # Agent handoff routing rules
├── agents/                            # Core Agent Repository (165+ agents)
│   └── boss/
│       ├── SKILL.md                   # Agent prompt
│       └── manifest.json              # Machine-readable metadata
├── registry/                          # Global discovery registry
│   ├── sources.json                   # Registered project scan sources
│   ├── pc-inventory.json              # [NEW] Map of all discovered assets on the PC
│   └── sync-manifest.json             # Last sync state (hashes, timestamps)
└── docs/                              # [NEW] Professional Documentation Suite
    ├── installation/                  # Step-by-step install guides
    ├── architecture/                  # LLDP and system design
    ├── publishing/                    # How to publish MCPs and agents
    └── security/                      # Credential management guide
```

---

## 2. Core Features & CLI Commands

### A. The Auto-Discovery Engine (`loragent discover`)
Instead of hardcoding paths, Loragent will dynamically scan the entire PC to build a massive inventory of every AI asset.
- **Scans directories:** `~/.cursor`, `~/.claude`, `~/.agents`, `~/.kiro`, `~/.gemini`, and all connected projects in the user's workspace.
- **Identifies:** `SKILL.md` files, `mcp.json`/`mcp_config.json` files, `.mdc` rules, and `AGENTS.md` files.
- **Action:** Builds `registry/pc-inventory.json`. 
- **Contextual Injection:** When working in a specific project, Loragent can query this inventory and automatically pull in the exact agents, skills, and rules needed for that project's stack (e.g., pulling React agents for a Next.js project).

### B. URL-Based Ingestion & Generation (`loragent analyze <URL>`)
When the user provides a GitHub URL or project path, Loragent acts as an "Oracle":
1. **Clone/Fetch:** Downloads the target repository into a temporary sandbox.
2. **System Analysis:** Analyzes the architecture, dependencies (`package.json`, `Cargo.toml`, etc.), and file structures.
3. **Identify Key Needs:** Determines what agents and skills are required to manage this specific codebase (e.g., realizing it's a Python/Django app needing a Python expert agent and a Postgres database skill).
4. **Auto-Generate:** Dynamically creates new Loragent agents, skills, and MCP configurations tailored specifically to that project.
5. **Install:** Injects these newly minted assets into the project's `.agents/` directory.

### C. Master Sync Pipeline (`loragent sync`)
Synchronizes all discovered and generated assets across the ecosystem.
- Normalizes discovered agents into the Loragent `manifest.json` format.
- Merges MCP configurations into `unified-mcp-registry.json`.
- Distributes finalized assets back out to global IDE directories (`~/.skills`, `~/.claude/skills`, `~/.config/Code/User/mcp.json`, etc.).
- Platform-aware: Automatically handles path differences between Linux, macOS, and Windows.

---

## 3. Security & Authentication: Secure Credential Vault Integration

Loragent v2.0 completely drops hardcoded `.env` files and plaintext secrets, deeply integrating with the existing `/secure-cred-vault` located at `~/.cred/` (or equivalent dynamic path).

**How it works:**
1. **LORE Auth Module:** The `lore/auth/` module wraps the `cred` CLI tool.
2. **Agent Execution:** When an agent needs an API key (e.g., GitHub Token for URL ingestion, OpenAI key for generation), it requests it by category and key name:
   ```javascript
   // Loragent automatically executes:
   const token = execSync('cred get github pat').toString().trim();
   ```
3. **MCP Security:** The Loragent MCP server will fetch required credentials from the vault at runtime before establishing connections to external services.
4. **User Prompting:** If a required credential is missing from the vault, Loragent halts and instructs the user: `"Credential missing. Please run 'cred set github pat' to continue."`

---

## 4. Publishing the MCP & Agents

Loragent acts as the central hub for the user's entire digital empire. 

**How to Install (User Flow):**
1. User runs `loragent install --global`.
2. Loragent sets up the CLI globally via `npm link` or an OS-level binary.
3. Loragent runs an initial `discover` to map the user's PC.
4. Loragent symlinks its unified MCP server into the user's preferred IDEs (Cursor, Claude, VSCode).

**How to Publish the MCP:**
The `mcp/server.js` (PORT layer) exposes Loragent's capabilities to AI IDEs. 
- **Local Publishing:** `loragent sync` automatically writes the Loragent MCP server configuration into `~/mcp.json` and `~/.claude/mcp.json`.
- **Remote Publishing (Future):** The MCP server can be containerized (Docker) or deployed via Cloudflare Workers (using the `cloudflare-mcp` patterns) to allow remote agents to utilize Loragent's capabilities.

---

## 5. Professional Documentation Architecture

The `docs/` directory will be structured for deployment to a professional documentation site (e.g., using VitePress, MkDocs, or Docusaurus).

- **`docs/index.md`**: The Loragent Manifesto & 108-Agent Mega-Agency overview.
- **`docs/installation/`**:
  - `quick-start.md`: Global installation and first PC scan.
  - `ide-setup.md`: Configuring Cursor, Claude, and VSCode to use Loragent MCP.
- **`docs/usage/`**:
  - `url-ingestion.md`: How to use `loragent analyze <URL>` to auto-generate agents.
  - `auto-discovery.md`: How Loragent maps the PC and routes skills.
- **`docs/security/`**:
  - `secure-cred-vault.md`: Comprehensive guide on the encrypted credential vault.
- **`docs/development/`**:
  - `lldp-architecture.md`: Deep dive into FACE, PULSE, LORE, PORT, and LOOM.
  - `creating-agents.md`: Manifest formats and SKILL.md requirements.

---

## 6. Implementation Phasing

**Phase 1: Foundation & Discovery Engine**
- Build the `loragent discover` command to replicate the PC-wide bash scan using Node.js.
- Implement OS-aware path resolution.

**Phase 2: Secure Cred Vault Integration**
- Build the `lore/auth/vault.js` module.
- Update all existing scripts to strip plaintext secrets and query the vault.

**Phase 3: The "Oracle" URL Ingestion Engine**
- Build `loragent analyze <URL>`.
- Integrate AST parsing and dependency analysis to auto-generate `manifest.json` and `SKILL.md` files for new projects.

**Phase 4: Synchronization & Publishing**
- Finalize `loragent sync`.
- Automate the injection of the Loragent MCP into all discovered IDE configurations.

**Phase 5: Professional Documentation**
- Write the complete Markdown suite in `docs/`.
- Set up a static site generator configuration (e.g., VitePress) for professional rendering.

---

> [!NOTE]
> **Approval Request:** This plan incorporates URL-based auto-generation, PC-wide asset discovery, Secure Cred Vault integration, and a professional docs architecture. No code will be written until this plan is approved.

---

## 7. Global Skill Expansions (UI/UX & Advanced MCPs)

To align Loragent with state-of-the-art coding agents in 2026, the ecosystem will natively bundle top-tier UI/UX and web development workflows.

**A. UI/UX Specialist Agent**
- Dedicated agent (`ui-ux-specialist`) focused on React, Tailwind, fluid typography, and deep accessibility (WCAG) compliance.
- Employs modern aesthetics (glassmorphism, curated HSL palettes, micro-animations).
- Native integration with the `chrome-devtools` MCP for live debugging.

**B. Turnkey MCP Integrations**
Pre-configured, out-of-the-box MCP server setups in `src/mcp/configs/`:
- **Composio**: Toolkits for Jira, GitHub, Slack to handle agent workflows and design handoffs.
- **Firecrawl**: Advanced web scraping for automated research and context ingestion.
- **Frontend Design**: Anthropic's frontend-design MCP for Figma-to-code workflows and design token extraction.

**C. Zen Comprehensive Review**
- Full orchestration capability using the `/zen-comprehensive-review` skill.
- Automated multi-model (Opus, Codex, Gemini) consensus review for Loragent updates, ensuring security, performance, and best practices.
