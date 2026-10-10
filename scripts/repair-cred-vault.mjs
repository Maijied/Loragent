#!/usr/bin/env node
/**
 * Loragent — repair canonical cred vault: refresh Cloudflare tokens from wrangler OAuth,
 * mirror cloudflare/* category, remove deprecated global API key, sync GitHub from gh CLI.
 */
import { spawnSync } from "node:child_process";
import { decryptVault, encryptVault, loadVault } from "./lib/cred-vault-gpg.mjs";

const CCM = process.env.CCM_ROOT ?? "/home/maizied/cursor-usage-monitor";
const CCM_ADMIN = `${CCM}/website/admin`;
const DEFAULT_ACCOUNT_ID = "f049faaf2f67549f5c58837479596a4a";

function tryWranglerOAuth() {
  const r = spawnSync("npx", ["wrangler", "auth", "token", "--json"], {
    cwd: CCM_ADMIN,
    encoding: "utf8",
    env: { ...process.env, CLOUDFLARE_API_TOKEN: "", CLOUDFLARE_EMAIL_API_TOKEN: "" },
  });
  const match = `${r.stdout}\n${r.stderr}`.match(/\{[\s\S]*"token"[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]).token ?? null;
  } catch {
    return null;
  }
}

async function probeDeploy(token, accountId) {
  const pagesRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/cursor-monitor-admin`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return pagesRes.ok;
}

function ghToken() {
  const r = spawnSync("gh", ["auth", "token"], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const t = r.stdout.trim();
  return t || null;
}

const loaded = loadVault();
if (!loaded) {
  console.error("Cannot decrypt vault — set CRED_VAULT_PASSPHRASE or add .cred-vault-passphrase.");
  process.exit(1);
}

const { vault, passphrase } = loaded;
const accountId = String(vault.cursor?.cloudflare_account_id ?? DEFAULT_ACCOUNT_ID).trim();

let oauth = tryWranglerOAuth();
if (!oauth) {
  console.error("wrangler OAuth unavailable — run: cd cursor-usage-monitor/website/admin && npx wrangler login");
  process.exit(1);
}

const deployOk = await probeDeploy(oauth, accountId);
if (!deployOk) {
  console.error("wrangler OAuth token cannot access Pages API for this account.");
  process.exit(1);
}

vault.cursor = vault.cursor ?? {};
vault.cursor.cloudflare_account_id = accountId;
vault.cursor.cloudflare_api_token = oauth;
vault.cursor.cloudflare_oauth_token = oauth;
if (!vault.cursor.cloudflare_email_api_token) {
  vault.cursor.cloudflare_email_api_token = oauth;
}

vault.cloudflare = vault.cloudflare ?? {};
vault.cloudflare.account_id = accountId;
vault.cloudflare.api_token = oauth;
if (!vault.cloudflare.email_api_token) {
  vault.cloudflare.email_api_token = oauth;
}

if (vault.cursor.cloudflare_global_api_key_ROTATE_ME) {
  delete vault.cursor.cloudflare_global_api_key_ROTATE_ME;
  console.log("Removed deprecated cursor/cloudflare_global_api_key_ROTATE_ME");
}

const token = ghToken();
if (token) {
  vault.cursor.github_token = token;
  vault.github = vault.github ?? {};
  vault.github.pat = token;
  vault.titi = vault.titi ?? {};
  vault.titi.github_token = token;
  console.log("Synced github token from gh CLI into vault categories");
}

if (!encryptVault(passphrase, vault)) {
  console.error("Vault re-encryption failed.");
  process.exit(1);
}

console.log("Vault repaired:");
console.log("  • cursor/cloudflare_api_token ← wrangler OAuth (Pages-verified)");
console.log("  • cursor/cloudflare_oauth_token updated");
console.log("  • cloudflare/api_token mirrored");
console.log("\nRun: node scripts/vault-health-check.mjs");
