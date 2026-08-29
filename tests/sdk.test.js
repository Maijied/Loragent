import test from 'node:test';
import assert from 'node:assert';
import { 
  LoragentClient, 
  LoragentBoss, 
  LoragentChorki, 
  executeCLI, 
  LoragentCheckpointEngine, 
  LoragentTracer, 
  Formations, 
  CoreAgents, 
  Categories 
} from '../sdk/index.js';

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

  await t.test('should execute safe CLI commands with executeCLI', async () => {
    const res = await executeCLI('node -v');
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.code, 0);
    assert.ok(res.stdout.startsWith('v'));
  });

  await t.test('should block destructive CLI commands via guardrails', async () => {
    await assert.rejects(
      async () => {
        await executeCLI('rm -rf /');
      },
      /WORKSPACE_GUARD/
    );
  });

  await t.test('should persist and load checkpoints via LoragentCheckpointEngine', async () => {
    const engine = new LoragentCheckpointEngine();
    const chk = await engine.saveCheckpoint('test-task-1', 1, { status: 'in-progress' }, { user: 'dev' });
    assert.ok(chk.checkpointId);
    assert.strictEqual(chk.taskId, 'test-task-1');

    const loaded = await engine.loadCheckpoint(chk.checkpointId);
    assert.strictEqual(loaded.checkpointId, chk.checkpointId);
    assert.strictEqual(loaded.state.status, 'in-progress');
  });

  await t.test('should record spans and generate summaries via LoragentTracer', () => {
    const tracer = new LoragentTracer({ serviceName: 'test-tracer' });
    const spanId = tracer.startSpan('agent:handoff', { from: 'boss', to: 'tech-director' });
    assert.ok(spanId);

    const finished = tracer.endSpan(spanId, { status: 'success' });
    assert.strictEqual(finished.status, 'OK');
    assert.ok(finished.durationMs >= 0);

    const summary = tracer.getTraceSummary();
    assert.strictEqual(summary.serviceName, 'test-tracer');
    assert.strictEqual(summary.totalSpans, 1);
    assert.strictEqual(summary.errorCount, 0);
  });
});
