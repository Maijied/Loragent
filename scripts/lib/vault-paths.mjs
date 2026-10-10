import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { homedir } from "node:os";

export const VAULT_FILE =
  process.env.CRED_STORE_FILE ?? "/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg";

const PASSPHRASE_FILES = [
  resolve(process.env.LORAGENT_ROOT ?? "/mnt/NewVolume/Personal_Projects/loragent", ".cred-vault-passphrase"),
  "/mnt/NewVolume/Personal_Projects/cred/.cred-vault-passphrase",
  "/mnt/NewVolume/Personal_Projects/cursor-usage-monitor/.cred-vault-passphrase",
  "/mnt/NewVolume/Personal_Projects/cursor-usage-monitor/website/admin/.cred-vault-passphrase",
  "/mnt/NewVolume/Personal_Projects/cred/VAULT_PASSPHRASE_READ_ONCE.txt",
  resolve(homedir(), ".cred", "pin"),
  "/mnt/NewVolume/Personal_Projects/cred/.pin",
];

function parsePassphraseFile(raw) {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const parsed = [];
  const labeled = raw.match(/^Passphrase:\s*(.+)$/m);
  if (labeled?.[1]) parsed.push(labeled[1].trim());
  for (const line of lines) {
    if (/^passphrase:/i.test(line)) {
      const inline = line.replace(/^passphrase:\s*/i, "").trim();
      if (inline) parsed.push(inline);
    } else if (
      line &&
      !/^one-time/i.test(line) &&
      !/^vault:/i.test(line) &&
      !/^created:/i.test(line) &&
      !/^passphrase:?$/i.test(line)
    ) {
      parsed.push(line);
    }
  }
  return parsed;
}

/** @returns {string[]} */
export function readPassphraseCandidates() {
  const out = [];
  const fromEnv = (process.env.CRED_VAULT_PASSPHRASE ?? process.env.CRED_PASSPHRASE ?? "").trim();
  if (fromEnv) out.push(fromEnv);

  for (const file of PASSPHRASE_FILES) {
    if (!existsSync(file)) continue;
    try {
      out.push(...parsePassphraseFile(readFileSync(file, "utf8").trim()));
    } catch {
      /* ignore */
    }
  }

  return [...new Set(out.filter(Boolean))];
}
