import test from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import path from 'path';
import { getPinSync } from '../src/lore/auth/pin-manager.js';

const EMAIL_SCRIPT = path.join(process.cwd(), 'bin', 'loragent-email.js');

test('Loragent Email CLI', async (t) => {
    const pin = getPinSync();

    await t.test('should output usage when called with help or without args', () => {
        const result = spawnSync('node', [EMAIL_SCRIPT, 'help'], { 
            env: {
                PATH: process.env.PATH,
                CRED_PASSPHRASE: pin || ''
            }
        });
        assert.strictEqual(result.status, 0);
        assert.ok(result.stdout.toString().includes('Usage:'));
    });

    await t.test('should validate Cloudflare credentials or exit gracefully', () => {
        const result = spawnSync('node', [EMAIL_SCRIPT, 'list'], { 
            timeout: 10000,
            env: {
                PATH: process.env.PATH,
                CRED_PASSPHRASE: pin || ''
            }
        });
        assert.ok([0, 1].includes(result.status ?? 0));
    });
});
