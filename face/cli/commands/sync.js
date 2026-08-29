import { Command } from 'commander';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../..');

export default function(program) {
  const syncCmd = new Command('sync')
    .description('Sync canonical Loragent MCPs, skills, rules, and modes into IDE global directories with deduplication and filtering')
    .option('-f, --filter <query>', 'Filter skills by keyword (e.g. react, deploy, security)')
    .option('-c, --category <category>', 'Filter by functional category (engineering|devops|security|creative|data|business|ai)')
    .action((opts) => {
      console.log('🔄 [FACE] Starting Filtered & Deduplicated Loragent IDE Sync...');
      const scriptPath = path.join(ROOT, 'scripts', 'universal-sync.js');
      
      const args = [];
      if (opts.filter) args.push(`--filter "${opts.filter}"`);
      if (opts.category) args.push(`--category "${opts.category}"`);

      try {
        execSync(`node ${scriptPath} ${args.join(' ')}`, { stdio: 'inherit', cwd: ROOT });
      } catch (err) {
        console.error('❌ [FACE] Sync failed:', err.message);
      }
    });

  program.addCommand(syncCmd);
}
