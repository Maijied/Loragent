const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/const (.*?) = require\(['"](.*?)['"]\);/g, 'import $1 from \'$2.js\';');
  
  // Fix built-ins (no .js)
  content = content.replace(/from '(fs|path|os|child_process|commander)\.js'/g, 'from \'$1\'');
  
  content = content.replace(/module\.exports = (.*?);/g, 'export default $1;');
  // The command files export a function taking program
  content = content.replace(/module\.exports = function\(program\) \{/g, 'export default function(program) {');

  // Fix __dirname since it's ESM
  if (content.includes('__dirname')) {
    content = `import { fileURLToPath } from 'url';\nimport { dirname } from 'path';\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);\n` + content;
    // ensure path is imported if we just added dirname
    if (!content.includes(`import path from 'path'`)) {
      content = content.replace(/import \{ dirname \} from 'path';/, `import path from 'path';\nimport { dirname } from 'path';`);
    }
  }

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
