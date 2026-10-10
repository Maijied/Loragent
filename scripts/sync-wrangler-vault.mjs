#!/usr/bin/env node
/**
 * Loragent — use wrangler OAuth to GET deploy auth and SET vault + GitHub + Pages/worker secrets.
 *
 * Prereq: cd cursor-usage-monitor/website/admin && npx wrangler login
 *
 *   node scripts/sync-wrangler-vault.mjs
 *   node scripts/sync-wrangler-vault.mjs --skip-mail   # skip enable-mail worker setup
 *   node scripts/sync-wrangler-vault.mjs --dry-run
 */
import { spawnSync } from "node:child_process";
import { encryptVault, loadVault } from "./lib/cred-vault-gpg.mjs";

const CCM = process.env.CCM_ROOT ?? "/home/maizied/cursor-usage-monitor";
const CCM_ADMIN = `${CCM}/website/admin`;
const CCM_REPO = "Maijied/Cursor-Curse-Monitor-by-Lorapok";
const LORAGENT_REPO = "Maijied/Loragent";
const DEFAULT_ACCOUNT_ID = "f049faaf2f67549f5c58837479596a4a";
const PAGES_PROJECT = "cursor-monitor-admin";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const skipMail = args.has("--skip-mail");

function log(step, msg) {
  console.log(`\n[wrangler-sync] ${step} ${msg}`);
}

