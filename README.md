<div align="center">
  
# 🤖 Loragent: The Universal Multi-Agent Ecosystem

**An enterprise-grade, universally compatible AI orchestration framework that transforms single-agent IDEs into a massive 108-agent virtual software firm.**

[![Version](https://img.shields.io/badge/version-1.0.0--master-blue.svg)]()
[![Compatibility](https://img.shields.io/badge/compatibility-Universal-success.svg)]()
[![Agents](https://img.shields.io/badge/agents-108%20Unique%20Personas-purple.svg)]()

</div>

---

## 🌍 Universal Compatibility
Loragent is completely **framework-agnostic**. It is designed to be injected into any project and is supported by **all AI coding agents in the world**. 
Whether you use **Claude Code**, **Cursor**, **Codex**, **Antigravity IDE**, **GitHub Copilot Workspace**, or any other LLM-powered editor, Loragent natively overrides their default behavior to enforce a highly structured, multi-agent workflow.

---

## 🧠 System Architecture
Loragent operates on a strict **Hub-and-Spoke** topology, completely replacing standard "guesswork" AI coding with a deterministic engineering pipeline.

### 1. The Dynamic Formation Engine
When a user submits a prompt, `loragent-teacher` clarifies the requirements. Then, the central orchestrator (`loragent-boss`) evaluates the scope and triggers one of four Formation Squads:
- 🛠️ **Auto Team Formation**: Standard engineering (Tech Director + Backend SE + Frontend SE + SQA + DevOps).
- 🏢 **Office Formation**: Business & Marketing (Project Coordinator + Marketing Manager + Publisher).
- 🥷 **Chela Formation**: Aggressive bug hunting (Bug Hunter + Shift Engineer + Debugger).
- 🚀 **Freelance Formation**: Isolated gig work (3D Designer, Validator, etc.).

For extremely complex tasks requiring more than 5 agents in parallel, the Boss delegates network routing to **`loragent-spidernet`**, the multi-agent workflow coordinator.

### 2. On-Demand Lazy Loading (Token Efficiency)
Loragent features a massive 108-agent roster but maintains an ultra-lightweight footprint using lazy loading.
- **Global Roster**: When installed, all 108 agents are cached in a global directory on your machine (`~/.loragent/master-roster/`).
- **Core Operations**: Only 5 essential orchestrators (`boss`, `spidernet`, `teacher`, `watchman`, `workspace-guard`) are actively installed in your project workspace.
- **Dynamic Summoning**: When the Boss needs a specialist (e.g., `react-specialist`), it uses the MCP Server to dynamically summon that agent from the global cache into the local workspace mid-conversation, freeing up massive context window tokens.

### 3. The Watchman & Crash Recovery
Never lose your context window again.
The `loragent-watchman` agent works silently in the background, continuously logging the exact execution state (current task, last completed step, next step) to a `.loragent/watchman-cache.json` file.
If the AI crashes, hits a token limit, or gets stuck, simply type `/loragent-watchman continue` to resume exactly where it left off.

### 3. The Firebase Self-Improvement Loop
Loragent agents get smarter the more you use them.
1. **Idea Extraction**: `loragent-gold-collector` watches the workflow. When a novel solution is found, it scrubs all PII and API keys, extracting only the abstract *idea*.
2. **Autonomous Skilling**: `loragent-skill-creator` takes that idea and physically writes a new `SKILL.md` file.
3. **Hivemind Sync**: `loragent-database-updater` pushes this new knowledge to a global Firebase Database, ensuring your agents never repeat the same mistake twice.

### 5. Native MCP Server
Loragent includes a built-in Model Context Protocol (MCP) server that provides standard inter-agent communication:
- `loragent_summon_agent()`: Lazily fetches a specialist agent from the global cache and injects it into the workspace.
- `loragent_dismiss_agent()`: Cleans up a specialist agent to free up context tokens (Garbage Collection).
- `loragent_steer()`: Formally passes context and payloads to the next agent in the pipeline.
- `loragent_trigger_hook()`: Triggers local workspace lifecycle events (pre-commit, deploy-retry).
- `loragent_watchman_save()`: Saves the session state to the cache.

---

## ⚡ How to Use

### Installation
Loragent can be injected into any workspace using our Python, Node, or Composer scripts.

**Via Python Installer:**
```bash
python /path/to/loragent/bin/install-officers.py
```
This script will cache the 108 Master Agents to `~/.loragent/master-roster/`, copy only the 5 Core Operators into your project's `.agents/skills/` directory, and append the `AGENTS.md` ruleset.

### Starting the Engine
Add the Loragent MCP server to your AI IDE configuration (Cursor, Antigravity, etc.):
```bash
node /path/to/loragent/src/mcp/server.js
```

### ⌨️ Prompt Engineering (Slash Commands)
Loragent natively supports custom slash commands to make steering your 108-agent workforce effortless. Type these directly into your AI chat:
- `/loragent-watchman continue`: Resumes execution from the Watchman cache.
- `/loragent-boss auto`: Instantly triggers the Auto-Team formation.
- `/loragent-boss chela`: Instantly triggers the Chela (Debugging) formation.
- `/loragent-teacher clarify`: Forces the teacher agent to ask clarifying requirements.
- `/loragent-inspector rca`: Forces a Root Cause Analysis report on the current bug.

---

## 👥 The 108 Master Agents
Loragent features 108 **strictly unique** agents, guaranteeing no overlapping roles. Here is a high-level summary of the divisions:

- **The Executive Board**: Boss, Teacher, Project Manager, Project Coordinator, Project Overviewer, Client.
- **The Core Engineers**: Tech Director, Backend SE, Frontend SE, SQA, DevOps, Architect Designer, SE Model Specialist.
- **The Bug Hunters**: Bug Hunter, Shift Engineer, Debugger, Inspector, Performance Analyser.
- **The Language Masters**: Python Expert, Javascript Expert, Rust Expert, C++ Expert, Go Expert, Legacy System Analyser.
- **The Framework Masters**: React Specialist, Vue Specialist, Angular Specialist, Django Specialist, Laravel Specialist, Node Specialist.
- **The Infrastructure Team**: Cloud Specialist, Azure Specialist, Vercel Expert, Railway Expert, Docman (Docker), K8 Expert, ISP Man.
- **The Designers**: UI/UX Professional, 3D Designer, Animator, Logo Designer, Prototype Designer, Theme Guy, Responsive System Designer.
- **The Automation & Tools Team**: Tools Specialist, CLI Utilities Specialist, CLI Automation Maker, Browser Automation Expert, Workflow Automation Specialist, CI/CD Automation Expert.
- **The Business & Marketing Team**: Marketing Strategy Manager, Ads Manager, Publisher, Sales Executive, PR Specialist, Fund Collector, Software Business Analyst.
- **The AI & Data Team**: AI Communicator, Validator, Mathematician, Algorithm Implementer, Database Designer.
- **The Integrators**: Paymentguy, Notion Expert, Store Specialist, Localization Expert, API Chef, Authentication Engineer.
- **The Observers & Logistics**: Watchman, Spidernet, Cache Collector, Gold Collector, Skill Creator, Database Updater, Workspace Guard, Operations.
- **The Writers**: Readme Generator Specialist, Content Writer, CV Maker, Professional Document Creator, Research Paper Writer.

---
*Built for the future of Autonomous Agentic Coding.*
