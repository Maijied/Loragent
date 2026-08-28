import test from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import path from 'path';

const EMAIL_SCRIPT = path.join(process.cwd(), 'bin', 'loragent-email.js');

test('Loragent Email CLI', (t) => {
    t.test('should fail without environment variables', () => {
        // Run with empty env
        const result = spawnSync('node', [EMAIL_SCRIPT, 'list'], { env: {} });
        assert.notStrictEqual(result.status, 0);
        assert.ok(result.stderr.toString().includes('Missing required Cloudflare environment variables'));
    });

    t.test('should output usage when called without args', () => {
        const result = spawnSync('node', [EMAIL_SCRIPT], { 
            env: {
                CLOUDFLARE_ZONE_ID: 'dummy',
                CLOUDFLARE_API_KEY: 'dummy',
                CLOUDFLARE_API_EMAIL: 'dummy'
            }
        });
        assert.strictEqual(result.status, 0);
        assert.ok(result.stdout.toString().includes('Usage:'));
    });
});
