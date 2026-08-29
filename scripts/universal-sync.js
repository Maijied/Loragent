import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const home = os.homedir();
const platform = os.platform();

// Resolving global app data paths across OS
const getAppDataPath = () => {
  if (platform === 'win32') return process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
  if (platform === 'darwin') return path.join(home, 'Library', 'Application Support');
  return path.join(home, '.config');
};

const appData = getAppDataPath();

const LORAGENT_MCP = {
  command: "node",
  args: [path.join(rootDir, "port", "mcp", "server.js")],
  env: {
    LORAGENT_WORKSPACE: rootDir
  }
};

// ----------------------------------------------------------------------
// 1. MCP Configuration Sync (Merge from .mcp.json)
// ----------------------------------------------------------------------
const mcpPaths = [
  // Cursor
  path.join(home, 'mcp.json'),
  path.join(rootDir, '.cursor', 'mcp.json'),
  // VSCode / GitHub Copilot
  path.join(rootDir, '.vscode', 'mcp.json'),
  // Antigravity / Gemini IDE
  path.join(home, '.gemini', 'config', 'mcp_config.json'),
  // VSCode (Cline)
  path.join(appData, 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'),
  // VSCode (Roo Cline)
  path.join(appData, 'Code', 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'cline_mcp_settings.json'),
  // Claude Desktop
  path.join(appData, 'Claude', 'claude_desktop_config.json'),
  // Windsurf
  path.join(home, '.codeium', 'windsurf', 'mcp_config.json')
];

// Read master .mcp.json if available
let masterMcpConfig = { mcpServers: {} };
const masterMcpFile = path.join(rootDir, '.mcp.json');
if (fs.existsSync(masterMcpFile)) {
  try {
    masterMcpConfig = JSON.parse(fs.readFileSync(masterMcpFile, 'utf8'));
  } catch (e) {
    console.warn('⚠️ Warning: Failed to parse root .mcp.json');
  }
}

console.log('🔄 Merging Loragent & Official Cloudflare MCP servers into global configs...');
for (const mcpFile of mcpPaths) {
  try {
    let config = { mcpServers: {} };
    if (fs.existsSync(mcpFile)) {
      const raw = fs.readFileSync(mcpFile, 'utf8');
      if (raw.trim()) {
        try {
          config = JSON.parse(raw);
        } catch(e) {
          console.warn(`⚠️  Warning: Failed to parse JSON in ${mcpFile}. Skipping.`);
          continue;
        }
      }
    } else {
      fs.mkdirSync(path.dirname(mcpFile), { recursive: true });
    }

    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    const isWindsurf = mcpFile.includes('windsurf');

    // 1. Merge master MCP servers from .mcp.json
    for (const [key, serverDef] of Object.entries(masterMcpConfig.mcpServers || {})) {
      if (isWindsurf) {
        if (serverDef.url) {
          config.mcpServers[key] = { serverUrl: serverDef.url };
        } else {
          config.mcpServers[key] = { ...serverDef };
        }
      } else {
        config.mcpServers[key] = { ...serverDef };
      }
    }

    // 2. Ensure local loragent uses absolute server path
    config.mcpServers["loragent"] = LORAGENT_MCP;

    // 3. Ensure Cloudflare remote MCPs
    const cloudflareUrls = {
      "cloudflare": "https://mcp.cloudflare.com/mcp",
      "cloudflare-docs": "https://docs.mcp.cloudflare.com/mcp",
      "cloudflare-bindings": "https://bindings.mcp.cloudflare.com/mcp",
      "cloudflare-builds": "https://builds.mcp.cloudflare.com/mcp",
      "cloudflare-observability": "https://observability.mcp.cloudflare.com/mcp"
    };

    for (const [name, url] of Object.entries(cloudflareUrls)) {
      if (isWindsurf) {
        config.mcpServers[name] = { serverUrl: url };
      } else {
        config.mcpServers[name] = { url };
      }
    }

    fs.writeFileSync(mcpFile, JSON.stringify(config, null, 2), 'utf8');
    console.log(`✅ Synced MCP to: ${mcpFile}`);
  } catch (error) {
    console.error(`❌ Failed to sync MCP to ${mcpFile}:`, error.message);
  }
}

// ----------------------------------------------------------------------
// 2. Master Roster Sync (~/.loragent/master-roster/skills/)
// ----------------------------------------------------------------------
const agentsSourceDir = path.join(rootDir, 'agents');
const masterRosterSkillsDir = path.join(home, '.loragent', 'master-roster', 'skills');

console.log('\n🔄 Syncing 174 Agents to Global Master Roster...');
if (fs.existsSync(agentsSourceDir)) {
  fs.mkdirSync(masterRosterSkillsDir, { recursive: true });
  const agentDirs = fs.readdirSync(agentsSourceDir);
  let count = 0;
  for (const agent of agentDirs) {
    const srcAgentDir = path.join(agentsSourceDir, agent);
    if (fs.statSync(srcAgentDir).isDirectory()) {
      const destAgentDir = path.join(masterRosterSkillsDir, agent);
      fs.cpSync(srcAgentDir, destAgentDir, { recursive: true, force: true });
      count++;
    }
  }
  console.log(`✅ Synced ${count} agents into master roster: ${masterRosterSkillsDir}`);
}

// ----------------------------------------------------------------------
// 3. Global & Workspace Skills Sync (/skill command support)
// ----------------------------------------------------------------------
const skillsSourceDir = path.join(rootDir, 'skills');
const globalSkillDirs = [
  path.join(home, '.skills'),                     // Cursor standard
  path.join(home, '.agents', 'skills'),           // Loragent global hub
  path.join(home, '.gemini', 'config', 'skills'), // Antigravity / Gemini
  path.join(home, '.claude', 'skills')           // Claude Code
];

console.log('\n🔄 Syncing Skills to global IDE directories...');
if (fs.existsSync(skillsSourceDir)) {
  const skills = fs.readdirSync(skillsSourceDir);
  
  for (const targetDir of globalSkillDirs) {
    try {
      fs.mkdirSync(targetDir, { recursive: true });
      for (const skill of skills) {
        const srcPath = path.join(skillsSourceDir, skill);
        if (fs.statSync(srcPath).isDirectory()) {
          const destPath = path.join(targetDir, skill);
          fs.cpSync(srcPath, destPath, { recursive: true, force: true });
        }
      }
      console.log(`✅ Synced ${skills.length} skills to: ${targetDir}`);
    } catch(err) {
      console.error(`❌ Failed syncing skills to ${targetDir}:`, err.message);
    }
  }
}

// Ensure local workspace .agents/skills has core agents + system skills
const localWorkspaceSkillsDir = path.join(rootDir, '.agents', 'skills');
fs.mkdirSync(localWorkspaceSkillsDir, { recursive: true });
const coreAgents = ['boss', 'teacher', 'spidernet', 'watchman', 'workspace-guard', 'tech-director', 'backend-se', 'frontend-se', 'sqa', 'bug-hunter', 'wrangler-specialist'];
for (const agent of coreAgents) {
  const src = path.join(agentsSourceDir, agent);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(localWorkspaceSkillsDir, `loragent-${agent}`), { recursive: true, force: true });
  }
}
if (fs.existsSync(skillsSourceDir)) {
  fs.cpSync(skillsSourceDir, localWorkspaceSkillsDir, { recursive: true, force: true });
}
console.log(`✅ Synced core agents & skills into local workspace: ${localWorkspaceSkillsDir}`);

