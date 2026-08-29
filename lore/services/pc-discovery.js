import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import SkillDeduplicator from './skill-deduplicator.js';

/**
 * Universal PC Discovery Service v2 (Deduplication, Filtering & Auto-Enrichment)
 * ==============================================================================
 * Scans the machine across all known AI IDE configurations, global roots,
 * and project workspaces to build a live inventory of:
 * - SKILL.md agent & skill definitions (deduplicated & quality scored)
 * - MCP server configurations (.mcp.json, mcp_config.json, claude_desktop_config.json, etc.)
 * - Workspace Rules (.mdc, .cursorrules, .clinerules, .windsurfrules, AGENTS.md)
 * - Custom Modes & Subagents (.roomodes, .agents/subagents)
 */
class PCDiscovery {
  constructor() {
    this.home = os.homedir();
  }

  /**
   * Primary discovery scanner with intelligent deduplication and filtering
   * @param {Object} options
   * @returns {Object} Full inventory of discovered assets
   */
  discover(options = {}) {
    const customPaths = options.customPaths || [];
    const save = options.save !== false;
    const filter = options.filter || '';
    const category = options.category || '';
    const minQuality = options.minQuality ? parseInt(options.minQuality, 10) : 0;
    const uniqueOnly = options.unique !== false;
    const enrichCanonical = options.enrich === true;

    const rawSkills = [];
    const rawAgents = [];
    const rawMcpServers = [];
    const rawRules = [];
    const rawModes = [];
    const locationsScanned = [];

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
        locationsScanned.push(root);
        this._scanLocation(root, { rawSkills, rawAgents, rawMcpServers, rawRules, rawModes }, 0, 4);
      }
    }

    // Run Deduplication and Quality Engine
    const dedupedResult = SkillDeduplicator.deduplicateAndEnrich(rawSkills, {
      filter,
      category,
      minQuality,
      enrichCanonical,
    });

    const mcpServers = this._dedupe(rawMcpServers, 'name');
    const rules = this._dedupe(rawRules, 'path');
    const modes = this._dedupe(rawModes, 'name');

    const inventory = {
      timestamp: new Date().toISOString(),
      platform: process.platform,
      arch: process.arch,
      home: this.home,
      summary: {
        totalRawSkillsScanned: dedupedResult.totalRaw,
        totalUniqueSkills: dedupedResult.totalUnique,
        totalDuplicatesFiltered: dedupedResult.totalDuplicatesFiltered,
        totalMcpServers: mcpServers.length,
        totalRules: rules.length,
        totalModes: modes.length,
      },
      locationsScanned,
      skills: uniqueOnly ? dedupedResult.skills : rawSkills,
      mcpServers,
      rules,
      modes,
    };

    if (save) {
      this._saveInventory(inventory);
    }

    return inventory;
  }

  _scanLocation(dirPath, sink, currentDepth, maxDepth) {
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
          const parsed = this._parseSkillFull(skillFile, entry.name);
          sink.rawSkills.push(parsed);
        }

        // Check for agent.json inside directory
        const agentFile = path.join(fullPath, 'agent.json');
        if (fs.existsSync(agentFile)) {
          try {
            const agentData = JSON.parse(fs.readFileSync(agentFile, 'utf8'));
            sink.rawAgents.push({
              name: agentData.name || entry.name,
              path: agentFile,
              role: agentData.role || '',
              description: agentData.description || '',
            });
          } catch {}
        }

        this._scanLocation(fullPath, sink, currentDepth + 1, maxDepth);
      } else if (entry.isFile()) {
        // MCP configs
        if (['mcp.json', '.mcp.json', 'mcp_config.json', 'claude_desktop_config.json', 'cline_mcp_settings.json'].includes(entry.name)) {
          this._extractMcpServers(fullPath, sink.rawMcpServers);
        }

        // Rules
        if (entry.name.endsWith('.mdc') || ['AGENTS.md', '.cursorrules', '.clinerules', '.windsurfrules'].includes(entry.name)) {
          sink.rawRules.push({
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
              sink.rawModes.push({
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

  _extractMcpServers(filePath, out) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const servers = data.mcpServers || {};
      for (const [key, cfg] of Object.entries(servers)) {
        out.push({
          name: key,
          command: cfg.command || '',
          args: cfg.args || [],
          sourceConfig: filePath,
          description: cfg.description || '',
        });
      }
    } catch {}
  }

  _parseSkillFull(filePath, dirName) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      let fm = {};
      let body = raw.trim();

      if (m) {
        const [, fmBlock, b] = m;
        body = b.trim();
        for (const line of fmBlock.split('\n')) {
          const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
          if (kv) {
            const key = kv[1];
            const val = kv[2].trim().replace(/^['"]|['"]$/g, '');
            if (val.startsWith('[') && val.endsWith(']')) {
              fm[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
            } else {
              fm[key] = val;
            }
          }
        }
      }

      const name = fm.name || dirName;
      return {
        name,
        path: filePath,
        description: fm.description || '',
        formation: fm.formation || 'auto',
        layer: fm.layer || 'cross',
        version: fm.version || '2.0.0',
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        allowed_tools: Array.isArray(fm.allowed_tools) ? fm.allowed_tools : [],
        connectors: Array.isArray(fm.connectors) ? fm.connectors : [],
        fm,
        body,
        raw,
      };
    } catch {
      return { name: dirName, path: filePath, fm: {}, body: '', raw: '' };
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
