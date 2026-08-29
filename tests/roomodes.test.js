import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('Roo Code / Cline Custom Modes (.roomodes) Suite', async (t) => {
  const root = process.cwd();
  const roomodesPath = path.join(root, '.roomodes');

  await t.test('should validate .roomodes file existence and schema', () => {
    assert.ok(fs.existsSync(roomodesPath), '.roomodes must exist in workspace root');
    const content = fs.readFileSync(roomodesPath, 'utf8');
    const data = JSON.parse(content);
    assert.ok(Array.isArray(data.customModes), 'customModes must be an array');
    assert.ok(data.customModes.length >= 7, 'Must define at least 7 custom modes');

    const modeSlugs = data.customModes.map(m => m.slug);
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
      assert.ok(modeSlugs.includes(slug), `Mode ${slug} must be defined in .roomodes`);
      const mode = data.customModes.find(m => m.slug === slug);
      assert.ok(mode.name, `${slug} must have name`);
      assert.ok(mode.roleDefinition, `${slug} must have roleDefinition`);
      assert.ok(Array.isArray(mode.groups), `${slug} must define tool groups`);
    }
  });
});
