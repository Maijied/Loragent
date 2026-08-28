# Secure Credential Vault (cred)

Loragent prioritizes security. To ensure API keys (like OpenAI, GitHub, or Composio) never leak in your configuration files or repositories, we integrate deeply with the **Secure Credential Vault**.

## How it works

The vault stores all your secrets in a single JSON file that is heavily encrypted using GnuPG (AES-256).

Loragent reads these values **automatically** at runtime. You do not need to paste keys into `.env` or `mcp.json` files!

## Setting up your PIN (Passphrase)

When you initialize the vault or fetch a key for the first time in a session, you will be prompted to enter your **PIN (Passphrase)**.

1. **Initialize the vault** (Only needed once per PC):
   ```bash
   cred init
   ```
   *You will be prompted via a secure popup (`pinentry`) to create a strong PIN/passphrase. Do not forget this PIN!*

2. **Storing a Secret**:
   Instead of writing a secret in code, use the `cred` CLI:
   ```bash
   cred set composio api_key
   ```
   The terminal will securely ask you to paste the value. The secret is immediately encrypted with your PIN.

## Automatic Reads by Loragent

When Loragent needs the Composio API key, it internally calls:
```javascript
const composioKey = Vault.get('composio', 'api_key');
```

If your GPG agent is locked, your OS will automatically show a secure prompt asking for your PIN to decrypt it.
If the key hasn't been set yet, Loragent gracefully pauses and explains exactly what `cred set` command you need to run to add it.

This completely eliminates credential exposure in version control or plain text!
