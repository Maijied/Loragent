#!/usr/bin/env node
/**
 * Loragent — Credential Vault Bridge & Synchronization Script
 * Runs /mnt/NewVolume/Personal_Projects/cred/sync-all.mjs across all ecosystem repos.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const syncScript = "/mnt/NewVolume/Personal_Projects/cred/sync-all.mjs";

if (!existsSync(syncScript)) {
  console.error(`Master sync script not found at ${syncScript}`);
  process.exit(1);
}

console.log("Invoking Lorapok Labs Credential Vault Master Sync...");
const r = spawnSync(process.execPath, [syncScript], { stdio: "inherit" });
process.exit(r.status ?? 0);
