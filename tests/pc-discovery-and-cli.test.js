import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import PCDiscovery from '../lore/services/pc-discovery.js';
import SkillDeduplicator from '../lore/services/skill-deduplicator.js';
import ProjectAnalyzer from '../lore/services/project-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

test('Universal PC Discovery & Project Analyzer Suite', async (t) => {
  await t.test('SkillDeduplicator should normalize slugs, compute quality scores, and filter duplicates', () => {
    const rawMockSkills = [
      {
        name: 'loragent-react-best-practices',
        path: '/tmp/copy1/skills/react-best-practices/SKILL.md',
        description: 'React architectural patterns and performance tips',
        fm: { name: 'react-best-practices', description: 'React patterns', version: '2.0.0', tags: ['react', 'ui'] },
        body: '## §1 · Role & Identity\n## §3 · Primary Objective\n```javascript\nconst x = 1;\n```',
      },
      {
        name: 'react-best-practices',
        path: '/tmp/copy2/plugins/react-plugin/skills/react-best-practices/SKILL.md',
        description: 'Older clone without section markers',
        fm: { name: 'react-best-practices' },
        body: 'Simple react info',
      },
      {
        name: 'loragent-devops',
        path: '/tmp/copy1/skills/devops/SKILL.md',
        description: 'DevOps & Docker deployment specialist',
        fm: { name: 'devops', description: 'DevOps specialist', tags: ['devops', 'docker'] },
        body: '## §1 · Role & Identity\n## §5 · Execution Specifications',
      }
    ];

    const result = SkillDeduplicator.deduplicateAndEnrich(rawMockSkills);
    assert.strictEqual(result.totalRaw, 3, 'Must track 3 raw skills');
    assert.strictEqual(result.totalUnique, 2, 'Must collapse duplicates into 2 unique skills');
    assert.strictEqual(result.totalDuplicatesFiltered, 1, 'Must record 1 duplicate filtered');

    const reactSkill = result.skills.find(s => s.slug === 'react-best-practices');
    assert.ok(reactSkill, 'Must find canonical react-best-practices');
    assert.strictEqual(reactSkill.duplicateCount, 1, 'Must indicate 1 duplicate clone');
    assert.ok(reactSkill.qualityScore > 30, 'Must score high for standard sections');

    // Test category filter
    const devopsOnly = SkillDeduplicator.deduplicateAndEnrich(rawMockSkills, { category: 'devops' });
    assert.strictEqual(devopsOnly.totalUnique, 1);
    assert.strictEqual(devopsOnly.skills[0].slug, 'devops');
  });

  await t.test('PCDiscovery should scan, deduplicate, and score assets cleanly', () => {
    const inventory = PCDiscovery.discover({ save: true, unique: true });
    
    assert.ok(inventory, 'Inventory must be returned');
    assert.ok(inventory.summary, 'Summary must exist');
    assert.ok(inventory.summary.totalRawSkillsScanned > 0, 'Must scan raw skills');
    assert.ok(inventory.summary.totalUniqueSkills > 0, 'Must have unique canonical skills');
    assert.ok(inventory.summary.totalDuplicatesFiltered >= 0, 'Must track filtered duplicates');
    assert.ok(inventory.summary.totalMcpServers > 0, 'Must discover MCP servers');
    
    // Check saved inventory file
    const savedPath = path.join(ROOT, 'registry', 'pc-inventory.json');
    assert.ok(fs.existsSync(savedPath), 'registry/pc-inventory.json must exist');
  });

  await t.test('ProjectAnalyzer should accurately identify Node/React/TypeScript stack', async () => {
    const analysis = await ProjectAnalyzer.analyze(ROOT);
    
    assert.ok(analysis, 'Analysis must be returned');
    assert.ok(analysis.languages.includes('javascript'), 'Must detect JavaScript');
    assert.ok(analysis.recommendedAgents.includes('loragent-boss'), 'Must recommend boss');
    assert.ok(analysis.recommendedAgents.includes('loragent-tech-director'), 'Must recommend tech director');
    assert.ok(analysis.recommendedSkills.includes('loragent-watchman'), 'Must recommend watchman');
    assert.strictEqual(analysis.recommendedFormation, 'auto-team', 'Should select auto-team formation');
  });
});
