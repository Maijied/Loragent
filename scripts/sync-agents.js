#!/usr/bin/env node

/**
 * Loragent Agent Sync Script
 * 
 * Scans all known agent source directories across the PC,
 * detects new/modified agents, normalizes them to SKILL.md format,
 * updates agent-index.json, and regenerates AGENT_INDEX.md.
 *
 * Usage:
 *   node scripts/sync-agents.js              # Full sync
 *   node scripts/sync-agents.js --dry-run    # Preview changes only
 *   node scripts/sync-agents.js --stats      # Show statistics only
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const LORAGENT_ROOT = process.env.LORAGENT_WORKSPACE || path.resolve(process.cwd());
const AGENTS_DIR = path.join(LORAGENT_ROOT, 'agents');
const INDEX_FILE = path.join(LORAGENT_ROOT, 'agent-index.json');
const CATALOG_FILE = path.join(LORAGENT_ROOT, 'AGENT_INDEX.md');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const STATS_ONLY = args.includes('--stats');

// ─── Source Directories to Scan ─────────────────────────────────────────
const SCAN_SOURCES = [
    {
        id: 'lorapok-ai-agent',
        label: 'Lorapok AI Agent Subagents',
        paths: [
            process.env.LORAPOK_AI_AGENT_PATH || path.join(os.homedir(), 'Personal_Projects', 'lorapok_ai_agent', '.agents', 'subagents'),
        ],
        pattern: /\.md$/,
        nameExtractor: (file) => path.basename(file, '.md').replace(/^lorapok-/, ''),
    },
    {
        id: 'lorapok-player',
        label: 'Lorapok Player Agents',
        paths: [
            process.env.LORAPOK_PLAYER_PATH || path.join(os.homedir(), 'Personal_Projects', 'lorapok_player', '.agents'),
        ],
        pattern: /\.md$/,
        nameExtractor: (file) => path.basename(file, '.md').replace(/^lorapok-/, ''),
    },
    {
        id: 'aswitch-i',
        label: 'AswitchI Agents',
        paths: [
            process.env.ASWITCH_I_PATH || path.join(os.homedir(), 'Personal_Projects', 'AswitchI', '.agents'),
        ],
        pattern: /\.md$/,
        nameExtractor: (file) => path.basename(file, '.md'),
    },
    {
        id: 'freqghost',
        label: 'FreqGhost Skills',
        paths: [
            path.join(os.homedir(), '.skills'),
        ],
        pattern: /^freqghost-/,
        nameExtractor: (dir) => path.basename(dir),
        isDirectory: true,
        dirFilter: (name) => name.startsWith('freqghost-'),
    },
    {
        id: 'ide-skills',
        label: 'IDE Custom Skills',
        paths: [
            path.join(os.homedir(), '.skills'),
        ],
        isDirectory: true,
        dirFilter: (name) => {
            // Only import curated custom skills, not Cursor built-ins
            const customPrefixes = ['loragent-', 'lorapok-', 'streamvar-'];
            const customNames = [
                'accessibility-audit', 'react-best-practices',
                'professional-readme-creator', 'professional-research-docx-writer',
                'web-design-guidelines', 'package-expert', 'seo',
                'repo-repair', 'marketing-gen', 'scaffold', 'fastapi', 'deploy',
            ];
            return customPrefixes.some(p => name.startsWith(p)) || customNames.includes(name);
        },
        nameExtractor: (dir) => path.basename(dir),
    },
];

// ─── Agent Template ─────────────────────────────────────────────────────
const AGENT_TEMPLATE = `---
name: "loragent-{{NAME}}"
description: "{{DESCRIPTION}}"
---

# Lorapok Mega-Agency: {{TITLE}}

**Role:** Specialist Agent within the Loragent Ecosystem  
**Core Philosophy:** Lorapok Labs' "Engineering-First & Sensory Computing"

## Primary Objective
{{CONTENT}}

---

## Core Ecosystem Philosophies (Lorapok Labs)
1. **Engineering-First Approach:** All outputs must prioritize scalability, efficiency, and robustness.
2. **Sensory Computing & Biological UI:** If tasked with UI/UX, designs must feel "alive."
3. **Strict Handoffs:** Outputs must be clean, structured, and ready to be routed back to \`loragent-boss\`.
4. **Data Security (Vault):** Never print plain-text secrets. Rely on the \`secure-cred-vault\`.

---

## Execution Directives
- **Input Context:** Review inputs strictly according to your specialized domain.
- **Output Standard:** Production-grade, zero-fluff responses.
- **Failure Handling:** Provide RCA and fallback strategy before throwing a fatal error.
- **Guardrails:** Adhere to \`loragent-workspace-guard\` policies.
`;

// ─── Category Mapping ───────────────────────────────────────────────────
const CATEGORY_MAP = {
    'engineering': ['backend-se', 'frontend-se', 'tech-director', 'team-lead', 'code-optimizer', 'algorithm-implementer', 'specialized-developer'],
    'orchestration': ['boss', 'spidernet', 'project-coordinator', 'project-manager', 'workflow-manager', 'workflow-automation-specialist', 'project-architect'],
    'quality': ['sqa', 'sqa-lead', 'bug-hunter', 'test-sentinel', 'validator', 'pipeline-checker', 'code-auditor', 'model-auditor', 'token-auditor'],
    'devops': ['devops', 'cicd-automation-expert', 'docman', 'k8-expert', 'operations', 'deploy'],
    'security': ['workspace-guard', 'authentication-engineer', 'accounts-specialist', 'governance-guard', 'admin-reliability'],
    'creative': ['ui-ux-professional', 'logo-designer', 'animator', '3d-designer', 'project-theme-expert', 'prototype-designer', 'themeguy', 'portfolio-designer', 'streamvar-theme-architect', 'web-design-guidelines'],
    'business': ['business-expert', 'marketing-strategy-manager', 'sales-executive', 'pr-specialist', 'hr', 'fund-collector', 'client', 'software-business-analyst', 'marketing-gen'],
    'documentation': ['content-writer', 'professional-document-creator', 'readme-generator-specialist', 'professional-readme-creator', 'professional-research-docx-writer', 'research-paper-writer', 'doc-brain-updater'],
    'language-expert': ['javascript-expert', 'python-expert', 'cpp-expert', 'go-expert', 'rust-expert', 'react-specialist', 'angular-specialist', 'vue-specialist', 'node-specialist', 'laravel-specialist', 'django-specialist', 'fastapi', 'react-best-practices'],
    'cloud': ['cloud-specialist', 'azure-specialist', 'google-products-specialist', 'vercel-expert', 'railway-expert', 'loragent-cloudflare-mail-master'],
    'data': ['database-designer', 'database-updater', 'gold-collector', 'cache-collector', 'token-sniper', 'legacy-system-analyser'],
    'tools': ['cli-automation-maker', 'cli-utilities-specialist', 'command-executor', 'tools-specialist', 'package-maker', 'env-maker', 'package-expert', 'scaffold', 'repo-repair'],
    'publishing': ['publisher', 'store-specialist', 'delivery-boy', 'release-integrity', 'version-bumper', 'loragent-dynamic-versioning', 'git-release-manager'],
    'communication': ['teacher', 'ai-communicator', 'office-assistant', 'pion'],
    'research': ['thewikiboy', 'professor', 'srs-analyzer', 'se-model-specialist', 'mathematician'],
    'monitoring': ['watchman', 'performance-analyser', 'inspector', 'project-overviewer'],
    'browser': ['browser-specialist', 'browser-automation-expert', 'accessibility-audit'],
    'media': ['vidman', 'cv-maker', 'jokki-bhai'],
    'network': ['isp-man', 'responsive-system-designer', 'localization-expert'],
    'seo': ['seo-specialist', 'seo'],
};

const CORE_AGENTS = ['boss', 'teacher', 'spidernet', 'watchman', 'workspace-guard'];
const AUTO_TEAM = ['tech-director', 'backend-se', 'frontend-se', 'sqa', 'devops', 'team-lead'];
const OFFICE = ['project-coordinator', 'project-manager', 'marketing-strategy-manager', 'publisher', 'pr-specialist', 'hr', 'sales-executive', 'business-expert', 'client'];
const CHELA = ['bug-hunter', 'shift-engineer', 'git-specialist', 'debugger', 'inspector'];

function getCategory(slug) {
    for (const [cat, members] of Object.entries(CATEGORY_MAP)) {
        if (members.includes(slug)) return cat;
    }
    if (slug.startsWith('freqghost-')) return 'freqghost';
    return 'general';
}

function getFormation(slug) {
    if (CORE_AGENTS.includes(slug)) return 'all';
    if (AUTO_TEAM.includes(slug)) return 'auto-team';
    if (OFFICE.includes(slug)) return 'office';
    if (CHELA.includes(slug)) return 'chela';
    return 'freelance';
}

function getType(slug) {
    return CORE_AGENTS.includes(slug) ? 'core' : 'specialist';
}

function extractDescription(skillContent) {
    const match = skillContent.match(/description:\s*["']?([^"'\n]+)/);
    return match ? match[1].trim() : '';
}

// ─── Main Sync Logic ────────────────────────────────────────────────────
function syncAgents() {
    console.log('🔄 Loragent Agent Sync');
    console.log('='.repeat(50));
    console.log(`Root: ${LORAGENT_ROOT}`);
    console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

    let newCount = 0;
    let updatedCount = 0;
    let existingCount = 0;

    // Scan external sources for new agents
    for (const source of SCAN_SOURCES) {
        console.log(`📂 Scanning: ${source.label}`);
        for (const scanPath of source.paths) {
            if (!fs.existsSync(scanPath)) {
                console.log(`   ⚠️  Path not found: ${scanPath}`);
                continue;
            }

            let items;
            if (source.isDirectory) {
                items = fs.readdirSync(scanPath)
                    .filter(name => source.dirFilter ? source.dirFilter(name) : true)
                    .filter(name => {
                        const fullPath = path.join(scanPath, name);
                        return fs.statSync(fullPath).isDirectory();
                    });
            } else {
                items = fs.readdirSync(scanPath)
                    .filter(name => source.pattern ? source.pattern.test(name) : true);
            }

            for (const item of items) {
                const agentName = source.nameExtractor(item);
                const agentDir = path.join(AGENTS_DIR, agentName);
                const skillFile = path.join(agentDir, 'SKILL.md');

                if (fs.existsSync(skillFile)) {
                    existingCount++;
                    continue;
                }

                newCount++;
                console.log(`   ✅ NEW: ${agentName} (from ${source.id})`);

                if (!DRY_RUN) {
                    if (!fs.existsSync(agentDir)) fs.mkdirSync(agentDir, { recursive: true });

                    // Copy source
                    const sourcePath = source.isDirectory
                        ? path.join(scanPath, item, 'SKILL.md')
                        : path.join(scanPath, item);

                    if (fs.existsSync(sourcePath)) {
                        const content = fs.readFileSync(sourcePath, 'utf8');
                        fs.writeFileSync(path.join(agentDir, '_source.md'), content);

                        // Generate SKILL.md
                        const desc = extractDescription(content) || `Imported agent: ${agentName}`;
                        const title = agentName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                        const cleanContent = content.replace(/^---[\s\S]*?---\s*/, '');

                        const skill = AGENT_TEMPLATE
                            .replace(/\{\{NAME\}\}/g, agentName)
                            .replace(/\{\{DESCRIPTION\}\}/g, desc.replace(/"/g, '\\"'))
                            .replace(/\{\{TITLE\}\}/g, title)
                            .replace(/\{\{CONTENT\}\}/g, cleanContent.substring(0, 2000));

                        fs.writeFileSync(skillFile, skill);
                    }
                }
            }
        }
    }

    console.log(`\n📊 Sync Summary:`);
    console.log(`   New agents imported: ${newCount}`);
    console.log(`   Already existing:    ${existingCount}`);

    if (DRY_RUN) {
        console.log('\n⚠️  Dry run — no changes written.');
        return;
    }

    // Rebuild agent-index.json
    rebuildIndex();
    rebuildCatalog();
}

