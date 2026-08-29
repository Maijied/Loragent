import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { executeCLI } from '../sdk/tools/cli-runner.js';

test('Claude Code Extended Memory & Lifecycle Hooks Suite', (t) => {
  const root = process.cwd();

  t.test('should have 3-Layer memory files configured', () => {
    // Layer 1
    const claudeMd = path.join(root, 'CLAUDE.md');
    const agentsMd = path.join(root, 'AGENTS.md');
    assert.ok(fs.existsSync(claudeMd), 'CLAUDE.md must exist');
    assert.ok(fs.existsSync(agentsMd), 'AGENTS.md must exist');

    const content = fs.readFileSync(claudeMd, 'utf8');
    assert.ok(content.includes('Memory Architecture (3-Layer)'), 'Must define 3-Layer memory');
    assert.ok(content.includes('Auto Memory Notes Pipeline'), 'Must define Auto Memory Notes pipeline');
    assert.ok(content.includes('Progressive Disclosure (Token Budget)'), 'Must define token budget rules');

    // Layer 2: Skills / Agents directory
    const agentsDir = path.join(root, 'agents');
    assert.ok(fs.existsSync(agentsDir), 'agents directory must exist');
    const agents = fs.readdirSync(agentsDir);
    assert.ok(agents.length >= 170, 'Must have 170+ agent skills');

    // Layer 3: Watchman cache path definition
    assert.ok(content.includes('.loragent-debug/watchman-cache.json'), 'Must reference Layer 3 ephemeral session cache');
  });

  t.test('should validate hooks/hooks.json configuration and lifecycle events', () => {
    const hooksPath = path.join(root, 'hooks', 'hooks.json');
    assert.ok(fs.existsSync(hooksPath), 'hooks/hooks.json must exist');

    const hooksData = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));
    
    // Normalize hooks if array or object
    const hooksMap = {};
    if (Array.isArray(hooksData.hooks)) {
      for (const h of hooksData.hooks) {
        hooksMap[h.name] = h;
      }
    } else {
      Object.assign(hooksMap, hooksData.hooks);
    }

    assert.ok(hooksMap['pre-commit'], 'pre-commit hook must be defined');
    assert.ok(hooksMap['post-task-watchman-save'] || hooksMap['post-task'], 'post-task hook must be defined');
    assert.ok(hooksMap['pre-deploy-verify'] || hooksMap['pre-deploy'], 'pre-deploy hook must be defined');
    assert.ok(hooksMap['secret-leak-guard'], 'secret-leak-guard hook must be defined');
    assert.ok(hooksMap['destructive-io-guard'], 'destructive-io-guard hook must be defined');
  });

  t.test('should have memory pipeline agents registered in catalog', () => {
    const goldCollector = path.join(root, 'agents', 'gold-collector', 'SKILL.md');
    const skillCreator = path.join(root, 'agents', 'skill-creator', 'SKILL.md');
    const dbUpdater = path.join(root, 'agents', 'database-updater', 'SKILL.md');
    const cacheCollector = path.join(root, 'agents', 'cache-collector', 'SKILL.md');

    assert.ok(fs.existsSync(goldCollector), 'loragent-gold-collector must exist');
    assert.ok(fs.existsSync(skillCreator), 'loragent-skill-creator must exist');
    assert.ok(fs.existsSync(dbUpdater), 'loragent-database-updater must exist');
    assert.ok(fs.existsSync(cacheCollector), 'loragent-cache-collector must exist');
  });

  t.test('should enforce token budget resident set (boss, watchman, workspace-guard, spidernet, teacher)', () => {
    const residentSet = ['boss', 'watchman', 'workspace-guard', 'spidernet', 'teacher'];
    for (const agent of residentSet) {
      const p = path.join(root, 'agents', agent, 'SKILL.md');
      assert.ok(fs.existsSync(p), `Resident core agent ${agent} must exist`);
    }
  });

  t.test('should block destructive bash commands per tool permissions matrix', async () => {
    await assert.rejects(
      async () => {
        await executeCLI('rm -rf /tmp/loragent-unsafe-test');
      },
      /WORKSPACE_GUARD/
    );

    await assert.rejects(
      async () => {
        await executeCLI('wrangler delete test-worker');
      },
      /WORKSPACE_GUARD/
    );
  });
});
