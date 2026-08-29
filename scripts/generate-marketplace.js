#!/usr/bin/env node
/**
 * Loragent — Marketplace Generator v2
 * =====================================
 * Scans all SKILL.md files across the repo and regenerates
 * registry/marketplace.json with full metadata for each item.
 * Also updates AGENT_INDEX.md.
 *
 * Usage:
 *   node scripts/generate-marketplace.js
 *   node scripts/generate-marketplace.js --dry-run
 *   node scripts/generate-marketplace.js --no-index   (skip AGENT_INDEX.md)
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

const DRY_RUN  = process.argv.includes('--dry-run');
const NO_INDEX = process.argv.includes('--no-index');

const log = (...a) => console.log('▶', ...a);
const ok  = (...a) => console.log('✅', ...a);

// ─── SKILL.md frontmatter parser (no deps) ───────────────────────────────────
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw.trim() };
  const [, fmBlock, body] = m;
  const fm = {};
  let key = null, multi = false;
  for (const line of fmBlock.split('\n')) {
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kv) {
      multi = false; key = kv[1];
      const v = kv[2].trim();
      if (v === '>-' || v === '>') { fm[key] = ''; multi = true; continue; }
      if (v.startsWith('[') && v.endsWith(']')) {
        fm[key] = v.slice(1,-1).split(',').map(s=>s.trim().replace(/^['"]|['"]$/g,'')).filter(Boolean);
      } else fm[key] = v.replace(/^['"]|['"]$/g,'');
    } else if (multi && key && line.trim())  { fm[key] += (fm[key]?' ':'')+line.trim(); }
    else if (line.match(/^\s+-\s+/)) {
      if (!fm[key]) fm[key] = [];
      if (!Array.isArray(fm[key])) fm[key] = [fm[key]];
      fm[key].push(line.trim().replace(/^-\s+/,'').replace(/^['"]|['"]$/g,''));
    }
  }
  return { fm, body: body.trim() };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const manifestPath = path.join(ROOT, 'reports', 'agents.manifest.json');
let manifest = [];
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

log(`Loaded ${manifest.length} agents from manifest`);

const items = [];
const byFormation = {};
const categories = {
  engineering: 0, devops: 0, security: 0, creative: 0, data: 0,
  business: 0, ai: 0, observer: 0, orchestration: 0,
};

for (const e of manifest) {
  const slug = e.slug || e.name;
  const formation = e.formation || 'auto';
  const layer     = (e.layer || 'cross').toUpperCase();
  const tags      = Array.isArray(e.tags) ? e.tags : [];

  const item = {
    slug,
    id:          slug,
    name:        e.displayName || slug.replace(/loragent-/,'').split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '),
    type:        'AGENT',
    formation,
    layer,
    costTier:    e.costTier || 'low',
    description: e.description || '',
    tags,
    standalone:  true,
    requiresStack: false,
    requiresConfirmation: !!e.requiresConfirmation,
    connectors:  Array.isArray(e.connectors) ? e.connectors : [],
    allowedTools: Array.isArray(e.allowedTools) ? e.allowedTools : [],
    version:     e.version || '2.0.0',
    sourceUrl:   e.source_url || null,
    path:        e.repoRelativePath || `skills/${slug}/SKILL.md`,
    objective:   e.primaryObjective || e.description || '',
  };

  // Category counting
  if (tags.includes('creative') || tags.includes('design') || tags.includes('image')) categories.creative++;
  else if (tags.includes('devops') || tags.includes('deploy') || tags.includes('cloud')) categories.devops++;
  else if (tags.includes('security') || tags.includes('audit') || tags.includes('sqa')) categories.security++;
  else if (tags.includes('data') || tags.includes('database') || tags.includes('analytics')) categories.data++;
  else if (tags.includes('ai') || tags.includes('ml') || tags.includes('llm')) categories.ai++;
  else if (tags.includes('business') || tags.includes('marketing') || tags.includes('office')) categories.business++;
  else if (formation === 'observer') categories.observer++;
  else if (formation === 'orchestrator') categories.orchestration++;
  else categories.engineering++;

  if (!byFormation[formation]) byFormation[formation] = [];
  byFormation[formation].push(item);

  items.push(item);
}

// ─── Load MCP entries from .mcp.json ─────────────────────────────────────────
const mcpPath = path.join(ROOT, '.mcp.json');
const mcpItems = [];
if (fs.existsSync(mcpPath)) {
  const mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
  for (const [key, cfg] of Object.entries(mcpConfig.mcpServers || {})) {
    mcpItems.push({
      slug: key, id: key, name: key.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '),
      type: 'MCP SERVER', description: cfg.description || '',
      command: cfg.command, args: cfg.args,
      standalone: true, requiresStack: false,
    });
  }
}

// ─── Load formations (6 preset squads) ──────────────────────────────────────
const formDir = path.join(ROOT, 'formations');
const formationItems = [];
if (fs.existsSync(formDir)) {
  for (const f of fs.readdirSync(formDir).filter(n => n.endsWith('.json') && n !== 'formations.json')) {
    try {
      const fd = JSON.parse(fs.readFileSync(path.join(formDir, f), 'utf8'));
      formationItems.push({ ...fd, type: 'FORMATION', slug: fd.id || f.replace('.json', '') });
    } catch {}
  }
}

// ─── Build marketplace.json ──────────────────────────────────────────────────
const allItems = [...items, ...mcpItems, ...formationItems];

const existing = fs.existsSync(path.join(ROOT, 'registry', 'marketplace.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'marketplace.json'), 'utf8'))
  : {};

const marketplace = {
  $schema:        'https://loragent.lorapok.tech/schemas/marketplace.schema.json',
  version:        '2.0.0',
  generatedAt:    new Date().toISOString(),
  total:          allItems.length,
  totalItems:     allItems.length,
  totalAgents:    items.length,
  totalMcp:       mcpItems.length,
  totalFormations: formationItems.length,
  breakdown: {
    agentsAndSkills: items.length,
    mcpServers:      mcpItems.length,
    formations:      formationItems.length,
  },
  categories: [
    { id: 'all',          name: 'All Resources',       count: allItems.length },
    { id: 'agents',       name: `${items.length} Agents & Skills`, count: items.length },
    { id: 'mcp',          name: `${mcpItems.length} MCP Servers`,  count: mcpItems.length },
    { id: 'formations',   name: `${formationItems.length} Formations`, count: formationItems.length },
    { id: 'engineering',  name: 'Software Engineering', count: categories.engineering },
    { id: 'security',     name: 'QA & Security',        count: categories.security },
    { id: 'devops',       name: 'DevOps & Deploy',      count: categories.devops },
    { id: 'data',         name: 'Data & Databases',     count: categories.data },
    { id: 'creative',     name: 'Creative & Design',    count: categories.creative },
    { id: 'ai',           name: 'AI & ML',              count: categories.ai },
    { id: 'business',     name: 'Business & Office',    count: categories.business },
  ],
  // Preserve any existing ingested history
  ingested: existing.ingested || [],
  items: allItems,
};

if (!DRY_RUN) {
  fs.mkdirSync(path.join(ROOT, 'registry'), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, 'registry', 'marketplace.json'),
    JSON.stringify(marketplace, null, 2), 'utf8'
  );
  ok(`registry/marketplace.json → ${allItems.length} items (${items.length} agents, ${mcpItems.length} MCPs, ${formationItems.length} formations)`);
} else {
  log(`[DRY RUN] Would write ${allItems.length} items to registry/marketplace.json`);
}

// ─── Rebuild AGENT_INDEX.md ──────────────────────────────────────────────────
if (!NO_INDEX) {
  let md = `# Loragent Agent Index\n\n`;
  md += `> Auto-generated. Re-run \`node scripts/generate-marketplace.js\` to update.\n\n`;
  md += `**Total agents:** ${items.length} | **MCP servers:** ${mcpItems.length} | **Formations:** ${formationItems.length}\n\n`;

  for (const [formation, agents] of Object.entries(byFormation).sort()) {
    md += `## ${formation.toUpperCase()} Formation (${agents.length})\n\n`;
    for (const a of agents.sort((x,y) => x.slug.localeCompare(y.slug))) {
      const standalone = a.standalone ? '✅ standalone' : '⚠️ stack req';
      md += `- **\`${a.slug}\`** \`[${a.layer}]\` \`${standalone}\` — ${(a.description||'').slice(0,100)}\n`;
    }
    md += '\n';
  }

  if (!DRY_RUN) {
    fs.writeFileSync(path.join(ROOT, 'AGENT_INDEX.md'), md, 'utf8');
    ok(`AGENT_INDEX.md updated`);
  } else {
    log('[DRY RUN] Would update AGENT_INDEX.md');
  }
}

console.log(`\n📦 Marketplace generation complete:`);
console.log(`   Agents: ${items.length}`);
console.log(`   MCPs:   ${mcpItems.length}`);
console.log(`   Forms:  ${formationItems.length}`);
console.log(`   Total:  ${allItems.length}\n`);
