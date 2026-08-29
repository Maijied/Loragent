#!/usr/bin/env node
/**
 * Loragent — Web & Remote URL Ingest Pipeline v2
 * ================================================
 * Fetches any URL, uses Claude to analyze what it describes,
 * and generates production-grade Loragent artifacts automatically:
 *   - SKILL.md (standalone, with all §§ sections)
 *   - mcp-fragment.json (standalone connector config)
 *   - .kiro/steering/<slug>.md mirror
 *   - .cursor/rules/<slug>.mdc mirror
 *   - Updates registry/marketplace.json
 *
 * Usage:
 *   node scripts/ingest-url.js --url <url> [options]
 *
 * Options:
 *   --url <url>             URL to ingest (required)
 *   --type <skill|mcp|agent|steering>  Force artifact type (default: auto-detect)
 *   --out <dir>             Custom output directory
 *   --slug <name>           Override auto-generated slug
 *   --dry-run               Preview generated output, no files written
 *   --no-mirrors            Skip .kiro/steering + .cursor/rules generation
 *   --no-marketplace        Skip updating registry/marketplace.json
 *   --formation <name>      Override formation (default: freelance)
 *   --layer <name>          Override LLDP layer (default: auto-detect)
 *
 * Examples:
 *   node scripts/ingest-url.js --url https://docs.fal.ai
 *   node scripts/ingest-url.js --url https://github.com/modelcontextprotocol/servers --type mcp
 *   node scripts/ingest-url.js --url https://replicate.com/docs --type skill --formation freelance
 *   node scripts/ingest-url.js --url https://docs.anthropic.com --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

// ─── Arg parsing ────────────────────────────────────────────────────────────
const rawArgs = process.argv.slice(2);
const flag = (f) => { const i = rawArgs.indexOf(f); return i !== -1 && rawArgs[i+1] ? rawArgs[i+1] : null; };
const has  = (f) => rawArgs.includes(f);

const TARGET_URL   = flag('--url');
const FORCE_TYPE   = flag('--type')?.toLowerCase();
const CUSTOM_OUT   = flag('--out');
const CUSTOM_SLUG  = flag('--slug');
const FORCE_FORM   = flag('--formation');
const FORCE_LAYER  = flag('--layer');
const DRY_RUN      = has('--dry-run');
const NO_MIRRORS   = has('--no-mirrors');
const NO_MKTPLACE  = has('--no-marketplace');

if (!TARGET_URL) {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  Loragent — Web & Remote URL Ingest Pipeline v2              ║
╚═══════════════════════════════════════════════════════════════╝

Usage:
  node scripts/ingest-url.js --url <url> [options]

Required:
  --url <url>            URL to fetch and analyze

Options:
  --type skill|mcp|agent|steering  Force artifact type (default: auto)
  --out <dir>            Custom output directory for generated files
  --slug <name>          Override the auto-generated slug
  --formation <name>     auto|office|chela|freelance|observer (default: freelance)
  --layer <name>         face|pulse|lore|port|loom|cross (default: auto)
  --dry-run              Preview output without writing files
  --no-mirrors           Skip Kiro + Cursor mirror generation
  --no-marketplace       Skip updating registry/marketplace.json

Examples:
  node scripts/ingest-url.js --url https://docs.fal.ai
  node scripts/ingest-url.js --url https://github.com/some/mcp-server --type mcp
  node scripts/ingest-url.js --url https://replicate.com/docs --dry-run
  node scripts/ingest-url.js --url https://sdk.vercel.ai --formation freelance --layer loom
`);
  process.exit(1);
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const log  = (...a) => console.log('▶', ...a);
const ok   = (...a) => console.log('✅', ...a);
const warn = (...a) => console.warn('⚠️ ', ...a);
const err  = (...a) => { console.error('❌', ...a); process.exit(1); };

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function writeFile(filePath, content) {
  if (DRY_RUN) {
    console.log(`\n──── DRY RUN: ${filePath} ────`);
    console.log(content.split('\n').slice(0, 30).join('\n'));
    if (content.split('\n').length > 30) console.log('  ... (truncated)');
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath)) fs.copyFileSync(filePath, `${filePath}.bak`);
  fs.writeFileSync(filePath, content, 'utf8');
  ok(`  Written: ${path.relative(ROOT, filePath)}`);
}

// ─── Step 1: Fetch URL content ───────────────────────────────────────────────
async function fetchContent(url) {
  log(`Fetching: ${url}`);
  let html = '';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Loragent-Ingest/2.0 (github.com/Maijied/Loragent)',
        'Accept': 'text/html,application/json,text/markdown,*/*',
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    warn(`Fetch failed (${e.message}). Proceeding with URL-only analysis.`);
    return null;
  }

  // Strip HTML tags to get readable text (simple approach, no deps)
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .trim()
    .slice(0, 12000); // cap at 12K chars to fit in Claude context

  ok(`Fetched ${text.length} chars from ${url}`);
  return text;
}

