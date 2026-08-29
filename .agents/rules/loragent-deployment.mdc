---
description: Deployment and MCP configuration rules — Vercel, Railway, Docker, env vars, secret handling. Activates on deploy configs and MCP JSON files.
globs: ['*.mcp.json', '.mcp.json', 'vercel.json', 'railway.json', 'Dockerfile', 'docker-compose*.yml', '.env.example', '*.config.ts']
alwaysApply: false
---

# Loragent Deploy & Config Rules

## Secret Handling
- `.env` files are NEVER committed — only `.env.example` with placeholder values
- All secrets stored via `secure-cred-vault` through `loragent-accounts-specialist`
- MCP env vars use `${ENV_VAR_NAME}` placeholder syntax — never hardcoded values
- Any deploy config containing a real secret is a critical violation

## Deployment Workflow
1. `loragent-devops` runs `pre-deploy-check.sh` hook
2. `loragent-workspace-guard` approves production deployments
3. Deploy via appropriate MCP connector (vercel/railway/docker) or Mission Control (https://mission-control.lorapok.tech)
4. Post-deploy: `loragent_watchman_save` + Slack notification (if configured)

## MCP Config Standards
- All new connectors go in `.mcp.json` at repo root
- Include `description`, `install` command, and `usage_example` for every server
- `requires_confirmation: true` on any server that modifies prod infrastructure
- Document required env vars in `.env.example` immediately when adding a connector

## Docker Standards
- Multi-stage builds only — builder + runtime stages
- Non-root user in runtime stage
- `.dockerignore` must exclude: `node_modules`, `.env`, `*.log`, `.git`
- Health check required for all long-running containers
