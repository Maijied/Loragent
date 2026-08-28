#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetProjectRoot = process.cwd();
const packageRoot = path.join(__dirname, '..');

const targetAgentsDir = path.join(targetProjectRoot, '.agents', 'skills');
const targetRulesDir = path.join(targetProjectRoot, '.agents');
const targetRulesFile = path.join(targetRulesDir, 'AGENTS.md');

console.log('Installing Loragent Officers into:', targetProjectRoot);

// Ensure target directories exist
if (!fs.existsSync(targetAgentsDir)) {
    fs.mkdirSync(targetAgentsDir, { recursive: true });
}
if (!fs.existsSync(targetRulesDir)) {
    fs.mkdirSync(targetRulesDir, { recursive: true });
}

// Copy Skills (Agents)
const agentsDir = path.join(packageRoot, 'agents');
if (fs.existsSync(agentsDir)) {
    const agents = fs.readdirSync(agentsDir);
    agents.forEach(agent => {
        const agentPath = path.join(agentsDir, agent);
        const targetAgentPath = path.join(targetAgentsDir, agent);
        
        if (fs.statSync(agentPath).isDirectory()) {
            if (!fs.existsSync(targetAgentPath)) {
                fs.mkdirSync(targetAgentPath, { recursive: true });
            }
            // Copy files inside
            const files = fs.readdirSync(agentPath);
            files.forEach(file => {
                const srcFile = path.join(agentPath, file);
                const destFile = path.join(targetAgentPath, file);
                fs.copyFileSync(srcFile, destFile);
            });
            console.log(`Copied agent: ${agent}`);
        }
    });
}

// Copy/Append Rules
const rulesFile = path.join(packageRoot, 'rules', 'AGENTS.md');
if (fs.existsSync(rulesFile)) {
    const ruleContent = fs.readFileSync(rulesFile, 'utf8');
    
    // Check if it already exists to append, or create new
    if (fs.existsSync(targetRulesFile)) {
        const existingContent = fs.readFileSync(targetRulesFile, 'utf8');
        if (!existingContent.includes('Loragent Officers - Universal Virtual Office Rules')) {
            fs.appendFileSync(targetRulesFile, `\n\n${ruleContent}`);
            console.log('Appended Loragent rules to existing AGENTS.md');
        } else {
            console.log('Loragent rules already exist in AGENTS.md');
        }
    } else {
        fs.writeFileSync(targetRulesFile, ruleContent);
        console.log('Created AGENTS.md with Loragent rules');
    }
}

console.log('Installation Complete. Your Virtual Office is ready.');

console.log(`\n=========================================\n        Loragent MCP Server Setup          \n=========================================\nTo enable dynamic steering, hooks, and state management,\nadd the Loragent MCP server to your AI IDE config.\nCommand: node process.cwd()/src/mcp/server.js\n=========================================\n`);