// ─── Step 2: Claude analysis ─────────────────────────────────────────────────
async function analyzeWithClaude(url, content) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    warn('ANTHROPIC_API_KEY not set — using heuristic analysis only');
    return heuristicAnalyze(url);
  }

  log('Analyzing with Claude API...');

  const prompt = `You are the Loragent Skill Factory. Analyze this URL and its content, then generate a complete Loragent artifact specification as a JSON object.

URL: ${url}
Content (first 12K chars):
---
${content || '(fetch failed — analyze from URL only)'}
---

Return ONLY a JSON object (no markdown, no explanation) with this exact shape:
{
  "slug": "loragent-<kebab-case-name>",
  "displayName": "Human Readable Name",
  "artifactType": "skill|mcp|agent|steering",
  "formation": "freelance|auto|office|chela|observer",
  "layer": "face|pulse|lore|port|loom|cross",
  "costTier": "low|medium|high",
  "description": "One dense paragraph: what this provides, WHEN to invoke it, when NOT to invoke it.",
  "primaryObjective": "One sentence: the single measurable outcome.",
  "roleIdentity": "2-3 sentences: what role this agent plays, what expertise it provides.",
  "scopeBoundary": "What this agent/skill does NOT do.",
  "capabilitiesList": ["capability 1", "capability 2", "..."],
  "toolCheckCommands": ["which <tool> || echo NOT_FOUND", "..."],
  "toolInstallCommands": ["npm install -g <pkg>", "pip install <pkg>", "..."],
  "toolVerifyCommands": ["<tool> --version", "..."],
  "executionSteps": ["Step 1: ...", "Step 2: ...", "..."],
  "outputFormat": "Description of what this agent/skill outputs.",
  "handoffTargets": "loragent-boss (on completion) or specific agent slug",
  "mcpServerKey": "kebab-case-mcp-server-name",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "<package-name>"],
  "mcpEnvVars": { "ENV_VAR_NAME": "\${ENV_VAR_NAME}" },
  "envVarsNeeded": ["ENV_VAR_NAME", "..."],
  "installCommands": ["npm install -g <pkg>", "..."],
  "standaloneInvoke": "/loragent:<slug>",
  "standaloneCliExample": "node skills/<slug>/cli.js --help",
  "tags": ["lorapok", "loragent", "<domain>"],
  "requiresConfirmation": false,
  "requiresStack": false,
  "agentSpecificPhilosophy": "One custom philosophy bullet for this specific agent, or empty string."
}

Classification rules:
- "mcp" if the URL is a GitHub MCP server, has "mcp" in the path, or describes an MCP server implementation
- "skill" if it's a documentation page, API reference, tool guide, or service docs
- "agent" if it describes a role or persona (a developer type, a business function)
- "steering" if it's a standards doc, style guide, or architectural reference
- Layer: face=UI/visual, pulse=realtime/streaming, lore=data/AI/ML, port=API/auth/payments, loom=infra/deploy, cross=orchestration/meta`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    const rawText = data.content?.[0]?.text || '';
    // Strip any accidental markdown fences
    const clean = rawText.replace(/^```json\n?|^```\n?|```$/gm, '').trim();
    const spec = JSON.parse(clean);
    ok('Claude analysis complete');
    return spec;
  } catch (e) {
    warn(`Claude API error: ${e.message}. Falling back to heuristic.`);
    return heuristicAnalyze(url);
  }
}

// ─── Heuristic fallback (no API key / network fail) ──────────────────────────
function heuristicAnalyze(url) {
  const u = url.toLowerCase();
  const isGitHub = u.includes('github.com');
  const isMcp = u.includes('/mcp') || u.includes('mcp-') || u.includes('-mcp');
  const isDeploy = u.includes('vercel') || u.includes('railway') || u.includes('netlify') || u.includes('render');
  const isAI = u.includes('openai') || u.includes('anthropic') || u.includes('replicate') || u.includes('fal.ai') || u.includes('hugging');
  const isDB = u.includes('postgres') || u.includes('mysql') || u.includes('mongo') || u.includes('supabase') || u.includes('firebase');
  const isDesign = u.includes('figma') || u.includes('design') || u.includes('ui') || u.includes('css') || u.includes('tailwind');
  const isAuth = u.includes('auth') || u.includes('oauth') || u.includes('jwt') || u.includes('clerk') || u.includes('supabase');
  const isEmail = u.includes('email') || u.includes('resend') || u.includes('sendgrid') || u.includes('mailgun') || u.includes('smtp');
  const isPayment = u.includes('stripe') || u.includes('payment') || u.includes('checkout') || u.includes('paddle');

  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  const pathParts = url.replace(/^https?:\/\/[^/]+/, '').split('/').filter(Boolean);
  const nameParts = [domain.split('.')[0], ...pathParts].filter(p => p.length > 1 && p !== 'www');

  const slug = CUSTOM_SLUG || `loragent-${slugify(nameParts.join('-')).slice(0, 40)}`;
  const displayName = nameParts.map(p => p[0].toUpperCase() + p.slice(1)).join(' ');

  return {
    slug,
    displayName,
    artifactType: isMcp ? 'mcp' : 'skill',
    formation: isDeploy ? 'auto' : 'freelance',
    layer: isDeploy ? 'loom' : isDesign ? 'face' : isDB ? 'lore' : isAuth || isPayment ? 'port' : 'cross',
    costTier: isAI ? 'high' : isDeploy ? 'medium' : 'low',
    description: `Provides ${displayName} integration capabilities. Invoke when any agent or workflow needs access to ${displayName} services, APIs, or documentation. Do NOT invoke for unrelated tasks.`,
    primaryObjective: `Integrate ${displayName} capabilities into the Loragent ecosystem.`,
    roleIdentity: `${displayName} specialist. Provides access to ${displayName} APIs, documentation, and tooling. Source: ${url}`,
    scopeBoundary: `Only handles ${displayName}-related tasks. All other domains route to appropriate specialists.`,
    capabilitiesList: ['Access to service APIs', 'Documentation reference', 'Integration patterns', 'Error handling'],
    toolCheckCommands: [],
    toolInstallCommands: [],
    toolVerifyCommands: [],
    executionSteps: ['1. Verify credentials and connectivity', '2. Execute the requested operation', '3. Validate output', '4. Return result'],
    outputFormat: 'Structured response matching the service API output format.',
    handoffTargets: 'loragent-boss (on completion)',
    mcpServerKey: slug.replace('loragent-', ''),
    mcpCommand: 'npx',
    mcpArgs: ['-y', `@modelcontextprotocol/server-${slug.replace('loragent-', '')}`],
    mcpEnvVars: {},
    envVarsNeeded: [],
    installCommands: [],
    standaloneInvoke: `/loragent:${slug.replace('loragent-', '')}`,
    standaloneCliExample: `node skills/${slug}/cli.js --help`,
    tags: ['lorapok', 'loragent', slug.replace('loragent-', ''), isAI ? 'ai' : isDeploy ? 'deploy' : 'integration'],
    requiresConfirmation: isDeploy || isPayment,
    requiresStack: false,
    agentSpecificPhilosophy: '',
  };
}

// ─── Step 3: Generate SKILL.md ────────────────────────────────────────────────
function generateSkillMd(spec, url) {
  const envBlock = spec.envVarsNeeded?.length
    ? spec.envVarsNeeded.map(v => `export ${v}="your_${v.toLowerCase()}_here"`).join('\n')
    : '# No environment variables required';

  const installBlock = [
    ...spec.toolInstallCommands || [],
    ...spec.installCommands || [],
  ].join('\n') || '# No additional installation required';

  const checkBlock = spec.toolCheckCommands?.join('\n') || `# Check: curl -sf ${url} > /dev/null && echo REACHABLE`;
  const verifyBlock = spec.toolVerifyCommands?.join('\n') || '# Verify connectivity before use';

  const capabilitiesSection = spec.capabilitiesList?.length
    ? spec.capabilitiesList.map(c => `- ${c}`).join('\n')
    : '- See source documentation for full capabilities';

  const stepsSection = spec.executionSteps?.length
    ? spec.executionSteps.join('\n')
    : '1. Check environment\n2. Execute operation\n3. Validate result';

  const philosophyLine = spec.agentSpecificPhilosophy
    ? `\n- **${spec.agentSpecificPhilosophy}**`
    : '';

  const mcpCallExample = spec.artifactType === 'mcp'
    ? `// Direct MCP tool call (standalone):
const result = await mcp.call("${spec.mcpServerKey}/<tool_name>", { /* params */ })`
    : `// Invoke via skill (no stack needed):
// /loragent:${spec.slug.replace('loragent-', '')}`;

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
  - ${spec.mcpServerKey || 'web-fetch'}
allowed_tools:
  - filesystem_read
  - filesystem_write
  - ${spec.mcpServerKey ? spec.mcpServerKey.replace(/-/g, '_') + '_run' : 'web_fetch'}
requires_confirmation: ${spec.requiresConfirmation}
requires_stack: ${spec.requiresStack}
standalone: true
cost_tier: ${spec.costTier}
source_url: ${url}
source_type: web-ingest
generated_by: loragent-web-ingest
standalone_invoke:
  claude_code: "${spec.standaloneInvoke}"
  cli: "${spec.standaloneCliExample}"
---

# 🤖 ${spec.displayName}

> **Formation:** ${spec.formation} | **Layer:** ${spec.layer} | **Standalone:** ✅ | **v1.0.0**
> **Source:** [${url}](${url}) | Generated by \`loragent-web-ingest\`

---

## § Standalone Quick Start

\`\`\`bash
# Mode A — Claude Code / any SKILL.md-compatible IDE:
${spec.standaloneInvoke}

# Mode B — skills-mcp (expose to any MCP client):
npx -y skills-mcp -s ./.agents/skills

# Mode C — raw MCP connector only:
# Copy skills/${spec.slug}/mcp-fragment.json into your .mcp.json

# Mode D — CLI:
${spec.standaloneCliExample}
\`\`\`

**Environment setup:**
\`\`\`bash
${envBlock}
\`\`\`

**Install dependencies:**
\`\`\`bash
${installBlock}
\`\`\`

---

## §1 · Role & Identity

**What this agent IS:**
${spec.roleIdentity}

**What this agent is NOT:**
${spec.scopeBoundary}

**Reporting to:** \`loragent-boss\` (via \`loragent_steer\`) or direct standalone invocation
**Hands off to:** ${spec.handoffTargets}

---

## §2 · Core Philosophy (Lorapok Ecosystem)

| Directive | Mandate |
|---|---|
| **Engineering-First** | Verifiable over clever. No speculative abstractions. |
| **Strict Handoffs** | Finish scope, emit payload, route via \`loragent_steer\` (when stack is present). |
| **Standalone-Safe** | All operations complete without boss/spidernet/watchman. |
| **Evidence > Assertion** | Cite the source URL and API response. Never fabricate output. |
| **Idempotent Output** | Same input → same output, always. |
| **Zero-Trust Vault** | No plaintext secrets. Route credential ops through \`secure-cred-vault\`. |
${philosophyLine}

---

## §3 · Primary Objective

${spec.primaryObjective}

**Definition of Done:** Task complete, output validated, state checkpointed, agent dismissed (if stack present).

---

## §4 · Capabilities

${capabilitiesSection}

**Source documentation:** [${url}](${url})

---

## §5 · Tool Setup & Verification

\`\`\`bash
# Step 1 — Check
${checkBlock}

# Step 2 — Install
${installBlock}

# Step 3 — Verify
${verifyBlock}
\`\`\`

---

## §6 · Execution Specifications

${stepsSection}

---

## §7 · MCP & Standalone Call Protocol

**When Loragent stack IS present:**
\`\`\`javascript
await mcp.call("loragent_summon_agent", { agent: "${spec.slug}", context: payload })
// ... on completion:
await mcp.call("loragent_steer", { from: "${spec.slug}", to: "${spec.handoffTargets?.split(' ')[0] || 'loragent-boss'}", payload: result })
await mcp.call("loragent_watchman_save", { agent: "${spec.slug}", step: "complete", context: state })
await mcp.call("loragent_dismiss_agent", { agent: "${spec.slug}" })
\`\`\`

**Standalone (no stack):**
\`\`\`javascript
${mcpCallExample}
\`\`\`

---

## §8 · Output Contract

**Format:** ${spec.outputFormat}

\`\`\`json
{
  "agent": "${spec.slug}",
  "status": "complete | partial | blocked",
  "standalone": true,
  "source_url": "${url}",
  "output": {},
  "next_action": "deliver_to_user"
}
\`\`\`

**Failure modes:**
- Missing env var → print §Standalone Quick Start env block, halt
- Service unreachable → retry once with exponential backoff, then report blocked
- Out of scope → explain and suggest correct agent via registry

---

## §9 · Standalone MCP Fragment

Drop \`mcp-fragment.json\` from this folder into your \`.mcp.json\` to use just this connector:

\`\`\`json
${JSON.stringify({
    [spec.mcpServerKey]: {
      command: spec.mcpCommand,
      args: spec.mcpArgs,
      env: spec.mcpEnvVars,
      description: spec.description?.slice(0, 120),
    }
  }, null, 2)}
\`\`\`

---

## §10 · Editor Compatibility

| Editor | Format | Activation |
|---|---|---|
| Claude Code | This \`SKILL.md\` | \`${spec.standaloneInvoke}\` |
| Codex | \`SKILL.md\` + \`AGENTS.md\` | auto-discovery |
| Cursor | \`.cursor/rules/${spec.slug}.mdc\` | glob-scoped |
| Kiro | \`.kiro/steering/${spec.slug}.md\` | \`#${spec.slug}\` |
| Windsurf / Cline | \`.windsurfrules\` / \`.clinerules\` block | always |
| Any MCP client | \`mcp-fragment.json\` | tool: \`${spec.mcpServerKey}\` |
`;
}

