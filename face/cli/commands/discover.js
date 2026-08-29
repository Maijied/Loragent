import { Command } from 'commander';
import PCDiscovery from '../../../lore/services/pc-discovery.js';

export default function(program) {
  const discoverCmd = new Command('discover')
    .description('Scans local OS paths for existing Loragent assets and registers them')
    .option('--json', 'Output results as JSON')
    .option('--no-save', 'Do not save to registry/pc-inventory.json')
    .action((opts) => {
      console.log('🔍 [FACE] Running Universal PC Asset Discovery...');
      const discovered = PCDiscovery.discover({ save: opts.save !== false });

      if (opts.json) {
        console.log(JSON.stringify(discovered, null, 2));
        return;
      }

      console.log('\n╔═══════════════════════════════════════════════════════════════╗');
      console.log('║  Loragent — Universal PC Discovery Complete                  ║');
      console.log('╚═══════════════════════════════════════════════════════════════╝');
      console.log(`📍 Scanned Locations : ${discovered.locationsScanned.length} root directories`);
      console.log(`🧠 Discovered Skills  : ${discovered.skills.length}`);
      console.log(`🤖 Discovered Agents  : ${discovered.agents.length}`);
      console.log(`🔌 Discovered MCPs    : ${discovered.mcpServers.length}`);
      console.log(`📜 Discovered Rules   : ${discovered.rules.length}`);
      console.log(`🎛️  Discovered Modes   : ${discovered.modes.length}`);

      if (discovered.skills.length > 0) {
        console.log('\nTop Discovered Skills:');
        for (const s of discovered.skills.slice(0, 8)) {
          console.log(`  • ${s.name} [${s.layer || 'cross'}] → ${s.path}`);
        }
        if (discovered.skills.length > 8) {
          console.log(`    ... and ${discovered.skills.length - 8} more`);
        }
      }

      if (discovered.mcpServers.length > 0) {
        console.log('\nDiscovered MCP Servers:');
        for (const m of discovered.mcpServers.slice(0, 8)) {
          console.log(`  • ${m.name} (${m.command}) → ${m.sourceConfig}`);
        }
        if (discovered.mcpServers.length > 8) {
          console.log(`    ... and ${discovered.mcpServers.length - 8} more`);
        }
      }

      console.log('\n✅ Inventory saved to: registry/pc-inventory.json\n');
    });

  program.addCommand(discoverCmd);
}
