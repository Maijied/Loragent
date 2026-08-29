import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import PCDiscovery from '../lore/services/pc-discovery.js';
import ProjectAnalyzer from '../lore/services/project-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

test('Universal PC Discovery & Project Analyzer Suite', async (t) => {
  await t.test('PCDiscovery should scan and inventory assets', () => {
    const inventory = PCDiscovery.discover({ save: true });
    
    assert.ok(inventory, 'Inventory must be returned');
    assert.ok(inventory.summary, 'Summary must exist');
    assert.ok(Array.isArray(inventory.locationsScanned), 'Locations scanned must be an array');
    assert.ok(inventory.summary.totalSkills > 0, 'Must discover skills on the machine');
    assert.ok(inventory.summary.totalMcpServers > 0, 'Must discover MCP servers on the machine');
    
    // Check saved inventory file
    const savedPath = path.join(ROOT, 'registry', 'pc-inventory.json');
    assert.ok(fs.existsSync(savedPath), 'registry/pc-inventory.json must exist');
  });

  await t.test('ProjectAnalyzer should accurately identify Node/React/TypeScript stack', async () => {
    // Analyze current loragent repo
    const analysis = await ProjectAnalyzer.analyze(ROOT);
    
    assert.ok(analysis, 'Analysis must be returned');
    assert.ok(analysis.languages.includes('javascript'), 'Must detect JavaScript');
    assert.ok(analysis.recommendedAgents.includes('loragent-boss'), 'Must recommend boss');
    assert.ok(analysis.recommendedAgents.includes('loragent-tech-director'), 'Must recommend tech director');
    assert.ok(analysis.recommendedSkills.includes('loragent-watchman'), 'Must recommend watchman');
    assert.strictEqual(analysis.recommendedFormation, 'auto-team', 'Should select auto-team formation');
  });

  await t.test('ProjectAnalyzer should handle non-existent directory gracefully', async () => {
    const fakePath = path.join(ROOT, 'non-existent-sandbox-dir');
    const analysis = await ProjectAnalyzer.analyze(fakePath);
    
    assert.ok(analysis);
    assert.strictEqual(analysis.languages.length, 0);
  });
});