// ─── Step 4: Generate mcp-fragment.json ──────────────────────────────────────
function generateMcpFragment(spec) {
  return JSON.stringify({
    mcpServers: {
      [spec.mcpServerKey]: {
        command: spec.mcpCommand,
        args:    spec.mcpArgs,
        env:     spec.mcpEnvVars,
        description: spec.description?.slice(0, 200) || '',
        source_url:  spec.sourceUrl || '',
        standalone:  true,
      }
    }
  }, null, 2);
}

// ─── Step 5: Generate Kiro steering mirror ────────────────────────────────────
function generateKiroSteering(spec) {
  return `---
inclusion: manual
name: ${spec.slug}
description: ${spec.displayName} — ${spec.roleIdentity?.slice(0, 100)}
---

# ${spec.displayName}

${spec.roleIdentity}

## Scope boundary
${spec.scopeBoundary}

## Core capabilities
${spec.capabilitiesList?.map(c => `- ${c}`).join('\n') || '- See source documentation'}

## Source
${spec.sourceUrl || ''}

## Usage
Invoke via Kiro by referencing \`#${spec.slug}\` in chat, or call the MCP tool directly.
All handoffs route through \`loragent_steer\`. Save state with \`loragent_watchman_save\`.

<!-- Auto-generated by loragent-web-ingest. Re-run ingest-url.js to update. -->
`;
}

