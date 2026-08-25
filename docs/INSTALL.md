# Loragent — Install Guide

Portable agent stack for Lorapok Labs: skills, MCP servers, rules, subagents, and deployment orchestration.

**Project root:** `/mnt/NewVolume/Personal_Projects/loragent`

## Quick install (global sync)

```bash
# One command — symlinks skills/rules into ~/.cursor and ~/.claude
~/.local/bin/sync-global-agent-stack
```

Or run the project script directly:

```bash
bash /mnt/NewVolume/Personal_Projects/loragent/scripts/sync-loragent-stack.sh
```

## Manual install

### 1. Skills (Cursor / Claude)

```bash
LORAGENT=/mnt/NewVolume/Personal_Projects/loragent
mkdir -p ~/.cursor/skills ~/.claude/skills

for skill in "$LORAGENT"/skills/loragent-*/; do
  name=$(basename "$skill")
  ln -sfn "$skill" "$HOME/.cursor/skills/$name"
  ln -sfn "$skill" "$HOME/.claude/skills/$name"
done
```

### 2. Rules

```bash
mkdir -p ~/.cursor/rules
ln -sfn "$LORAGENT/rules/loragent-deployment.mdc" ~/.cursor/rules/
ln -sfn "$LORAGENT/rules/loragent-skills-naming.mdc" ~/.cursor/rules/
```

### 3. MCP servers

Copy or merge `mcp/mcp.json` into your Cursor MCP config:

| File | Purpose |
|------|---------|
| `~/.cursor/mcp.json` | Cursor Desktop |
| Project `.cursor/mcp.json` | Per-repo override |

Set env vars before use:

```bash
export GITHUB_TOKEN=ghp_...   # github MCP
export LORAGENT_WORKSPACE=/mnt/NewVolume/Personal_Projects/loragent
```

### 4. Subagents & agents

Reference files live in:

- `subagents/` — focused workers (publish, website, AMO)
- `agents/` — full orchestration prompts

Attach subagent markdown in Cursor **Rules** or paste into agent instructions.

## Verify

```bash
ls ~/.cursor/skills/loragent-*
cat ~/.cursor/rules/loragent-deployment.mdc | head -5
```

In Cursor chat, type: *"Use loragent-unified-deployment skill"* — the agent should read `SKILL.md` and route deploys through Mission Control.

## Uninstall

```bash
rm -f ~/.cursor/skills/loragent-* ~/.claude/skills/loragent-*
rm -f ~/.cursor/rules/loragent-*.mdc
```