// ----------------------------------------------------------------------
// 4. Subagents & Mentions Sync (@agent support)
// ----------------------------------------------------------------------
const localSubagentsDir = path.join(rootDir, '.agents', 'subagents');
fs.mkdirSync(localSubagentsDir, { recursive: true });
if (fs.existsSync(agentsSourceDir)) {
  const agentDirs = fs.readdirSync(agentsSourceDir);
  for (const agent of agentDirs) {
    const srcSkill = path.join(agentsSourceDir, agent, 'SKILL.md');
    if (fs.existsSync(srcSkill)) {
      const destSubagent = path.join(localSubagentsDir, `loragent-${agent}.md`);
      fs.copyFileSync(srcSkill, destSubagent);
    }
  }
  console.log(`✅ Synced @subagent definitions to: ${localSubagentsDir}`);
}

// ----------------------------------------------------------------------
// 5. Workspace Editor Rules Sync (All IDEs)
// ----------------------------------------------------------------------
console.log('\n🔄 Syncing Workspace Rules...');

// Target-specific mappings
const ruleMappings = [
  { target: 'CLAUDE.md', source: path.join(rootDir, 'rules', 'AGENTS.md') },
  { target: '.clinerules', source: path.join(rootDir, 'rules', 'loragent-cline.md'), fallback: path.join(rootDir, 'rules', 'AGENTS.md') },
  { target: '.cursorrules', source: path.join(rootDir, 'rules', 'loragent-cursor.md'), fallback: path.join(rootDir, 'rules', 'AGENTS.md') },
  { target: '.windsurfrules', source: path.join(rootDir, 'rules', 'loragent-windsurf.md'), fallback: path.join(rootDir, 'rules', 'AGENTS.md') }
];

