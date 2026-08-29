#!/usr/bin/env node
/**
 * Loragent - Complete Website Data Compiler
 * Compiles all 224 Agents, 20 MCP Servers, and 6 Squad Formations
 * into optimized datasets for both Next.js and Vite websites and registry/marketplace.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const manifestPath = path.join(root, 'reports', 'agents.manifest.json');
const formationsPath = path.join(root, 'formations', 'formations.json');
const mcpConfigPath = path.join(root, '.mcp.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const formationsData = JSON.parse(fs.readFileSync(formationsPath, 'utf8'));
const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));

function categorizeAgent(slug, layer, formation, description, tags = []) {
  const s = slug.toLowerCase();
  const d = (description || '').toLowerCase();
  const t = tags.map(x => x.toLowerCase()).join(' ');

  if (s.includes('boss') || s.includes('teacher') || s.includes('spidernet') || s.includes('coordinator')) return 'ORCHESTRATION';
  if (s.includes('bug-hunter') || s.includes('debugger') || s.includes('shift-engineer') || s.includes('inspector') || s.includes('rca') || formation === 'chela') return 'DEBUGGING';
  if (s.includes('watchman') || s.includes('workspace-guard') || s.includes('cache-collector') || s.includes('gold-collector') || formation === 'observer') return 'OBSERVER';
  if (s.includes('sqa') || s.includes('security') || s.includes('audit') || s.includes('guard') || s.includes('test') || s.includes('vault') || s.includes('accounts')) return 'SECURITY';
  if (s.includes('deploy') || s.includes('wrangler') || s.includes('docker') || s.includes('cicd') || s.includes('devops') || s.includes('tools-install') || s.includes('publish') || s.includes('amo') || s.includes('vscode')) return 'DEVOPS';
  if (s.includes('image') || s.includes('gif') || s.includes('3d') || s.includes('logo') || s.includes('designer') || s.includes('video') || s.includes('art') || s.includes('audio') || s.includes('music')) return 'CREATIVE';
  if (s.includes('firebase') || s.includes('sql') || s.includes('database') || s.includes('bigquery') || s.includes('postgres') || s.includes('dbt') || s.includes('data')) return 'DATA';
  if (s.includes('marketing') || s.includes('pr-') || s.includes('publisher') || s.includes('ads') || s.includes('business') || s.includes('seo') || s.includes('sales') || formation === 'office') return 'BUSINESS';
  
  return 'ENGINEERING';
}

const agents = manifest.map((a) => {
  const isResident = ['loragent-boss', 'loragent-teacher', 'loragent-workspace-guard', 'loragent-watchman', 'loragent-spidernet'].includes(a.slug);
  const category = categorizeAgent(a.slug, a.layer, a.formation, a.description, a.tags);
  
  let objective = a.primaryObjective || '';
  if (!objective && a.originalBody) {
    const match = a.originalBody.match(/## Primary Objective\s*([\s\S]*?)(?:\n##|\n---|$)/i);
    if (match) {
      objective = match[1].replace(/^[#\s*>-]+/gm, '').trim().slice(0, 300);
    }
  }
  if (!objective) {
    objective = a.description || 'Specialized AI agent within the Loragent multi-agent ecosystem.';
  }

  let tools = a.allowedTools && a.allowedTools.length > 0 ? a.allowedTools : [];
  if (tools.length === 0) {
    if (category === 'DEVOPS') tools = ['bash', 'filesystem_write', 'loragent_trigger_hook'];
    else if (category === 'SECURITY') tools = ['filesystem_read', 'ast_grep', 'loragent_workspace_guard'];
    else if (category === 'CREATIVE') tools = ['loragent_image_generate', 'ffmpeg', 'filesystem_write'];
    else if (category === 'DATA') tools = ['sql_query', 'firebase_admin', 'filesystem_read'];
    else tools = ['filesystem_read', 'filesystem_write', 'loragent_steer'];
  }

  const isSpecialist = a.layer !== 'cross' && a.formation !== 'orchestrator';
  const itemType = isSpecialist ? 'SKILL' : 'AGENT';


  return {
    id: a.slug,
    slug: a.slug,
    name: a.displayName || a.slug.replace(/^loragent-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    type: itemType,
    category: category,
    formation: a.formation || 'auto',
    layer: a.layer ? a.layer.toUpperCase() : 'CROSS',
    version: a.version || '2.0.0',
    description: a.description || `${a.displayName} agent for autonomous workflow execution.`,
    objective: objective,
    isResident: isResident,
    tags: a.tags && a.tags.length > 0 ? a.tags : ['loragent', category.toLowerCase()],
    connectors: a.connectors || ['loragent-core', 'filesystem'],
    allowedTools: tools,
    requiresConfirmation: !!a.requiresConfirmation,
    canSpawnSubagents: a.canSpawnSubagents !== undefined ? a.canSpawnSubagents : (isResident || a.formation === 'auto'),
    costTier: a.costTier || (isResident ? 'low' : 'medium'),
    slashCommand: `/loragent:${a.slug.replace(/^loragent-/, '')}`,
    installCmd: `npx -y @lorapok/loragent@latest install ${a.slug}`,
    summonCmd: `/loragent:${a.slug.replace(/^loragent-/, '')}`,
    destinationProject: `.agents/skills/${a.slug}/SKILL.md`,
    destinationGlobal: `~/.loragent/skills/${a.slug}/SKILL.md`,
    filePath: a.repoRelativePath || `agents/${a.slug.replace(/^loragent-/, '')}/SKILL.md`
  };
});

// Compile MCP Servers
const mcpServers = Object.entries(mcpConfig.mcpServers || {}).map(([key, cfg]) => {
  const cat = key.includes('firebase') || key.includes('sql') || key.includes('database') ? 'DATA' :
              key.includes('deploy') || key.includes('docker') ? 'DEVOPS' :
              key.includes('image') || key.includes('gif') ? 'CREATIVE' : 'TOOLS';
  return {
    id: `mcp-${key}`,
    slug: key,
    name: key.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') + ' MCP',
    type: 'MCP SERVER',
    category: cat,
    formation: 'mesh',
    layer: 'PORT',
    version: '2.0.0',
    description: `Native Model Context Protocol connector for ${key} automated tool invocation.`,
    objective: `Exposes deterministic JSON-RPC tool endpoints for ${key} directly to AI agents.`,
    isResident: false,
    tags: ['mcp', key, 'connector'],
    connectors: [key],
    allowedTools: [key.replace(/-/g, '_')],
    requiresConfirmation: key.includes('deploy'),
    canSpawnSubagents: false,
    costTier: 'low',
    slashCommand: `/loragent:mcp ${key}`,
    installCmd: `npx -y @lorapok/loragent@latest add-mcp ${key}`,
    summonCmd: `mcp:${key}`,
    destinationProject: '.mcp.json',
    destinationGlobal: '~/.claude/mcp.json',
    filePath: `port/mcp/${key}.js`
  };
});

// Compile Formations
const formations = formationsData.formations.map((f) => {
  return {
    id: `formation-${f.id}`,
    slug: f.slug,
    name: f.name,
    type: 'FORMATION PRESET',
    category: 'ORCHESTRATION',
    formation: f.id,
    layer: 'LORE',
    version: '2.0.0',
    description: f.description,
    objective: `Squad matrix executing ${f.name} with coordinated agent handoffs.`,
    isResident: true,
    tags: ['formation', f.id, 'squad'],
    connectors: ['loragent-core'],
    allowedTools: ['loragent_steer', 'loragent_summon_agent'],
    requiresConfirmation: false,
    canSpawnSubagents: true,
    costTier: 'medium',
    slashCommand: `/loragent:boss ${f.id}`,
    installCmd: `npx -y @lorapok/loragent@latest formation ${f.id}`,
    summonCmd: `/loragent:boss ${f.id}`,
    destinationProject: `.loragent/formations/${f.id}.json`,
    destinationGlobal: `~/.loragent/formations/${f.id}.json`,
    filePath: `formations/${f.id}.json`,
    squad: f.squad || []
  };
});

const allItems = [...agents, ...mcpServers, ...formations];

const fullData = {
  $schema: 'https://loragent.lorapok.tech/schemas/marketplace.schema.json',
  version: '2.0.0',
  generatedAt: new Date().toISOString(),
  total: allItems.length,
  totalItems: allItems.length,
  totalAgents: agents.length,
  totalMcp: mcpServers.length,
  totalFormations: formations.length,
  breakdown: {
    agentsAndSkills: agents.length,
    mcpServers: mcpServers.length,
    formations: formations.length
  },
  categories: [
    { id: 'all', name: 'All Resources', count: allItems.length },
    { id: 'agents', name: '224 Autonomous Agents', count: agents.length },
    { id: 'mcp', name: '20 MCP Servers', count: mcpServers.length },
    { id: 'formations', name: '6 Squad Formations', count: formations.length },
    { id: 'engineering', name: 'Software Engineering', count: allItems.filter(i => i.category === 'ENGINEERING').length },
    { id: 'security', name: 'QA & Security', count: allItems.filter(i => i.category === 'SECURITY').length },
    { id: 'devops', name: 'DevOps & Deploy', count: allItems.filter(i => i.category === 'DEVOPS').length },
    { id: 'data', name: 'Data & Databases', count: allItems.filter(i => i.category === 'DATA').length },
    { id: 'creative', name: 'Creative & Design', count: allItems.filter(i => i.category === 'CREATIVE').length },
    { id: 'business', name: 'Business Operations', count: allItems.filter(i => i.category === 'BUSINESS').length },
    { id: 'debugging', name: 'Chela Debugging', count: allItems.filter(i => i.category === 'DEBUGGING').length },
    { id: 'observer', name: 'Observer & Sentinel', count: allItems.filter(i => i.category === 'OBSERVER').length }
  ],
  items: allItems
};

// Write to website datasets and marketplace.json
const paths = [
  path.join(root, 'loragent-web', 'src', 'data', 'all-agents.json'),
  path.join(root, 'website', 'src', 'data', 'all-agents.json'),
  path.join(root, 'registry', 'marketplace.json')
];

for (const p of paths) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(fullData, null, 2), 'utf8');
  console.log(`✓ Generated ${p} (${allItems.length} items)`);
}

console.log(`\n🎉 Successfully compiled all ${agents.length} agents, ${mcpServers.length} MCP servers, and ${formations.length} formations!`);
