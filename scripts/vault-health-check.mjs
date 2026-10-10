#!/usr/bin/env node
/**
 * Loragent — Secure Credential Vault health check (names + API probes only; no secret values).
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { loadVault, VAULT_FILE } from "./lib/cred-vault-gpg.mjs";
import { readPassphraseCandidates } from "./lib/vault-paths.mjs";

const CCM_ADMIN = process.env.CCM_ROOT
  ? `${process.env.CCM_ROOT}/website/admin`
  : "/home/maizied/cursor-usage-monitor/website/admin";

async function probeGithub(token) {
  if (!token) return { ok: false, detail: "missing" };
  const r = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "loragent-vault-check",
    },
  });
  if (r.status === 200) return { ok: true, detail: "active" };
  return { ok: false, detail: `HTTP ${r.status}` };
}

async function probeDeployToken(token, accountId) {
  if (!token) return { ok: false, status: 0 };
  const verifyRes = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const verifyBody = await verifyRes.json().catch(() => ({}));
  if (verifyRes.ok && verifyBody?.result?.status === "active") {
    return { ok: true, status: verifyRes.status, via: "verify" };
  }
  if (accountId) {
    const pagesRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/cursor-monitor-admin`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (pagesRes.ok) return { ok: true, status: pagesRes.status, via: "pages" };
  }
  return { ok: false, status: verifyRes.status || 401 };
}

async function probeEmailToken(token, accountId) {
  if (!token || !accountId) return { ok: false, status: 0 };
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/domains`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok && body.success !== false, status: res.status };
}

function maskPresent(v) {
  if (v == null) return "missing";
  const s = String(v).trim();
  if (!s) return "empty";
  return `set (${s.length} chars)`;
}

function listKeys(vault) {
  const rows = [];
  for (const [cat, obj] of Object.entries(vault ?? {})) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) continue;
    for (const key of Object.keys(obj)) rows.push(`${cat}/${key}`);
  }
  return rows.sort();
}

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

const loaded = loadVault();
console.log("=== Loragent — Secure Credential Vault health check ===\n");
console.log(`Vault: ${existsSync(VAULT_FILE) ? VAULT_FILE : "MISSING"}`);
console.log(`Passphrase sources: ${readPassphraseCandidates().length ? "found" : "MISSING"}`);

if (!loaded) {
  console.error("\nCannot decrypt vault. Add .cred-vault-passphrase or set CRED_VAULT_PASSPHRASE.");
  process.exit(1);
}

const { vault } = loaded;
const cursor = vault.cursor ?? {};
const accountId = String(cursor.cloudflare_account_id ?? "").trim();
const apiToken = String(cursor.cloudflare_api_token ?? "").trim();
const emailToken = String(cursor.cloudflare_email_api_token ?? "").trim();
const githubToken = String(cursor.github_token ?? vault.github?.pat ?? vault.titi?.github_token ?? "").trim();

console.log("\nKeys (names only):");
for (const k of listKeys(vault)) console.log(`  • ${k}`);

console.log("\nCursor / Cloudflare:");
console.log(`  cloudflare_account_id: ${accountId ? `set (${accountId.slice(0, 8)}…)` : "missing"}`);
console.log(`  cloudflare_api_token: ${maskPresent(apiToken)}`);
console.log(`  cloudflare_email_api_token: ${maskPresent(emailToken)}`);
console.log(`  github_token: ${maskPresent(githubToken)}`);

console.log("\nProbes:");
const deploy = await probeDeployToken(apiToken, accountId);
console.log(`  deploy token: ${deploy.ok ? `OK (${deploy.via})` : `FAIL HTTP ${deploy.status}`}`);
const email = await probeEmailToken(emailToken, accountId);
console.log(`  email token: ${email.ok ? `OK HTTP ${email.status}` : `FAIL HTTP ${email.status}`}`);
const gh = await probeGithub(githubToken);
console.log(`  github token: ${gh.ok ? "OK active" : `FAIL ${gh.detail}`}`);
const wrangler = tryWranglerOAuth();
console.log(`  wrangler OAuth fallback: ${wrangler ? "available" : "not logged in"}`);

const issues = [];
if (!accountId) issues.push("cursor/cloudflare_account_id missing");
if (!apiToken) issues.push("cursor/cloudflare_api_token missing");
else if (!deploy.ok && !wrangler) issues.push("deploy token invalid and wrangler not logged in");
if (!email.ok) issues.push("email token not accepted by Cloudflare Email API");
if (!githubToken) issues.push("github token missing");
else if (!gh.ok) issues.push("github token rejected");
if (cursor.cloudflare_global_api_key_ROTATE_ME) {
  issues.push("deprecated cursor/cloudflare_global_api_key_ROTATE_ME still present — run repair-cred-vault.mjs");
}

console.log("\n=== Summary ===");
if (!issues.length) {
  console.log("Vault looks healthy.");
  process.exit(0);
}
console.log("Issues:");
for (const i of issues) console.log(`  ✗ ${i}`);
process.exit(issues.some((i) => !i.includes("deprecated")) ? 2 : 1);
