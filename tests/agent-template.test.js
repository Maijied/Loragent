import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { formatAgentFromTemplate } from '../scripts/enrich-skills.js';

test('Agent Template & Specification Standard Suite', async (t) => {
  const root = process.cwd();
  const templatePath = path.join(root, 'AGENT_TEMPLATE.md');

  await t.test('should validate AGENT_TEMPLATE.md file existence and sections', () => {
    assert.ok(fs.existsSync(templatePath), 'AGENT_TEMPLATE.md must exist');
    const content = fs.readFileSync(templatePath, 'utf8');

    // Verify all 8 specification sections
    assert.ok(content.includes('§1 · Role & Identity'), 'Must contain §1 · Role & Identity');
    assert.ok(content.includes('§2 · Core Philosophy (Lorapok Ecosystem)'), 'Must contain §2 · Core Philosophy');
    assert.ok(content.includes('§3 · Primary Objective'), 'Must contain §3 · Primary Objective');
    assert.ok(content.includes('§4 · Inputs & Context Requirements'), 'Must contain §4 · Inputs & Context');
    assert.ok(content.includes('§5 · Execution Specifications'), 'Must contain §5 · Execution Specifications');
    assert.ok(content.includes('5.3 Tool Install & Call Protocol'), 'Must contain 5.3 Tool Protocol');
    assert.ok(content.includes('5.4 Failure Protocol'), 'Must contain 5.4 Failure Protocol');
    assert.ok(content.includes('§6 · Output Contract'), 'Must contain §6 · Output Contract');
    assert.ok(content.includes('§7 · Connector & MCP Server Registry'), 'Must contain §7 · Connector Registry');
    assert.ok(content.includes('§8 · Editor Compatibility Matrix'), 'Must contain §8 · Editor Compatibility Matrix');
  });

  await t.test('should correctly compile an agent specification from template', () => {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const mockAgent = {
      name: 'loragent-test-specialist',
      description: 'A mock agent for unit testing template compilation.',
      invoke_when: 'When testing template rendering.',
      do_not_invoke_when: 'In production operations.',
      version: '1.2.0',
      formation: 'chela',
      layer: 'port',
      category: 'testing',
      role: 'Automated test validator for LLDP templates.'
    };

    const compiled = formatAgentFromTemplate(mockAgent, templateContent);

    assert.ok(compiled.includes('name: loragent-test-specialist'), 'Must contain slug');
    assert.ok(compiled.includes('TEST SPECIALIST'), 'Must contain display name');
    assert.ok(compiled.includes('chela'), 'Must contain formation');
    assert.ok(compiled.includes('port'), 'Must contain layer');
    assert.ok(compiled.includes('1.2.0'), 'Must contain version');
    assert.ok(compiled.includes('Automated test validator for LLDP templates.'), 'Must contain role definition');
    assert.ok(compiled.includes('loragent_steer'), 'Must contain steer directive');
  });
});
