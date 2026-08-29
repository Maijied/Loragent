# TiTi Vault — Zero-Trust Credential Enclave & LLE 5-Seal Architecture

> **Official Lorapok Labs Security Standard**  
> Encrypted at rest via **AES-256 GnuPG & LLE 5-Seal Chaos Engine** · Injected dynamically in memory · Universal across all 224 Loragent AI Agents, IDEs, CI/CD, and Projects.

---

## 🔒 1. Architecture: The TiTi Vault Enclave

Traditional setups store API keys in plaintext `.env` files or hardcoded configs, causing Git leaks, process inspection leaks (`ps aux`), and AI chat exposure.

**The TiTi Vault Standard:**
1. **Zero-Trust Master Enclave**: All credentials live in an encrypted GPG/AES-256 payload at `/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg`.
2. **In-Memory Dynamic Injection**: Child processes receive decrypted tokens directly in process memory via runtime clearance without touching the disk in plaintext.
3. **LLE 5-Seal Pre-Push Guard**: Git pre-push hooks automatically compile and obfuscate sensitive modules into encrypted `.titi.enc` containers before any remote push.

---

## 🛠️ 2. TiTi Vault CLI Reference (`titi` / `cred`)

| Command | Description |
|---|---|
| `titi list` / `cred list` | List all categories and secret key names safely (no values shown) |
| `titi get <cat> <key>` | Pipe decrypted secret value directly to stdout for runtime injection |
| `titi get <cat> <key> --copy` | Copy secret directly to system clipboard securely |
| `titi set <cat> <key>` | Prompt on a hidden TTY to safely record or rotate a secret |
| `titi env <cat>` | Generate in-memory `export KEY="value"` environment variables |
| `titi edit` | Safely edit JSON in a RAM-only secure temporary buffer |
| `titi rm <cat> <key>` | Remove an obsolete credential key |
| `titi rekey` | Re-encrypt the master enclave with a new clearance passphrase |

---

## 💡 3. How to Use in Development & Multi-Agent Workflows

### A. Python / PIP (Loragent SDK)
```python
import os
from loragent.auth import get_vault_secret

# Automatically fetches from TiTi Vault in-memory enclave
api_key = get_vault_secret("pypi", "token")
```

### B. Node.js / TypeScript
```javascript
import { getPinSync } from './src/lore/auth/pin-manager.js';
import { execSync } from 'child_process';

const pin = getPinSync();
const token = execSync(`CRED_PASSPHRASE="${pin}" cred get cloudflare api_token`, { encoding: 'utf8' }).trim();
```

### C. Go / Golang Module
```go
import "github.com/Maijied/Loragent/v2/pkg/loragent"

client := loragent.NewClient(
    loragent.WithAuthEnclave(os.Getenv("CRED_PASSPHRASE")),
)
```

---

## 🔄 4. Synchronizing Across All Workspaces & IDEs

Run the master TiTi Vault synchronization engine to distribute vault awareness across Claude Code, Antigravity, Cursor, and VS Code:

```bash
node /mnt/NewVolume/Personal_Projects/cred/sync-all.mjs
```
