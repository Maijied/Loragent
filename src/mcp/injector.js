import fs from 'fs';
import path from 'path';
import os from 'os';
import logger from '../utils/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const IDE_PATHS = {
  cursor: path.join(os.homedir(), '.cursor', 'mcp.json'),
  cline_cursor: path.join(os.homedir(), '.config', 'Cursor', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'),
  cline_vscode: path.join(os.homedir(), '.config', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'),
  claude_desktop: path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json')
};

/**
 * Reads a JSON file safely
 */
function readConfig(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    logger.error(`Failed to read config from ${filePath}`, err.message);
  }
  return null;
}

/**
 * Writes a JSON file securely
 */
function writeConfig(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { mode: 0o600 });
    logger.info(`Successfully injected MCP config into ${filePath}`);
    return true;
  } catch (err) {
    logger.error(`Failed to write config to ${filePath}`, err.message);
    return false;
  }
}

/**
 * Injects an MCP server into all discovered IDE configurations
 * securely wrapping environment variables with the `cred` vault
 */
export function injectMcpServer(serverName, mcpConfig, vaultKeys) {
  let injectedCount = 0;

  // We wrap the standard command using a shell execution that grabs keys from cred vault
  // e.g. FIRECRAWL_API_KEY=$(CRED_PASSPHRASE=$(loragent get-pin) cred get firecrawl api_key)
  const envPreload = Object.entries(vaultKeys || {})
    .map(([envVar, vaultPath]) => `${envVar}=$(CRED_PASSPHRASE=$(loragent get-pin 2>/dev/null) cred get ${vaultPath})`)
    .join(' ');

  const command = mcpConfig.command;
  const args = mcpConfig.args.join(' ');
  
  let secureConfig = mcpConfig;
  
  // Only wrap in bash if we actually have vault keys to inject
  if (envPreload) {
    secureConfig = {
      command: "bash",
      args: [
        "-c",
        `${envPreload} ${command} ${args}`
      ]
    };
  }

  for (const [ide, filePath] of Object.entries(IDE_PATHS)) {
    const config = readConfig(filePath);
    
    // Only inject if the config file already exists, or if it's Cursor's default mcp.json
    if (config || ide === 'cursor') {
      const baseConfig = config || { mcpServers: {} };
      if (!baseConfig.mcpServers) {
        baseConfig.mcpServers = {};
      }
      
      baseConfig.mcpServers[serverName] = secureConfig;
      
      if (writeConfig(filePath, baseConfig)) {
        injectedCount++;
      }
    }
  }

  return injectedCount;
}
