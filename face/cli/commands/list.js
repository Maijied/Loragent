import { Command } from 'commander';
import SourceRegistry from '../../../lore/models/source-registry.js';

export default function(program) {
  const listCmd = new Command('list')
    .description('List available agents, skills, rules, or mcps')
    .argument('[type]', 'Type of assets to list', 'all')
    .action((type) => {
      console.log(`[FACE] Listing ${type}...`);
      // Stub implementation
      const sources = SourceRegistry.getSources();
      console.log(`Scanning across ${sources.length} sources...`);
      if (type === 'all' || type === 'agents') console.log('Agents: [review-bugbot, plan, ...]');
      if (type === 'all' || type === 'skills') console.log('Skills: [secure-cred-vault, ...]');
      if (type === 'all' || type === 'mcps') console.log('MCPs: [chrome-devtools, ...]');
    });

  program.addCommand(listCmd);
};