function rebuildIndex() {
    console.log('\n📋 Rebuilding agent-index.json...');
    const entries = fs.readdirSync(AGENTS_DIR);
    const agents = [];

    for (const entry of entries) {
        const entryPath = path.join(AGENTS_DIR, entry);
        if (!fs.statSync(entryPath).isDirectory()) continue;

        const skillFile = path.join(entryPath, 'SKILL.md');
        let description = '';
        let source = 'native';

        if (fs.existsSync(skillFile)) {
            description = extractDescription(fs.readFileSync(skillFile, 'utf8'));
        }

        // Detect source from _source.md presence and category
        if (fs.existsSync(path.join(entryPath, '_source.md'))) {
            if (entry.startsWith('freqghost-')) source = 'freqghost';
            else if (['code-auditor', 'doc-brain-updater', 'git-release-manager', 'model-auditor', 'test-sentinel', 'token-auditor'].includes(entry)) source = 'lorapok-ai-agent';
            else if (['project-architect', 'specialized-developer', 'sqa-lead'].includes(entry)) source = 'lorapok-player';
            else if (['admin-reliability', 'governance-guard', 'release-integrity'].includes(entry)) source = 'aswitch-i';
            else source = 'ide-skills';
        }

        agents.push({
            name: 'loragent-' + entry,
            slug: entry,
            type: getType(entry),
            source,
            path: `agents/${entry}/SKILL.md`,
            category: getCategory(entry),
            formation: getFormation(entry),
            description: description || `Agent: ${entry}`,
        });
    }

    agents.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

    const index = {
        version: '1.0.0',
        generated: new Date().toISOString(),
        ecosystem: 'Loragent by Lorapok Labs',
        statistics: {
            totalAgents: agents.length,
            coreAgents: agents.filter(a => a.type === 'core').length,
            specialists: agents.filter(a => a.type === 'specialist').length,
            nativeAgents: agents.filter(a => a.source === 'native').length,
            importedAgents: agents.filter(a => a.source !== 'native').length,
            categories: [...new Set(agents.map(a => a.category))].length,
            formations: {
                'auto-team': agents.filter(a => a.formation === 'auto-team').length,
                'office': agents.filter(a => a.formation === 'office').length,
                'freelance': agents.filter(a => a.formation === 'freelance').length,
                'chela': agents.filter(a => a.formation === 'chela').length,
                'all': agents.filter(a => a.formation === 'all').length,
            },
        },
        sources: SCAN_SOURCES.map(s => ({ id: s.id, label: s.label, paths: s.paths })),
        automations: [
            { name: 'brain-sync', path: 'loom/automations/brain-sync.md', trigger: 'code-change' },
            { name: 'model-catalog-health', path: 'loom/automations/model-catalog-health.md', trigger: 'scheduled' },
            { name: 'test-sentinel', path: 'loom/automations/test-sentinel.md', trigger: 'pr-push' },
        ],
        steerRules: [
            { name: 'branch-merge-guide', path: 'loom/steer/branch_merge_guide.md' },
            { name: 'cli-ux-standards', path: 'loom/steer/cli_ux_standards.md' },
            { name: 'code-style', path: 'loom/steer/code_style.md' },
            { name: 'model-orchestration', path: 'loom/steer/model_orchestration.md' },
            { name: 'token-optimization', path: 'loom/steer/token_optimization.md' },
        ],
        workflows: [
            { name: 'lorapok-ai-workflow', path: 'loom/workflows/lorapok-ai-workflow.md' },
        ],
        agents,
    };

    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
    console.log(`   ✅ Written ${agents.length} agents to agent-index.json`);
}

