import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-[#00FF41] font-mono selection:bg-[#00FF41] selection:text-black">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-50"></div>
      
      {/* Navigation */}
      <nav className="border-b border-[#00FF41]/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between uppercase text-xs tracking-widest">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#00FF41] text-lg">&gt;_ LORAGENT</span>
            <span className="hidden md:inline text-gray-500">v1.0.0_STABLE</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">[ DOCS ]</a>
            <a href="#" className="hover:text-white transition-colors">[ GITHUB ]</a>
            <a href="#" className="hover:text-white transition-colors">[ INITIATE ]</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Hero Section */}
        <div className="mt-12 md:mt-24 border border-[#00FF41]/30 bg-black/50 p-6 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 text-[10px] text-gray-600">SYS_AUTH: REQUIRED</div>
          
          <div className="max-w-3xl space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold uppercase leading-tight">
              Enterprise Orchestration <br/>
              <span className="text-white">&amp; Autonomous</span> Protocol.
            </h1>
            
            <p className="text-sm md:text-base text-gray-400 max-w-2xl font-sans">
              Deploy absolute control over your AI ecosystem. Secure credentials, zero-trust state execution, and raw CLI power.
            </p>

            <div className="pt-8">
              <div className="bg-[#050505] border border-[#00FF41]/50 p-4 font-mono text-sm inline-block w-full max-w-xl">
                <div className="flex justify-between items-center mb-2 border-b border-[#00FF41]/20 pb-2">
                  <span className="text-xs text-gray-500">USER: ADMIN // LOCAL</span>
                  <span className="text-xs text-gray-500">EXEC_TIME: 0.04ms</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-[#00FF41]">root@lorapok:~$</span> npm install -g loragent
                  <br/>
                  <span className="text-gray-500">Fetching packages... [OK]</span>
                  <br/>
                  <span className="text-[#00FF41]">root@lorapok:~$</span> loragent init
                  <br/>
                  <span className="text-yellow-400">WARNING:</span> Vault PIN required.
                  <br/>
                  <span className="text-white animate-pulse">_</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Grid */}
        <div className="mt-12 md:mt-24">
          <h2 className="text-xl md:text-2xl mb-8 uppercase border-l-4 border-[#00FF41] pl-4">System Architecture [LLDP]</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { id: "FACE", func: "CLI ROUTING" },
              { id: "PULSE", func: "DAEMON SYNC" },
              { id: "LORE", func: "MODEL LOGIC" },
              { id: "PORT", func: "MCP ADAPTER" },
              { id: "LOOM", func: "GRAPH ORCH" }
            ].map((node, i) => (
              <div key={i} className="border border-gray-800 hover:border-[#00FF41] bg-[#050505] p-4 transition-colors group cursor-crosshair">
                <div className="text-xs text-gray-600 mb-4 flex justify-between">
                  <span>NODE_{i+1}</span>
                  <span className="text-green-900 group-hover:text-[#00FF41] transition-colors">●</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{node.id}</h3>
                <p className="text-xs text-[#00FF41]/70">{node.func}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
      
      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 w-full border-t border-[#00FF41]/30 bg-black p-2 flex justify-between text-[10px] text-gray-500 uppercase tracking-widest z-40">
        <div>STATUS: ONLINE</div>
        <div className="hidden md:block">ENCRYPTION: AES-256-GCM</div>
        <div>CONNECTION: SECURE</div>
      </footer>
    </div>
  );
}
