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

program.parse(process.argv);
