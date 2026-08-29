@AGENTS.md

---
name: loragent-claude-memory
description: Claude Code extended memory layer and enterprise orchestration directives for the Loragent ecosystem.
---

# Loragent — Claude Code Extended Memory & Enterprise Directives

## 🧠 Memory Architecture (3-Layer)

**Layer 1 — Project Root** (`CLAUDE.md` + `AGENTS.md`): Always loaded. Core directives, slash commands, hard rules.

**Layer 2 — Agent Skills** (`skills/*/SKILL.md`, `agents/*/SKILL.md`): Loaded on demand via `/loragent:<slug>` or `@<slug>`. Each file is scoped to one role. Do not load all 224 at once.

**Layer 3 — Session State** (`.loragent-debug/watchman-cache.json`): Ephemeral. Resume with `/loragent-watchman continue`.

## 🔄 Auto Memory Notes Pipeline
When you write a significant solution, new pattern, or novel fix:
1. Do NOT forget it — hand it to `loragent-gold-collector` for extraction.
2. Gold Collector scrubs PII/secrets and emits an abstract `idea.md`.
3. `loragent-skill-creator` writes a new `SKILL.md` from the idea.
4. `loragent-database-updater` pushes to Firebase hivemind.

## 🔒 Tool Permissions & Execution Standards

| MCP Tool | Permission | When |
|---|---|---|
| `loragent_summon_agent` | auto | Boss needs a specialist |
| `loragent_dismiss_agent` | auto | Specialist task complete |
| `loragent_steer` | auto | Agent-to-agent handoff |
| `loragent_trigger_hook` | auto | Lifecycle events |
| `loragent_watchman_save` | auto | State checkpoint |
| `loragent_image_generate` | auto | Creative/visual tasks |
| `loragent_deploy` | **confirm** | Any deployment action |
| `loragent_git_push` | **confirm** | Remote git operations |
| Destructive bash (`rm -rf`, drops) | **BLOCK** | Always — route to workspace-guard |

## 🪝 Lifecycle Hooks
Hooks defined in `hooks/hooks.json` and `.agents/hooks/hooks.json`. Active:
- `pre-commit` → `loragent-sqa` lint + type-check
- `post-task` → `loragent-watchman` state save
- `pre-deploy` → `loragent-devops` build verification
- `check-done` → `loragent-chorki` continuous autopilot verification

## ⚡ Skills Invocation Examples
```bash
/loragent:boss           # activate orchestrator, describe your task
/loragent:image-generate # generate image via Fal.ai/Replicate
/loragent:gif-create     # create animated GIF via FFmpeg
/loragent:deploy         # deploy to Vercel/Railway/Docker
/loragent:tools-install  # install npm/pip/composer packages
/loragent:watchman       # crash recovery / resume session
```

## 📉 Progressive Disclosure (Token Budget)
When total skill context would exceed 40K tokens:
1. Keep only `boss`, `watchman`, `workspace-guard`, `spidernet`, `teacher` resident.
2. All others must be summoned/dismissed per task.
3. `loragent-cache-collector` prunes stale context automatically.
