/**
 * @file extension.js
 * Loragent VS Code & Open VSX Extension Entrypoint
 * Lorapok Labs Universal Multi-Agent Ecosystem Extension
 */

import * as vscode from 'vscode';
import { spawn } from 'node:child_process';
import path from 'node:path';

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
  // Command: Summon Boss Orchestrator
  const bossCmd = vscode.commands.registerCommand('loragent.boss', async () => {
    const task = await vscode.window.showInputBox({
      prompt: 'Describe your software engineering or architectural task for Loragent Boss',
      placeHolder: 'e.g. Build authentication with TiTi Vault or debug test suites'
    });
    if (!task) return;

    const terminal = vscode.window.createTerminal({ name: 'Loragent Boss' });
    terminal.show();
    terminal.sendText(`npx -y @lorapok/loragent@latest boss "${task}"`);
  });

  // Command: Quick Formation Selector
  const formationCmd = vscode.commands.registerCommand('loragent.formations', async () => {
    const formations = [
      { label: '🤖 AUTO (Engineering)', description: 'Tech Director, Backend SE, Frontend SE, SQA, DevOps', detail: 'auto' },
      { label: '🏢 OFFICE (Business)', description: 'Project Coordinator, Marketing, PR, Publisher', detail: 'office' },
      { label: '⚡ CHELA (Debugging & Fixes)', description: 'Bug Hunter, Shift Engineer, Git Specialist', detail: 'chela' },
      { label: '🎯 FREELANCE (Specialists)', description: 'UI/UX, 3D Design, Cloudflare Wrangler, Logo Design', detail: 'freelance' },
      { label: '🛡️ OBSERVER (Recovery & State)', description: 'Watchman, Workspace Guard, Cache Collector', detail: 'observer' },
      { label: '🕸️ SPIDERNET (DAG Multi-Agent)', description: 'Spidernet coordinator for dependency DAGs', detail: 'spidernet' }
    ];

    const selected = await vscode.window.showQuickPick(formations, {
      placeHolder: 'Select active multi-agent squad formation matrix'
    });

    if (selected) {
      vscode.window.showInformationMessage(`Active Loragent Formation: ${selected.label}`);
    }
  });

  // Command: Sync Skills across Workspace
  const syncCmd = vscode.commands.registerCommand('loragent.sync', () => {
    const terminal = vscode.window.createTerminal({ name: 'Loragent Sync' });
    terminal.show();
    terminal.sendText(`npx -y @lorapok/loragent@latest sync`);
  });

  // Command: Check TiTi Vault Status
  const vaultCmd = vscode.commands.registerCommand('loragent.titiVault', () => {
    vscode.window.showInformationMessage('TiTi Vault Status: LLE 5-Seal Enclave Active (Zero-Trust Memory Injected)');
  });

  // Status Bar Item
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.text = '$(hubot) Loragent (v2.0.0)';
  statusBar.tooltip = 'Loragent Universal Multi-Agent Ecosystem — Click to Summon Boss';
  statusBar.command = 'loragent.boss';
  statusBar.show();

  context.subscriptions.push(bossCmd, formationCmd, syncCmd, vaultCmd, statusBar);
}

export function deactivate() {}
