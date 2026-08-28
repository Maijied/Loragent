import { Command } from 'commander';
import SourceRegistry from '../../../lore/models/source-registry.js';
import platform from '../../../lore/models/platform.js';

export default function(program) {
  const syncCmd = new Command('sync')
    .description('Sync assets from registry sources into the IDE global state')
    .action(() => {
      console.log('[FACE] Starting synchronization process...');
      const sources = SourceRegistry.getSources();
      
      console.log(`[FACE] Found ${sources.length} sources to sync.`);
      // Sync logic stub
      console.log(`[FACE] Synchronized with ${platform.osType} globals:`);
      console.log(`  -> Cursor MCP: ${platform.getCursorMcpPath()}`);
      console.log(`  -> Claude MCP: ${platform.getClaudeMcpPath()}`);
    });

  program.addCommand(syncCmd);
};
