#!/usr/bin/env node
/**
 * Loragent — Artifact Factory CLI v2
 * ====================================
 * Generates any Loragent artifact from a JSON spec or natural language.
 * Produces: SKILL.md, agent, mcp-fragment.json, kiro-steering, cursor-rule,
 *           formation.json, or a full skill bundle (all of the above).
 *
 * Usage:
 *   node scripts/generate-artifact.js --type <type> [options]
 *
 * Artifact types:
 *   skill       Full standalone SKILL.md + mcp-fragment + mirrors
 *   agent       Agent SKILL.md with formation/layer assignments
 *   mcp         MCP server entry + mcp-fragment.json
 *   steering    Kiro .kiro/steering/<slug>.md
 *   rule        Cursor .cursor/rules/<slug>.mdc
 *   formation   formations/<id>.json squad definition
 *   bundle      All of the above for one slug
 *
 * Input modes:
 *   --spec <file.json>     Read spec from a JSON file
 *   --name <slug>          Generate from slug + prompts (interactive)
 *   --nl <"description">   Parse natural language description (uses Claude API)
 *   --from-url <url>       Delegates to ingest-url.js (convenience wrapper)
 *
 * Examples:
 *   node scripts/generate-artifact.js --type skill --spec ./specs/my-skill.json
 *   node scripts/generate-artifact.js --type bundle --name loragent-stripe
 *   node scripts/generate-artifact.js --type mcp --nl "Stripe payment processing MCP server"
 *   node scripts/generate-artifact.js --type formation --name my-formation
 *   node scripts/generate-artifact.js --from-url https://docs.stripe.com
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

const rawArgs = process.argv.slice(2);
const flag = (f) => { const i = rawArgs.indexOf(f); return i !== -1 && rawArgs[i+1] ? rawArgs[i+1] : null; };
const has  = (f) => rawArgs.includes(f);

const TYPE     = flag('--type')?.toLowerCase();
const SPEC_FILE= flag('--spec');
const NAME     = flag('--name');
const NL_DESC  = flag('--nl');
const FROM_URL = flag('--from-url');
const DRY_RUN  = has('--dry-run');
const OUT      = flag('--out');

// ─── Help ────────────────────────────────────────────────────────────────────
if (!TYPE && !FROM_URL) {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  Loragent — Artifact Factory CLI v2                          ║
╚═══════════════════════════════════════════════════════════════╝

Artifact types:
  skill       SKILL.md + mcp-fragment.json + Kiro + Cursor mirrors
  agent       Agent SKILL.md with full §§ sections
  mcp         MCP server entry + mcp-fragment.json only
  steering    .kiro/steering/<slug>.md only
  rule        .cursor/rules/<slug>.mdc only
  formation   formations/<id>.json squad definition
  bundle      ALL of the above for one slug

Input modes:
  --spec <file.json>   Read from a JSON spec file (see templates/artifact-spec.schema.json)
  --name <slug>        Use slug + interactive prompts
  --nl "<description>" Parse natural language (uses Claude API if ANTHROPIC_API_KEY set)
  --from-url <url>     Delegates to ingest-url.js

Options:
  --out <dir>    Custom output root
  --dry-run      Preview without writing

Examples:
  node scripts/generate-artifact.js --type skill --name loragent-stripe
  node scripts/generate-artifact.js --type bundle --spec ./specs/openai-mcp.json
  node scripts/generate-artifact.js --type mcp --nl "Notion database read/write MCP"
  node scripts/generate-artifact.js --from-url https://docs.stripe.com
  node scripts/generate-artifact.js --type formation --spec ./specs/finance-team.json
`);
  process.exit(1);
}

const log  = (...a) => console.log('▶', ...a);
const ok   = (...a) => console.log('✅', ...a);
const warn = (...a) => console.warn('⚠️ ', ...a);

function writeFile(filePath, content) {
  if (DRY_RUN) {
    console.log(`\n──── DRY RUN: ${path.relative(ROOT, filePath)} ────`);
    console.log(content.split('\n').slice(0, 25).join('\n') + (content.split('\n').length > 25 ? '\n...' : ''));
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath)) fs.copyFileSync(filePath, `${filePath}.bak`);
  fs.writeFileSync(filePath, content, 'utf8');
  ok(`Written: ${path.relative(ROOT, filePath)}`);
}

// ─── Load spec ───────────────────────────────────────────────────────────────
async function resolveSpec() {
  // Delegate to ingest-url.js if --from-url
  if (FROM_URL) {
    log(`Delegating to ingest-url.js for URL: ${FROM_URL}`);
    try {
      execSync(`node ${path.join(__dirname, 'ingest-url.js')} --url "${FROM_URL}"${DRY_RUN ? ' --dry-run' : ''}`, {
        stdio: 'inherit', cwd: ROOT
      });
    } catch {}
    process.exit(0);
  }

  if (SPEC_FILE) {
    if (!fs.existsSync(SPEC_FILE)) {
      console.error(`❌ Spec file not found: ${SPEC_FILE}`);
      process.exit(1);
    }
    return JSON.parse(fs.readFileSync(SPEC_FILE, 'utf8'));
  }

  if (NL_DESC) {
    return await nlToSpec(NL_DESC);
  }

  if (NAME) {
    return buildMinimalSpec(NAME);
  }

  console.error('❌ Provide --spec, --name, --nl, or --from-url');
  process.exit(1);
}

function buildMinimalSpec(slug) {
  const clean  = slug.startsWith('loragent-') ? slug : `loragent-${slug}`;
  const base   = clean.replace('loragent-', '');
  const display= base.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  return {
    slug: clean, displayName: display,
    artifactType: TYPE || 'skill',
    formation: 'freelance', layer: 'cross', costTier: 'low',
    description: `${display} specialist agent in the Loragent ecosystem.`,
    primaryObjective: `Provide ${display} capabilities.`,
    roleIdentity: `${display} expert. Handles all ${display}-related tasks.`,
    scopeBoundary: `Only ${display} work. All other domains route to appropriate specialists.`,
    capabilitiesList: ['Domain expertise', 'Tool integration', 'Output generation'],
    toolCheckCommands: [], toolInstallCommands: [], toolVerifyCommands: [],
    executionSteps: ['1. Validate inputs', '2. Execute', '3. Validate output', '4. Return result'],
    outputFormat: 'Structured Markdown or JSON response.',
    handoffTargets: 'loragent-boss (on completion)',
    mcpServerKey: base, mcpCommand: 'npx', mcpArgs: ['-y', `${base}-mcp`],
    mcpEnvVars: {}, envVarsNeeded: [], installCommands: [],
    standaloneInvoke: `/loragent:${base}`,
    standaloneCliExample: `node skills/${clean}/cli.js --help`,
    tags: ['lorapok', 'loragent', base],
    requiresConfirmation: false, requiresStack: false,
    agentSpecificPhilosophy: '', sourceUrl: '',
  };
}

async function nlToSpec(description) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    warn('No ANTHROPIC_API_KEY — using name extraction from description');
    const words  = description.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean);
    const name   = words.slice(0, 4).join('-');
    return buildMinimalSpec(`loragent-${name}`);
  }

  log('Parsing natural language spec with Claude...');
  const prompt = `Convert this natural language description into a Loragent artifact specification JSON.
Description: "${description}"
Return ONLY a valid JSON object matching the artifact spec schema. No markdown, no explanation.
Required fields: slug, displayName, artifactType, formation, layer, costTier, description,
primaryObjective, roleIdentity, scopeBoundary, capabilitiesList, toolCheckCommands,
toolInstallCommands, toolVerifyCommands, executionSteps, outputFormat, handoffTargets,
mcpServerKey, mcpCommand, mcpArgs, mcpEnvVars, envVarsNeeded, installCommands,
standaloneInvoke, standaloneCliExample, tags, requiresConfirmation, requiresStack, agentSpecificPhilosophy.`;

  const res  = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2048, messages: [{ role: 'user', content: prompt }] }),
  });
  const data = await res.json();
  const raw  = data.content?.[0]?.text || '';
  const clean= raw.replace(/^```json\n?|^```\n?|```$/gm, '').trim();
  ok('Spec generated from natural language');
  return JSON.parse(clean);
}

// ─── Artifact generators ─────────────────────────────────────────────────────
function genSkillMd(spec) {
  const envBlock     = spec.envVarsNeeded?.map(v => `export ${v}=""`).join('\n') || '# none';
  const installBlock = [...(spec.toolInstallCommands||[]), ...(spec.installCommands||[])].join('\n') || '# none';
  const checkBlock   = spec.toolCheckCommands?.join('\n') || '# check tool availability';
  const stepsBlock   = spec.executionSteps?.join('\n') || '1. Execute\n2. Validate\n3. Return';
  const capBlock     = spec.capabilitiesList?.map(c=>`- ${c}`).join('\n') || '- General capability';
  const philo        = spec.agentSpecificPhilosophy ? `\n- **${spec.agentSpecificPhilosophy}**` : '';

  return `---
name: ${spec.slug}
description: >-
  ${spec.description}
version: 1.0.0
license: MIT
formation: ${spec.formation}
layer: ${spec.layer}
tags: ${JSON.stringify(spec.tags)}
connectors:
  - loragent-core
  - ${spec.mcpServerKey || 'filesystem'}
allowed_tools:
  - filesystem_read
  - filesystem_write
requires_confirmation: ${spec.requiresConfirmation}
requires_stack: ${spec.requiresStack}
standalone: true
cost_tier: ${spec.costTier}
source_url: ${spec.sourceUrl || ''}
generated_by: loragent-skill-factory
standalone_invoke:
  claude_code: "${spec.standaloneInvoke}"
  cli: "${spec.standaloneCliExample}"
---

# 🤖 ${spec.displayName}

> **Formation:** ${spec.formation} | **Layer:** ${spec.layer} | **Standalone:** ✅ | **v1.0.0**

---

## § Standalone Quick Start

\`\`\`bash
${spec.standaloneInvoke}
# or:
${spec.standaloneCliExample}
\`\`\`

**Env setup:**
\`\`\`bash
${envBlock}
\`\`\`

**Install:**
\`\`\`bash
${installBlock}
\`\`\`

---

## §1 · Role & Identity

**What this agent IS:**
${spec.roleIdentity}

**What this agent is NOT:**
${spec.scopeBoundary}

**Hands off to:** ${spec.handoffTargets}

---

## §2 · Core Philosophy
${philo}
- Engineering-First · Strict Handoffs · Standalone-Safe · Evidence > Assertion · Idempotent Output

---

## §3 · Primary Objective

${spec.primaryObjective}

---

## §4 · Capabilities

${capBlock}

---

## §5 · Tool Setup

\`\`\`bash
# Check
${checkBlock}
# Install
${installBlock}
# Verify
${spec.toolVerifyCommands?.join('\n') || '# verify manually'}
\`\`\`

---

## §6 · Execution Steps

${stepsBlock}

---

## §7 · MCP Call Protocol

**Stack present:**
\`\`\`javascript
await mcp.call("loragent_summon_agent", { agent: "${spec.slug}", context: payload })
await mcp.call("loragent_steer", { from: "${spec.slug}", to: "${spec.handoffTargets?.split(' ')[0]||'loragent-boss'}", payload: result })
await mcp.call("loragent_dismiss_agent", { agent: "${spec.slug}" })
\`\`\`

---

## §8 · Output Contract

**Format:** ${spec.outputFormat}

\`\`\`json
{ "agent": "${spec.slug}", "status": "complete", "standalone": true, "output": {} }
\`\`\`
`;
}

function genMcpFragment(spec) {
  return JSON.stringify({
    mcpServers: {
      [spec.mcpServerKey]: {
        command:     spec.mcpCommand,
        args:        spec.mcpArgs,
        env:         spec.mcpEnvVars,
        description: spec.description?.slice(0, 200),
        standalone:  true,
        source_url:  spec.sourceUrl || '',
      }
    }
  }, null, 2);
}

function genKiroSteering(spec) {
  return `---
inclusion: manual
name: ${spec.slug}
description: ${spec.displayName} — ${spec.roleIdentity?.slice(0,100)}
---

# ${spec.displayName}

${spec.roleIdentity}

## Scope
${spec.scopeBoundary}

## Capabilities
${spec.capabilitiesList?.map(c=>`- ${c}`).join('\n') || '- See spec'}

## Call via
\`${spec.standaloneInvoke}\` or MCP tool \`${spec.mcpServerKey}\`

<!-- Auto-generated by loragent-skill-factory -->
`;
}

function genCursorRule(spec) {
  return `---
description: ${spec.displayName} — ${spec.description?.slice(0, 120)}
globs: []
alwaysApply: false
---

# ${spec.displayName}

${spec.roleIdentity}

## Capabilities
${spec.capabilitiesList?.map(c=>`- ${c}`).join('\n') || '- See spec'}

## Invoke
\`${spec.standaloneInvoke}\` or via MCP: \`${spec.mcpServerKey}\`

<!-- Auto-generated by loragent-skill-factory -->
`;
}

function genFormation(spec) {
  const base    = spec.slug.replace('loragent-', '');
  const agents  = spec.squadAgents || [`loragent-${base}-lead`, `loragent-${base}-worker`];
  return JSON.stringify({
    $schema: '../schemas/formation.schema.json',
    id: base,
    name: `${spec.displayName} Formation`,
    formation: spec.formation || 'auto',
    leadAgent: agents[0],
    description: spec.description,
    activeAgents: agents,
    residentInContext: false,
    defaultTools: ['bash', 'filesystem_read', 'filesystem_write', 'loragent_steer', 'loragent_watchman_save'],
    slashCommand: `/loragent-boss ${base}`,
    priority: 50,
  }, null, 2);
}

// ─── Write helpers ────────────────────────────────────────────────────────────
function writeAll(spec, types) {
  const outRoot  = OUT ? path.resolve(process.cwd(), OUT) : ROOT;
  const slug     = spec.slug;
  const base     = slug.replace('loragent-', '');
  const skillDir = path.join(outRoot, '.agents', 'skills', slug);

  for (const t of types) {
    switch (t) {
      case 'skill':
      case 'agent':
        writeFile(path.join(skillDir, 'SKILL.md'), genSkillMd(spec));
        writeFile(path.join(skillDir, 'mcp-fragment.json'), genMcpFragment(spec));
        break;
      case 'mcp':
        writeFile(path.join(skillDir, 'mcp-fragment.json'), genMcpFragment(spec));
        break;
      case 'steering':
        writeFile(path.join(outRoot, '.kiro', 'steering', `${slug}.md`), genKiroSteering(spec));
        break;
      case 'rule':
        writeFile(path.join(outRoot, '.cursor', 'rules', `${slug}.mdc`), genCursorRule(spec));
        break;
      case 'formation':
        writeFile(path.join(outRoot, 'formations', `${base}.json`), genFormation(spec));
        break;
      case 'bundle':
        writeFile(path.join(skillDir, 'SKILL.md'), genSkillMd(spec));
        writeFile(path.join(skillDir, 'mcp-fragment.json'), genMcpFragment(spec));
        writeFile(path.join(outRoot, '.kiro', 'steering', `${slug}.md`), genKiroSteering(spec));
        writeFile(path.join(outRoot, '.cursor', 'rules', `${slug}.mdc`), genCursorRule(spec));
        break;
    }
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n╔═══════════════════════════════════════════╗`);
  console.log(`║  Loragent Artifact Factory CLI v2        ║`);
  console.log(`╚═══════════════════════════════════════════╝\n`);
  if (DRY_RUN) log('DRY RUN — no files written');

  const spec  = await resolveSpec();
  const types = TYPE === 'bundle' ? ['bundle'] : [TYPE || 'skill'];

  log(`Slug     : ${spec.slug}`);
  log(`Type(s)  : ${types.join(', ')}`);
  log(`Formation: ${spec.formation}`);
  log(`Layer    : ${spec.layer}`);

  writeAll(spec, types);

  console.log(`\n✅ Done! Artifact(s) generated for: ${spec.slug}`);
  console.log(`   Invoke: ${spec.standaloneInvoke}`);
  console.log(`   Validate: node scripts/enrich-skills.js --validate`);
  console.log(`   Register: node scripts/generate-marketplace.js\n`);
})();
