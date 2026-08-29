#!/usr/bin/env node
/**
 * Loragent — Agent/Skill Mass Enrichment Pipeline v2
 * =====================================================
 * Reads all SKILL.md files across the Loragent repos,
 * enriches them with the v2 AGENT_TEMPLATE, and optionally
 * mirrors each agent to Kiro steering, Cursor .mdc, Windsurf
 * rules, Cline rules, and Roo Code modes.
 *
 * Modes:
 *   --extract       Scan all repos → reports/agents.manifest.json (read-only)
 *   --compile       Read manifest → write enriched SKILL.md files
 *   --compile --dry-run    Preview diffs, no writes
 *   --compile --mirrors    Also emit Kiro/Cursor/Windsurf/Cline mirrors
 *   --validate      Check all SKILL.md files against the v2 template schema
 *   --agent-index   Regenerate AGENT_INDEX.md and agent-index.json from manifest
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultRoot = path.resolve(__dirname, '..');

// ─── CONFIG ────────────────────────────────────────────────────────────────
export const CONFIG = {
  repos: [
    {
      root: defaultRoot,
      agentsDirs: ['agents', 'skills', '.agents/skills'],
      outputMirrorRoot: true,   // emit .kiro/steering + .cursor/rules at repo root
    },
    ...(fs.existsSync('/mnt/NewVolume/Personal_Projects/lorapok_player') ? [{
      root: '/mnt/NewVolume/Personal_Projects/lorapok_player',
      agentsDirs: ['.agents/skills'],
      outputMirrorRoot: true,
    }] : []),
    ...(fs.existsSync('/mnt/NewVolume/Personal_Projects/loragent-officers') ? [{
      root: '/mnt/NewVolume/Personal_Projects/loragent-officers',
      agentsDirs: ['agents'],
      outputMirrorRoot: true,
    }] : []),
  ],
  templateDir:   path.join(defaultRoot, 'templates'),
  reportDir:     path.join(defaultRoot, 'reports'),
  defaultVersion: '2.0.0',
  defaultTags:    ['lorapok', 'loragent'],
  formations:     ['auto', 'office', 'chela', 'freelance', 'observer', 'orchestrator'],
  lldpLayers:     ['face', 'pulse', 'lore', 'port', 'loom', 'cross'],
  requiredFields: ['name', 'description', 'version', 'tags'],
};
// ─── END CONFIG ─────────────────────────────────────────────────────────────

// ── Minimal YAML frontmatter parser ─────────────────────────────────────────
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw.trim() };
  const [, fmBlock, body] = m;
  const fm = {};
  let key = null, multiline = false;
  for (const line of fmBlock.split('\n')) {
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kv) {
      multiline = false;
      key = kv[1];
      const val = kv[2].trim();
      if (val === '>-' || val === '>') { fm[key] = ''; multiline = true; continue; }
      if (val.startsWith('[') && val.endsWith(']')) {
        fm[key] = val.slice(1,-1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g,'')).filter(Boolean);
      } else {
        fm[key] = val.replace(/^['"]|['"]$/g, '');
      }
    } else if (multiline && key && line.trim()) {
      fm[key] += (fm[key] ? ' ' : '') + line.trim();
    } else if (line.match(/^\s+-\s+/)) {
      if (!fm[key]) fm[key] = [];
      if (!Array.isArray(fm[key])) fm[key] = [fm[key]];
      fm[key].push(line.trim().replace(/^-\s+/, '').replace(/^['"]|['"]$/g, ''));
    }
  }
  return { fm, body: body.trim() };
}

export function toYamlList(arr) {
  if (!arr || arr.length === 0) return '[]';
  return `[${arr.map(s => `"${s}"`).join(', ')}]`;
}

// ── File discovery ───────────────────────────────────────────────────────────
export function findSkillFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findSkillFiles(full));
    else if (entry.isFile() && entry.name === 'SKILL.md') out.push(full);
  }
  return out;
}

// ── Backward Compatible Template Formatter for Unit Tests ────────────────────
export function formatAgentFromTemplate(agentData, templateContent) {
  const slug = agentData.name.startsWith('loragent-') ? agentData.name : `loragent-${agentData.name}`;
  const displayName = slug.replace(/^loragent-/, '').replace(/-/g, ' ').toUpperCase();

  let formatted = templateContent
    .replaceAll('{{AGENT_SLUG}}', slug)
    .replaceAll('{{AGENT_DISPLAY_NAME}}', displayName)
    .replaceAll('{{AGENT_DESCRIPTION_TRIGGER_CONDITION}}', agentData.description || 'Specialized Loragent agent.')
    .replaceAll('{{INVOKE_WHEN}}', agentData.invoke_when || 'Task requires specialized domain expertise.')
    .replaceAll('{{DO_NOT_INVOKE_WHEN}}', agentData.do_not_invoke_when || 'Standard generic code generation suffices.')
    .replaceAll('{{VERSION | 1.0.0}}', agentData.version || '1.0.0')
    .replaceAll('{{VERSION}}', agentData.version || '1.0.0')
    .replaceAll('{{FORMATION | auto|office|chela|freelance|observer}}', agentData.formation || 'freelance')
    .replaceAll('{{FORMATION}}', agentData.formation || 'freelance')
    .replaceAll('{{LLDP_LAYER | face|pulse|lore|port|loom|cross}}', agentData.layer || 'lore')
    .replaceAll('{{LLDP_LAYER}}', agentData.layer || 'lore')
    .replaceAll('{{DOMAIN_TAG}}', agentData.category || 'specialist')
    .replaceAll('{{ROLE_DEFINITION}}', agentData.role || agentData.description)
    .replaceAll('{{SCOPE_BOUNDARY}}', 'Do not execute tasks outside the explicit domain specification.')
    .replaceAll('{{HANDOFF_TARGETS}}', '`loragent-boss`, `loragent-sqa`, or designated workflow recipient')
    .replaceAll('{{AGENT_SPECIFIC_PHILOSOPHY}}', 'Prioritize deterministic, verifiable outcomes with zero token waste.')
    .replaceAll('{{PRIMARY_OBJECTIVE}}', agentData.description || 'Fulfill specialized domain workflow directives.')
    .replaceAll('{{DEFINITION_OF_DONE}}', 'Target artifact created, validated, and verified via check-done hook.')
    .replaceAll('{{INPUT_1}}', 'Task Prompt')
    .replaceAll('{{INPUT_1_SOURCE}}', 'User / Boss Orchestrator')
    .replaceAll('{{INPUT_1_REQUIRED}}', 'Yes')
    .replaceAll('{{INPUT_2}}', 'Context Graph')
    .replaceAll('{{INPUT_2_SOURCE}}', '.loragent-debug/orchestration-graph.json')
    .replaceAll('{{INPUT_2_REQUIRED}}', 'Optional')
    .replaceAll('{{ADDITIONAL_CONTEXT_READS}}', 'Relevant workspace files')
    .replaceAll('{{EXECUTION_STEPS_NUMBERED}}', '1. Parse input payload\n2. Verify context and dependencies\n3. Execute operations safely\n4. Validate outputs and emit steer payload')
    .replaceAll('{{STANDARDS_BULLETS}}', '- LLDP Layer Compliance\n- Zero plaintext secret emission\n- Structured JSON response')
    .replaceAll('{{OUTPUT_FORMAT}}', 'Structured JSON or clean Markdown response')
    .replaceAll('{{DEFAULT_NEXT_ACTION}}', 'verify_or_complete')
    .replaceAll('{{HANDOFF_TARGET_SLUG}}', 'loragent-boss')
    .replaceAll('{{CONNECTOR_1}}', 'loragent-mcp-cloud')
    .replaceAll('{{CONNECTOR_1_PURPOSE}}', 'Multi-Agent Coordination & State')
    .replaceAll('{{CONNECTOR_2}}', 'secure-cred-vault')
    .replaceAll('{{CONNECTOR_2_PURPOSE}}', 'Zero-Trust Credential Enclave')
    .replaceAll('{{REQUIRES_CONFIRMATION | false}}', agentData.requires_confirmation ? 'true' : 'false')
    .replaceAll('{{CAN_SPAWN | false}}', agentData.can_spawn_subagents ? 'true' : 'false')
    .replaceAll('{{COST_TIER | low|medium|high}}', agentData.cost_tier || 'low')
    .replace(/\{\{#each CONNECTORS\}\}[\s\S]*?\{\{\/each\}\}/g, '- loragent-mcp-cloud\n  - secure-cred-vault')
    .replace(/\{\{#each ALLOWED_TOOLS\}\}[\s\S]*?\{\{\/each\}\}/g, '- loragent_summon_agent\n  - loragent_dismiss_agent\n  - loragent_steer\n  - loragent_trigger_hook\n  - loragent_watchman_save');

  return formatted;
}

// ── EXTRACT ──────────────────────────────────────────────────────────────────
export function extract() {
  const manifest = [];
  let total = 0;
  for (const repo of CONFIG.repos) {
    if (!fs.existsSync(repo.root)) continue;
    for (const agentsDir of repo.agentsDirs) {
      const root = path.join(repo.root, agentsDir);
      for (const file of findSkillFiles(root)) {
        total++;
        const raw  = fs.readFileSync(file, 'utf8');
        const { fm, body } = parseFrontmatter(raw);
        const slug = (fm.name || path.basename(path.dirname(file))).replace(/^loragent-?/, 'loragent-');
        const displayName = slug.replace(/^loragent-?/i, '').replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase());
        const description = fm.description || `${displayName} specialist agent in the Loragent ecosystem.`;
        manifest.push({
          // ── Source metadata ──────────────────────────────────────
          repo:    repo.root,
          file,
          repoRelativePath: path.relative(repo.root, file),
          // ── Frontmatter (auto-extracted) ─────────────────────────
          name:         fm.name || slug,
          slug,
          displayName,
          description,
          version:      fm.version || CONFIG.defaultVersion,
          tags:         fm.tags || CONFIG.defaultTags,
          connectors:   fm.connectors || [],
          allowedTools: fm.allowed_tools || [],
          formation:    fm.formation || 'auto',
          layer:        fm.layer || 'cross',
          requiresConfirmation: fm.requires_confirmation || false,
          canSpawnSubagents:    fm.can_spawn_subagents || false,
          costTier:     fm.cost_tier || 'low',
          // ── Human-review fields (fill in manifest before --compile) ──
          roleIdentity:          fm.role_identity || '',
          scopeBoundary:         '',
          handoffTargets:        '',
          agentSpecificPhilosophy: '',
          primaryObjective:      '',
          definitionOfDone:      '',
          inputs:                [],
          outputFormat:          '',
          handoffProtocol:       '',
          escalation:            '',
          // ── Original body (preserved as §4 Execution Specs) ──────
          originalBody: body,
          // ── Mirrors config ──────────────────────────────────────
          kiroInclusion:     'manual',
          kiroFileMatch:     '',
          cursorGlobs:       '[]',
          cursorAlwaysApply: false,
        });
      }
    }
  }
  fs.mkdirSync(CONFIG.reportDir, { recursive: true });
  const reportPath = path.join(CONFIG.reportDir, 'agents.manifest.json');
  fs.writeFileSync(reportPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`[extract] ✅ ${total} SKILL.md files scanned across available repos`);
  console.log(`[extract] 📄 Manifest → ${reportPath}`);
  console.log(`[extract] 👉 Next: review manifest, fill in human-review fields, then run --compile`);
  return manifest;
}

// ── COMPILE ──────────────────────────────────────────────────────────────────
export function compile({ dryRun, mirrors } = {}) {
  const reportPath = path.join(CONFIG.reportDir, 'agents.manifest.json');
  if (!fs.existsSync(reportPath)) {
    console.error('[compile] ❌ No manifest found. Running extract first...');
    extract();
  }
  const manifest = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  const skillTplPath  = path.join(CONFIG.templateDir, 'SKILL.md.template');
  const kiroTplPath   = path.join(CONFIG.templateDir, 'steering.kiro.md.template');
  const cursorTplPath = path.join(CONFIG.templateDir, 'rules.cursor.mdc.template');

  const skillTpl  = fs.readFileSync(skillTplPath, 'utf8');
  const kiroTpl   = fs.existsSync(kiroTplPath) ? fs.readFileSync(kiroTplPath, 'utf8') : '';
  const cursorTpl = fs.existsSync(cursorTplPath) ? fs.readFileSync(cursorTplPath, 'utf8') : '';

  let written = 0, skipped = 0;

  for (const e of manifest) {
    const desc = e.description || `${e.displayName} specialist agent in the Loragent ecosystem.`;
    const vars = {
      AGENT_SLUG:    e.slug,
      DISPLAY_NAME:  e.displayName,
      VERSION:       e.version,
      FORMATION:     e.formation,
      LLDP_LAYER:    e.layer,
      TAGS_YAML:     toYamlList(e.tags),
      CONNECTORS_YAML: toYamlList(e.connectors),
      ALLOWED_TOOLS_YAML: toYamlList(e.allowedTools),
      REQUIRES_CONFIRMATION: String(!!e.requiresConfirmation),
      CAN_SPAWN:     String(!!e.canSpawnSubagents),
      COST_TIER:     e.costTier,
      // description block — multiline in frontmatter uses >- block scalar
      DESCRIPTION_BLOCK: desc.length > 80
        ? `>-\n  ${desc.replace(/\n/g, '\n  ')}`
        : desc,
      ROLE_IDENTITY:   e.roleIdentity || `${e.displayName} is a Loragent ecosystem specialist. Scope: ${desc}`,
      SCOPE_BOUNDARY:  e.scopeBoundary || 'Anything outside the stated scope — route to the appropriate specialist via loragent-boss.',
      HANDOFF_TARGETS: e.handoffTargets || 'loragent-boss (on completion)',
      AGENT_SPECIFIC_PHILOSOPHY: e.agentSpecificPhilosophy || '',
      PRIMARY_OBJECTIVE: e.primaryObjective || desc,
      DEFINITION_OF_DONE: e.definitionOfDone || 'Deliverable matches specification, output payload is complete, agent dismissed.',
      ORIGINAL_BODY:   e.originalBody || '_No legacy instructions found._',
      OUTPUT_FORMAT:   e.outputFormat || 'Structured JSON payload via loragent_steer, plus Markdown summary for the user.',
      HANDOFF_PROTOCOL: e.handoffProtocol || 'Report completion to loragent-boss via loragent_steer. No automatic downstream routing.',
      ESCALATION:      e.escalation || 'Halt and report to loragent-boss if task is outside scope. Never guess.',
      CONNECTORS_PROSE: e.connectors.length ? e.connectors.join(', ') : 'none required',
      REPO_RELATIVE:   e.repoRelativePath,
      // Kiro/Cursor vars
      INCLUSION_MODE:  e.kiroInclusion,
      FILE_MATCH_LINE: e.kiroInclusion === 'fileMatch' && e.kiroFileMatch
        ? `fileMatchPattern: '${e.kiroFileMatch}'\n`
        : '',
      CURSOR_GLOBS:    e.cursorGlobs,
      CURSOR_ALWAYS:   String(!!e.cursorAlwaysApply),
    };

    const fill = (tpl) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] != null ? vars[k] : '');

    const skillRendered = fill(skillTpl);

    if (dryRun) {
      console.log(`\n── DRY RUN ── ${e.file}`);
      console.log(skillRendered.split('\n').slice(0, 15).join('\n') + '\n  ...');
      skipped++;
      continue;
    }

    // Resolve target path safely relative to defaultRoot
    let destFile = e.file;
    let destRepo = e.repo;
    if (e.repoRelativePath) {
      destFile = path.resolve(defaultRoot, e.repoRelativePath);
      destRepo = defaultRoot;
    } else if (path.isAbsolute(destFile) && !fs.existsSync(path.dirname(destFile))) {
      const sub = destFile.includes('/loragent/') ? destFile.split('/loragent/')[1] : path.basename(destFile);
      destFile = path.resolve(defaultRoot, sub);
      destRepo = defaultRoot;
    }

    // Backup + write SKILL.md
    if (process.argv.includes('--backup') && fs.existsSync(destFile)) fs.copyFileSync(destFile, `${destFile}.bak`);
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.writeFileSync(destFile, skillRendered, 'utf8');
    written++;

    // Mirrors
    if (mirrors) {
      const kiroDir   = path.join(destRepo || defaultRoot, '.kiro', 'steering');
      const cursorDir = path.join(destRepo || defaultRoot, '.cursor', 'rules');
      fs.mkdirSync(kiroDir,   { recursive: true });
      fs.mkdirSync(cursorDir, { recursive: true });
      if (kiroTpl) fs.writeFileSync(path.join(kiroDir,   `${e.slug}.md`),  fill(kiroTpl),   'utf8');
      if (cursorTpl) fs.writeFileSync(path.join(cursorDir, `${e.slug}.mdc`), fill(cursorTpl), 'utf8');
    }
  }

  if (dryRun) {
    console.log(`\n[compile] Dry run — ${manifest.length} entries previewed, 0 written.`);
  } else {
    console.log(`[compile] ✅ Written ${written}/${manifest.length} SKILL.md${mirrors ? ' + Kiro + Cursor mirrors' : ''}`);
    if (written !== manifest.length) console.warn(`[compile] ⚠️  ${manifest.length - written} skipped (check above)`);
  }
}

// ── VALIDATE ─────────────────────────────────────────────────────────────────
export function validate() {
  const reportPath = path.join(CONFIG.reportDir, 'agents.manifest.json');
  const manifest = fs.existsSync(reportPath)
    ? JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    : (() => { console.log('[validate] No manifest — running extract first'); return extract(); })();

  let errors = 0;
  for (const e of manifest) {
    const missing = CONFIG.requiredFields.filter(f => !e[f] || e[f].toString().trim() === '');
    if (missing.length) {
      console.warn(`⚠️  ${e.slug}: missing required fields: ${missing.join(', ')}`);
      errors++;
    }
    if (!CONFIG.formations.includes(e.formation)) {
      console.warn(`⚠️  ${e.slug}: invalid formation "${e.formation}"`);
      errors++;
    }
    if (!CONFIG.lldpLayers.includes(e.layer)) {
      console.warn(`⚠️  ${e.slug}: invalid LLDP layer "${e.layer}"`);
      errors++;
    }
  }
  if (errors === 0) {
    console.log(`[validate] ✅ All ${manifest.length} agents pass schema validation`);
  } else {
    console.log(`[validate] ❌ ${errors} validation errors across ${manifest.length} agents`);
  }
}

// ── AGENT INDEX ──────────────────────────────────────────────────────────────
export function buildIndex(argv = process.argv) {
  const reportPath = path.join(CONFIG.reportDir, 'agents.manifest.json');
  if (!fs.existsSync(reportPath)) {
    console.log('[agent-index] No manifest found. Extracting...');
    extract();
  }
  const manifest = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  const byFormation = {};
  for (const e of manifest) {
    if (!byFormation[e.formation]) byFormation[e.formation] = [];
    byFormation[e.formation].push({ slug: e.slug, name: e.displayName, description: e.description, layer: e.layer });
  }

  let md = `# Loragent Agent Index\n\n> Auto-generated. Do not hand-edit. Run \`node scripts/enrich-skills.js --agent-index\`.\n\n`;
  md += `**Total agents:** ${manifest.length}\n\n`;
  for (const [formation, agents] of Object.entries(byFormation)) {
    md += `## ${formation.toUpperCase()} Formation (${agents.length})\n\n`;
    for (const a of agents) {
      md += `- **\`${a.slug}\`** \`[${a.layer}]\` — ${a.description || a.name}\n`;
    }
    md += '\n';
  }

  const indexPath = path.join(CONFIG.repos[0].root, 'AGENT_INDEX.md');
  const jsonPath  = path.join(CONFIG.repos[0].root, 'agent-index.json');

  if (!dryRun(argv)) {
    fs.writeFileSync(indexPath, md, 'utf8');
    fs.writeFileSync(jsonPath, JSON.stringify({ generated: new Date().toISOString(), total: manifest.length, formations: byFormation }, null, 2), 'utf8');
    console.log(`[agent-index] ✅ AGENT_INDEX.md + agent-index.json regenerated (${manifest.length} agents)`);
  } else {
    console.log(md.split('\n').slice(0,20).join('\n') + '\n...');
  }
}

export const dryRun = (argv) => argv.includes('--dry-run');

// ── CLI Execution ─────────────────────────────────────────────────────────────
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const args = process.argv.slice(2);
  if      (args.includes('--extract'))     extract();
  else if (args.includes('--compile'))     compile({ dryRun: args.includes('--dry-run'), mirrors: args.includes('--mirrors') });
  else if (args.includes('--validate'))    validate();
  else if (args.includes('--agent-index')) buildIndex(process.argv);
  else console.log(`
Loragent Enrichment Pipeline v2
Usage:
  node scripts/enrich-skills.js --extract
  node scripts/enrich-skills.js --compile [--dry-run] [--mirrors]
  node scripts/enrich-skills.js --validate
  node scripts/enrich-skills.js --agent-index [--dry-run]
`);
}
