import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('Loragent Plugin Manifest Suite', (t) => {
  const root = process.cwd();
  const pluginJsonPath = path.join(root, 'plugin.json');

  t.test('should validate plugin.json structure and required metadata', () => {
    assert.ok(fs.existsSync(pluginJsonPath), 'plugin.json must exist in root');
    const manifest = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));

    assert.strictEqual(manifest.name, 'loragent');
    assert.strictEqual(manifest.version, '2.0.0');
    assert.strictEqual(manifest.publisher, 'LorapokLabs');
    assert.strictEqual(manifest.license, 'MIT');
    assert.strictEqual(manifest.author.name, 'Maizied');
    assert.strictEqual(manifest.author.url, 'https://lorapok.github.io');
    assert.strictEqual(manifest.homepage, 'https://loragent.lorapok.tech');
    assert.ok(Array.isArray(manifest.keywords));
    assert.ok(manifest.keywords.includes('loragent'));
    assert.ok(manifest.keywords.includes('lorapok'));
  });

  t.test('should verify all referenced assets in plugin.json exist', () => {
    const manifest = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));

    const skillsPath = path.resolve(root, manifest.skills);
    const agentsPath = path.resolve(root, manifest.agents);
    const mcpPath = path.resolve(root, manifest.mcpServers);
    const hooksPath = path.resolve(root, manifest.hooks);
    const rulesPath = path.resolve(root, manifest.rules);
    const entrypointPath = path.resolve(root, manifest.entrypoint);

    assert.ok(fs.existsSync(skillsPath), `Skills path ${skillsPath} must exist`);
    assert.ok(fs.existsSync(agentsPath), `Agents path ${agentsPath} must exist`);
    assert.ok(fs.existsSync(mcpPath), `MCP config ${mcpPath} must exist`);
    assert.ok(fs.existsSync(hooksPath), `Hooks config ${hooksPath} must exist`);
    assert.ok(fs.existsSync(rulesPath), `Rules file ${rulesPath} must exist`);
    assert.ok(fs.existsSync(entrypointPath), `Entrypoint ${entrypointPath} must exist`);
  });
});
