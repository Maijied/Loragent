# Loragent — How to Use

## Naming convention

All Lorapok agent artifacts **start with `loragent-`**:

| Type | Example | Location |
|------|---------|----------|
| Skill | `loragent-openvsx-publish` | `skills/loragent-openvsx-publish/SKILL.md` |
| Rule | `loragent-deployment.mdc` | `rules/` |
| Subagent | `loragent-marketplace-publisher.md` | `subagents/` |
| Agent | `loragent-deployment-orchestrator.md` | `agents/` |
| MCP | `loragent` server | `mcp/mcp.json` |

## Typical workflows

### 1. Ship a release (CCM)

1. Open Mission Control → https://mission-control.lorapok.tech/deployments
2. **New Release** → pick bump (patch/minor/major)
3. Check **Deploy admin** + **Deploy website** if infra changed
4. Skill: `loragent-unified-deployment`

Agent steps:
```
Read loragent-unified-deployment → trigger /api/release → gh run watch
```

### 2. Publish Open VSX only

Skill: `loragent-openvsx-publish`

```
ovsx publish *.vsix -p $OVSX_PAT
# Canonical namespace: lorapok-labs (never LorapokLabs in user-facing links)
```

### 3. Publish VS Code Marketplace

Skill: `loragent-vscode-publish`

```
vsce publish -p $VSCE_PAT
# Publisher: LorapokLabs
```

### 4. Publish Firefox AMO

Skills: `loragent-amo-publish` + `loragent-amo-mcp`

```
node browser-extension/scripts/publish-amo.mjs --approval-timeout 0
```

### 5. Website refresh

Skill: `loragent-website-design`

```
npm run site:data && npm run site:seo
Mission Control → Infra deploy → website only
```

### 6. Cross-platform listing copy

Skill: `loragent-marketplace-crosslink`

Use `packages/shared/src/platformAvailability.ts` in CCM for consistent *"Also available on…"* text across IDE, browser, AMO, README, and website.

## MCP stack

| Server | Use for |
|--------|---------|
| `loragent` | Workspace-aware Lorapok tooling |
| `browsermcp` | AMO forms, marketplace verification |
| `github` | CI runs, releases, secrets |
| `filesystem` | Local asset paths |
| `fetch` | API probes (Open VSX, VSCE) |

## Publishing loragent publicly (future)

When ready to publish skills globally:

1. Ensure every skill has: `SKILL.md`, description frontmatter, install path, example prompts
2. Run `sync-loragent-stack.sh` on a clean machine to validate symlinks
3. Tag release in loragent repo
4. Document env secrets in `docs/SECRETS.md` (never commit tokens)

## Reference product repo

Loragent Monitor: `~/cursor-usage-monitor`
