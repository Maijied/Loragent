---
name: "loragent-lorapok-mcp-integration"
description: "Skill for building, configuring, and verifying Model Context Protocol (MCP) server & client integrations within Lorapok AI Agent."
---

# 🤖 "loragent-lorapok-mcp-integration"

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Lorapok Mega-Agency: Lorapok Mcp Integration

**Role:** Specialist Agent within the Loragent Ecosystem  
**Core Philosophy:** Lorapok Labs' "Engineering-First & Sensory Computing"

## Primary Objective
# Lorapok MCP Integration Skill

## Overview
Model Context Protocol (MCP) allows Lorapok AI Agent to expose and consume external tools, resources, and prompt templates standardizing agent capabilities.

## Architecture & Config
- Project MCP config file: `mcp.json` / `.agents/mcp.json` (keep identical).
- **Enabled servers today:** `filesystem`, `git` only.
- Do not document command-execution or search servers as active unless added to `mcp.json`.

## Standards
- Tool names must be lower_snake_case.
- Parameters must include JSON schema descriptions.
- Secure tool invocation with permission validation and argument sanitization.


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
