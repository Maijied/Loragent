import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPassphraseCandidates, VAULT_FILE } from "./vault-paths.mjs";

export { VAULT_FILE };

function withPassphraseFile(passphrase, fn) {
  const dir = mkdtempSync(join(tmpdir(), "loragent-cred-"));
  const passPath = join(dir, "pass");
  writeFileSync(passPath, `${passphrase}\n`, { mode: 0o600 });
  try {
    return fn(passPath);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function decryptVault(passphrase, vaultFile = VAULT_FILE) {
  return withPassphraseFile(passphrase, (passPath) => {
    const r = spawnSync(
      "gpg",
      [
        "--batch",
        "--quiet",
        "--yes",
        "--pinentry-mode",
        "loopback",
        "--passphrase-file",
        passPath,
        "-d",
        vaultFile,
      ],
      { encoding: "utf8" }
    );
    if (r.status !== 0 || !r.stdout.trim()) return null;
    try {
      return JSON.parse(r.stdout);
    } catch {
      return null;
    }
  });
}

export function encryptVault(passphrase, data, vaultFile = VAULT_FILE) {
  return withPassphraseFile(passphrase, (passPath) => {
    const r = spawnSync(
      "gpg",
      [
        "--batch",
        "--quiet",
        "--yes",
        "--pinentry-mode",
        "loopback",
        "--passphrase-file",
        passPath,
        "-c",
        "--cipher-algo",
        "AES256",
        "-o",
        vaultFile,
      ],
      { input: JSON.stringify(data), encoding: "utf8" }
    );
    return r.status === 0;
  });
}

/** @returns {{ vault: object, passphrase: string } | null} */
export function loadVault() {
  for (const candidate of readPassphraseCandidates()) {
    const vault = decryptVault(candidate);
    if (vault) return { vault, passphrase: candidate };
  }
  return null;
}