function wranglerOAuth() {
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

function ghToken() {
  const r = spawnSync("gh", ["auth", "token"], { encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() || null : null;
}

function ghSecret(name, value, { repo, env } = {}) {
  if (!value) return;
  const cmd = ["secret", "set", name];
  if (env) cmd.push("--env", env);
  if (repo) cmd.push("--repo", repo);
  if (dryRun) {
    console.log(`[dry-run] gh ${cmd.join(" ")}`);
    return;
  }
  const r = spawnSync("gh", cmd, { input: value, encoding: "utf8", stdio: ["pipe", "inherit", "inherit"] });
  if (r.status !== 0) throw new Error(`gh secret set ${name} failed`);
  console.log(`  ✓ GitHub ${env ? `${env}/` : ""}${name}`);
}

function pagesSecret(name, value, deployToken, accountId) {
  if (!value) return;
  if (dryRun) {
    console.log(`[dry-run] wrangler pages secret put ${name}`);
    return;
  }
  const r = spawnSync(
    "npx",
    ["wrangler", "pages", "secret", "put", name, `--project-name=${PAGES_PROJECT}`],
    {
      cwd: CCM_ADMIN,
      input: value,
      encoding: "utf8",
      stdio: ["pipe", "inherit", "inherit"],
      env: {
        ...process.env,
        CI: "true",
        WRANGLER_SEND_METRICS: "false",
        CLOUDFLARE_ACCOUNT_ID: accountId,
        CLOUDFLARE_API_TOKEN: deployToken,
      },
    }
  );
  if (r.status !== 0) throw new Error(`wrangler pages secret put ${name} failed`);
  console.log(`  ✓ Pages ${name}`);
}

function workerSecret(name, value, deployToken, accountId, config = "workers/stats-cron/wrangler.toml") {
  if (!value) return;
  if (dryRun) {
    console.log(`[dry-run] wrangler secret put ${name} (${config})`);
    return;
  }
  const r = spawnSync("npx", ["wrangler", "secret", "put", name, "--config", config], {
    cwd: CCM_ADMIN,
    input: value,
    encoding: "utf8",
    stdio: ["pipe", "inherit", "inherit"],
    env: {
      ...process.env,
      CI: "true",
      WRANGLER_SEND_METRICS: "false",
      CLOUDFLARE_ACCOUNT_ID: accountId,
      CLOUDFLARE_API_TOKEN: deployToken,
    },
  });
  if (r.status !== 0) {
    console.warn(`  ⚠ wrangler secret put ${name} failed (worker may be missing in this checkout)`);
    return;
  }
  console.log(`  ✓ Worker ${name}`);
}

async function probeDeploy(token, accountId) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${PAGES_PROJECT}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.ok;
}

async function probeEmail(token, accountId) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/domains`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const body = await res.json().catch(() => ({}));
  return res.ok && body.success !== false;
}

function runNodeScript(scriptPath, extraEnv = {}) {
  if (dryRun) {
    console.log(`[dry-run] node ${scriptPath}`);
    return true;
  }
  const r = spawnSync(process.execPath, [scriptPath], {
    cwd: CCM_ADMIN,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  return r.status === 0;
}

const oauth = wranglerOAuth();
if (!oauth) {
  console.error("wrangler OAuth missing. Run:\n  cd cursor-usage-monitor/website/admin && npx wrangler login");
  process.exit(1);
}

const loaded = loadVault();
if (!loaded) {
  console.error("Cannot decrypt gpg vault — add .cred-vault-passphrase or CRED_VAULT_PASSPHRASE.");
  process.exit(1);
}

const { vault, passphrase } = loaded;
const accountId = String(vault.cursor?.cloudflare_account_id ?? DEFAULT_ACCOUNT_ID).trim();
const github = ghToken() ?? String(vault.cursor?.github_token ?? vault.github?.pat ?? "").trim();
const cronSecret = String(vault.cursor?.cron_secret ?? "").trim();

log("1/6", "Probing wrangler OAuth against Cloudflare Pages…");
const deployOk = await probeDeploy(oauth, accountId);
if (!deployOk) {
  console.error("wrangler OAuth cannot access Mission Control Pages project.");
  process.exit(1);
}
console.log("  ✓ deploy auth OK (wrangler OAuth)");

const emailOk = await probeEmail(oauth, accountId);
console.log(`  ${emailOk ? "✓" : "⚠"} email REST API ${emailOk ? "OK" : "not available on this token (mail relay may still work)"}`);

log("2/6", "Updating gpg cred vault…");
vault.cursor = vault.cursor ?? {};
vault.cursor.cloudflare_account_id = accountId;
vault.cursor.cloudflare_api_token = oauth;
vault.cursor.cloudflare_oauth_token = oauth;
vault.cursor.cloudflare_email_api_token = oauth;
if (github) {
  vault.cursor.github_token = github;
  vault.github = vault.github ?? {};
  vault.github.pat = github;
  vault.titi = vault.titi ?? {};
  vault.titi.github_token = github;
}
vault.cloudflare = vault.cloudflare ?? {};
vault.cloudflare.account_id = accountId;
vault.cloudflare.api_token = oauth;
vault.cloudflare.email_api_token = oauth;
delete vault.cursor?.cloudflare_global_api_key_ROTATE_ME;

if (!dryRun && !encryptVault(passphrase, vault)) {
  console.error("Vault encrypt failed.");
  process.exit(1);
}
console.log("  ✓ credentials.json.gpg updated");

const mailEnv = {
  CLOUDFLARE_ACCOUNT_ID: accountId,
  CLOUDFLARE_API_TOKEN: oauth,
  CLOUDFLARE_EMAIL_API_TOKEN: oauth,
  ...(github ? { GITHUB_TOKEN: github } : {}),
  ...(cronSecret ? { CRON_SECRET: cronSecret } : {}),
};

log("3/6", `GitHub secrets → ${CCM_REPO} (admin-production + repo)…`);
ghSecret("CLOUDFLARE_ACCOUNT_ID", accountId, { repo: CCM_REPO });
ghSecret("CLOUDFLARE_API_TOKEN", oauth, { repo: CCM_REPO });
ghSecret("CLOUDFLARE_EMAIL_API_TOKEN", oauth, { repo: CCM_REPO });
ghSecret("CLOUDFLARE_ACCOUNT_ID", accountId, { repo: CCM_REPO, env: "admin-production" });
ghSecret("CLOUDFLARE_API_TOKEN", oauth, { repo: CCM_REPO, env: "admin-production" });
ghSecret("CLOUDFLARE_EMAIL_API_TOKEN", oauth, { repo: CCM_REPO, env: "admin-production" });
if (github) {
  // GitHub reserves GITHUB_* for built-in tokens — Pages secret only (see sync-github-token-cred-vault.mjs).
  console.log("  ℹ skipping gh secret GITHUB_TOKEN (reserved); syncing to Pages via wrangler");
}
if (cronSecret) {
  ghSecret("CRON_SECRET", cronSecret, { repo: CCM_REPO, env: "admin-production" });
}

log("4/6", `GitHub secrets → ${LORAGENT_REPO}…`);
ghSecret("CLOUDFLARE_ACCOUNT_ID", accountId, { repo: LORAGENT_REPO });
ghSecret("CLOUDFLARE_API_TOKEN", oauth, { repo: LORAGENT_REPO });

log("5/6", "Wrangler Pages + worker secrets (Mission Control)…");
pagesSecret("CLOUDFLARE_EMAIL_API_TOKEN", oauth, oauth, accountId);
if (github) pagesSecret("GITHUB_TOKEN", github, oauth, accountId);
if (cronSecret) {
  pagesSecret("CRON_SECRET", cronSecret, oauth, accountId);
  workerSecret("CRON_SECRET", cronSecret, oauth, accountId);
}

if (!skipMail) {
  log("6/6", "enable-mail (relay worker + domain via wrangler)…");
  const mailOk = runNodeScript(`${CCM_ADMIN}/scripts/enable-mail.mjs`, mailEnv);
  if (!mailOk) {
    console.warn("  ⚠ enable-mail had errors — deploy/mail relay may need manual check");
  }
} else {
  log("6/6", "Skipped enable-mail (--skip-mail)");
}

console.log("\n=== Done ===");
console.log("Verify:  node scripts/vault-health-check.mjs");
console.log("Mail:    cd cursor-usage-monitor && node website/admin/scripts/verify-mail-setup.mjs");
