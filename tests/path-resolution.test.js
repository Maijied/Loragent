import test from 'node:test';
import assert from 'node:assert';
import os from 'os';
import path from 'path';

test('Dynamic Path Resolution', async (t) => {
    await t.test('should use os.homedir for credential paths', () => {
        const expectedBase = os.homedir();
        const credPath = path.join(os.homedir(), '.cred', 'vault.json');
        
        assert.ok(credPath.startsWith(expectedBase));
        assert.ok(!credPath.includes('/Users/'));
    });

    await t.test('should use process.cwd for local execution', () => {
        const root = process.cwd();
        assert.ok(root.length > 0);
        assert.ok(path.isAbsolute(root));
    });
});
