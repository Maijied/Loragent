import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import os from 'os';
import path from 'path';
import fs from 'fs';

class Platform {
  constructor() {
    this.osType = os.platform(); // 'win32', 'darwin', 'linux'
    this.homeDir = os.homedir();
    this.paths = this._loadPaths();
  }

  _loadPaths() {
    try {
      const pathsFile = path.join(__dirname, '../../registry/platform-paths.json');
      const data = JSON.parse(fs.readFileSync(pathsFile, 'utf8'));
      // Fallback to linux if platform not found
      return data[this.osType] || data['linux'];
    } catch (e) {
      console.error('Failed to load platform paths:', e);
      return {};
    }
  }

  getCursorMcpPath() {
    return path.join(this.homeDir, this.paths.cursor);
  }

  getClaudeMcpPath() {
    return path.join(this.homeDir, this.paths.claude);
  }
  
  getCredVaultPath() {
    return this.paths.credVault.startsWith('~') 
      ? path.join(this.homeDir, this.paths.credVault.slice(1))
      : this.paths.credVault;
  }

  getWorkspaceAgentsPath(workspaceRoot) {
    return path.join(workspaceRoot, this.paths.agents);
  }
}

export default new Platform();
