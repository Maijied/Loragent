import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import readline from 'readline';
import logger from '../../utils/logger.js';

const ENV_DIR = path.join(os.homedir(), '.loragent');
const ENV_FILE = path.join(ENV_DIR, 'env.json');
const ALGORITHM = 'aes-256-cbc';

function getMachineKey() {
    const userInfo = os.userInfo();
    const uniqueString = `${os.hostname()}-${userInfo.username}-${userInfo.uid}`;
    return crypto.createHash('sha256').update(uniqueString).digest();
}

export function savePin(pin) {
    try {
        if (!fs.existsSync(ENV_DIR)) {
            fs.mkdirSync(ENV_DIR, { recursive: true });
        }
        
        const key = getMachineKey();
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        
        let encrypted = cipher.update(pin, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const payload = {
            iv: iv.toString('hex'),
            encryptedData: encrypted
        };
        
        fs.writeFileSync(ENV_FILE, JSON.stringify(payload), { mode: 0o600 });
        logger.info('PIN successfully encrypted and saved to ~/.loragent/env.json');
        return true;
    } catch (err) {
        logger.error('Failed to save PIN:', err.message);
        return false;
    }
}

export async function getPin(promptIfMissing = true) {
    try {
        if (fs.existsSync(ENV_FILE)) {
            const payload = JSON.parse(fs.readFileSync(ENV_FILE, 'utf8'));
            const key = getMachineKey();
            const iv = Buffer.from(payload.iv, 'hex');
            
            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
            let decrypted = decipher.update(payload.encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        }
    } catch (err) {
        logger.error('Failed to read or decrypt saved PIN. It may be corrupted or from a different machine.');
    }

    if (promptIfMissing) {
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
                    logger.error('PIN cannot be empty.');
                    process.exit(1);
                }
            });
        });
    }

    return null;
}
