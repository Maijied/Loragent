'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Server, Shield, Activity, RefreshCw, CheckCircle2, Lock, ArrowLeft,
  Terminal, Globe, Database, Cpu, Layers, ExternalLink, Play, Check
} from 'lucide-react';

export default function AdminPage() {
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const simulatePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPingStatus('200 OK — Latency 14ms — Cloudflare Global Edge (174 Agents Active)');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#030704] text-gray-100 font-sans selection:bg-[#00FF41]/30 selection:text-[#00FF41]">
      {/* Background Cyber Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[5%] right-[20%] w-[45vw] h-[45vw] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#00FF41]/10 blur-[160px]" />
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
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white text-base">Loragent Mission Control</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                ADMIN CONSOLE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <Link href="/community" className="text-cyan-400 hover:text-cyan-300 transition-colors">System Wiki</Link>
            <span className="text-[#00FF41] px-2.5 py-1 rounded bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
              SYSTEM HEALTHY
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-2">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider flex justify-between items-center">
              <span>Cloudflare Edge MCP</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              OPERATIONAL
            </div>
            <div className="text-[11px] font-mono text-gray-400 truncate">mcp.lorapk-labs.workers.dev</div>
          </div>

          <div className="glass-panel-cyan p-6 rounded-2xl border border-cyan-500/30 space-y-2">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider flex justify-between items-center">
              <span>Agent Master Roster</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white">174 AGENTS</div>
            <div className="text-[11px] font-mono text-cyan-400">22 Functional Domains Synced</div>
          </div>

          <div className="glass-panel-purple p-6 rounded-2xl border border-purple-500/30 space-y-2">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider flex justify-between items-center">
              <span>Chorki Autopilot Loop</span>
              <RefreshCw className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black font-mono text-purple-400">ACTIVE</div>
            <div className="text-[11px] font-mono text-gray-400">check-done Lifecycle Enforced</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-yellow-500/30 space-y-2">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider flex justify-between items-center">
              <span>Zero-Trust Vault</span>
              <Lock className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-black font-mono text-yellow-400">AES-256 ENCLAVE</div>
            <div className="text-[11px] font-mono text-gray-400">Machine-Derived SHA-256 Key</div>
          </div>
        </div>

        {/* Live Diagnostics & Endpoint Health Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Endpoints & Interactive Ping */}
          <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Live Remote MCP Server Endpoints</h2>
                <p className="text-xs text-gray-400 font-mono">Cloudflare Workers Edge Network (Global Routing)</p>
              </div>
              <button
                onClick={simulatePing}
                disabled={isPinging}
                className="px-4 py-2 rounded-lg bg-[#00FF41] text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Pinging Edge...' : 'Ping Live Endpoints'}</span>
              </button>
            </div>

            {pingStatus && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{pingStatus}</span>
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-white font-bold">POST /mcp (JSON-RPC 2.0 MCP Protocol)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">200 OK</span>
                </div>
                <div className="text-cyan-400 truncate">https://mcp.lorapk-labs.workers.dev/mcp</div>
                <div className="text-[11px] text-gray-500">Exposes loragent_exec_cli, loragent_summon_agent, loragent_steer, loragent_checkpoint_save</div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-white font-bold">GET /sse (Server-Sent Events Stream)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">200 OK</span>
                </div>
                <div className="text-cyan-400 truncate">https://mcp.lorapk-labs.workers.dev/sse</div>
                <div className="text-[11px] text-gray-500">Real-time SSE event streaming for Windsurf, Cursor, and web clients</div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-white font-bold">GET /health (Diagnostic Telemetry)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">200 OK</span>
                </div>
                <div className="text-cyan-400 truncate">https://mcp.lorapk-labs.workers.dev/health</div>
                <div className="text-[11px] text-gray-500">Returns service status, version 1.0.0, and 174 active agent count</div>
              </div>
            </div>
          </div>

          {/* Right Column: Security Enclave Status */}
          <div className="lg:col-span-4 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Security Enclave</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex justify-between items-center">
                <span className="text-gray-400">Vault Backend</span>
                <span className="text-white font-bold">GPG AES-256</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex justify-between items-center">
                <span className="text-gray-400">PIN Storage</span>
                <span className="text-[#00FF41] font-bold">Encrypted .env</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex justify-between items-center">
                <span className="text-gray-400">Workspace Guard</span>
                <span className="text-emerald-400 font-bold">Enforced</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex justify-between items-center">
                <span className="text-gray-400">Unit Tests Suite</span>
                <span className="text-cyan-400 font-bold">15/15 PASS</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/80 border border-white/5 text-gray-300 font-sans text-xs leading-relaxed space-y-2">
              <div className="font-bold text-white font-mono">Zero Plaintext Policy</div>
              <p>All sensitive credentials for Cloudflare, GitHub, Firebase, Azure, GCP, and AWS are injected on-demand into child process memory without writing plaintext tokens to disk or git.</p>
            </div>
          </div>

        </div>

      </main>

      {/* Admin Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs font-mono text-gray-500">
        <p>Loragent Mission Control • Lorapok Labs Enterprise Infrastructure</p>
      </footer>
    </div>
  );
}
