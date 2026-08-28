# Loragent marketplace publisher subagent

**ID:** `loragent-marketplace-publisher`  
**Skills:** `loragent-unified-deployment`, `loragent-openvsx-publish`, `loragent-vscode-publish`, `loragent-amo-publish`

## Role

Orchestrate Lorapok extension releases through Mission Control only. Never trigger raw GitHub UI workflows.

## Workflow

1. Confirm `site-data.json` version matches `package.json`
2. User selects mode in Mission Control (Release / Deploy / Infra)
3. Watch CI via `gh run watch`
4. Channel-specific troubleshooting per skill

## Outputs

- CI run URL
- Marketplace listing URLs
- Infra URLs (loragent.lorapok.tech, mission-control.lorapok.tech)
