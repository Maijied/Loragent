# Loragent — Secure Credential Vault & Zero-Trust Integration Guide

> **Zero-Trust Enterprise Credential Vault & Machine Enclave**  
> Encrypted at rest via **AES-256 GnuPG** · Injected dynamically at runtime · Interoperable across all AI Agents, IDEs, CI/CD, and Projects.

---

## 1. Why the Credential Vault Architecture is Superior

Traditional software teams place plaintext API keys in `.env` files. This introduces severe vulnerabilities:
1. **Accidental Git Commits**: Plaintext tokens pushed to GitHub repos.
2. **Process Inspection**: Tokens passed in CLI flags appear in `ps aux` and bash history.
3. **AI Chat Leaks**: Raw keys pasted in prompt windows get logged in transcript histories.
4. **Configuration Drift**: Multiple projects using outdated or mismatched tokens.

### The Solution: Zero-Trust Machine Enclave
- **Encrypted Vault**: Stored symmetrically in `/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg`.
- **Dynamic In-Memory Fetch**: Applications call `cred get <category> <key>` or programmatic helpers to fetch secrets directly into process memory.
- **Automated Cloud Sync**: Secrets synchronize to GitHub Secrets, Cloudflare Workers/Pages, and Vercel with zero plaintext disk exposure.

---

## 2. Command Reference (`cred`)

| Command | Purpose |
|---|---|
| `cred list` | List categories and key names safely (no values) |
| `cred get <cat> <key>` | Output secret value directly to stdout for piping |
| `cred get <cat> <key> --copy` | Copy secret directly to system clipboard |
| `cred set <cat> <key>` | Prompt on hidden tty to store or rotate a secret |
| `cred env <cat>` | Generate `export KEY="value"` commands |
| `cred edit` | Securely edit decrypted JSON in tmpfs |
| `cred rm <cat> <key>` | Delete an obsolete secret key |
| `cred rekey` | Re-encrypt vault with a new master passphrase |

---

## 3. Synchronizing Across All Projects

Run the master synchronization script to install the skill and rules into every project:

```bash
node /mnt/NewVolume/Personal_Projects/cred/sync-all.mjs
# or within Loragent:
node scripts/sync-cred-vault.js
```

This distributes the `secure-cred-vault` skill across:
- **Global IDE Configs**: Claude Code (`~/.claude/skills`), Antigravity (`~/.gemini/config/skills`), Cursor (`~/.cursor/skills`).
- **All Project Repositories**: `.agents/skills/secure-cred-vault/` and `.cursor/skills/secure-cred-vault/` across all active projects.
