import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import readline from 'readline';

const ENV_DIR = path.join(os.homedir(), '.loragent');
const ENV_FILE = path.join(ENV_DIR, 'env.json');
const LOCAL_ENV_FILE = path.join(process.cwd(), '.env');
const ALGORITHM = 'aes-256-cbc';

function getMachineKey() {
    const userInfo = os.userInfo();
    const uniqueString = `${os.hostname()}-${userInfo.username}-${userInfo.uid || 'lorapok'}`;
    return crypto.createHash('sha256').update(uniqueString).digest();
}

/**
 * Encrypt PIN using machine-derived key
 */
export function encryptPin(pin) {
    const key = getMachineKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(pin, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
}

/**
 * Decrypt PIN using machine-derived key
 */
export function decryptPin(encryptedData, ivHex) {
    const key = getMachineKey();
    const iv = Buffer.from(ivHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

/**
 * Save encrypted PIN to .env in workspace and ~/.loragent/env.json
 */
export function savePin(pin, envPath = LOCAL_ENV_FILE) {
    try {
        const payload = encryptPin(pin);

        // 1. Save to ~/.loragent/env.json
        if (!fs.existsSync(ENV_DIR)) {
            fs.mkdirSync(ENV_DIR, { recursive: true });
        }
        fs.writeFileSync(ENV_FILE, JSON.stringify(payload), { mode: 0o600 });

        // 2. Save encrypted PIN to .env
        let envContent = '';
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        const lines = envContent.split('\n').filter(line => 
            !line.startsWith('LORAGENT_VAULT_ENCRYPTED_PIN=') &&
            !line.startsWith('LORAGENT_VAULT_IV=')
        );

        lines.push(`LORAGENT_VAULT_ENCRYPTED_PIN="${payload.encryptedData}"`);
        lines.push(`LORAGENT_VAULT_IV="${payload.iv}"`);

        fs.writeFileSync(envPath, lines.join('\n') + '\n', { mode: 0o600 });
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Synchronously retrieve and decrypt PIN from .env or env.json
 */
export function getPinSync(envPath = LOCAL_ENV_FILE) {
    // 1. Direct environment variable (already decrypted)
    if (process.env.CRED_PASSPHRASE) {
        return process.env.CRED_PASSPHRASE;
    }

    // 2. Read from .env
    if (fs.existsSync(envPath)) {
        try {
            const content = fs.readFileSync(envPath, 'utf8');
            const encMatch = content.match(/LORAGENT_VAULT_ENCRYPTED_PIN=["']?([^"'\n]+)["']?/);
            const ivMatch = content.match(/LORAGENT_VAULT_IV=["']?([^"'\n]+)["']?/);
            
            if (encMatch && ivMatch) {
                return decryptPin(encMatch[1], ivMatch[1]);
            }
        } catch {}
    }

    // 3. Read from ~/.loragent/env.json
    if (fs.existsSync(ENV_FILE)) {
        try {
            const payload = JSON.parse(fs.readFileSync(ENV_FILE, 'utf8'));
            return decryptPin(payload.encryptedData, payload.iv);
        } catch {}
    }

    return null;
}

/**
 * Async getPin with interactive prompt fallback
 */
export async function getPin(promptIfMissing = true) {
    const resolved = getPinSync();
    if (resolved) return resolved;

    if (promptIfMissing && process.stdin.isTTY) {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Please enter your Secure Cred Vault PIN: ', (answer) => {
                rl.close();
                const pin = answer.trim();
                if (pin) {
                    savePin(pin);
                    resolve(pin);
                } else {
                    process.exit(1);
                }
            });
        });
    }

    return null;
}
