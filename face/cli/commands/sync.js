import { Command } from 'commander';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../..');

export default function(program) {
  const syncCmd = new Command('sync')
    .description('Sync Loragent MCPs, skills, rules, and modes into all IDE global directories')
    .action(() => {
      console.log('🔄 [FACE] Starting Universal Loragent IDE Sync...');
      const scriptPath = path.join(ROOT, 'scripts', 'universal-sync.js');
      try {
        execSync(`node ${scriptPath}`, { stdio: 'inherit', cwd: ROOT });
      } catch (err) {
        console.error('❌ [FACE] Sync failed:', err.message);
      }
    });

  program.addCommand(syncCmd);
}