function rebuildCatalog() {
    console.log('📖 Rebuilding AGENT_INDEX.md...');
    const index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
    const agents = index.agents;
    const stats = index.statistics;

    const categoryEmojis = {
        'browser': '🌐', 'business': '💼', 'cloud': '☁️', 'communication': '📡',
        'creative': '🎨', 'data': '💾', 'devops': '🚀', 'documentation': '📝',
        'engineering': '⚙️', 'freqghost': '👻', 'general': '📦', 'language-expert': '💻',
        'media': '🎬', 'monitoring': '📡', 'network': '🌍', 'orchestration': '🎯',
        'publishing': '📤', 'quality': '✅', 'research': '🔬', 'security': '🛡️',
        'seo': '🔍', 'tools': '🔧',
    };

    let md = '# 🏢 Loragent — Unified Agent Index\n\n';
    md += '> The Master Catalog of all AI agents in the Lorapok Mega-Agency ecosystem.\n\n';
    md += `> **${stats.totalAgents} agents** across **${stats.categories} categories** | ${stats.nativeAgents} native + ${stats.importedAgents} imported\n\n`;
    md += '---\n\n';

    md += '## 📊 Dashboard\n\n';
    md += '| Metric | Count |\n|--------|-------|\n';
    md += `| **Total Agents** | ${stats.totalAgents} |\n`;
    md += `| Core Operations | ${stats.coreAgents} |\n`;
    md += `| Specialists | ${stats.specialists} |\n`;
    md += `| Native | ${stats.nativeAgents} |\n`;
    md += `| Imported | ${stats.importedAgents} |\n\n`;

    md += '### Formation Breakdown\n\n';
    md += '| Formation | Agents |\n|-----------|--------|\n';
    md += `| 🟢 Auto Team | ${stats.formations['auto-team']} |\n`;
    md += `| 🏢 Office | ${stats.formations['office']} |\n`;
    md += `| 🔧 Freelance | ${stats.formations['freelance']} |\n`;
    md += `| 🔴 Chela | ${stats.formations['chela']} |\n`;
    md += `| ⭐ All | ${stats.formations['all']} |\n\n`;
    md += '---\n\n';

    const categories = [...new Set(agents.map(a => a.category))].sort();
    md += '## 🗂️ Agent Catalog\n\n';

    for (const cat of categories) {
        const catAgents = agents.filter(a => a.category === cat);
        const emoji = categoryEmojis[cat] || '📦';
        md += `### ${emoji} ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${catAgents.length})\n\n`;
        md += '| Agent | Type | Source | Formation | Description |\n';
        md += '|-------|------|--------|-----------|-------------|\n';
        for (const a of catAgents) {
            const icon = a.type === 'core' ? '⭐' : '🔹';
            md += `| ${icon} \`${a.name}\` | ${a.type} | ${a.source} | ${a.formation} | ${(a.description || '').substring(0, 80)} |\n`;
        }
        md += '\n';
    }

    md += '---\n\n';
    md += `*Generated: ${index.generated} | Version: ${index.version}*\n`;

    fs.writeFileSync(CATALOG_FILE, md);
    console.log(`   ✅ Written AGENT_INDEX.md (${md.length} bytes)`);
}

// ─── Stats Mode ─────────────────────────────────────────────────────────
function showStats() {
    if (!fs.existsSync(INDEX_FILE)) {
        console.log('No agent-index.json found. Run sync first.');
        return;
    }
    const index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
    console.log('📊 Loragent Agent Statistics');
    console.log('='.repeat(40));
    console.log(JSON.stringify(index.statistics, null, 2));
    console.log('\nCategories:');
    const cats = {};
    for (const a of index.agents) {
        cats[a.category] = (cats[a.category] || 0) + 1;
    }
    Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
    });
}

// ─── Entry Point ────────────────────────────────────────────────────────
if (STATS_ONLY) {
    showStats();
} else {
    syncAgents();
}
