const fs = require('fs');
const path = require('path');

const os = require('os');
const LORAPOK_PLAYER_PATH = process.env.LORAPOK_PLAYER_PATH || path.join(os.homedir(), 'Personal_Projects', 'lorapok_player', '.agents', 'skills');

const DIRECTORIES_TO_SCAN = [
    path.join(process.cwd(), 'agents'),
    LORAPOK_PLAYER_PATH,
    path.join(process.cwd(), '..', 'loragent-officers', 'agents')
];

const TEMPLATE_PATH = path.join(__dirname, '../AGENT_TEMPLATE.md');

async function processSkillFile(filePath, templateContent) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Check if already enriched to avoid double wrapping
        if (fileContent.includes('Lorapok Mega-Agency:') && fileContent.includes('Core Ecosystem Philosophies')) {
            console.log(`Skipping already enriched file: ${filePath}`);
            return;
        }

        // Extremely basic markdown frontmatter parser
        const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        let name = 'loragent-unknown';
        let description = 'A specialized Loragent subagent.';
        let originalContent = fileContent;

        if (match) {
            const frontmatter = match[1];
            originalContent = match[2].trim();

            const nameMatch = frontmatter.match(/name:\s*"?([^"\n]+)"?/);
            if (nameMatch) name = nameMatch[1];

            const descMatch = frontmatter.match(/description:\s*"?([^"\n]+)"?/);
            if (descMatch) description = descMatch[1];
        }

        // Clean up title from original content if it exists to avoid double titles
        originalContent = originalContent.replace(/^#\s+[^\n]+\n+/, '');

        // Format Title from name
        const title = name.replace(/^loragent-/, '').replace(/-/g, ' ').toUpperCase();

        const newContent = templateContent
            .replace('{{AGENT_NAME}}', name)
            .replace('{{AGENT_DESCRIPTION}}', description)
            .replace('{{AGENT_TITLE}}', title)
            .replace('{{ORIGINAL_CONTENT}}', originalContent);

        fs.writeFileSync(filePath, newContent);
        console.log(`Enriched: ${filePath}`);

    } catch (e) {
        console.error(`Error processing ${filePath}:`, e);
    }
}

function traverseDirectory(dir, templateContent) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            traverseDirectory(fullPath, templateContent);
        } else if (file === 'SKILL.md') {
            processSkillFile(fullPath, templateContent);
        }
    }
}

function main() {
    console.log('Starting mass enrichment...');
    const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    
    for (const dir of DIRECTORIES_TO_SCAN) {
        console.log(`Scanning directory: ${dir}`);
        traverseDirectory(dir, templateContent);
    }
    
    console.log('Enrichment complete.');
}

main();