for (const { target, source, fallback } of ruleMappings) {
  const src = fs.existsSync(source) ? source : (fallback && fs.existsSync(fallback) ? fallback : null);
  if (src) {
    const content = fs.readFileSync(src, 'utf8');
    const targetPath = path.join(rootDir, target);
    try {
      fs.writeFileSync(targetPath, content, 'utf8');
      console.log(`✅ Synced rule to: ${target}`);
    } catch (err) {
      console.error(`❌ Failed to sync rule to ${targetPath}:`, err.message);
    }
  }
}

// Also sync all rules/*.md and rules/*.mdc to .cursor/rules and .agents/rules
const rulesSrcDir = path.join(rootDir, 'rules');
const cursorRulesDir = path.join(rootDir, '.cursor', 'rules');
const agentsRuleDir = path.join(rootDir, '.agents', 'rules');
fs.mkdirSync(cursorRulesDir, { recursive: true });
fs.mkdirSync(agentsRuleDir, { recursive: true });

if (fs.existsSync(rulesSrcDir)) {
  const ruleFiles = fs.readdirSync(rulesSrcDir);
  for (const file of ruleFiles) {
    const srcFile = path.join(rulesSrcDir, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, path.join(agentsRuleDir, file));
      const cursorDest = file.endsWith('.md') ? `${file}c` : file;
      fs.copyFileSync(srcFile, path.join(cursorRulesDir, cursorDest));
    }
  }
  console.log(`✅ Successfully synced ${ruleFiles.length} rules to: .cursor/rules/ and .agents/rules/`);
}

