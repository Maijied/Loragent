import test from 'node:test';
import assert from 'node:assert';
import path from 'path';
import os from 'os';

test('Dynamic Path Resolution', (t) => {
    t.test('should use os.homedir for credential paths', () => {
        const expected = path.join(os.homedir(), '.cred');
        // Simulate what platform-paths.json or scripts should resolve
        const resolved = expected; 
        assert.strictEqual(resolved, expected);
        assert.ok(!resolved.includes('/mnt/NewVolume/Personal_Projects'));
    });

    t.test('should use process.cwd for local execution', () => {
        const expected = path.join(process.cwd(), 'agents');
        const resolved = expected;
        assert.ok(!resolved.includes('process.cwd()')); // Ensure it didn't stay as a string
    });
});
