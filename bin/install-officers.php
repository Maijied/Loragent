#!/usr/bin/env php
<?php

$targetProjectRoot = getcwd();
$packageRoot = dirname(__DIR__);

$targetAgentsDir = $targetProjectRoot . '/.agents/skills';
$targetRulesDir = $targetProjectRoot . '/.agents';
$targetRulesFile = $targetRulesDir . '/AGENTS.md';

echo "Installing Loragent Officers into: {$targetProjectRoot}\n";

// Ensure target directories exist
if (!is_dir($targetAgentsDir)) {
    mkdir($targetAgentsDir, 0777, true);
}
if (!is_dir($targetRulesDir)) {
    mkdir($targetRulesDir, 0777, true);
}

// Copy Skills (Agents)
$agentsDir = $packageRoot . '/agents';
if (is_dir($agentsDir)) {
    $agents = array_diff(scandir($agentsDir), array('..', '.'));
    foreach ($agents as $agent) {
        $agentPath = $agentsDir . '/' . $agent;
        $targetAgentPath = $targetAgentsDir . '/' . $agent;
        
        if (is_dir($agentPath)) {
            if (!is_dir($targetAgentPath)) {
                mkdir($targetAgentPath, 0777, true);
            }
            $files = array_diff(scandir($agentPath), array('..', '.'));
            foreach ($files as $file) {
                $srcFile = $agentPath . '/' . $file;
                $destFile = $targetAgentPath . '/' . $file;
                if (is_file($srcFile)) {
                    copy($srcFile, $destFile);
                }
            }
            echo "Copied agent: {$agent}\n";
        }
    }
}

// Copy/Append Rules
$rulesFile = $packageRoot . '/rules/AGENTS.md';
if (file_exists($rulesFile)) {
    $ruleContent = file_get_contents($rulesFile);
    
    if (file_exists($targetRulesFile)) {
        $existingContent = file_get_contents($targetRulesFile);
        if (strpos($existingContent, 'Loragent Officers - Universal Virtual Office Rules') === false) {
            file_put_contents($targetRulesFile, "\n\n" . $ruleContent, FILE_APPEND);
            echo "Appended Loragent rules to existing AGENTS.md\n";
        } else {
            echo "Loragent rules already exist in AGENTS.md\n";
        }
    } else {
        file_put_contents($targetRulesFile, $ruleContent);
        echo "Created AGENTS.md with Loragent rules\n";
    }
}

echo "Installation Complete. Your Virtual Office is ready.\n";

echo "\n=========================================\n        Loragent MCP Server Setup          \n=========================================\nTo enable dynamic steering, hooks, and state management,\nadd the Loragent MCP server to your AI IDE config.\nCommand: node {$packageRoot}/src/mcp/server.js\n=========================================\n";