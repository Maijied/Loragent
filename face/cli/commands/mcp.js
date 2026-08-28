import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { injectMcpServer } from '../../../src/mcp/injector.js';
import logger from '../../../src/utils/logger.js';
import { fileURLToPath } from 'url';
import { getPin } from '../../../src/lore/auth/pin-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of integrations to their required vault keys
const VAULT_REQUIREMENTS = {
  firecrawl: {
    FIRECRAWL_API_KEY: 'firecrawl api_key'
  },
  composio: {
    COMPOSIO_API_KEY: 'composio api_key'
  },
  'frontend-design': {
    ANTHROPIC_API_KEY: 'anthropic api_key'
  }
};

export default function mcpCmd(program) {
  program
    .command('mcp')
    .description('Manage MCP servers for Loragent')
    .argument('<action>', 'Action to perform (e.g., init)')
    .argument('<integration>', 'The integration to initialize (e.g., firecrawl, composio)')
    .action(async (action, integration) => {
      if (action !== 'init') {
        logger.error(`Unknown action '${action}'. Only 'init' is supported currently.`);
        process.exit(1);
      }

      logger.info(`Initializing MCP server: ${integration}...`);

      const configPath = path.join(__dirname, '../../../src/mcp/configs', `${integration}.json`);
      
      if (!fs.existsSync(configPath)) {
        logger.error(`Integration '${integration}' is not supported or missing config at ${configPath}`);
        process.exit(1);
      }

      const fullConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const mcpConfig = fullConfig.mcpServers[integration];
      
      if (!mcpConfig) {
        logger.error(`Config file missing mcpServers.${integration}`);
        process.exit(1);
      }
      
      const vaultKeys = VAULT_REQUIREMENTS[integration] || {};

      // Get PIN and set for automated reading
      const pin = await getPin();
      if (pin) {
        process.env.CRED_PASSPHRASE = pin;
      }

      // Check if we need to prompt the user to set their credentials
      for (const [envVar, vaultPath] of Object.entries(vaultKeys)) {
        try {
          // Check if credential exists
          const existing = execSync(`cred get ${vaultPath} 2>/dev/null`, { encoding: 'utf8' }).trim();
          if (!existing) {
            logger.info(`Missing credential for ${vaultPath}. Prompting secure vault...`);
            // We use stdio: inherit to allow the user to type in the interactive prompt securely
            execSync(`cred set ${vaultPath}`, { stdio: 'inherit' });
          }
        } catch (err) {
          logger.info(`Credential ${vaultPath} missing or error reading it. Prompting...`);
          try {
            execSync(`cred set ${vaultPath}`, { stdio: 'inherit' });
          } catch (promptErr) {
            logger.error(`Failed to securely set ${vaultPath}. Aborting.`);
            process.exit(1);
          }
        }
      }

      // Now inject into IDEs
      logger.info('Injecting configuration into installed IDEs...');
      const count = injectMcpServer(integration, mcpConfig, vaultKeys);
      
      if (count > 0) {
        logger.info(`✅ Successfully installed ${integration} MCP server across ${count} IDE(s).`);
      } else {
        logger.error(`❌ Could not inject MCP server. No supported IDE configurations found.`);
      }
    });
}
