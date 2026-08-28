import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-[#00FF41] font-mono selection:bg-[#00FF41] selection:text-black">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-50"></div>
      
      {/* Navigation */}
      <nav className="border-b border-[#00FF41]/30 p-4 sticky top-0 bg-black/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 uppercase text-xs tracking-widest">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#00FF41] text-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_8px_#00FF41]"></span>
              &gt;_ LORAGENT
            </span>
            <span className="hidden sm:inline text-gray-500">v1.0.0_LLDP</span>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px]">
            <a href="#architecture" className="hover:text-white transition-colors">[ ARCHITECTURE ]</a>
            <a href="#agents" className="hover:text-white transition-colors">[ 167 AGENTS ]</a>
            <a href="#mcp" className="hover:text-white transition-colors">[ CLOUD MCP ]</a>
            <a href="#sdk" className="hover:text-white transition-colors">[ SDK ]</a>
            <Link href="/community" className="hover:text-white transition-colors text-cyan-400">[ WIKI &amp; GUIDES ]</Link>
            <Link href="/admin" className="hover:text-white transition-colors text-purple-400">[ ADMIN PANEL ]</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-16">
        
        {/* Hero Section */}
        <section className="mt-8 md:mt-16 border border-[#00FF41]/30 bg-black/60 p-6 md:p-12 relative overflow-hidden rounded-xl shadow-[0_0_30px_rgba(0,255,65,0.05)]">
          <div className="absolute top-0 right-0 p-3 text-[10px] text-gray-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FF41]"></span>
            EDGE_DEPLOYED: CLOUDFLARE_WORKERS
          </div>
          
          <div className="max-w-4xl space-y-6">
            <div className="inline-block px-2.5 py-1 text-xs border border-[#00FF41]/40 bg-[#00FF41]/10 rounded">
              ⚡ AUTONOMOUS MULTI-AGENT PROTOCOL • 167 CONSTITUENT AGENTS
            </div>
            
            <h1 className="text-3xl md:text-6xl font-black uppercase leading-none tracking-tight text-white">
              Enterprise Orchestration <br/>
              <span className="text-[#00FF41] bg-gradient-to-r from-[#00FF41] via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                &amp; Autonomous Self-Improvement
              </span>
            </h1>
            
            <p className="text-sm md:text-lg text-gray-300 max-w-3xl font-sans leading-relaxed">
              Loragent is the universal virtual office protocol by Lorapok Labs. It synchronizes 167 autonomous AI agents across Antigravity, Cursor, Claude Code, Windsurf, and VS Code with zero-trust credentials and real-time edge execution.
            </p>

            {/* Terminal Preview */}
            <div className="pt-4">
              <div className="bg-[#050805] border border-[#00FF41]/50 p-5 font-mono text-xs md:text-sm rounded-lg w-full max-w-3xl shadow-2xl">
                <div className="flex justify-between items-center mb-3 border-b border-[#00FF41]/20 pb-2">
                  <span className="text-xs text-gray-400">SESSION: CHORKI_AUTOPILOT_LOOP // LLDP</span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    VERIFIED_DONE: 100%
                  </span>
                </div>
                <div className="text-gray-300 space-y-1.5">
                  <div><span className="text-[#00FF41]">root@lorapok:~$</span> loragent autopilot &quot;Deploy full-stack architecture with CI/CD&quot;</div>
                  <div className="text-gray-500">[PULSE] StateWatcher active • [LORE] Boss parsing intent...</div>
                  <div className="text-cyan-400">▶ [AUTO TEAM] Summoning loragent-tech-director, loragent-backend-se, loragent-frontend-se</div>
                  <div className="text-purple-400">🌀 [CHORKI LOOP] Running iterative execution &amp; triggering check-done lifecycle hook...</div>
                  <div className="text-emerald-400">✅ Hook check-done verified (Builds, Tests, MCP Sync: 100% PASS)</div>
                  <div className="text-[#00FF41] animate-pulse">root@lorapok:~$ █</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#sdk" 
                className="px-6 py-3 bg-[#00FF41] text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,65,0.4)]"
              >
                Get Started with SDK
              </a>
              <Link 
                href="/community" 
                className="px-6 py-3 border border-[#00FF41]/50 text-[#00FF41] hover:bg-[#00FF41]/10 font-bold text-xs uppercase tracking-wider rounded transition-all"
              >
                Explore Agent Index (167)
              </Link>
            </div>
          </div>
        </section>

        {/* LLDP 5-Layer System Architecture */}
        <section id="architecture" className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#00FF41]/30 pb-4">
            <h2 className="text-xl md:text-3xl font-black uppercase text-white flex items-center gap-3">
              <span className="text-[#00FF41]">01 //</span> LLDP System Architecture
            </h2>
            <span className="text-xs text-gray-500">LORAPOK LABS DESIGN PATTERN</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { id: "FACE", name: "User Interface / CLI", func: "Commander.js CLI, slash commands, autopilot router", path: "face/cli/" },
              { id: "PULSE", name: "State Daemon", func: "Real-time state watcher, session telemetry & heartbeat", path: "pulse/daemon/" },
              { id: "LORE", name: "Domain & Intelligence", func: "Model orchestration, prompt strictness & asset registry", path: "lore/models/" },
              { id: "PORT", name: "Edge & MCP Adapters", func: "Cloudflare Workers edge MCP + native stdio transports", path: "port/mcp/" },
              { id: "LOOM", name: "Workflows & DI", func: "Container injection, Chorki loop & lifecycle hooks", path: "loom/" }
            ].map((node, i) => (
              <div key={i} className="border border-gray-800 hover:border-[#00FF41] bg-[#070b07] p-5 transition-all group rounded-lg relative">
                <div className="text-xs text-gray-500 mb-3 flex justify-between">
                  <span>LAYER_{i+1}</span>
                  <span className="text-green-900 group-hover:text-[#00FF41] transition-colors font-bold">●</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1 tracking-wider">{node.id}</h3>
                <div className="text-xs text-[#00FF41] font-semibold mb-2">{node.name}</div>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">{node.func}</p>
                <div className="mt-4 pt-3 border-t border-gray-900 text-[10px] text-gray-500">
                  PATH: <code>{node.path}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Formations Matrix */}
        <section id="agents" className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#00FF41]/30 pb-4">
            <h2 className="text-xl md:text-3xl font-black uppercase text-white flex items-center gap-3">
              <span className="text-[#00FF41]">02 //</span> 4 Dynamic Formation Modes
            </h2>
            <span className="text-xs text-gray-500">167 AGENTS • 22 CATEGORIES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-emerald-500/30 bg-emerald-950/10 p-5 rounded-lg space-y-3">
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">🟢 Auto Team Matrix</div>
              <p className="text-xs text-gray-300 font-sans">Full-stack software engineering formation. Designed for rapid, zero-regression feature development.</p>
              <div className="text-[11px] text-gray-400 space-y-1 pt-2 border-t border-emerald-900/40">
                <div>• <code>loragent-tech-director</code> (Architect)</div>
                <div>• <code>loragent-backend-se</code> (APIs &amp; Data)</div>
                <div>• <code>loragent-frontend-se</code> (Sensory UI)</div>
                <div>• <code>loragent-sqa</code> (Automated QA)</div>
                <div>• <code>loragent-cicd-specialist</code> (Deployments)</div>
              </div>
            </div>

            <div className="border border-cyan-500/30 bg-cyan-950/10 p-5 rounded-lg space-y-3">
              <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">🏢 Enterprise Office</div>
              <p className="text-xs text-gray-300 font-sans">Product, business strategy, executive operations, publishing, and customer relations.</p>
              <div className="text-[11px] text-gray-400 space-y-1 pt-2 border-t border-cyan-900/40">
                <div>• <code>loragent-project-coordinator</code></div>
                <div>• <code>loragent-project-manager</code></div>
                <div>• <code>loragent-marketing-strategy-manager</code></div>
                <div>• <code>loragent-publisher</code></div>
                <div>• <code>loragent-pr-specialist</code></div>
              </div>
            </div>

            <div className="border border-purple-500/30 bg-purple-950/10 p-5 rounded-lg space-y-3">
              <div className="text-xs text-purple-400 font-bold uppercase tracking-wider">🔧 Freelance Specialist</div>
              <p className="text-xs text-gray-300 font-sans">140+ Isolated domain specialists dynamically summoned on demand via MCP.</p>
              <div className="text-[11px] text-gray-400 space-y-1 pt-2 border-t border-purple-900/40">
                <div>• <code>loragent-3d-designer</code></div>
                <div>• <code>loragent-logo-designer</code></div>
                <div>• <code>loragent-rust-expert</code></div>
                <div>• <code>loragent-fastapi</code></div>
                <div>• <code>loragent-database-designer</code></div>
              </div>
            </div>

            <div className="border border-red-500/30 bg-red-950/10 p-5 rounded-lg space-y-3">
              <div className="text-xs text-red-400 font-bold uppercase tracking-wider">🔴 Chela Debugging</div>
              <p className="text-xs text-gray-300 font-sans">Mission-critical bug hunting, error telemetry mapping, and root cause analysis.</p>
              <div className="text-[11px] text-gray-400 space-y-1 pt-2 border-t border-red-900/40">
                <div>• <code>loragent-bug-hunter</code> (Lead)</div>
                <div>• <code>loragent-shift-engineer</code></div>
                <div>• <code>loragent-git-specialist</code></div>
                <div>• <code>loragent-debugger</code></div>
                <div>• <code>loragent-inspector</code> (RCA)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Cloudflare Edge MCP Server */}
        <section id="mcp" className="border border-[#00FF41]/30 bg-[#040804] p-6 md:p-10 rounded-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#00FF41]/20 pb-4">
            <div>
              <div className="text-xs text-cyan-400 uppercase tracking-widest font-bold">Cloudflare Workers Edge Network</div>
              <h2 className="text-2xl md:text-3xl font-black text-white">Live Remote MCP Server</h2>
            </div>
            <div className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
              STATUS: OPERATIONAL
            </div>
          </div>

          <p className="text-sm text-gray-300 font-sans max-w-3xl leading-relaxed">
            Connect any AI IDE directly to the remote Loragent MCP server running on Cloudflare Workers edge nodes globally without needing local Node.js binaries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black border border-gray-800 p-4 rounded space-y-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Universal IDE Config (mcp.json / mcp_config.json)</span>
              <pre className="text-xs text-cyan-300 overflow-x-auto p-3 bg-[#020502] rounded border border-gray-900">
{`{
  "mcpServers": {
    "loragent-cloud": {
      "url": "https://mcp.lorapk-labs.workers.dev/mcp",
      "type": "http"
    }
  }
}`}
              </pre>
            </div>

            <div className="bg-black border border-gray-800 p-4 rounded space-y-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Protocol Endpoints</span>
              <div className="text-xs space-y-2 text-gray-300 font-mono">
                <div><span className="text-[#00FF41]">POST /mcp</span> — JSON-RPC 2.0 MCP Protocol</div>
                <div><span className="text-[#00FF41]">GET /sse</span> — Server-Sent Events MCP Stream</div>
                <div><span className="text-[#00FF41]">GET /health</span> — Ecosystem Health &amp; Telemetry</div>
                <div><span className="text-[#00FF41]">GET /agents</span> — 167 Agent Catalog REST API</div>
              </div>
            </div>
          </div>
        </section>

        {/* SDK Quickstart */}
        <section id="sdk" className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#00FF41]/30 pb-4">
            <h2 className="text-xl md:text-3xl font-black uppercase text-white flex items-center gap-3">
              <span className="text-[#00FF41]">03 //</span> Professional JavaScript &amp; TypeScript SDK
            </h2>
            <span className="text-xs text-gray-500">NPM PACKAGE: loragent</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-gray-800 bg-[#070b07] p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-bold text-white">Installation &amp; Client Setup</h3>
              <pre className="text-xs text-gray-300 bg-black p-4 rounded border border-gray-900 overflow-x-auto">
{`# Install Loragent package
npm install loragent

# Import in your TypeScript or Node.js project
import { LoragentClient, LoragentBoss, LoragentChorki } from 'loragent';

// Instantiate Client (connects to Cloudflare MCP or Local)
const client = new LoragentClient();

// Query the 167 agent catalog
const frontendAgents = await client.searchAgents('frontend');
console.log(frontendAgents);`}
              </pre>
            </div>

            <div className="border border-gray-800 bg-[#070b07] p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-bold text-white">Chorki Autopilot &amp; Boss Formations</h3>
              <pre className="text-xs text-gray-300 bg-black p-4 rounded border border-gray-900 overflow-x-auto">
{`// Initialize Boss Orchestrator
const boss = new LoragentBoss();
await boss.initAutoTeam('Build Next.js Dashboard with Tailwind');

// Run Chorki Relentless Autopilot Loop
const chorki = new LoragentChorki();
const result = await chorki.runLoop('Verify workspace and test suite', {
  maxIterations: 5,
  onProgress: (evt) => console.log(\`[\${evt.status}] Iteration \${evt.iteration}\`)
});

console.log(result.success ? '100% DONE' : 'Needs attention');`}
              </pre>
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer Status Bar */}
      <footer className="border-t border-[#00FF41]/30 bg-black p-4 mt-20 text-xs text-gray-500 uppercase tracking-widest">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-[#00FF41]">
            <span className="w-2 h-2 bg-[#00FF41] rounded-full"></span>
            SYSTEM: ONLINE • 167 AGENTS READY
          </div>
          <div>ENCRYPTION: AES-256-GCM (SECURE CRED VAULT)</div>
          <div>LORAPOK LABS © 2026</div>
        </div>
      </footer>
    </div>
  );
}
