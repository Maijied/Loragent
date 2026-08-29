import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

/**
 * Universal PC Discovery Service
 * ==============================
 * Scans the machine across all known AI IDE configurations, global roots,
 * and project workspaces to build a live inventory of:
 * - SKILL.md agent & skill definitions
 * - MCP server configurations (.mcp.json, mcp_config.json, claude_desktop_config.json, etc.)
 * - Workspace Rules (.mdc, .cursorrules, .clinerules, .windsurfrules, AGENTS.md)
 * - Custom Modes & Subagents (.roomodes, .agents/subagents)
 */
class PCDiscovery {
  constructor() {
    this.home = os.homedir();
  }

  /**
   * Primary discovery scanner
   * @param {Object} options
   * @returns {Object} Full inventory of discovered assets
   */
  discover(options = {}) {
    const customPaths = options.customPaths || [];
    const save = options.save !== false;

    const inventory = {
      timestamp: new Date().toISOString(),
      platform: process.platform,
      arch: process.arch,
      home: this.home,
      summary: {
        totalSkills: 0,
        totalAgents: 0,
        totalMcpServers: 0,
        totalRules: 0,
        totalModes: 0,
      },
      locationsScanned: [],
      skills: [],
      agents: [],
      mcpServers: [],
      rules: [],
      modes: [],
    };

    const targetRoots = [
      // IDE Global configs
      path.join(this.home, '.gemini', 'config'),
      path.join(this.home, '.cursor'),
      path.join(this.home, '.claude'),
      path.join(this.home, '.agents'),
      path.join(this.home, '.kiro'),
      path.join(this.home, '.skills'),
      path.join(this.home, '.codeium', 'windsurf'),
      path.join(this.home, '.config', 'Claude'),
      path.join(this.home, '.config', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev'),
      path.join(this.home, '.config', 'Code', 'User', 'globalStorage', 'rooveterinaryinc.roo-cline'),
      // Master Roster
      path.join(this.home, '.loragent', 'master-roster'),
      // Current Workspace
      process.cwd(),
      // Custom extra search paths
      ...customPaths,
    ];

    for (const root of targetRoots) {
      if (fs.existsSync(root)) {
        inventory.locationsScanned.push(root);
        this._scanLocation(root, inventory, 0, 4);
      }
    }

    // Deduplicate lists by path or name
    inventory.skills = this._dedupe(inventory.skills, 'path');
    inventory.agents = this._dedupe(inventory.agents, 'path');
    inventory.mcpServers = this._dedupe(inventory.mcpServers, 'name');
    inventory.rules = this._dedupe(inventory.rules, 'path');
    inventory.modes = this._dedupe(inventory.modes, 'name');

    inventory.summary.totalSkills = inventory.skills.length;
    inventory.summary.totalAgents = inventory.agents.length;
    inventory.summary.totalMcpServers = inventory.mcpServers.length;
    inventory.summary.totalRules = inventory.rules.length;
    inventory.summary.totalModes = inventory.modes.length;

    if (save) {
      this._saveInventory(inventory);
    }

    return inventory;
  }

  _scanLocation(dirPath, inv, currentDepth, maxDepth) {
    if (currentDepth > maxDepth) return;

    let entries = [];
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip ignored directories
        if (['node_modules', '.git', 'dist', 'target', 'vendor', '.local_plain_backup'].includes(entry.name)) {
          continue;
        }

        // Check for SKILL.md inside directory
        const skillFile = path.join(fullPath, 'SKILL.md');
        if (fs.existsSync(skillFile)) {
          const meta = this._parseSkillFrontmatter(skillFile);
          inv.skills.push({
            name: meta.name || entry.name,
            path: skillFile,
            description: meta.description || '',
            formation: meta.formation || 'auto',
            layer: meta.layer || 'cross',
            version: meta.version || '2.0.0',
          });
        }

        // Check for agent.json inside directory
        const agentFile = path.join(fullPath, 'agent.json');
        if (fs.existsSync(agentFile)) {
          try {
            const agentData = JSON.parse(fs.readFileSync(agentFile, 'utf8'));
            inv.agents.push({
              name: agentData.name || entry.name,
              path: agentFile,
              role: agentData.role || '',
              description: agentData.description || '',
            });
          } catch {}
        }

        this._scanLocation(fullPath, inv, currentDepth + 1, maxDepth);
      } else if (entry.isFile()) {
        // MCP configs
        if (['mcp.json', '.mcp.json', 'mcp_config.json', 'claude_desktop_config.json', 'cline_mcp_settings.json'].includes(entry.name)) {
          this._extractMcpServers(fullPath, inv);
        }

        // Rules
        if (entry.name.endsWith('.mdc') || ['AGENTS.md', '.cursorrules', '.clinerules', '.windsurfrules'].includes(entry.name)) {
          inv.rules.push({
            name: entry.name,
            path: fullPath,
            sizeBytes: entry.size || fs.statSync(fullPath).size,
          });
        }

        // Custom Modes (.roomodes)
        if (entry.name === '.roomodes') {
          try {
            const roomodes = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            for (const mode of roomodes.customModes || []) {
              inv.modes.push({
                name: mode.name || mode.slug,
                slug: mode.slug,
                roleDefinition: mode.roleDefinition || '',
                sourcePath: fullPath,
              });
            }
          } catch {}
        }
      }
    }
  }

  _extractMcpServers(filePath, inv) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const servers = data.mcpServers || {};
      for (const [key, cfg] of Object.entries(servers)) {
        inv.mcpServers.push({
          name: key,
          command: cfg.command || '',
          args: cfg.args || [],
          sourceConfig: filePath,
          description: cfg.description || '',
        });
      }
    } catch {}
  }

  _parseSkillFrontmatter(filePath) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!match) return {};
      const fmBlock = match[1];
      const fm = {};
      for (const line of fmBlock.split('\n')) {
        const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
        if (kv) {
          fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
        }
      }
      return fm;
    } catch {
      return {};
    }
  }

  _dedupe(list, key) {
    const seen = new Set();
    return list.filter(item => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }

  _saveInventory(inventory) {
    const regDir = path.join(process.cwd(), 'registry');
    fs.mkdirSync(regDir, { recursive: true });
    const invPath = path.join(regDir, 'pc-inventory.json');
    fs.writeFileSync(invPath, JSON.stringify(inventory, null, 2), 'utf8');
  }
}

export default new PCDiscovery();
