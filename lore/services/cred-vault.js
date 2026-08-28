import { execSync } from 'child_process';

class CredVault {
  /**
   * Gets a credential from the secure-cred-vault.
   * Note: The underlying `cred` command may prompt for a GPG passphrase if the agent/gpg-agent doesn't have it cached.
   * @param {string} category 
   * @param {string} key 
   * @returns {string} The decrypted secret
   */
  get(category, key) {
    try {
      // We assume `cred` is in the PATH or we can call it via bash
      // We trim to remove trailing newlines from the bash output
      const output = execSync(`cred get ${category} ${key}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      return output.trim();
    } catch (e) {
      throw new Error(`Failed to retrieve credential ${category}:${key}. Make sure the vault is unlocked and the credential exists.`);
    }
  }

  /**
   * Gets all environment variables for a specific category.
   * @param {string} category 
   * @returns {Object} A map of key-value pairs for the category
   */
  getEnv(category) {
    try {
      const output = execSync(`cred env ${category}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      const envVars = {};
      output.split('\n').forEach(line => {
        const match = line.match(/^export (.*?)=['"]?(.*?)['"]?$/);
        if (match) {
          envVars[match[1]] = match[2];
        }
      });
      return envVars;
    } catch (e) {
      throw new Error(`Failed to retrieve env for category ${category}.`);
    }
  }
}

export default new CredVault();
