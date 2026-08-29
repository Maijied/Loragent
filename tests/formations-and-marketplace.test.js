import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { loadFormationPreset, loadAllFormations, getMarketplaceCatalog, SQUAD_PRESETS } from '../sdk/index.js';

test('Loragent Formations & Marketplace Catalog Suite', async (t) => {
  const root = process.cwd();

  await t.test('should validate 6 Formation Squad Presets', () => {
    const formations = ['orchestrator', 'auto-team', 'office', 'chela-debugger', 'freelance-isolation', 'observer-recovery'];
    for (const f of formations) {
      const p = path.join(root, 'formations', `${f}.json`);
      assert.ok(fs.existsSync(p), `Formation ${f}.json must exist`);
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      assert.ok(data.name, `${f} must have name`);
      assert.ok(data.leadAgent, `${f} must have leadAgent`);
      assert.ok(Array.isArray(data.activeAgents) && data.activeAgents.length > 0, `${f} must have activeAgents`);
    }

    const all = loadAllFormations();
    assert.strictEqual(all.formations.length, 6, 'Must define 6 formations in index');
  });

  await t.test('should load formation presets via SDK', () => {
    const orch = loadFormationPreset('orchestrator');
    assert.ok(orch);
    assert.strictEqual(orch.leadAgent, 'loragent-boss');
    assert.ok(orch.activeAgents.includes('loragent-teacher'));

    const autoTeam = loadFormationPreset('auto-team');
    assert.ok(autoTeam);
    assert.strictEqual(autoTeam.leadAgent, 'loragent-tech-director');
  });

  await t.test('should validate registry/marketplace.json with 250+ items', () => {
    const cat = getMarketplaceCatalog();
    assert.ok(cat.totalItems >= 250, 'Marketplace catalog must contain >= 250 items');
    assert.strictEqual(cat.breakdown.formations, 6, 'Must have 6 formations in marketplace');
    assert.strictEqual(cat.breakdown.agentsAndSkills, 224, 'Must have 224 agents/skills in marketplace');
    assert.ok(cat.breakdown.mcpServers >= 15, 'Must have 15+ MCP servers in marketplace');

    // Check individual items
    const bossItem = cat.items.find(i => i.slug === 'loragent-boss');
    assert.ok(bossItem, 'loragent-boss must be in catalog');
    assert.strictEqual(bossItem.type, 'AGENT');

    const falMcp = cat.items.find(i => i.slug === 'image-generate-fal');
    assert.ok(falMcp, 'image-generate-fal MCP must be in catalog');
    assert.strictEqual(falMcp.type, 'MCP SERVER');
  });
});
