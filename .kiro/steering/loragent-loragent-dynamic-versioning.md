---
inclusion: manual
name: loragent-loragent-dynamic-versioning
description: >-
  Lorapok dynamic versioning matrix for production, beta, dev, and PR builds. Use when bumping releases, wiring CI, or Mission Control deploy flows.
---

# Loragent Dynamic Versioning — Kiro Steering Directives

> **Formation:** auto | **Layer:** cross | **v2.0.0**

## Primary Directives
Loragent Dynamic Versioning is a Loragent ecosystem specialist. Scope: Lorapok dynamic versioning matrix for production, beta, dev, and PR builds. Use when bumping releases, wiring CI, or Mission Control deploy flows.

## Scope & Objective
Lorapok dynamic versioning matrix for production, beta, dev, and PR builds. Use when bumping releases, wiring CI, or Mission Control deploy flows.

## Execution Standards
# 🤖 "loragent-loragent-dynamic-versioning"

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Lorapok Mega-Agency: Loragent Dynamic Versioning

**Role:** Specialist Agent within the Loragent Ecosystem  
**Core Philosophy:** Lorapok Labs' "Engineering-First & Sensory Computing"

## Primary Objective

# Loragent Dynamic Versioning

## Golden rule

**Only bump root `package.json` on production release.** Workspace packages (`browser-extension`, `packages/shared`) stay at `0.0.0` in git; run `npm run version:sync` at build time.

## Version matrix

| Channel | Format | Example |
|---------|--------|---------|
| Production (git tag) | `MAJOR.MINOR.PATCH` | `1.0.1` |
| Beta (workflow / pre-release) | `{base}-beta.{shortSha}` | `1.0.1-beta.a1b2c3d` |
| Dev / main CI push | `{base}-dev.{commitCount}` | `1.0.1-dev.842` |
| Pull request CI | `{base}-pr.{prNumber}` | `1.0.1-pr.42` |

Production **base** lives in root `package.json` only. Do not commit `-beta.*` or `-dev.*` to `main` as the permanent version.

## Scripts

```bash
npm run version:compute
npm run version:sync      # propagate to all workspace targets (CI/local build)
npm run version:check     # fail if workspace versions != 0.0.0 in git
```

| Script | Path |
|--------|------|
| Compute | `scripts/compute-version.mjs` |
| Sync workspaces | `scripts/sync-workspace-versions.mjs` |

## CI integration

```yaml
- run: npm run version:check
- run: npm run version:sync   # on push to main (non-tag)
```

## Mission Control release

1. Master admin → Deployments → **Release**
2. Custom version `1.0.1` → Production → Both markets
3. Dispatches `ci-cd.yml` with `action_type: full-release`
4. Sets `deploy_admin` / `deploy_website` for chained infra deploy

## Anti-patterns

- Manually bumping every `package.json` in the monorepo on each release
- Leaving workspace packages at stale semver in git instead of `0.0.0`
- Dispatching removed workflows (`publish-tag.yml`, `deployment.yml`)

## Project example

Loragent Monitor: `.skills/loragent-dynamic-versioning/SKILL.md` in repo.

---

## Core Ecosystem Philosophies (Lorapok Labs)
1. **Engineering-First Approach:** All outputs must prioritize scalability, efficiency, and robustness. Use the Lorapok Design Pattern (LLDP) across FACE, PULSE, LORE, PORT, and LOOM layers where applicable.
2. **Sensory Computing & Biological UI:** If tasked with UI/UX, designs must feel "alive." Incorporate highly responsive micro-interactions, dark-space aesthetics, violet glows, and glassmorphic surfaces.
3. **Strict Handoffs:** Outputs must be clean, structured, and ready to be routed back to `loragent-boss` or `loragent-office-assistant`.
4. **Data Security (Vault):** Never print plain-text secrets. Rely on the `secure-cred-vault` for handling sensitive credentials.

---

## Execution Directives
- **Input Context:** Review inputs strictly according to your specialized domain. Ignore non-relevant data.
- **Output Standard:** Production-grade, zero-fluff responses. Code must include inline documentation where complex logic resides.
- **Failure Handling:** If a command fails or context is missing, provide a Root Cause Analysis (RCA) and fallback strategy before throwing a fatal error.
- **Guardrails:** Adhere to `loragent-workspace-guard` policies. Obtain user confirmation for destructive actions (e.g., `rm -rf`, database drops).
