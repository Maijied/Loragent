import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

export default function(program) {
  const createCmd = new Command('create')
    .description('Create a new agent, skill, rule, or mcp')
    .argument('<type>', 'Type of asset to create (agent|skill|rule|mcp)')
    .argument('<name>', 'Name of the asset')
    .action((type, name) => {
      console.log(`[FACE] Creating ${type} named ${name}...`);
      
      const templatesDir = path.join(__dirname, '../templates');
      const targetDir = path.join(process.cwd(), '.agents', type === 'mcp' ? 'mcp' : `${type}s`);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      let templateFile;
      let targetFile;

      switch(type) {
        case 'agent':
          templateFile = 'agent.md.hbs';
          targetFile = path.join(targetDir, `${name}.md`);
          break;
        case 'skill':
          templateFile = 'skill.md.hbs';
          targetFile = path.join(targetDir, `${name}.md`);
          break;
        case 'rule':
          templateFile = 'rule.mdc.hbs';
          targetFile = path.join(targetDir, `${name}.mdc`);
          break;
        case 'mcp':
          templateFile = 'mcp-entry.json.hbs';
          targetFile = path.join(targetDir, `${name}.json`);
          break;
        default:
          console.error(`Unknown type: ${type}`);
          return;
      }

      let content = fs.readFileSync(path.join(templatesDir, templateFile), 'utf8');
      content = content.replace(/\{\{name\}\}/g, name)
                       .replace(/\{\{description\}\}/g, 'Auto-generated description')
                       .replace(/\{\{version\}\}/g, '1.0.0')
                       .replace(/\{\{model\}\}/g, 'default');
      
      fs.writeFileSync(targetFile, content);
      console.log(`Created: ${targetFile}`);
    });

  program.addCommand(createCmd);
};
