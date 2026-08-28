# Security & Credentials

Loragent strictly forbids storing credentials in plaintext `.env` files or hardcoded scripts. 

## The Credential Vault

All secrets are managed via the `/secure-cred-vault` skill, which uses GnuPG AES-256 encryption.

Agents dynamically request secrets at runtime using the `CredVault` service:

```javascript
import CredVault from '../../lore/services/cred-vault.js';

const myToken = CredVault.get('github', 'pat');
```

If a secret is missing, Loragent will prompt the user to securely input it via the `cred` CLI.
