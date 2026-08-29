import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('Roo Code / Cline Custom Modes (.roomodes) Suite', (t) => {
  const root = process.cwd();
  const roomodesPath = path.join(root, '.roomodes');

  t.test('should validate .roomodes file existence and schema', () => {
    assert.ok(fs.existsSync(roomodesPath), '.roomodes should exist in workspace root');
    const raw = fs.readFileSync(roomodesPath, 'utf8');
    const parsed = JSON.parse(raw);

    assert.ok(Array.isArray(parsed.customModes), 'customModes must be an array');
    assert.strictEqual(parsed.customModes.length, 7, 'should define all 7 custom modes');

    const expectedSlugs = [
      'loragent-boss',
      'loragent-auto-team',
      'loragent-chela',
      'loragent-office',
      'loragent-creative',
      'loragent-devops',
      'loragent-watchman'
    ];

    for (const slug of expectedSlugs) {
      const mode = parsed.customModes.find(m => m.slug === slug);
      assert.ok(mode, `custom mode ${slug} should exist`);
      assert.ok(mode.name, `mode ${slug} must have a name`);
      assert.ok(mode.roleDefinition, `mode ${slug} must have a roleDefinition`);
      assert.ok(Array.isArray(mode.groups), `mode ${slug} must have groups array`);
    }
  });
});
