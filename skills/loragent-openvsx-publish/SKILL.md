---
name: loragent-openvsx-publish
description: Open VSX publishing for Lorapok VS Code extensions — canonical lorapok-labs namespace, duplicate listing fixes, CI sync.
---

# Loragent Open VSX Publish

## Canonical listing

- **Namespace:** `lorapok-labs` (canonical)
- **Duplicate:** `LorapokLabs` (legacy — exclude from download totals)
- **CCM ID:** `lorapok-labs.cursor-curse-monitor-by-lorapok`

## CI paths

| Trigger | Workflow action |
|---------|-----------------|
| Mission Control Deploy/Release | `publish-tag` or `full-release` with market Open VSX or Both |
| Fast canonical fix | `sync-open-vsx` workflow_dispatch |

## Local publish

```bash
cd /home/maizied/cursor-usage-monitor
npm run version:sync
npm run package
node scripts/publish-ovsx.mjs
```

## Common failures

| Symptom | Fix |
|---------|-----|
| `duplicate-listing` sync status | Run `scripts/publish-ovsx.mjs` to claim canonical namespace |
| Version mismatch | `npm run version:sync` before package |
| Open VSX lags package version | Mission Control re-deploy with `publish-tag` |

## Related

- `loragent-unified-deployment` — Mission Control entry points
- `loragent-dynamic-versioning` — version sync before publish
