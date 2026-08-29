import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('MCP Server Registry (.mcp.json) Suite', async (t) => {
  const root = process.cwd();
  const mcpJsonPath = path.join(root, '.mcp.json');

  await t.test('should validate .mcp.json file existence and schema', () => {
    assert.ok(fs.existsSync(mcpJsonPath), '.mcp.json must exist in project root');
    const content = fs.readFileSync(mcpJsonPath, 'utf8');
    const data = JSON.parse(content);
    assert.ok(data.mcpServers, 'Must have mcpServers object');

    const expectedServers = [
      'loragent-core',
      'loragent-cloud',
      'github',
      'filesystem',
      'image-generate-fal',
      'image-generate-replicate',
      'gif-create',
      'browser-automation',
      'deploy-vercel',
      'deploy-railway',
      'deploy-docker',
      'database-postgres',
      'database-mysql',
      'firebase-admin',
      'slack-notify',
      'email-send',
      'openapi-caller',
      'git-ops',
      'web-search',
      'skills-loader'
    ];

    for (const server of expectedServers) {
      assert.ok(data.mcpServers[server], `Server ${server} must be defined in .mcp.json`);
    }
  });

  await t.test('should verify MCP servers are synced to IDE config paths', () => {
    const cursorMcp = path.join(root, '.cursor', 'mcp.json');
    const vscodeMcp = path.join(root, '.vscode', 'mcp.json');

    assert.ok(fs.existsSync(cursorMcp), '.cursor/mcp.json must exist');
    assert.ok(fs.existsSync(vscodeMcp), '.vscode/mcp.json must exist');

    const cursorData = JSON.parse(fs.readFileSync(cursorMcp, 'utf8'));
    assert.ok(cursorData.mcpServers['image-generate-fal'], 'image-generate-fal must be in cursor mcp.json');
    assert.ok(cursorData.mcpServers['deploy-docker'], 'deploy-docker must be in cursor mcp.json');
    assert.ok(cursorData.mcpServers['firebase-admin'], 'firebase-admin must be in cursor mcp.json');
  });
});