// ─── Step 6: Generate Cursor .mdc rule ───────────────────────────────────────
function generateCursorMdc(spec) {
  return `---
description: ${spec.displayName} — ${spec.description?.slice(0, 120)}
globs: []
alwaysApply: false
---

# ${spec.displayName}

**Role:** ${spec.roleIdentity}
**Scope boundary:** ${spec.scopeBoundary}
**Source:** ${spec.sourceUrl || ''}

## Capabilities
${spec.capabilitiesList?.map(c => `- ${c}`).join('\n') || '- See source documentation'}

## Usage
- Standalone: \`${spec.standaloneInvoke}\`
- MCP connector: add \`mcp-fragment.json\` to your \`.mcp.json\`
- Handoff on completion → \`${spec.handoffTargets || 'loragent-boss'}\`

<!-- Auto-generated by loragent-web-ingest. Re-run ingest-url.js to update. -->
`;
}

// ─── Step 7: Update marketplace.json ─────────────────────────────────────────
function updateMarketplace(spec, outDir) {
  const mktPath = path.join(ROOT, 'registry', 'marketplace.json');
  if (!fs.existsSync(mktPath)) { warn('marketplace.json not found — skipping'); return; }

  const mkt = JSON.parse(fs.readFileSync(mktPath, 'utf8'));
  if (!mkt.items) mkt.items = [];
  if (!mkt.ingested) mkt.ingested = [];

  const entry = {
    slug:        spec.slug,
    id:          spec.slug,
    name:        spec.displayName,
    type:        spec.artifactType.toUpperCase(),
    formation:   spec.formation,
    layer:       spec.layer.toUpperCase(),
    costTier:    spec.costTier,
    description: spec.description,
    tags:        spec.tags,
    standalone:  true,
    requiresStack: spec.requiresStack,
    sourceUrl:   spec.sourceUrl,
    version:     '1.0.0',
    path:        path.relative(ROOT, path.join(outDir, 'SKILL.md')),
    generatedAt: new Date().toISOString(),
  };

  // Replace if already exists, else append
  const idx = mkt.items.findIndex(i => i.slug === spec.slug);
  if (idx >= 0) mkt.items[idx] = entry;
  else mkt.items.push(entry);

  mkt.ingested.push({ slug: spec.slug, url: spec.sourceUrl, at: new Date().toISOString() });
  mkt.total      = mkt.items.length;
  mkt.totalItems = mkt.items.length;
  mkt.generatedAt = new Date().toISOString();

  if (!DRY_RUN) {
    fs.writeFileSync(mktPath, JSON.stringify(mkt, null, 2), 'utf8');
    ok(`marketplace.json updated (${mkt.total} total items)`);
  } else {
    log(`[DRY RUN] Would update marketplace.json → total: ${mkt.total + 1}`);
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  Loragent — Web & Remote URL Ingest Pipeline v2              ║
╚═══════════════════════════════════════════════════════════════╝
`);
  log(`Target URL: ${TARGET_URL}`);
  if (DRY_RUN) log('DRY RUN MODE — no files will be written');

  // 1. Fetch
  const content = await fetchContent(TARGET_URL);

  // 2. Analyze
  let spec = await analyzeWithClaude(TARGET_URL, content);
  spec.sourceUrl = TARGET_URL;

  // Apply CLI overrides
  if (CUSTOM_SLUG) spec.slug = CUSTOM_SLUG.startsWith('loragent-') ? CUSTOM_SLUG : `loragent-${CUSTOM_SLUG}`;
  if (FORCE_TYPE)  spec.artifactType = FORCE_TYPE;
  if (FORCE_FORM)  spec.formation    = FORCE_FORM;
  if (FORCE_LAYER) spec.layer        = FORCE_LAYER;

  log(`\nGenerated spec:`);
  log(`  Slug       : ${spec.slug}`);
  log(`  Type       : ${spec.artifactType}`);
  log(`  Formation  : ${spec.formation}`);
  log(`  Layer      : ${spec.layer}`);
  log(`  Standalone : true`);

  // 3. Determine output directory
  const skillBase = CUSTOM_OUT
    ? path.resolve(process.cwd(), CUSTOM_OUT)
    : path.join(ROOT, '.agents', 'skills', spec.slug);

  // 4. Generate and write all artifacts
  console.log('\n── Generating artifacts ──────────────────────────────────────');

  const skillMd = generateSkillMd(spec, TARGET_URL);
  writeFile(path.join(skillBase, 'SKILL.md'), skillMd);

  const mcpFrag = generateMcpFragment(spec);
  writeFile(path.join(skillBase, 'mcp-fragment.json'), mcpFrag);

  if (!NO_MIRRORS) {
    const kiroPath   = path.join(ROOT, '.kiro', 'steering', `${spec.slug}.md`);
    const cursorPath = path.join(ROOT, '.cursor', 'rules', `${spec.slug}.mdc`);
    writeFile(kiroPath,   generateKiroSteering(spec));
    writeFile(cursorPath, generateCursorMdc(spec));
  }

  if (!NO_MKTPLACE) {
    updateMarketplace(spec, skillBase);
  }

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  ✅ Ingestion complete!                                       ║
╠═══════════════════════════════════════════════════════════════╣
║  Skill: ${spec.slug.padEnd(51)}║
║  Invoke: ${spec.standaloneInvoke.padEnd(50)}║
║  Install: node scripts/registry-cli.js install ${spec.slug.slice(0,26).padEnd(14)}║
╚═══════════════════════════════════════════════════════════════╝

Next steps:
  1. Review .agents/skills/${spec.slug}/SKILL.md
  2. Add real env vars: ${spec.envVarsNeeded?.join(', ') || 'none required'}
  3. Validate: node scripts/enrich-skills.js --validate
  4. Commit: git add -A && git commit -m "feat(skill): ingest ${spec.slug}"
`);
})();
