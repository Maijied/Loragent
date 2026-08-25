#!/usr/bin/env bash
# Sync loragent skills + MCP from project repo to Cursor/Agents/Claude global stacks.
set -euo pipefail

LORAGENT_ROOT="/mnt/NewVolume/Personal_Projects/loragent"
CURSOR_SKILLS="${HOME}/.cursor/skills"
AGENTS_SKILLS="${HOME}/.agents/skills"
CLAUDE_SKILLS="${HOME}/.claude/skills"
CURSOR_MCP="${HOME}/.cursor/mcp.json"
AGENTS_MCP="${HOME}/.agents/mcp.json"

mkdir -p "${CURSOR_SKILLS}" "${AGENTS_SKILLS}" "${CLAUDE_SKILLS}" "${HOME}/.agents"

echo "==> Syncing loragent-* skills from ${LORAGENT_ROOT}/skills"
for skill_dir in "${LORAGENT_ROOT}"/skills/loragent-*; do
  [ -d "$skill_dir" ] || continue
  skill_name="$(basename "$skill_dir")"
  rsync -a --delete "${skill_dir}/" "${CURSOR_SKILLS}/${skill_name}/"
  rsync -a --delete "${skill_dir}/" "${AGENTS_SKILLS}/${skill_name}/"
  rsync -a --delete "${skill_dir}/" "${CLAUDE_SKILLS}/${skill_name}/"
  echo "  synced ${skill_name}"
done

if [ -f "${LORAGENT_ROOT}/mcp/mcp.json" ]; then
  echo "==> Installing canonical MCP config"
  cp "${LORAGENT_ROOT}/mcp/mcp.json" "${CURSOR_MCP}"
  ln -sfn "${CURSOR_MCP}" "${AGENTS_MCP}"
fi

echo "==> Done. Loragent root: ${LORAGENT_ROOT}"
