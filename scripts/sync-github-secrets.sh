#!/bin/bash
# Sync Cloudflare and GitHub Secrets from Local Credential Vault to GitHub Repository
# This script reads from the local GPG vault and pushes secrets via `gh secret set`.

set -e

echo "🔒 Syncing secrets from local vault to GitHub via 'gh' CLI..."

# Check dependencies
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) could not be found. Please install it."
    exit 1
fi
if ! command -v jq &> /dev/null; then
    echo "❌ jq could not be found. Please install it."
    exit 1
fi
if ! command -v gpg &> /dev/null; then
    echo "❌ gpg could not be found. Please install it."
    exit 1
fi

VAULT_PATH="${CRED_VAULT_PATH:-$HOME/.cred/credentials.json.gpg}"

if [ ! -f "$VAULT_PATH" ]; then
    echo "❌ Vault not found at $VAULT_PATH"
    exit 1
fi

# Decrypt the vault to a temporary file in memory/tmp
TEMP_JSON=$(mktemp)
echo "🔑 Please enter your vault passphrase when prompted by GPG."
gpg -q -d --batch --pinentry-mode loopback "$VAULT_PATH" > "$TEMP_JSON"

echo "✅ Vault decrypted successfully."

# Extract values using jq
CF_ZONE=$(jq -r '.cursor.cloudflare_zone_lorapok_tech // empty' "$TEMP_JSON")
CF_KEY=$(jq -r '.cursor.cloudflare_global_api_key_ROTATE_ME // empty' "$TEMP_JSON")
CF_EMAIL=$(jq -r '.cursor.cloudflare_account_email // empty' "$TEMP_JSON")
CF_FORWARD_TO=$(jq -r '.cursor.mail_forward_to // empty' "$TEMP_JSON")
GH_TOKEN=$(jq -r '.cursor.github_token // empty' "$TEMP_JSON")
OVSX_PAT=$(jq -r '.cursor.ovsx_pat // empty' "$TEMP_JSON")
VSCE_PAT=$(jq -r '.cursor.vsce_pat // empty' "$TEMP_JSON")

# Securely remove the temporary file
rm -f "$TEMP_JSON"

# Push to GitHub Secrets
echo "🚀 Pushing secrets to GitHub..."

if [ -n "$CF_ZONE" ] && [ "$CF_ZONE" != "null" ]; then
    echo "$CF_ZONE" | gh secret set CLOUDFLARE_ZONE_ID
    echo "  -> CLOUDFLARE_ZONE_ID set"
fi
if [ -n "$CF_KEY" ] && [ "$CF_KEY" != "null" ]; then
    echo "$CF_KEY" | gh secret set CLOUDFLARE_API_KEY
    echo "  -> CLOUDFLARE_API_KEY set"
fi
if [ -n "$CF_EMAIL" ] && [ "$CF_EMAIL" != "null" ]; then
    echo "$CF_EMAIL" | gh secret set CLOUDFLARE_API_EMAIL
    echo "  -> CLOUDFLARE_API_EMAIL set"
fi
if [ -n "$CF_FORWARD_TO" ] && [ "$CF_FORWARD_TO" != "null" ]; then
    echo "$CF_FORWARD_TO" | gh secret set CLOUDFLARE_FORWARD_TO
    echo "  -> CLOUDFLARE_FORWARD_TO set"
fi
if [ -n "$OVSX_PAT" ] && [ "$OVSX_PAT" != "null" ]; then
    echo "$OVSX_PAT" | gh secret set OVSX_PAT
    echo "  -> OVSX_PAT set"
fi
if [ -n "$VSCE_PAT" ] && [ "$VSCE_PAT" != "null" ]; then
    echo "$VSCE_PAT" | gh secret set VSCE_PAT
    echo "  -> VSCE_PAT set"
fi

echo "🎉 All secrets synchronized to GitHub!"
