import React from 'react';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-cyan-500/30">
      {/* Abstract Glowing Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[120px]" />
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-600/20 blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-500 p-[1px]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-lg flex items-center justify-center font-bold text-cyan-400">L</div>
            </div>
            <Link href="/" className="font-bold text-lg tracking-tight hover:text-cyan-400 transition-colors">
              Loragent Wiki &amp; Docs
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <a href="#quickstart" className="hover:text-white transition-colors">Quickstart</a>
            <a href="#formations" className="hover:text-white transition-colors">Formations</a>
            <a href="#commands" className="hover:text-white transition-colors">Commands</a>
            <a href="#sdk" className="hover:text-white transition-colors">SDK Guide</a>
            <Link href="/admin" className="hover:text-white transition-colors text-purple-400">Admin</Link>
          </div>
          <Link 
            href="/"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white text-black rounded-full hover:bg-cyan-400 transition-all"
          >
            Launch Terminal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Official LLDP Multi-Agent Knowledge Base
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Loragent System Wiki &amp; Handbook
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The definitive guide to orchestrating 167 AI agents, configuring edge MCP nodes, running the Chorki autopilot loop, and building with the Loragent TypeScript SDK.
          </p>
        </div>

        {/* Quickstart Guide */}
        <section id="quickstart" className="border border-white/10 bg-white/[0.02] p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 rounded">SECTION 1</span>
            <h2 className="text-2xl font-bold">Quickstart &amp; IDE Setup</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/50 p-5 rounded-xl border border-white/5 space-y-3">
              <div className="text-cyan-400 font-bold text-sm">1. Global Installation</div>
              <p className="text-xs text-gray-400">Install via npm to get global access to the CLI and all 167 agent skills.</p>
              <pre className="text-xs font-mono bg-black p-3 rounded text-green-400 border border-white/5">
npm install -g loragent
              </pre>
            </div>

            <div className="bg-black/50 p-5 rounded-xl border border-white/5 space-y-3">
              <div className="text-purple-400 font-bold text-sm">2. Universal Sync</div>
              <p className="text-xs text-gray-400">Sync all agents and custom modes to Cursor, Claude Code, Antigravity, and Windsurf.</p>
              <pre className="text-xs font-mono bg-black p-3 rounded text-green-400 border border-white/5">
loragent sync
              </pre>
            </div>

            <div className="bg-black/50 p-5 rounded-xl border border-white/5 space-y-3">
              <div className="text-emerald-400 font-bold text-sm">3. Run Autopilot</div>
              <p className="text-xs text-gray-400">Launch autonomous execution with continuous lifecycle hook verification.</p>
              <pre className="text-xs font-mono bg-black p-3 rounded text-green-400 border border-white/5">
