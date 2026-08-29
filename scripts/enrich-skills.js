import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TEMPLATE_PATH = path.join(rootDir, 'AGENT_TEMPLATE.md');
const AGENTS_DIR = path.join(rootDir, 'agents');

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

export function enrichAgentSkills() {
  if (!fs.existsSync(AGENTS_DIR)) return;
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const agentFolders = fs.readdirSync(AGENTS_DIR);

  console.log(`Enriching ${agentFolders.length} agents against AGENT_TEMPLATE.md standard...`);
  let enrichedCount = 0;

  for (const folder of agentFolders) {
    const skillPath = path.join(AGENTS_DIR, folder, 'SKILL.md');
    const manifestPath = path.join(AGENTS_DIR, folder, 'manifest.json');
    if (!fs.existsSync(skillPath)) continue;

    let manifest = {};
    if (fs.existsSync(manifestPath)) {
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      } catch {}
    }

    const currentContent = fs.readFileSync(skillPath, 'utf8');
    if (!currentContent.includes('§1 · Role & Identity')) {
      const match = currentContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      let desc = manifest.description || 'Specialized agent.';
      if (match) {
        const descMatch = match[1].match(/description:\s*"?([^"\n]+)"?/);
        if (descMatch) desc = descMatch[1];
      }

      const enriched = formatAgentFromTemplate({
        name: folder,
        description: desc,
        formation: manifest.formation || 'freelance',
        layer: manifest.layer || 'lore',
        category: manifest.category || 'specialist'
      }, template);

      fs.writeFileSync(skillPath, enriched, 'utf8');
      enrichedCount++;
    }
  }

  console.log(`✅ Successfully validated & enriched ${enrichedCount} agent skills.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  enrichAgentSkills();
}
