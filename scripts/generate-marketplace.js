#!/usr/bin/env node
/**
 * Loragent Marketplace Compiler
 * Compiles 224+ Agents, Open Agent Skills, MCP Servers, and 6 Formation Squad Presets
 * into registry/marketplace.json following the open Agent Skills and MCP registry standard.
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
const categoriesPath = path.join(root, 'registry', 'categories.json');
const outputPath = path.join(root, 'registry', 'marketplace.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const formationsData = JSON.parse(fs.readFileSync(formationsPath, 'utf8'));
const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

const items = [];

// 1. Compile 224 Agents & Skills
for (const a of manifest) {
  const isSpecialist = a.layer !== 'cross' && a.formation !== 'orchestrator';
  const itemType = isSpecialist ? 'SKILL' : 'AGENT';
  
  items.push({
    id: a.slug,
    slug: a.slug,
    name: a.displayName,
    type: itemType,
    category: (a.category || a.tags[0] || 'engineering').toUpperCase(),
    formation: a.formation,
    layer: a.layer,
    version: a.version || '2.0.0',
    description: a.description,
    author: {
      name: 'Lorapok Labs',
      url: 'https://lorapok.tech',
      verified: true
    },
    tags: a.tags || ['loragent', 'lorapok'],
    connectors: a.connectors || [],
    allowedTools: a.allowedTools || [],
    requiresConfirmation: !!a.requiresConfirmation,
    canSpawnSubagents: !!a.canSpawnSubagents,
    costTier: a.costTier || 'low',
    installation: {
      projectDestination: `.agents/skills/${a.slug}/SKILL.md`,
      globalDestination: `~/.loragent/skills/${a.slug}/SKILL.md`,
      methods: ['NPX', 'GIT_SUBMODULE', 'DIRECT_INJECT'],
      command: `npx -y @lorapok/loragent@latest install ${a.slug}`
    }
  });
}

// 2. Compile MCP Servers from .mcp.json & Cloudflare Suite
const mcpServers = mcpConfig.mcpServers || {};
for (const [serverName, config] of Object.entries(mcpServers)) {
  items.push({
    id: `mcp-${serverName}`,
    slug: serverName,
    name: serverName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') + ' MCP',
    type: 'MCP SERVER',
    category: serverName.includes('database') || serverName.includes('firebase') ? 'DATA' : 
              serverName.includes('deploy') ? 'DEVOPS' : 
              serverName.includes('image') || serverName.includes('gif') ? 'CREATIVE' : 'TOOLS',
    version: '2.0.0',
    description: `Production Model Context Protocol server for ${serverName} integrations.`,
    author: {
      name: 'Lorapok Labs & Community',
      url: 'https://lorapok.tech',
      verified: true
    },
    tags: ['mcp', serverName, 'loragent'],
    installation: {
      projectDestination: '.mcp.json',
      globalDestination: '~/.claude/mcp.json',
      methods: ['NPX', 'STDIO', 'SSE_EDGE'],
      config: config,
      command: `npx -y @lorapok/loragent@latest add-mcp ${serverName}`
    }
  });
}

// 3. Compile 6 Formation Squad Presets
for (const f of formationsData.formations) {
  items.push({
    id: `formation-${f.id}`,
    slug: f.slug,
    name: f.name,
    type: 'FORMATION',
    category: 'ORCHESTRATION',
    version: '2.0.0',
    description: f.description,
    author: {
      name: 'Lorapok Labs',
      url: 'https://lorapok.tech',
      verified: true
    },
    leadAgent: f.leadAgent,
    activeAgents: f.activeAgents,
    tags: ['formation', f.slug, 'loragent'],
    installation: {
      projectDestination: `.loragent/formations/${f.id}.json`,
      globalDestination: `~/.loragent/formations/${f.id}.json`,
      methods: ['DIRECT_INJECT', 'CLI'],
      command: `npx -y @lorapok/loragent@latest formation ${f.id}`
    }
  });
}

const marketplaceCatalog = {
  $schema: 'https://loragent.lorapok.tech/schemas/marketplace.schema.json',
  version: '2.0.0',
  generatedAt: new Date().toISOString(),
  totalItems: items.length,
  breakdown: {
    agentsAndSkills: manifest.length,
    mcpServers: Object.keys(mcpServers).length,
    formations: formationsData.formations.length
  },
  categories,
  items
};

fs.writeFileSync(outputPath, JSON.stringify(marketplaceCatalog, null, 2), 'utf8');
console.log(`[marketplace] ✅ Generated marketplace catalog with ${items.length} items (${manifest.length} Agents/Skills, ${Object.keys(mcpServers).length} MCP Servers, ${formationsData.formations.length} Formations)`);
console.log(`[marketplace] 📄 Output → ${outputPath}`);
