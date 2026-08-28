# Loragent — Install Guide

Portable agent stack for Lorapok Labs: skills, MCP servers, rules, subagents, and deployment orchestration.

**Project root:** `<PROJECT_ROOT>`

## Quick install (global sync)

```bash
# One command — symlinks skills/rules into ~/.cursor and ~/.claude
~/.local/bin/sync-global-agent-stack
```

Or run the project script directly:

```bash
bash <PROJECT_ROOT>/scripts/sync-loragent-stack.sh
```

## Manual install

### 1. Skills (Cursor / Claude)

```bash
LORAGENT=<PROJECT_ROOT>
mkdir -p ~/.skills ~/.claude/skills

for skill in "$LORAGENT"/skills/loragent-*/; do
  name=$(basename "$skill")
  ln -sfn "$skill" "$HOME/.skills/$name"
  ln -sfn "$skill" "$HOME/.claude/skills/$name"
done
```

### 2. Rules

```bash
mkdir -p ~/.rules
ln -sfn "$LORAGENT/rules/loragent-deployment.mdc" ~/.rules/
ln -sfn "$LORAGENT/rules/loragent-skills-naming.mdc" ~/.rules/
```

### 3. MCP servers

Copy or merge `mcp/mcp.json` into your Cursor MCP config:

| File | Purpose |
|------|---------|
| `~/mcp.json` | Cursor Desktop |
| Project `mcp.json` | Per-repo override |

Set env vars before use:

```bash
export GITHUB_TOKEN=ghp_...   # github MCP
export LORAGENT_WORKSPACE=<PROJECT_ROOT>
```

### 4. Subagents & agents

Reference files live in:

- `subagents/` — focused workers (publish, website, AMO)
- `agents/` — full orchestration prompts

Attach subagent markdown in Cursor **Rules** or paste into agent instructions.

## Verify

```bash
ls ~/.skills/loragent-*
cat ~/.rules/loragent-deployment.mdc | head -5
```

In Cursor chat, type: *"Use loragent-unified-deployment skill"* — the agent should read `SKILL.md` and route deploys through Mission Control.

## Uninstall

```bash
rm -f ~/.skills/loragent-* ~/.claude/skills/loragent-*
rm -f ~/.rules/loragent-*.mdc
```
