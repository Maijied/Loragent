#!/usr/bin/env bash
# ============================================================
# Loragent Universal Standard v2 — Repo Bootstrap Script
# Run from the root of any Loragent ecosystem repo.
# Usage: bash scripts/bootstrap-standard.sh [--dry-run]
# ============================================================
set -euo pipefail

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
STANDARD_PACKAGE_DIR="${LORAGENT_STANDARD_DIR:-$SCRIPT_DIR/../loragent-standard}"

log()  { echo "▶ $*"; }
ok()   { echo "✅ $*"; }
warn() { echo "⚠️  $*"; }
dry()  { $DRY_RUN && echo "  [DRY RUN — would: $*]" || eval "$*"; }

echo ""
echo "════════════════════════════════════════════"
echo "  Loragent Universal Standard v2 Bootstrap"
echo "  Repo: $REPO_ROOT"
echo "  Dry-run: $DRY_RUN"
echo "════════════════════════════════════════════"
echo ""

# ── 1. Create required directories ────────────────────────────────────────────
log "Creating directory structure..."
for dir in \
  "skills" "agents" "hooks" "scripts" "docs" "reports" \
  ".kiro/steering" ".cursor/rules" ".claude-plugin" \
  ".loragent-debug"; do
  dry "mkdir -p '$REPO_ROOT/$dir'"
done
ok "Directories ready"

# ── 2. Copy standard files if the package dir exists ──────────────────────────
if [ -d "$STANDARD_PACKAGE_DIR" ]; then
  log "Copying standard files from $STANDARD_PACKAGE_DIR..."

  # Core project files (backup existing before overwrite)
  for file in "AGENTS.md" "CLAUDE.md" "AGENT_TEMPLATE.md" ".mcp.json" \
              ".windsurfrules" ".clinerules" ".roomodes"; do
    if [ -f "$REPO_ROOT/$file" ]; then
      dry "cp '$REPO_ROOT/$file' '$REPO_ROOT/${file}.bak'"
      warn "Backed up existing $file → ${file}.bak"
    fi
    dry "cp '$STANDARD_PACKAGE_DIR/$file' '$REPO_ROOT/$file'"
  done

  # Plugin manifest
  dry "cp '$STANDARD_PACKAGE_DIR/.claude-plugin/plugin.json' '$REPO_ROOT/.claude-plugin/plugin.json'"

  # Hooks
  dry "cp '$STANDARD_PACKAGE_DIR/hooks/hooks.json' '$REPO_ROOT/hooks/hooks.json'"

  # Kiro steering
  for f in "$STANDARD_PACKAGE_DIR/.kiro/steering/"*.md; do
    dry "cp '$f' '$REPO_ROOT/.kiro/steering/'"
  done

  # Cursor rules
  for f in "$STANDARD_PACKAGE_DIR/.cursor/rules/"*.mdc; do
    dry "cp '$f' '$REPO_ROOT/.cursor/rules/'"
  done

  # Scripts + templates
  dry "cp '$STANDARD_PACKAGE_DIR/scripts/enrich-skills.js' '$REPO_ROOT/scripts/'"
  dry "mkdir -p '$REPO_ROOT/templates'"
  for f in "$STANDARD_PACKAGE_DIR/templates/"*; do
    dry "cp '$f' '$REPO_ROOT/templates/'"
  done

  # Docs
  dry "cp '$STANDARD_PACKAGE_DIR/docs/LORAGENT_STANDARD_v2.md' '$REPO_ROOT/docs/'"

  ok "Standard files copied"
else
  warn "Standard package dir not found at $STANDARD_PACKAGE_DIR — skipping file copy"
  warn "Set LORAGENT_STANDARD_DIR env var to point to the standard package"
fi

# ── 3. Ensure .env.example has required placeholders ─────────────────────────
log "Checking .env.example..."
ENV_EXAMPLE="$REPO_ROOT/.env.example"
if [ ! -f "$ENV_EXAMPLE" ]; then
  dry "touch '$ENV_EXAMPLE'"
fi

REQUIRED_VARS=(
  "GITHUB_TOKEN="
  "FAL_API_KEY="
  "REPLICATE_API_TOKEN="
  "VERCEL_TOKEN="
  "VERCEL_TEAM_ID="
  "RAILWAY_TOKEN="
  "FIREBASE_PROJECT_ID="
  "FIREBASE_CLIENT_EMAIL="
  "FIREBASE_PRIVATE_KEY="
  "SLACK_BOT_TOKEN="
  "SLACK_DEPLOY_CHANNEL=#deployments"
  "BRAVE_API_KEY="
  "RESEND_API_KEY="
  "DATABASE_URL="
  "DB_HOST=localhost"
  "DB_USER="
  "DB_PASSWORD="
  "DB_DATABASE="
  "LORAGENT_ENV=development"
)

for var in "${REQUIRED_VARS[@]}"; do
  key="${var%%=*}"
  if ! grep -q "^$key=" "$ENV_EXAMPLE" 2>/dev/null; then
    dry "echo '$var' >> '$ENV_EXAMPLE'"
    log "  Added $key to .env.example"
  fi
done
ok ".env.example updated"

# ── 4. Check MCP server entrypoint ───────────────────────────────────────────
log "Checking MCP server..."
if [ -f "$REPO_ROOT/src/mcp/server.js" ]; then
  ok "MCP server found at src/mcp/server.js"
else
  warn "MCP server not found at src/mcp/server.js — check ARCHITECTURE.md for setup"
fi

# ── 5. Run enrichment pipeline ───────────────────────────────────────────────
if [ -f "$REPO_ROOT/scripts/enrich-skills.js" ]; then
  log "Running enrichment pipeline..."
  dry "cd '$REPO_ROOT' && node scripts/enrich-skills.js --extract"
  dry "cd '$REPO_ROOT' && node scripts/enrich-skills.js --validate"
  if ! $DRY_RUN; then
    echo ""
    echo "┌─────────────────────────────────────────────────────────────┐"
    echo "│  Review reports/agents.manifest.json                         │"
    echo "│  Fill in: roleIdentity, primaryObjective, handoffTargets     │"
    echo "│  Then run: node scripts/enrich-skills.js --compile --mirrors │"
    echo "└─────────────────────────────────────────────────────────────┘"
  fi
else
  warn "enrich-skills.js not found — skipping enrichment pipeline"
fi

# ── 6. Git status ─────────────────────────────────────────────────────────────
if ! $DRY_RUN; then
  echo ""
  log "Git status:"
  git -C "$REPO_ROOT" status --short | head -20 || true
  echo ""
  echo "When ready:"
  echo "  git add -A && git commit -m 'chore: apply Loragent Universal Standard v2' && git push"
fi

echo ""
echo "════════════════════════════════════════════"
echo "  Bootstrap complete. See docs/LORAGENT_STANDARD_v2.md"
echo "════════════════════════════════════════════"
