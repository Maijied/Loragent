#!/bin/bash
# Sync secrets from canonical GPG vault to GitHub (loragent / cursor-monitor repos).
# Uses scoped API tokens — never Cloudflare Global API keys.

set -euo pipefail

echo "🔒 Syncing secrets from canonical vault to GitHub..."

for cmd in gh jq gpg; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "❌ missing: $cmd"; exit 1; }
done

VAULT_PATH="${CRED_STORE_FILE:-/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg}"
PASS="${CRED_VAULT_PASSPHRASE:-${CRED_PASSPHRASE:-}}"

if [ ! -f "$VAULT_PATH" ]; then
  echo "❌ Vault not found at $VAULT_PATH"
  exit 1
fi

if [ -z "$PASS" ]; then
  for f in \
    "/mnt/NewVolume/Personal_Projects/cursor-usage-monitor/.cred-vault-passphrase" \
    "/mnt/NewVolume/Personal_Projects/loragent/.cred-vault-passphrase" \
    "/mnt/NewVolume/Personal_Projects/cred/.cred-vault-passphrase" \
    "$HOME/.cred/pin"; do
    if [ -f "$f" ]; then
      PASS="$(grep -vE '^(one-time|vault:|created:|Passphrase:)' "$f" | head -1 | sed 's/^passphrase:[[:space:]]*//i')"
      [ -n "$PASS" ] && break
    fi
  done
fi

if [ -z "$PASS" ]; then
  echo "❌ Set CRED_VAULT_PASSPHRASE or add .cred-vault-passphrase"
  exit 1
fi

TEMP_JSON="$(mktemp)"
trap 'rm -f "$TEMP_JSON"' EXIT

printf '%s' "$PASS" | gpg -q --batch --pinentry-mode loopback --passphrase-fd 0 -d "$VAULT_PATH" > "$TEMP_JSON"

CF_ACCOUNT="$(jq -r '.cursor.cloudflare_account_id // .cloudflare.account_id // empty' "$TEMP_JSON")"
CF_API="$(jq -r '.cursor.cloudflare_api_token // .cloudflare.api_token // empty' "$TEMP_JSON")"
CF_EMAIL_API="$(jq -r '.cursor.cloudflare_email_api_token // .cloudflare.email_api_token // empty' "$TEMP_JSON")"
CF_ZONE="$(jq -r '.cursor.cloudflare_zone_lorapok_tech // empty' "$TEMP_JSON")"
CF_FORWARD="$(jq -r '.cursor.mail_forward_to // empty' "$TEMP_JSON")"
OVSX_PAT="$(jq -r '.cursor.ovsx_pat // empty' "$TEMP_JSON")"
VSCE_PAT="$(jq -r '.cursor.vsce_pat // empty' "$TEMP_JSON")"

set_secret() {
  local name="$1" value="$2"
  [ -n "$value" ] && [ "$value" != "null" ] || return 0
  printf '%s' "$value" | gh secret set "$name"
  echo "  -> $name"
}

echo "🚀 Pushing secrets..."
set_secret CLOUDFLARE_ACCOUNT_ID "$CF_ACCOUNT"
set_secret CLOUDFLARE_API_TOKEN "$CF_API"
set_secret CLOUDFLARE_EMAIL_API_TOKEN "$CF_EMAIL_API"
set_secret CLOUDFLARE_ZONE_ID "$CF_ZONE"
set_secret CLOUDFLARE_FORWARD_TO "$CF_FORWARD"
set_secret OVSX_PAT "$OVSX_PAT"
set_secret VSCE_PAT "$VSCE_PAT"

echo "🎉 GitHub secrets synchronized."
