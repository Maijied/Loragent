import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const home = os.homedir();
const platform = os.platform();

// Parse CLI flags
const ARGS = process.argv.slice(2);
let FILTER_QUERY = '';
let CATEGORY_FILTER = '';

for (let i = 0; i < ARGS.length; i++) {
  if ((ARGS[i] === '-f' || ARGS[i] === '--filter') && ARGS[i + 1]) {
    FILTER_QUERY = ARGS[i + 1].toLowerCase();
  }
  if ((ARGS[i] === '-c' || ARGS[i] === '--category') && ARGS[i + 1]) {
    CATEGORY_FILTER = ARGS[i + 1].toLowerCase();
  }
}

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
      const raw = fs.readFileSync(mcpFile, 'utf8').trim();
      if (raw) {
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

console.log('\n🔄 Syncing Agents to Global Master Roster (Filtered & Unique)...');
if (fs.existsSync(agentsSourceDir)) {
  fs.mkdirSync(masterRosterSkillsDir, { recursive: true });
  const agentDirs = fs.readdirSync(agentsSourceDir);
  let count = 0;
  for (const agent of agentDirs) {
    if (FILTER_QUERY && !agent.toLowerCase().includes(FILTER_QUERY)) continue;

    const srcAgentDir = path.join(agentsSourceDir, agent);
    if (fs.statSync(srcAgentDir).isDirectory()) {
      const destAgentDir = path.join(masterRosterSkillsDir, agent);
      fs.cpSync(srcAgentDir, destAgentDir, { recursive: true, force: true });
      count++;
    }
  }
  console.log(`✅ Synced ${count} canonical agents into master roster: ${masterRosterSkillsDir}`);
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

console.log('\n🔄 Syncing Skills to global IDE directories (Canonical & Deduplicated)...');
if (fs.existsSync(skillsSourceDir)) {
  let skills = fs.readdirSync(skillsSourceDir);
  
  if (FILTER_QUERY) {
    skills = skills.filter(s => s.toLowerCase().includes(FILTER_QUERY));
  }

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
      console.log(`✅ Synced ${skills.length} filtered unique skills to: ${targetDir}`);
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
    } catch(err) {
      console.error(`❌ Failed syncing rule to ${target}:`, err.message);
    }
  }
}

// Global Cursor/Claude Rules (.cursor/rules/*.mdc)
const rulesSrcDir = path.join(rootDir, 'rules');
const cursorRulesDestDir = path.join(rootDir, '.cursor', 'rules');
const agentsRulesDestDir = path.join(rootDir, '.agents', 'rules');

[cursorRulesDestDir, agentsRulesDestDir].forEach(destDir => {
  fs.mkdirSync(destDir, { recursive: true });
  if (fs.existsSync(rulesSrcDir)) {
    const ruleFiles = fs.readdirSync(rulesSrcDir).filter(f => f.endsWith('.md') || f.endsWith('.mdc'));
    for (const file of ruleFiles) {
      const srcFile = path.join(rulesSrcDir, file);
      const destFileName = file.endsWith('.mdc') ? file : file.replace(/\.md$/, '.mdc');
      const destFile = path.join(destDir, destFileName);
      fs.copyFileSync(srcFile, destFile);
    }
    console.log(`✅ Successfully synced ${ruleFiles.length} rules to: ${path.relative(rootDir, destDir)}/`);
  }
});

// ----------------------------------------------------------------------
// 6. Roo Code (.roomodes) Mode Generation
// ----------------------------------------------------------------------
const roomodesPath = path.join(rootDir, '.roomodes');
const rooModesConfig = {
  customModes: [
    {
      slug: "loragent-boss",
      name: "👑 Loragent Boss — Chief Orchestrator",
      roleDefinition: "You are loragent-boss, the central routing orchestrator of Loragent. You analyze user tasks, select the optimal squad formation (Auto-Team, Enterprise-Office, Chela-Debugging, Freelance-Isolation, Recovery-Observer, or Spidernet-DAG), summon specialist agents via MCP, and ensure end-to-end task completion.",
      customInstructions: "Always consult .loragent-debug/orchestration-graph.json before routing. Summon specialists via loragent_summon_agent, log handoffs with loragent_steer, and dismiss specialists with loragent_dismiss_agent after task completion.",
      groups: ["read", "edit", "browser", "command", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-chorki",
      name: "🌀 Chorki — Continuous Autopilot",
      roleDefinition: "Autonomous relentless execution engine. You loop through tasks, execute code changes, trigger check-done hooks, apply self-healing fixes, and never stop until tasks are verifiably complete.",
      customInstructions: "Execute in a loop: Plan -> Implement -> Run check-done hook -> Self-heal on failure -> Verify 100% completion. Report status with clear progress badges.",
      groups: ["read", "edit", "command", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-tech-director",
      name: "🏛️ Tech Director — Lead Architect",
      roleDefinition: "Chief software architect for the Auto-Team. Defines technical architecture, database schemas, API specs, and component hierarchy before code is written. Enforces LLDP standards.",
      customInstructions: "Always produce clean architecture diagrams in mermaid. Validate dependency compatibility before approving packages. Delegate implementation to backend-se and frontend-se.",
      groups: ["read", "edit", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-bug-hunter",
      name: "🎯 Bug Hunter — Chela Debugger",
      roleDefinition: "Lead troubleshooting specialist. Expert at parsing logs, finding stack-trace origins, diagnosing race conditions, and executing Root Cause Analysis (RCA).",
      customInstructions: "Never guess file locations — parse .loragent-debug/orchestration-graph.json first. Write minimal reproducible tests for any bug before fixing.",
      groups: ["read", "edit", "command", "mcp"],
      source: "project"
    },
    {
      slug: "loragent-creative",
      name: "🎨 Creative Studio — Visuals & UI",
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
