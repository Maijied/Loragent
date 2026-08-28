import fs from 'fs';
import path from 'path';
import os from 'os';
import platform from '../models/platform.js';

class PCDiscovery {
  /**
   * Scans local global IDE directories and known workspaces to find existing skills/agents.
   */
  discover() {
    console.log(`[LORE] Discovering assets across the machine...`);
    const home = os.homedir();
    const discovered = {
      skills: [],
      agents: [],
      mcpServers: []
    };

    const searchPaths = [
      path.join(home, '.gemini', 'config', 'skills'),
      path.join(home, '.gemini', 'config', 'agents'),
      path.join(home, '.gemini', 'config', 'plugins')
    ];

    searchPaths.forEach(p => {
      if (fs.existsSync(p)) {
        this._scanDirectory(p, discovered);
      }
    });

    return discovered;
  }

  _scanDirectory(dirPath, discovered) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (fs.existsSync(path.join(fullPath, 'SKILL.md'))) {
           discovered.skills.push(fullPath);
        } else if (fs.existsSync(path.join(fullPath, 'agent.json'))) {
           discovered.agents.push(fullPath);
        } else if (fs.existsSync(path.join(fullPath, 'mcp_config.json'))) {
           discovered.mcpServers.push(fullPath);
        } else {
           this._scanDirectory(fullPath, discovered);
        }
      }
    }
  }
}

export default new PCDiscovery();
