import { Command } from 'commander';
import PCDiscovery from '../../../lore/services/pc-discovery.js';
import SourceRegistry from '../../../lore/models/source-registry.js';

export default function(program) {
  const discoverCmd = new Command('discover')
    .description('Scans local OS paths for existing Loragent assets and registers them')
    .action(() => {
      console.log('[FACE] Running PC discovery...');
      const discovered = PCDiscovery.discover();
      
      console.log(`Found:`);
      console.log(`- ${discovered.skills.length} Skills`);
      console.log(`- ${discovered.agents.length} Agents`);
      console.log(`- ${discovered.mcpServers.length} MCP Servers`);

      // Optionally, user can be prompted to add these to the source registry.
      // For now, let's just log them.
    });

  program.addCommand(discoverCmd);
};
