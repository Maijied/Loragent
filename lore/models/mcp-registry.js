import fs from 'fs';
import path from 'path';
import platform from './platform.js';

class MCPRegistry {
  constructor() {
    this.globalPathCursor = platform.getCursorMcpPath();
    this.globalPathClaude = platform.getClaudeMcpPath();
  }

  readRegistry(filePath) {
    if (!fs.existsSync(filePath)) return { mcpServers: {} };
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error(`Failed to read MCP registry at ${filePath}:`, e);
      return { mcpServers: {} };
    }
  }

  writeRegistry(filePath, data) {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  addServer(registryPath, serverName, serverConfig) {
    const data = this.readRegistry(registryPath);
    data.mcpServers = data.mcpServers || {};
    data.mcpServers[serverName] = serverConfig;
    this.writeRegistry(registryPath, data);
  }

  removeServer(registryPath, serverName) {
    const data = this.readRegistry(registryPath);
    if (data.mcpServers && data.mcpServers[serverName]) {
      delete data.mcpServers[serverName];
      this.writeRegistry(registryPath, data);
    }
  }

  syncToGlobals(serverName, serverConfig) {
    // Sync to Cursor
    if (this.globalPathCursor) {
      this.addServer(this.globalPathCursor, serverName, serverConfig);
    }
    // Sync to Claude
    if (this.globalPathClaude) {
      this.addServer(this.globalPathClaude, serverName, serverConfig);
    }
  }
}

export default new MCPRegistry();
