import React from 'react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#161b22]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              L
            </div>
            <div>
              <span className="font-bold text-lg text-white">Loragent Mission Control</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">ADMIN</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Terminal Home</Link>
            <Link href="/community" className="hover:text-white transition-colors">System Wiki</Link>
            <a href="#telemetry" className="hover:text-white transition-colors">Telemetry</a>
            <a href="#vault" className="hover:text-white transition-colors">Credential Vault</a>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors shadow-sm"
            >
              Back to CLI
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Admin Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#161b22] border border-gray-800 p-5 rounded-xl space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Cloudflare Edge MCP</div>
            <div className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ONLINE
            </div>
            <div className="text-xs text-gray-500 font-mono truncate">mcp.lorapk-labs.workers.dev</div>
          </div>

          <div className="bg-[#161b22] border border-gray-800 p-5 rounded-xl space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Registered Agents</div>
            <div className="text-2xl font-bold text-white">167 AGENTS</div>
            <div className="text-xs text-cyan-400">22 Functional Categories</div>
          </div>

          <div className="bg-[#161b22] border border-gray-800 p-5 rounded-xl space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Chorki Autopilot Loop</div>
            <div className="text-2xl font-bold text-purple-400">AUTONOMOUS</div>
            <div className="text-xs text-gray-500">check-done Hook Enforced</div>
          </div>

          <div className="bg-[#161b22] border border-gray-800 p-5 rounded-xl space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Zero-Trust Cred Vault</div>
            <div className="text-2xl font-bold text-blue-400">GPG AES-256</div>
            <div className="text-xs text-gray-500">Auto-PIN Enclave Active</div>
          </div>
        </div>

        {/* Live MCP & Telemetry Monitoring */}
        <section id="telemetry" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 bg-[#161b22] border border-gray-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Live MCP Server Endpoints</h2>
                <p className="text-xs text-gray-400">Global Cloudflare Worker &amp; Local Stdio Transports</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                HTTP/2 + SSE READY
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#0d1117] border border-gray-800 font-mono text-xs space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>POST /mcp (JSON-RPC 2.0)</span>
                  <span className="text-emerald-400">200 OK</span>
                </div>
                <div className="text-blue-400">https://mcp.lorapk-labs.workers.dev/mcp</div>
              </div>

              <div className="p-4 rounded-lg bg-[#0d1117] border border-gray-800 font-mono text-xs space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>GET /sse (Server-Sent Events Stream)</span>
                  <span className="text-emerald-400">200 OK</span>
                </div>
                <div className="text-blue-400">https://mcp.lorapk-labs.workers.dev/sse</div>
              </div>

              <div className="p-4 rounded-lg bg-[#0d1117] border border-gray-800 font-mono text-xs space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>GET /health (Diagnostic Telemetry)</span>
                  <span className="text-emerald-400">200 OK</span>
                </div>
                <div className="text-blue-400">https://mcp.lorapk-labs.workers.dev/health</div>
              </div>
            </div>
          </div>

          {/* Security Vault Inspector */}
          <div id="vault" className="lg:col-span-4 bg-[#161b22] border border-gray-800 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white">Security Vault Enclave</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-3 rounded bg-[#0d1117] border border-gray-800">
                <span className="text-gray-400">Vault Backend</span>
                <span className="text-white">credentials.json.gpg</span>
              </div>
              <div className="flex justify-between p-3 rounded bg-[#0d1117] border border-gray-800">
                <span className="text-gray-400">PIN Manager</span>
                <span className="text-emerald-400">Auto-Passphrase</span>
              </div>
              <div className="flex justify-between p-3 rounded bg-[#0d1117] border border-gray-800">
                <span className="text-gray-400">Workspace Guard</span>
                <span className="text-emerald-400">Protected</span>
              </div>
              <div className="flex justify-between p-3 rounded bg-[#0d1117] border border-gray-800">
                <span className="text-gray-400">Total Key Records</span>
                <span className="text-cyan-400">Encrypted</span>
              </div>
            </div>
          </div>

        </section>

      </main>

      {/* Admin Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        <p>Loragent Mission Control • Lorapok Labs Enterprise Infrastructure</p>
      </footer>
    </div>
  );
}
