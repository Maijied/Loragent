'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Terminal, Sparkles, Server, Layers, Cpu, Shield, Globe, 
  Search, ArrowLeft, Copy, Check, ExternalLink, Code2, Cloud
} from 'lucide-react';

const COMMANDS = [
  { cmd: 'loragent autopilot "<task>"', formation: 'Chorki Engine', desc: 'Runs continuous autonomous execution loop until the check-done verification lifecycle hook passes 100%.', ides: 'Antigravity, Cursor, Claude Code, Windsurf, VS Code' },
  { cmd: '/loragent-boss auto', formation: 'Auto Team Matrix', desc: 'Initializes the standard engineering matrix (Tech Director, Backend SE, Frontend SE, SQA, CI/CD Specialist).', ides: 'All AI IDEs' },
  { cmd: '/loragent-boss office', formation: 'Enterprise Office', desc: 'Initializes product, marketing, documentation, publishing, and customer relations matrix.', ides: 'All AI IDEs' },
  { cmd: '/loragent-boss chela', formation: 'Chela Debugging', desc: 'Forces mission-critical root cause analysis and instant regression resolution.', ides: 'All AI IDEs' },
  { cmd: '/loragent-teacher clarify', formation: 'Teacher Protocol', desc: 'Mandates strict requirements gathering and intent normalization before architecture synthesis.', ides: 'All AI IDEs' },
  { cmd: 'loragent summon <agent-name>', formation: 'Freelance Specialist', desc: 'Lazy-loads one of 140+ domain specialists (e.g., loragent-wrangler-specialist, loragent-3d-designer).', ides: 'MCP-supported IDEs' },
  { cmd: 'loragent sync', formation: 'Universal Sync', desc: 'Synchronizes all 174 agents, subagents, and IDE rules across Cursor, Claude, Antigravity, and Windsurf.', ides: 'CLI Terminal' },
  { cmd: 'loragent exec "<cli_cmd>"', formation: 'Multi-Cloud Runner', desc: 'Executes commands with zero-trust credentials automatically injected from machine-encrypted .env vault.', ides: 'CLI & SDK' }
];

export default function CommunityPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCommands = COMMANDS.filter(c => 
    c.cmd.toLowerCase().includes(search.toLowerCase()) || 
    c.desc.toLowerCase().includes(search.toLowerCase()) ||
    c.formation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030704] text-gray-100 font-sans selection:bg-[#00FF41]/30 selection:text-[#00FF41]">
      {/* Background Cyber Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[160px]" />
        <div className="fixed inset-0 opacity-[0.03] bg-[radial-gradient(#00FF41_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/10 sticky top-0 bg-[#030704]/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <span className="font-mono font-bold text-white text-base">Loragent System Wiki &amp; Docs</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#00FF41] px-2.5 py-1 rounded bg-[#00FF41]/10 border border-[#00FF41]/30">174 AGENTS REGISTERED</span>
            <Link href="/admin" className="text-purple-400 hover:text-purple-300 transition-colors">Admin Panel</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>OFFICIAL ECOSYSTEM REFERENCE HANDBOOK</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Loragent System Wiki &amp; Directives
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-sans leading-relaxed">
            Complete technical documentation for the 174-agent ecosystem, LLDP architecture, slash commands, zero-trust credential vault, and multi-cloud tool runners.
          </p>
        </div>

        {/* Quick Reference Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#00FF41]/20 text-[#00FF41] flex items-center justify-center font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Global CLI Setup</h3>
            <p className="text-xs text-gray-300 font-sans">Install globally via npm to enable universal slash commands and CLI tools:</p>
            <pre className="p-3 rounded-lg bg-black text-xs font-mono text-[#00FF41] border border-white/5">
              npm install -g loragent
            </pre>
          </div>

          <div className="glass-panel-cyan p-6 rounded-2xl border border-cyan-500/30 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Multi-Cloud Tools</h3>
            <p className="text-xs text-gray-300 font-sans">Execute commands across Cloudflare, GitHub, Firebase, Azure, GCP, and AWS with auto-vault credentials:</p>
            <pre className="p-3 rounded-lg bg-black text-xs font-mono text-cyan-400 border border-white/5">
              loragent exec &quot;wrangler deploy&quot;
            </pre>
          </div>

          <div className="glass-panel-purple p-6 rounded-2xl border border-purple-500/30 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Universal IDE Sync</h3>
            <p className="text-xs text-gray-300 font-sans">Sync all 174 agents, subagents, and IDE rules across Cursor, Claude, Antigravity, and Windsurf:</p>
            <pre className="p-3 rounded-lg bg-black text-xs font-mono text-purple-400 border border-white/5">
              loragent sync
            </pre>
          </div>
        </section>

        {/* Slash Commands & Subagents Directory */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Universal Slash Commands (/) &amp; Mentions (@)</h2>
              <p className="text-xs text-gray-400">Available across all LLDP-supported AI IDEs</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/60 border border-white/10 focus:border-[#00FF41] rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 glass-panel">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                <tr>
                  <th className="p-4">Command / Directive</th>
                  <th className="p-4">Formation / Subsystem</th>
                  <th className="p-4">Operational Behavior</th>
                  <th className="p-4">Supported IDEs</th>
                  <th className="p-4 text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {filteredCommands.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-[#00FF41] font-bold">{item.cmd}</td>
                    <td className="p-4 text-cyan-400">{item.formation}</td>
                    <td className="p-4 font-sans text-xs text-gray-300 max-w-md">{item.desc}</td>
                    <td className="p-4 text-gray-400">{item.ides}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => copy(item.cmd, `cmd-${i}`)}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                      >
                        {copiedId === `cmd-${i}` ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security & Enclave Protocol */}
        <section className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Zero-Trust Credential Vault &amp; Encrypted .env Protocol</h2>
              <p className="text-xs text-gray-400">Lorapok Labs Security Directive</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs text-gray-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
              <div className="font-bold text-white font-mono">1. AES-256 Machine Encryption</div>
              <p>The vault PIN is encrypted into <code>.env</code> using AES-256-CBC with a dynamic machine-derived SHA-256 key (hostname + username + UID). No plaintext keys are ever saved.</p>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
              <div className="font-bold text-white font-mono">2. Dynamic Credential Injection</div>
              <p>When running tools like <code>wrangler</code>, <code>gh</code>, <code>firebase</code>, <code>az</code>, or <code>gcloud</code>, credentials are dynamically resolved from the vault into process memory.</p>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
              <div className="font-bold text-white font-mono">3. Workspace Guardrails</div>
              <p>Destructive commands (e.g., <code>rm -rf /</code>, <code>wrangler delete</code>, <code>gh repo delete</code>) are strictly intercepted and blocked by <code>loragent-workspace-guard</code>.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs font-mono text-gray-500">
        <p>Loragent System Wiki &amp; Ecosystem Documentation • Lorapok Labs © 2026</p>
      </footer>
    </div>
  );
}
