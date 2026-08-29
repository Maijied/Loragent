import { Command } from 'commander';
import PCDiscovery from '../../../lore/services/pc-discovery.js';

export default function(program) {
  const discoverCmd = new Command('discover')
    .description('Scans local OS paths, filters redundant duplicate skills, scores quality, and builds clean asset inventory')
    .option('-f, --filter <query>', 'Filter skills by keyword (name, description, tags, tools)')
    .option('-c, --category <category>', 'Filter by functional category (engineering|devops|security|creative|data|business|ai)')
    .option('-q, --min-quality <score>', 'Filter by minimum quality score (0-100)')
    .option('--all', 'Show all raw discovered skills including redundant duplicates')
    .option('--enrich', 'Auto-enrich canonical skills with discovered capabilities from duplicates')
    .option('--json', 'Output results as JSON')
    .option('--no-save', 'Do not save to registry/pc-inventory.json')
    .action((opts) => {
      console.log('🔍 [FACE] Running Intelligent PC Asset Discovery & Deduplication...');
      
      const discovered = PCDiscovery.discover({
        save: opts.save !== false,
        filter: opts.filter,
        category: opts.category,
        minQuality: opts.minQuality,
        unique: !opts.all,
        enrich: opts.enrich,
      });

      if (opts.json) {
        console.log(JSON.stringify(discovered, null, 2));
        return;
      }

      console.log('\n╔═══════════════════════════════════════════════════════════════╗');
      console.log('║  Loragent — Smart Asset Discovery & Deduplication Complete   ║');
      console.log('╚═══════════════════════════════════════════════════════════════╝');
      console.log(`📍 Scanned Locations       : ${discovered.locationsScanned.length} root directories`);
      console.log(`📦 Total Raw Files Scanned  : ${discovered.summary.totalRawSkillsScanned}`);
      console.log(`✨ Unique Canonical Skills  : ${discovered.summary.totalUniqueSkills} distinct capabilities`);
      console.log(`🗑️  Redundant Clones Filtered: ${discovered.summary.totalDuplicatesFiltered} duplicates collapsed`);
      console.log(`🔌 Discovered MCP Servers   : ${discovered.summary.totalMcpServers}`);
      console.log(`📜 Discovered Rules         : ${discovered.summary.totalRules}`);
      console.log(`🎛️  Discovered Custom Modes  : ${discovered.summary.totalModes}`);

      if (opts.filter || opts.category || opts.minQuality) {
        console.log(`\n🎯 Active Filters: ${[
          opts.filter ? `Keyword: "${opts.filter}"` : '',
          opts.category ? `Category: "${opts.category}"` : '',
          opts.minQuality ? `Min Quality: ${opts.minQuality}` : '',
        ].filter(Boolean).join(' | ')}`);
      }

      if (discovered.skills.length > 0) {
        console.log('\nTop Canonical Skills (Sorted by Quality Score):');
        for (const s of discovered.skills.slice(0, 10)) {
          const clones = s.duplicateCount > 0 ? ` (+${s.duplicateCount} clones filtered)` : '';
          console.log(`  • \x1b[35m${s.slug}\x1b[0m [Q:${s.qualityScore || 80}/100] [${s.category || 'engineering'}]${clones}`);
          if (s.description) {
            console.log(`    └─ ${s.description.slice(0, 85)}...`);
          }
        }
        if (discovered.skills.length > 10) {
          console.log(`    ... and ${discovered.skills.length - 10} more unique skills`);
        }
      }

      if (discovered.mcpServers.length > 0) {
        console.log('\nDiscovered MCP Servers:');
        for (const m of discovered.mcpServers.slice(0, 6)) {
          console.log(`  • ${m.name} (${m.command})`);
        }
        if (discovered.mcpServers.length > 6) {
          console.log(`    ... and ${discovered.mcpServers.length - 6} more`);
        }
      }

      console.log('\n✅ Clean deduplicated inventory saved to: registry/pc-inventory.json\n');
    });

  program.addCommand(discoverCmd);
}
