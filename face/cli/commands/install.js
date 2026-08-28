import { Command } from 'commander';

export default function(program) {
  const installCmd = new Command('install')
    .description('Install a specific agent, skill, or mcp from a remote source')
    .argument('<identifier>', 'Identifier of the asset to install')
    .action((identifier) => {
      console.log(`[FACE] Installing ${identifier}...`);
      // Installation logic stub
      console.log(`[FACE] Successfully installed ${identifier}. Run loragent sync to apply.`);
    });

  program.addCommand(installCmd);
};
