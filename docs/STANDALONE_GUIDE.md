# Loragent — Standalone Usage Guide

Every artifact in this repo is **independently usable**. You do not need the
full 108-agent stack, loragent-boss, Firebase, or any other dependency unless
the specific skill's frontmatter declares it under `requires_stack: true`.

---

## 1. Usage Modes (pick any one)

### Mode A — Claude Code / Any IDE (single skill, no stack)
```bash
# Invoke one skill by itself — no boss, no formation
/loragent:image-generate
/loragent:gif-create
/loragent:deploy
/loragent:web-ingest
```

### Mode B — skills-mcp (expose any skills folder to any MCP client)
```bash
# Install once:
npm install -g skills-mcp

# Add to your .mcp.json or Claude Desktop config:
{
  "mcpServers": {
    "my-skills": {
      "command": "npx",
      "args": ["-y", "skills-mcp", "-s", "/path/to/skills"]
    }
  }
}
# Now every SKILL.md is available as an MCP tool to any client
```

### Mode C — One connector, no skill loader (raw MCP)
Each skill's folder contains a `mcp-fragment.json`. Drop it into your
`.mcp.json` and that single connector is active — nothing else needed.
```bash
# Example: just image generation, nothing else
cat skills/loragent-image-generate/mcp-fragment.json >> .mcp.json
```

### Mode D — CLI (no AI, direct tool execution)
Skills that wrap deterministic tools (ffmpeg, vercel, docker, etc.) ship
an optional `cli.js`. Run it directly:
```bash
node skills/loragent-gif-create/cli.js \
  --input ./video.mp4 --output ./out.gif --platform slack

node skills/loragent-deploy/cli.js \
  --target vercel --env production

node skills/loragent-web-ingest/cli.js \
  --url https://docs.some-tool.com --out ./skills/
```

### Mode E — Copy-paste single file
Copy a `SKILL.md` into any project's `skills/` folder. It works anywhere
`SKILL.md` files are supported (Claude Code, Codex, Copilot, etc.).
Zero dependencies, zero config.

---

## 2. Standalone Frontmatter Fields

When a skill is used standalone (no Loragent stack), these frontmatter fields
tell the consuming agent what it needs to self-bootstrap:

```yaml
---
name: loragent-<slug>
standalone: true            # this skill is fully self-contained
requires_stack: false       # false = no boss/spidernet/watchman needed
standalone_mcp:             # MCP config needed for THIS skill only
  image-generate-fal:
    command: npx
    args: ["-y", "fal-mcp"]
    env: { FAL_KEY: "${FAL_API_KEY}" }
standalone_install:         # what to install before using this skill alone
  - "npm install -g fal-mcp"
  - "export FAL_API_KEY=your_key_here"
standalone_invoke:          # how to call it without the full stack
  claude_code: "/loragent:image-generate"
  mcp_tool: "fal_run_model"
  cli: "node skills/loragent-image-generate/cli.js"
---
```

---

## 3. Skill Registry — Browse & Install

```bash
# List all available skills:
node scripts/registry-cli.js list

# Search by capability:
node scripts/registry-cli.js search "image generation"
node scripts/registry-cli.js search "deploy vercel"
node scripts/registry-cli.js search "gif animation"

# Install a skill from the registry into your project:
node scripts/registry-cli.js install loragent-image-generate
node scripts/registry-cli.js install loragent-gif-create

# Install from a URL (web ingestion):
node scripts/ingest-url.js --url https://docs.fal.ai --type skill
node scripts/ingest-url.js --url https://github.com/some/mcp-server --type mcp

# Remove a skill:
node scripts/registry-cli.js remove loragent-gif-create
```

---

## 4. What "Standalone" Means for Each Artifact Type

| Artifact | Standalone? | How |
|---|---|---|
| `SKILL.md` | ✅ Always | Copy to any `skills/` folder. Works in Claude Code, Codex, Copilot. |
| `mcp-fragment.json` | ✅ Always | Merge into any `.mcp.json`. Single connector, zero other deps. |
| `.kiro/steering/*.md` | ✅ Always | Copy to any repo's `.kiro/steering/`. Works in Kiro immediately. |
| `.cursor/rules/*.mdc` | ✅ Always | Copy to `.cursor/rules/`. Works in Cursor immediately. |
| `cli.js` | ✅ Always | `node cli.js --help`. Pure Node, no AI required. |
| `loragent-boss` | ⚠️ Stack required | Needs MCP server + other core agents. |
| `loragent-spidernet` | ⚠️ Stack required | Needs boss + MCP server. |
| Firebase hivemind | ⚠️ Stack required | Needs `loragent-core` MCP + Firebase creds. |
