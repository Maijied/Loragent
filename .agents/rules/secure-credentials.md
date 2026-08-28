---
name: Enforce Secure Credential Vault
description: Mandatory rule to strictly use the `cred` vault for all secrets, tokens, and API keys.
---

# Enforce Secure Credential Vault (Compulsory Rule)

This project strictly mandates the use of the **Secure Credential Vault (`cred`)** for handling all secrets, tokens, and API keys.

## The Rule
You MUST NOT use direct tokens, hardcoded secrets, or `process.env` directly for authentication or API keys anywhere in the Loragent codebase.

## Implementation Guidelines
- **NEVER** use `process.env.API_KEY` or `process.env.TOKEN`.
- **ALWAYS** retrieve credentials dynamically via the secure vault:
  ```javascript
  import { execSync } from 'child_process';
  
  function getSecure(vaultPath) {
      try {
          return execSync(`cred get ${vaultPath} 2>/dev/null`, { encoding: 'utf8' }).trim();
      } catch {
          return null;
      }
  }
  
  const API_KEY = getSecure('integration api_key');
  ```
- **Error Handling:** If credentials are not found, do not fall back to `process.env`. Instead, throw a clear error instructing the user to run `cred set "integration api_key"`.
- **MCP Configurations:** For MCP configs, never put raw tokens in the `env` dictionary. Always wrap the execution in a bash evaluation, e.g., `bash -c "API_KEY=$(cred get integration api_key) npx integration-mcp"`.
