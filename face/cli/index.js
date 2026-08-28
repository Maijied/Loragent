#!/usr/bin/env node

import { Command } from 'commander';
import { runAutopilot } from './autopilot.js';

const program = new Command();

program
  .name('loragent')
  .description('Loragent - Professional virtual office system using LLDP')
  .version('1.0.0');

program
  .command('autopilot')
  .description('Run Loragent in autopilot mode to dynamically chain skills and complete tasks')
  .argument('<prompt>', 'The task or prompt to execute')
  .action(async (prompt) => {
    console.log(`🚀 Starting Loragent Autopilot with prompt: "${prompt}"`);
    await runAutopilot(prompt);
  });

program
  .command('server')
  .description('Start the Loragent MCP Server')
  .action(() => {
    console.log('Starting Loragent MCP Server...');
    import('../../port/mcp/server.js');
  });

import { getPin } from '../../src/lore/auth/pin-manager.js';

program
  .command('get-pin', { hidden: true })
  .description('Internal command to resolve vault PIN')
  .action(async () => {
    const pin = await getPin(false);
    if (pin) {
      process.stdout.write(pin);
    }
  });

import createCmd from './commands/create.js';
import syncCmd from './commands/sync.js';
import listCmd from './commands/list.js';
import sourceCmd from './commands/source.js';
import installCmd from './commands/install.js';
import analyzeCmd from './commands/analyze.js';
import discoverCmd from './commands/discover.js';
import publishCmd from './commands/publish.js';

import mcpCmd from './commands/mcp.js';

// Register all new commands
createCmd(program);
syncCmd(program);
listCmd(program);
sourceCmd(program);
installCmd(program);
analyzeCmd(program);
discoverCmd(program);
publishCmd(program);
mcpCmd(program);

program.parse(process.argv);
