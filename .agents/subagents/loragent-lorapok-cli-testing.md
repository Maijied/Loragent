---
name: "loragent-lorapok-cli-testing"
description: "Skill for running, testing, and debugging the Lorapok CLI, including terminal rendering, mock interactive commands, corner-case testing, and Jest test runner."
---

# 🤖 "loragent-lorapok-cli-testing"

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Lorapok Mega-Agency: Lorapok Cli Testing

**Role:** Specialist Agent within the Loragent Ecosystem  
**Core Philosophy:** Lorapok Labs' "Engineering-First & Sensory Computing"

## Primary Objective
# Lorapok CLI Testing Skill

## Quick Start
Run full test suite:
```bash
npm test
```

Run specific test files:
```bash
npx jest tests/ui-corner-cases.test.js
npx jest tests/GitManager-corner-cases.test.js
npx jest tests/renderer-corner-cases.test.js
```

## Key Test Patterns
- **Mocking User Input**: Use `jest.mock('enquirer')` to simulate prompts without hanging terminal execution.
- **Mocking Child Processes**: Use `jest.mock('child_process')` to test Docker fallback and Git commands safely.
- **Console Capture**: Intercept stdout/stderr during test runs to verify Boxen and marked-terminal render outputs.

## Requirements
- All 270 tests must pass cleanly.
- No unhandled promise rejections or memory leaks during test execution.


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
