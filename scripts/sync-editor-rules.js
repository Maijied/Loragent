import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const sourceFile = path.join(rootDir, 'rules', 'AGENTS.md');

const targetFiles = [
  'CLAUDE.md',
  '.cursorrules',
  '.windsurfrules',
  '.clinerules'
];

try {
  if (!fs.existsSync(sourceFile)) {
    console.error(`Source file not found at: ${sourceFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(sourceFile, 'utf8');

  targetFiles.forEach(target => {
    const targetPath = path.join(rootDir, target);
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(`✅ Successfully synced rules to: ${target}`);
  });

  console.log('🎉 Universal AI Code Editor compatibility sync complete.');
} catch (error) {
  console.error('❌ Failed to sync editor rules:', error.message);
  process.exit(1);
}
