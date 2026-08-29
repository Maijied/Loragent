'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Terminal, Server, ArrowLeft, Play, RefreshCw, CheckCircle2, 
  Code2, Sparkles, Send, Copy, Check, Activity, Globe, Database
} from 'lucide-react';

const SAMPLE_ENDPOINTS = [
  { method: 'GET', url: '/api/mcp', label: 'MCP Server Status & Capabilities', body: null },
  { 
    method: 'POST', 
    url: '/api/mcp', 
    label: 'MCP: tools/list (All Online Tools)', 
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }, null, 2) 
  },
  { 
    method: 'POST', 
    url: '/api/mcp', 
    label: 'MCP: tools/call (Summon Tech Director)', 
    body: JSON.stringify({ 
      jsonrpc: "2.0", 
      id: 2, 
      method: "tools/call", 
      params: { 
        name: "loragent_summon_agent", 
        arguments: { 
          agentSlug: "tech-director", 
          taskDirective: "Design LLDP architecture for Next.js web application" 
        } 
      } 
    }, null, 2) 
  },
  { 
    method: 'POST', 
    url: '/api/mcp', 
    label: 'MCP: tools/call (Discover Assets)', 
    body: JSON.stringify({ 
      jsonrpc: "2.0", 
      id: 3, 
      method: "tools/call", 
      params: { 
        name: "loragent_discover", 
        arguments: { filter: "react", category: "engineering" } 
      } 
    }, null, 2) 
  },
  { method: 'GET', url: '/api/catalog', label: 'REST: Full 250-Item Catalog', body: null },
  { method: 'GET', url: '/api/agents/boss', label: 'REST: Agent Detail (Boss)', body: null },
  { method: 'GET', url: '/api/discover?filter=react', label: 'REST: Live PC Asset Discovery', body: null },
  { method: 'GET', url: '/api/telemetry', label: 'REST: Live Orchestration Telemetry', body: null },
  { method: 'GET', url: '/api/health', label: 'REST: System Health & RAM Metrics', body: null },
];

export default function ApiExplorerPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(SAMPLE_ENDPOINTS[0]);
  const [method, setMethod] = useState(SAMPLE_ENDPOINTS[0].method);
  const [url, setUrl] = useState(SAMPLE_ENDPOINTS[0].url);
  const [requestBody, setRequestBody] = useState<string>(SAMPLE_ENDPOINTS[0].body || '');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (ep: typeof SAMPLE_ENDPOINTS[0]) => {
    setSelectedEndpoint(ep);
    setMethod(ep.method);
    setUrl(ep.url);
    setRequestBody(ep.body || '');
    setResponseOutput(null);
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (method === 'POST' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      setResponseOutput(data);
    } catch (err: any) {
      setResponseOutput({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06060A] text-neutral-200">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06060A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE SERVER: ONLINE</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-2">
            <Server className="w-4 h-4" />
            <span>ONLINE MODEL CONTEXT PROTOCOL (MCP) & REST API CONSOLE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Live Interactive MCP & API Playground
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            Send real-time JSON-RPC 2.0 requests to the live MCP Server (/api/mcp) or execute dynamic REST telemetry queries directly from your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Preset Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
              Sample Directives & Endpoints
            </h2>
            <div className="space-y-2">
              {SAMPLE_ENDPOINTS.map((ep, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(ep)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-mono ${
                    selectedEndpoint.label === ep.label
                      ? 'bg-purple-500/15 border-purple-500/40 text-white shadow-[0_0_20px_rgba(123,47,190,0.2)]'
                      : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ep.method === 'POST' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="truncate text-neutral-300">{ep.url}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-sans truncate">
                    {ep.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Console */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-4">
              {/* Request URL Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleExecuteRequest}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(123,47,190,0.4)]"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Request</span>
                </button>
              </div>

              {/* Request Body Editor (for POST) */}
              {method === 'POST' && (
                <div>
                  <div className="text-xs font-mono text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>JSON-RPC 2.0 Payload</span>
                  </div>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={7}
                    className="w-full bg-black/80 border border-white/10 rounded-xl p-4 font-mono text-xs text-neutral-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}
            </div>

            {/* Live Response Box */}
            <div className="rounded-2xl border border-white/10 bg-black/80 p-6 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-2 font-semibold">
                  <Terminal className="w-4 h-4" />
                  <span>Live Server Output (JSON)</span>
                </span>
                {responseOutput && (
                  <button
                    onClick={handleCopyResponse}
                    className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Response'}</span>
                  </button>
                )}
              </div>

              <div className="font-mono text-xs text-neutral-300 min-h-[200px] max-h-[400px] overflow-auto select-all">
                {responseOutput ? (
                  <pre className="text-emerald-300 leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(responseOutput, null, 2)}
                  </pre>
                ) : (
                  <div className="text-neutral-500 py-12 text-center font-mono">
                    Click "Send Request" above to execute real-time query against the live server.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
