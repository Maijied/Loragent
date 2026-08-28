import { Command } from 'commander';
import SourceRegistry from '../../../lore/models/source-registry.js';

export default function(program) {
  const sourceCmd = new Command('source')
    .description('Manage asset sources (local or remote)');

  sourceCmd.command('add')
    .description('Add a new source')
    .argument('<id>', 'Unique identifier for the source')
    .argument('<path>', 'File path or URL for the source')
    .action((id, path) => {
      SourceRegistry.addSource({ id, type: 'local', path, enabled: true });
      console.log(`[FACE] Added source: ${id}`);
    });

  sourceCmd.command('remove')
    .description('Remove a source')
    .argument('<id>', 'Unique identifier for the source')
    .action((id) => {
      SourceRegistry.removeSource(id);
      console.log(`[FACE] Removed source: ${id}`);
    });

  sourceCmd.command('list')
    .description('List all sources')
    .action(() => {
      const sources = SourceRegistry.getSources();
      console.table(sources);
    });

  program.addCommand(sourceCmd);
};