// ----------------------------------------------------------------------
// 6. Roo Code / Cline Custom Modes (.roomodes)
// ----------------------------------------------------------------------
const roomodesPath = path.join(rootDir, '.roomodes');
const rooModesConfig = {
  customModes: [
    {
      slug: "loragent-boss",
      name: "🤖 Loragent Boss — Orchestrator",
      roleDefinition: "You are loragent-boss, the central intelligent routing hub of the 108-agent Loragent ecosystem. You NEVER implement anything yourself. Your sole function is to: (1) clarify requirements via loragent-teacher if needed, (2) select the correct formation, (3) summon agents via loragent_summon_agent MCP, (4) route handoffs via loragent_steer, (5) monitor execution via loragent-watchman. You speak in command language, not implementation language.",
      customInstructions: "Analyze task complexity first. For simple single-specialist tasks, summon directly. For compound tasks, select a formation and spin up the full squad. Always confirm destructive actions through workspace-guard. Save state via watchman after every major routing decision.",
      groups: ["read", "edit", "browser", "command", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-auto-team",
      name: "🛠️ Auto Team — Engineering Formation",
      roleDefinition: "Engineering squad: Tech Director (architecture) → Backend SE (APIs/DB) → Frontend SE (UI) → SQA (testing) → DevOps (deployment). You collectively implement a full software feature end-to-end. Each role hands off sequentially via loragent_steer.",
      customInstructions: "Tech Director goes first: define architecture, select stack, create task breakdown. Backend SE implements API + data layer. Frontend SE implements UI against the API spec. SQA writes tests and validates. DevOps handles CI/CD and deployment. Each agent saves state after their step.",
      groups: ["read", "edit", "command", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-chela",
      name: "🥷 Chela — Debugging Formation",
      roleDefinition: "Debug squad: Bug Hunter (locate the bug) → Shift Engineer (fix it) → Debugger (verify fix) → Inspector (RCA report). Triggered for mission-critical bugs, production incidents, and test failures. MANDATORY: read .loragent-debug/orchestration-graph.json before any action.",
      customInstructions: "Bug Hunter reads the orchestration graph first, then traces the error to exact file+line. Shift Engineer applies the minimal fix. Debugger runs the test suite to verify. Inspector writes a Root Cause Analysis. All steps logged to watchman cache.",
      groups: ["read", "edit", "command", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-office",
      name: "🏢 Office — Business Formation",
      roleDefinition: "Business squad: Project Coordinator (plan) → Marketing Strategy Manager (campaigns) → Publisher (content/publishing) → PR Specialist (outreach). Activated for product launches, marketing campaigns, and business operations.",
      customInstructions: "Coordinator creates the project plan and timeline. Marketing Manager defines strategy and assets needed. Publisher creates and schedules content. PR Specialist handles outreach and notifications (Slack/email via MCP).",
      groups: ["read", "edit", "browser", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-creative",
      "name": "🎨 Creative — Design & Media",
      roleDefinition: "Creative squad: UI/UX Professional + 3D Designer + Animator + Logo Designer + Image Generator. Produces all visual assets: images (Fal.ai MCP), GIFs (FFmpeg MCP), UI mockups, logos, animations. Uses Biological UI standards: dark-space, violet glow, glassmorphic.",
      customInstructions: "Always check connector availability before generating: FAL_API_KEY for images, ffmpeg for GIFs. Store all generated asset URLs in watchman cache. For Slack GIFs: max 2MB, 480px wide, 10s, fps=10. For web images: Flux Pro for quality, Flux Dev for speed.",
      groups: ["read", "edit", "browser", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-devops",
      name: "🚀 DevOps — Infrastructure & Deployment",
      roleDefinition: "Infrastructure agent: handles CI/CD, containerization (Docker), cloud deployment (Vercel/Railway), monitoring, and environment management. ALWAYS requires workspace-guard confirmation before any production deployment.",
      customInstructions: "Check pre-deploy hook passes before every deployment. Multi-stage Docker builds only. Never hardcode secrets — use ${ENV_VAR} syntax. Post-deploy: send Slack notification via MCP if SLACK_BOT_TOKEN is set. Log all deploy actions to watchman.",
      groups: ["read", "edit", "command", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-watchman",
      name: "👁️ Watchman — Crash Recovery",
      roleDefinition: "Session state guardian. Continuously logs execution state to .loragent-debug/watchman-cache.json. Resumes crashed or token-limited sessions. Activated by /loragent-watchman continue.",
      customInstructions: "On activation: read watchman-cache.json, summarize the last known state, identify the next pending step, and resume execution from that exact point. Never restart from scratch if a cache exists.",
      groups: ["read", "edit", "command", "mcp"],
      source: "project"
    }
  ]
};
fs.writeFileSync(roomodesPath, JSON.stringify(rooModesConfig, null, 2), 'utf8');
console.log(`✅ Successfully generated Roo Code custom modes in: .roomodes`);

console.log('\n🎉 Universal AI Code Editor compatibility sync complete.');
