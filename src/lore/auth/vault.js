import { execSync } from 'child_process';
import logger from '../../utils/logger.js';

/**
 * Loragent Secure Credential Vault Wrapper
 * Automatically reads credentials. Prompts users safely if missing.
 */
class Vault {
    /**
     * Retrieve a secret from the vault.
     * @param {string} category 
     * @param {string} key 
     */
    static get(category, key) {
        try {
            // Check if cred is installed
            execSync('command -v cred', { stdio: 'ignore' });
        } catch (e) {
            logger.error(`The 'cred' CLI is not installed or not in PATH.`);
            logger.info(`Please install the Secure Cred Vault first.`);
            process.exit(1);
        }

        try {
            // Execute cred get which will prompt for PIN via pinentry if GPG agent needs it.
            const value = execSync(`cred get ${category} ${key}`, { stdio: ['inherit', 'pipe', 'pipe'] }).toString().trim();
            if (!value || value === 'null') {
                throw new Error('Key not found');
            }
            return value;
        } catch (error) {
            logger.error(`❌ Secret [${key}] in category [${category}] is missing or vault is locked.`);
            logger.info(`\nTo set this credential, run the following command in your terminal:`);
            logger.info(`  cred set ${category} ${key}`);
            logger.info(`\nIf you haven't initialized your vault yet, run 'cred init' and set a memorable PIN.`);
            process.exit(1);
        }
    }

    /**
     * Retrieve all environment variables for a category as an object
     * @param {string} category
     */
    static getEnv(category) {
        try {
            // cred env outputs lines like 'export KEY="VALUE"'
            const envStr = execSync(`cred env ${category}`, { stdio: ['inherit', 'pipe', 'pipe'] }).toString();
            const envObj = {};
            
            envStr.split('\\n').forEach(line => {
                const match = line.match(/^export (.*?)=(.*)$/);
                if (match) {
                    let val = match[2];
                    if (val.startsWith('"') && val.endsWith('"')) {
                        val = val.slice(1, -1);
                    }
                    envObj[match[1]] = val;
                }
            });
            return envObj;
        } catch (error) {
            logger.warn(`Could not load environment for category [${category}]. Proceeding with system env.`);
            return {};
        }
    }
}

export default Vault;
