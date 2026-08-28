import React from 'react';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-cyan-500/30">
      {/* Abstract Glowing Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[120px]" />
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-600/20 blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-500 p-[1px]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-lg flex items-center justify-center font-bold">L</div>
            </div>
            <span className="font-bold text-lg tracking-tight">Lorapok Labs</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Architecture</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          </div>
          <button className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
            Install Loragent
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Loragent v1.0 is now available
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Enterprise Orchestration & Autonomous Self-Improvement
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The immutable core directive protocol. Loragent synchronizes 165+ agents across Cursor, VSCode, and Claude Desktop with absolute security and zero-trust credentials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              Initialize Loragent
            </button>
            <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all">
              Read the Wiki
            </button>
          </div>
        </div>

        {/* Terminal Window Mockup */}
        <div className="mt-20 relative max-w-4xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20"></div>
          <div className="relative rounded-2xl bg-[#0F0F0F] border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#141414]">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-2 text-xs text-gray-500 font-mono">loragent-boss — bash</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-4">
              <div className="text-gray-400">
                <span className="text-cyan-400">~/project</span> $ loragent autopilot "build my backend"
              </div>
              <div className="text-purple-400">
                [LOM] Initiating Auto Team Matrix...
              </div>
              <div className="text-gray-300">
                <span className="text-green-400">✔</span> Summoning loragent-tech-director<br/>
                <span className="text-green-400">✔</span> Summoning loragent-backend-se<br/>
                <span className="text-blue-400">ℹ</span> Fetching vault PIN via secure-cred-vault...
              </div>
              <div className="text-gray-400 animate-pulse">_</div>
            </div>
          </div>
        </div>
      </main>

      {/* Architecture Section */}
      <section className="relative py-24 px-6 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The LLDP Architecture</h2>
            <p className="text-gray-400">Five pillars powering the autonomous Loragent ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "FACE", desc: "CLI routing and interaction layer for developer presence.", color: "from-blue-500/20 to-transparent" },
              { title: "PULSE", desc: "Always-on daemon managing global state and telemetry sync.", color: "from-purple-500/20 to-transparent" },
              { title: "LORE", desc: "Model intelligence, local LLMs, and prompt strictness.", color: "from-cyan-500/20 to-transparent" },
              { title: "PORT", desc: "MCP tools and cross-platform IDE adapters.", color: "from-green-500/20 to-transparent" },
              { title: "LOOM", desc: "Agent orchestration and graph state execution.", color: "from-orange-500/20 to-transparent" }
            ].map((layer, i) => (
              <div key={i} className={`p-6 rounded-2xl border border-white/10 bg-gradient-to-b ${layer.color} backdrop-blur-sm hover:border-white/20 transition-colors`}>
                <h3 className="text-xl font-bold mb-2 text-white">{layer.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