loragent autopilot &quot;Build feature&quot;
              </pre>
            </div>
          </div>
        </section>

        {/* Formations & Boss Engine */}
        <section id="formations" className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-purple-500/20 text-purple-400 rounded">SECTION 2</span>
            <h2 className="text-2xl font-bold">The 4 Dynamic Formations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent space-y-3">
              <h3 className="text-lg font-bold text-emerald-400">Auto Team Matrix</h3>
              <p className="text-sm text-gray-300">
                The standard software development lifecycle engine. Automatically assigns roles to <code>loragent-tech-director</code>, <code>loragent-backend-se</code>, <code>loragent-frontend-se</code>, and <code>loragent-sqa</code>.
              </p>
              <div className="text-xs font-mono text-gray-400 pt-2 border-t border-white/5">
                Trigger: <code>/loragent-boss auto</code> or <code>boss.initAutoTeam()</code>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent space-y-3">
              <h3 className="text-lg font-bold text-cyan-400">Enterprise Office Matrix</h3>
              <p className="text-sm text-gray-300">
                Full-scale business operations engine. Delegates to project coordinators, marketing strategy managers, publishers, and PR specialists.
              </p>
              <div className="text-xs font-mono text-gray-400 pt-2 border-t border-white/5">
                Trigger: <code>/loragent-boss office</code> or <code>boss.initOffice()</code>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent space-y-3">
              <h3 className="text-lg font-bold text-purple-400">Freelance Specialist Isolation</h3>
              <p className="text-sm text-gray-300">
                On-demand lazy loading for 140+ highly specific tasks (3D design, database indexing, logo design, Rust development, WebRTC).
              </p>
              <div className="text-xs font-mono text-gray-400 pt-2 border-t border-white/5">
                Trigger: <code>loragent summon &lt;agent-name&gt;</code> or <code>client.summonAgent()</code>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/10 to-transparent space-y-3">
              <h3 className="text-lg font-bold text-red-400">Chela Debugging Protocol</h3>
              <p className="text-sm text-gray-300">
                Mission-critical bug hunting and root cause analysis. Deploys <code>loragent-bug-hunter</code>, <code>loragent-shift-engineer</code>, and <code>loragent-git-specialist</code>.
              </p>
              <div className="text-xs font-mono text-gray-400 pt-2 border-t border-white/5">
                Trigger: <code>/loragent-boss chela</code> or <code>boss.initChela()</code>
              </div>
            </div>
          </div>
        </section>

        {/* Slash Commands & Subagents Directory */}
        <section id="commands" className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 rounded">SECTION 3</span>
            <h2 className="text-2xl font-bold">Universal Slash Commands (/) &amp; Subagents (@)</h2>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/40">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 text-gray-400 font-mono">
                <tr>
                  <th className="p-4">Command / Mention</th>
                  <th className="p-4">Formation / Domain</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Supported IDEs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-gray-300">
                <tr>
                  <td className="p-4 text-cyan-400 font-bold">/loragent autopilot &lt;task&gt;</td>
                  <td className="p-4 text-emerald-400">Chorki Autopilot</td>
                  <td className="p-4">Continuous iterative execution loop until verification hook passes.</td>
                  <td className="p-4 text-gray-400">All (Antigravity, Cursor, Claude, Windsurf)</td>
                </tr>
                <tr>
                  <td className="p-4 text-cyan-400 font-bold">/loragent-boss auto</td>
                  <td className="p-4 text-emerald-400">Auto Team</td>
                  <td className="p-4">Forces Auto Team matrix (Architect, Backend, Frontend, SQA).</td>
                  <td className="p-4 text-gray-400">All</td>
                </tr>
                <tr>
                  <td className="p-4 text-cyan-400 font-bold">/loragent-boss chela</td>
                  <td className="p-4 text-red-400">Chela Debugging</td>
                  <td className="p-4">Forces Chela protocol for root cause analysis and instant bug hunting.</td>
                  <td className="p-4 text-gray-400">All</td>
                </tr>
                <tr>
                  <td className="p-4 text-cyan-400 font-bold">/loragent-teacher clarify</td>
                  <td className="p-4 text-purple-400">Teacher</td>
                  <td className="p-4">Strict requirements gathering and intent normalization.</td>
                  <td className="p-4 text-gray-400">All</td>
                </tr>
                <tr>
                  <td className="p-4 text-cyan-400 font-bold">@loragent-chorki</td>
                  <td className="p-4 text-emerald-400">Chorki Engine</td>
                  <td className="p-4">Autonomous execution subagent for multi-step tasks.</td>
                  <td className="p-4 text-gray-400">Cursor, Claude, Antigravity, Roo</td>
                </tr>
                <tr>
                  <td className="p-4 text-cyan-400 font-bold">@loragent-cicd-specialist</td>
                  <td className="p-4 text-cyan-400">CI/CD Pipeline</td>
                  <td className="p-4">Release engineer across GitHub Actions, Cloudflare, NPM, AMO.</td>
                  <td className="p-4 text-gray-400">Cursor, Claude, Antigravity, Roo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SDK Documentation */}
        <section id="sdk" className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 rounded">SECTION 4</span>
            <h2 className="text-2xl font-bold">TypeScript SDK Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
              <h3 className="font-bold text-cyan-400">LoragentClient</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Connects to the Cloudflare Edge MCP server (<code>https://mcp.lorapk-labs.workers.dev/mcp</code>) or local stdio server to search, summon, dismiss, steer, and trigger hooks.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
              <h3 className="font-bold text-purple-400">LoragentBoss</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Higher-level orchestration wrapper providing convenience methods for <code>initAutoTeam</code>, <code>initOffice</code>, <code>initChela</code>, and <code>delegate</code>.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
              <h3 className="font-bold text-emerald-400">LoragentChorki</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Continuous autonomous loop runner that executes steps, evaluates progress, and tests completion against verification hooks.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-500">
        <p>Loragent Documentation &amp; Ecosystem Handbook • Lorapok Labs © 2026</p>
      </footer>
    </div>
  );
}
