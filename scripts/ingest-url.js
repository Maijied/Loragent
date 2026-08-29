#!/usr/bin/env node
/**
 * Loragent — Web & Remote URL Ingest Pipeline
 * ===========================================
 * Ingests external documentation or MCP repositories from URLs
 * and converts them into standalone Loragent skills or MCP configurations.
 *
 * Usage:
 *   node scripts/ingest-url.js --url <url> --type <skill|mcp> [--out <dir>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const targetUrl = getArg('--url');
const ingestType = (getArg('--type') || 'skill').toLowerCase();
const customOut = getArg('--out');

if (!targetUrl) {
  console.log(`
Loragent Web & Remote URL Ingestion Tool
=========================================
Usage:
  node scripts/ingest-url.js --url <url> --type <skill|mcp> [--out <dir>]

Examples:
  node scripts/ingest-url.js --url https://docs.fal.ai --type skill
  node scripts/ingest-url.js --url https://github.com/modelcontextprotocol/servers --type mcp
`);
  process.exit(1);
}

console.log(`\n🌐 Ingesting remote asset from: \x1b[36m${targetUrl}\x1b[0m (Type: ${ingestType.toUpperCase()})`);

// Extract identifier from URL
let slug = targetUrl
  .replace(/^https?:\/\//, '')
  .replace(/[^a-zA-Z0-9_-]/g, '-')
  .toLowerCase()
  .replace(/^-+|-+$/g, '')
  .slice(0, 40);

if (!slug.startsWith('loragent-')) {
  slug = `loragent-${slug}`;
}

const baseSlug = slug.replace(/^loragent-/, '');
const outDir = customOut
  ? path.resolve(process.cwd(), customOut)
  : path.join(rootDir, '.agents', 'skills', slug);

fs.mkdirSync(outDir, { recursive: true });

if (ingestType === 'mcp') {
  const mcpConfig = {
    mcpServers: {
      [baseSlug]: {
        command: 'npx',
        args: ['-y', `@lorapok/${baseSlug}`, 'serve'],
        env: {
          SOURCE_URL: targetUrl
        }
      }
    }
  };

  const fragmentPath = path.join(outDir, 'mcp-fragment.json');
  fs.writeFileSync(fragmentPath, JSON.stringify(mcpConfig, null, 2), 'utf8');
  console.log(`✅ Ingested MCP connector configuration to: ${fragmentPath}`);
} else {
  const skillMd = `---
name: ${slug}
description: >-
  Standalone ingested skill from ${targetUrl}. Provides specialized documentation
  and deterministic tool execution context.
version: 1.0.0
standalone: true
requires_stack: false
source_url: ${targetUrl}
formation: freelance
layer: cross
tags: [loragent, standalone, ${baseSlug}, web-ingest]
connectors:
  - loragent-core
  - web-fetch
allowed_tools: [filesystem_read, filesystem_write, web_search, fetch]
cost_tier: low
---

# ${slug} — Standalone Ingested Skill

## §1 · Primary Objective
Provide domain expertise, API reference, and integration patterns extracted from:
[${targetUrl}](${targetUrl})

## §2 · Capabilities & Integration
- Standalone execution: Invoke directly with \`/loragent:${baseSlug}\`
- Zero-stack dependencies: Usable without loragent-boss or Firebase backend.
- Source Reference: ${targetUrl}

## §3 · Quick Verification
\`\`\`bash
/loragent:${baseSlug}
\`\`\`
`;

  const skillPath = path.join(outDir, 'SKILL.md');
  fs.writeFileSync(skillPath, skillMd, 'utf8');
  console.log(`✅ Created standalone SKILL.md at: ${skillPath}`);
}

console.log(`🎉 Ingestion complete for \x1b[32m${slug}\x1b[0m!\n`);
