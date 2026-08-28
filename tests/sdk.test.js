import test from 'node:test';
import assert from 'node:assert';
import { LoragentClient, LoragentBoss, LoragentChorki, Formations, CoreAgents, Categories } from '../sdk/index.js';

test('Loragent SDK Suite', async (t) => {
  await t.test('should export all constants, formations, and categories', () => {
    assert.strictEqual(Formations.AUTO_TEAM, 'auto-team');
    assert.strictEqual(Formations.CHELA, 'chela');
    assert.strictEqual(CoreAgents.BOSS, 'loragent-boss');
    assert.strictEqual(CoreAgents.CHORKI, 'loragent-chorki');
    assert.strictEqual(Categories.ENGINEERING, 'engineering');
  });

  await t.test('should instantiate LoragentClient with default or custom endpoints', () => {
    const client = new LoragentClient();
    assert.strictEqual(client.endpoint, 'https://mcp.lorapk-labs.workers.dev/mcp');

    const customClient = new LoragentClient({ url: 'http://localhost:8787/mcp' });
    assert.strictEqual(customClient.endpoint, 'http://localhost:8787/mcp');
  });

  await t.test('should instantiate LoragentBoss and configure formations', async () => {
    const boss = new LoragentBoss({ endpoint: 'https://mcp.lorapk-labs.workers.dev/mcp' });
    assert.ok(boss);
    assert.strictEqual(typeof boss.initAutoTeam, 'function');
    assert.strictEqual(typeof boss.initOffice, 'function');
    assert.strictEqual(typeof boss.initChela, 'function');
  });

  await t.test('should instantiate LoragentChorki loop engine', () => {
    const chorki = new LoragentChorki();
    assert.ok(chorki);
    assert.strictEqual(typeof chorki.runLoop, 'function');
  });
});
