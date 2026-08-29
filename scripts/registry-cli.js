#!/usr/bin/env node
/**
 * Loragent — Registry CLI for Standalone & Modular Skill Management
 * =================================================================
 * Enables standalone listing, searching, installing, and removing
 * of skills and MCP fragments directly from the Loragent registry.
 *
 * Usage:
 *   node scripts/registry-cli.js list
 *   node scripts/registry-cli.js search <keyword>
 *   node scripts/registry-cli.js install <slug> [--global]
 *   node scripts/registry-cli.js remove <slug> [--global]
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const marketplacePath = path.join(rootDir, 'registry', 'marketplace.json');
const manifestPath = path.join(rootDir, 'reports', 'agents.manifest.json');

function loadMarketplace() {
  if (fs.existsSync(marketplacePath)) {
    return JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
  }
  if (fs.existsSync(manifestPath)) {
    const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return { items: raw };
  }
  console.error('❌ Registry not found. Run "node scripts/generate-marketplace.js" first.');
  process.exit(1);
}

const args = process.argv.slice(2);
const command = args[0];
const query = args[1];
const isGlobal = args.includes('--global') || args.includes('-g');

const registry = loadMarketplace();
const items = registry.items || [];

switch (command) {
  case 'list': {
    console.log(`\n📦 Loragent Skill & Agent Registry (${items.length} total items)\n`);
    console.log('--------------------------------------------------------------------------------');
    console.log(
      'SLUG'.padEnd(32) +
      'TYPE'.padEnd(16) +
      'LAYER'.padEnd(10) +
      'FORMATION'
    );
    console.log('--------------------------------------------------------------------------------');

    for (const item of items.slice(0, 50)) {
      const slug = (item.slug || item.id || '').padEnd(32);
      const type = (item.type || 'AGENT').padEnd(16);
      const layer = (item.layer || 'CROSS').padEnd(10);
      const formation = item.formation || 'auto';
      console.log(`${slug}${type}${layer}${formation}`);
    }

    if (items.length > 50) {
      console.log(`\n... and ${items.length - 50} more items. Use "search <keyword>" to filter.`);
    }
    console.log('\n💡 Install any skill: node scripts/registry-cli.js install <slug>\n');
    break;
  }

  case 'search': {
    if (!query) {
      console.error('❌ Please specify a search query. Example: node scripts/registry-cli.js search "image"');
      process.exit(1);
    }
    const q = query.toLowerCase();
    const matches = items.filter((item) => {
      const name = (item.name || '').toLowerCase();
      const slug = (item.slug || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const tags = (item.tags || []).join(' ').toLowerCase();
      const tools = (item.allowedTools || []).join(' ').toLowerCase();
      return name.includes(q) || slug.includes(q) || desc.includes(q) || tags.includes(q) || tools.includes(q);
    });

    console.log(`\n🔍 Found ${matches.length} matches for "${query}":\n`);
    for (const m of matches) {
      console.log(`  • \x1b[32m${m.slug}\x1b[0m (${m.type || 'AGENT'}) - ${m.name || m.slug}`);
      console.log(`    \x1b[90m${(m.description || '').slice(0, 100)}...\x1b[0m`);
      console.log(`    Install: node scripts/registry-cli.js install ${m.slug}\n`);
    }
    break;
  }

  case 'install': {
    if (!query) {
      console.error('❌ Please specify a slug to install. Example: node scripts/registry-cli.js install loragent-image-generate');
      process.exit(1);
    }
    const item = items.find((i) => i.slug === query || i.slug === `loragent-${query}` || i.id === query);
    if (!item) {
      console.error(`❌ Skill or Agent "${query}" not found in registry.`);
      process.exit(1);
    }

    const cleanSlug = item.slug.startsWith('loragent-') ? item.slug : `loragent-${item.slug}`;
    const baseSlug = cleanSlug.replace(/^loragent-/, '');
    
    const targetDir = isGlobal
      ? path.join(os.homedir(), '.loragent', 'skills', cleanSlug)
      : path.join(rootDir, '.agents', 'skills', cleanSlug);

    fs.mkdirSync(targetDir, { recursive: true });

    // Look for source SKILL.md
    const possibleSources = [
      path.join(rootDir, 'skills', baseSlug, 'SKILL.md'),
      path.join(rootDir, 'skills', cleanSlug, 'SKILL.md'),
      path.join(rootDir, '.agents', 'skills', cleanSlug, 'SKILL.md'),
      path.join(rootDir, 'agents', baseSlug, 'SKILL.md'),
      path.join(rootDir, 'agents', cleanSlug, 'SKILL.md')
    ];

    let sourceFile = possibleSources.find((p) => fs.existsSync(p));
    let skillContent = '';

    if (sourceFile) {
      skillContent = fs.readFileSync(sourceFile, 'utf8');
    } else {
      // Synthesize standalone SKILL.md from registry metadata
      skillContent = `---
name: ${cleanSlug}
description: >-
  ${item.description || 'Specialized AI Agent within Loragent'}
version: ${item.version || '2.0.0'}
standalone: true
requires_stack: ${item.formation === 'orchestrator'}
layer: ${item.layer ? item.layer.toLowerCase() : 'cross'}
formation: ${item.formation || 'freelance'}
tags: ${JSON.stringify(item.tags || ['loragent', baseSlug])}
connectors: ${JSON.stringify(item.connectors || ['loragent-core', 'filesystem'])}
allowed_tools: ${JSON.stringify(item.allowedTools || ['filesystem_read', 'filesystem_write'])}
cost_tier: ${item.costTier || 'low'}
---

# ${item.name || cleanSlug}

## §1 · Primary Objective
${item.objective || item.description || 'Executes autonomous domain workflows.'}

## §2 · Allowed Tools & Connectors
- Tools: ${(item.allowedTools || []).join(', ') || 'filesystem_read, filesystem_write'}
- Connectors: ${(item.connectors || []).join(', ') || 'loragent-core'}
`;
    }

    const targetFile = path.join(targetDir, 'SKILL.md');
    fs.writeFileSync(targetFile, skillContent, 'utf8');

    // Create standalone mcp-fragment.json if tools or connectors exist
    if (item.allowedTools || item.connectors) {
      const fragmentPath = path.join(targetDir, 'mcp-fragment.json');
      const fragment = {
        mcpServers: {
          [cleanSlug]: {
            command: 'npx',
            args: ['-y', '@lorapok/loragent@latest', 'serve', cleanSlug],
            env: {}
          }
        }
      };
      fs.writeFileSync(fragmentPath, JSON.stringify(fragment, null, 2), 'utf8');
    }

    console.log(`\n✅ Installed \x1b[32m${cleanSlug}\x1b[0m successfully!`);
    console.log(`📁 Destination: ${targetFile}`);
    console.log(`⚡ Standalone Invoke: /loragent:${baseSlug}\n`);
    break;
  }

  case 'remove': {
    if (!query) {
      console.error('❌ Please specify a slug to remove. Example: node scripts/registry-cli.js remove loragent-gif-create');
      process.exit(1);
    }
    const cleanSlug = query.startsWith('loragent-') ? query : `loragent-${query}`;
    const targetDir = isGlobal
      ? path.join(os.homedir(), '.loragent', 'skills', cleanSlug)
      : path.join(rootDir, '.agents', 'skills', cleanSlug);

    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      console.log(`\n🗑️ Removed \x1b[33m${cleanSlug}\x1b[0m from ${targetDir}\n`);
    } else {
      console.log(`\n⚠️ ${cleanSlug} was not installed at ${targetDir}\n`);
    }
    break;
  }

  default:
    console.log(`
Loragent Registry CLI v2.0
==========================
Usage:
  node scripts/registry-cli.js list                 List top catalog resources
  node scripts/registry-cli.js search <keyword>     Search for skills, agents, MCPs
  node scripts/registry-cli.js install <slug>       Install skill to .agents/skills/
  node scripts/registry-cli.js install <slug> -g    Install skill globally to ~/.loragent/skills/
  node scripts/registry-cli.js remove <slug>        Remove installed skill
`);
    break;
}
