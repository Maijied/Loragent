const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/const (.*?) = require\(['"](.*?)['"]\);/g, 'import $1 from \'$2.js\';');
  
  // Fix built-ins (no .js)
  content = content.replace(/from '(fs|path|os|child_process|commander)\.js'/g, 'from \'$1\'');
  
  // Some destructuring imports might be grouped like `const { Command } = require(...)`
  // The regex above will turn it into `import { Command } from ...` which is valid.

  content = content.replace(/module\.exports = (.*?);/g, 'export default $1;');
  content = content.replace(/module\.exports = function\(program\) \{/g, 'export default function(program) {');

  // Fix __dirname since it's ESM
  if (content.includes('__dirname')) {
    content = `import { fileURLToPath } from 'url';\nimport { dirname } from 'path';\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);\n` + content;
  }

  // Edge case fix for importing models correctly
  content = content.replace(/from '\.\.\/\.\.\/lore\/models\/(.*?)\.js'/g, "from '../../lore/models/$1.js'");
  content = content.replace(/from '\.\.\/models\/(.*?)\.js'/g, "from '../models/$1.js'");
  
  fs.writeFileSync(filePath, content);
}

const files = [
  'lore/models/platform.js',
  'lore/models/skill.js',
  'lore/models/rule.js',
  'lore/models/source-registry.js',
  'lore/models/mcp-registry.js',
  'lore/models/agent.js',
  'lore/services/url-ingestion.js',
  'lore/services/project-analyzer.js',
  'lore/services/pc-discovery.js',
  'lore/services/cred-vault.js',
  'face/cli/commands/create.js',
  'face/cli/commands/sync.js',
  'face/cli/commands/analyze.js',
  'face/cli/commands/discover.js',
  'face/cli/commands/list.js',
  'face/cli/commands/source.js',
  'face/cli/commands/install.js'
];

files.forEach(replaceInFile);
console.log("Fixed CJS to ESM");
