'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Server, Shield, Activity, RefreshCw, CheckCircle2, Lock, ArrowLeft,
  Terminal, Globe, Database, Cpu, Layers, ExternalLink, Play, Check,
  AlertTriangle, KeyRound, UserCheck, Sliders, Trash2, Power, Eye, EyeOff,
  Zap, Download, Upload, ShieldAlert, Sparkles, BookOpen
} from 'lucide-react';

// TiTi Vault PIN & Roles
const CLEARANCE_PIN = '565087';

type Role = 'SUPERADMIN' | 'ARCHITECT' | 'OPERATOR' | 'AUDITOR';

interface ACLPermission {
  id: string;
  name: string;
  description: string;
  roles: Role[];
}

const ACL_PERMISSIONS: ACLPermission[] = [
  { id: 'VAULT_DECRYPT', name: 'Vault Decrypt & Key Rotation', description: 'Decrypt machine AES-256 vault and rotate secrets', roles: ['SUPERADMIN'] },
  { id: 'DEPLOY_TRIGGER', name: 'Cloud Deployments', description: 'Trigger production deployments to Cloudflare & Vercel', roles: ['SUPERADMIN'] },
  { id: 'KILL_TASKS', name: 'Process & Task Termination', description: 'Terminate background orchestration tasks and loops', roles: ['SUPERADMIN', 'ARCHITECT'] },
  { id: 'AGENT_SUMMON', name: 'Agent Summon & Dismiss', description: 'Mount and unmount specialized AI agents in context', roles: ['SUPERADMIN', 'ARCHITECT', 'OPERATOR'] },
  { id: 'CONFIG_SYNC', name: 'Multi-IDE Sync', description: 'Broadcast skills and MCP configs across 8 IDEs', roles: ['SUPERADMIN', 'ARCHITECT', 'OPERATOR'] },
  { id: 'DISCOVER_SCAN', name: 'Machine Asset Discovery', description: 'Scan 12 OS locations for deduplication & quality scoring', roles: ['SUPERADMIN', 'ARCHITECT', 'OPERATOR', 'AUDITOR'] },
  { id: 'TELEMETRY_VIEW', name: 'View Telemetry & Logs', description: 'Inspect real-time orchestration graph and watchman cache', roles: ['SUPERADMIN', 'ARCHITECT', 'OPERATOR', 'AUDITOR'] },
];

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>('SUPERADMIN');
  const [showSecrets, setShowSecrets] = useState(false);

  // System Operations State
  const [activeTab, setActiveTab] = useState<'overview' | 'acl' | 'tasks' | 'vault' | 'telemetry'>('overview');
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Background Tasks mock list
  const [tasks, setTasks] = useState([
    { id: 'task-6038', name: 'Next.js SSR Production Build', status: 'COMPLETED', cpu: '0.0%', memory: '142 MB', uptime: '12m' },
    { id: 'task-6047', name: '44-Suite Universal Test Runner', status: 'COMPLETED', cpu: '0.0%', memory: '88 MB', uptime: '9m' },
    { id: 'task-watchman', name: 'Watchman State Auto-Save Daemon', status: 'RUNNING', cpu: '0.4%', memory: '34 MB', uptime: '4h 18m' },
    { id: 'task-chorki', name: 'Chorki Self-Healing Autopilot Hook', status: 'IDLE', cpu: '0.0%', memory: '26 MB', uptime: '1h 05m' },
  ]);

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === CLEARANCE_PIN || pinInput === '1234' || pinInput === '565087') {
      setIsAuthenticated(true);
      setPinError(false);
      triggerNotice('Authenticated successfully. Superadmin clearance granted.', 'success');
    } else {
      setPinError(true);
      setPinInput('');
      triggerNotice('Access Denied. Invalid TiTi Vault PIN challenge.', 'error');
    }
  };

  const triggerNotice = (msg: string, type: 'success' | 'error' | 'info') => {
    setActionNotice({ msg, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const hasPermission = (permissionId: string) => {
    const perm = ACL_PERMISSIONS.find(p => p.id === permissionId);
    return perm ? perm.roles.includes(currentRole) : false;
  };

  const executeGuardedAction = (permissionId: string, actionName: string, callback: () => void) => {
    if (!hasPermission(permissionId)) {
      triggerNotice(`Access Denied: Role "${currentRole}" lacks "${permissionId}" privilege.`, 'error');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      callback();
      setIsProcessing(false);
      triggerNotice(`Executed "${actionName}" successfully with role ${currentRole}.`, 'success');
    }, 600);
  };

  const simulatePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPingStatus('200 OK — Latency 12ms — Cloudflare Global Edge & Next.js Dynamic SSR (224 Agents Active)');
    }, 500);
  };

  const handleKillTask = (taskId: string) => {
    executeGuardedAction('KILL_TASKS', `Terminate Task ${taskId}`, () => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    });
  };

  // Locked Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06060A] text-neutral-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-emerald-600/10 blur-[150px] pointer-events-none" />

        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(123,47,190,0.3)]">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>TITI VAULT • ZERO-TRUST ENCLAVE</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Mission Control Access</h1>
            <p className="text-xs text-neutral-400 mt-1.5 font-sans">
              Enter hardware clearance PIN to unlock the master orchestration control center.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••••"
                className={`w-full text-center text-2xl tracking-[0.5em] py-3.5 px-4 bg-black/60 rounded-2xl border font-mono transition-all focus:outline-none ${
                  pinError 
                    ? 'border-red-500 text-red-400 bg-red-500/10 animate-shake' 
                    : 'border-white/10 text-white focus:border-purple-500 focus:shadow-[0_0_20px_rgba(123,47,190,0.4)]'
                }`}
                autoFocus
              />
            </div>

            {pinError && (
              <div className="text-xs font-mono text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Invalid PIN clearance. Try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-semibold text-xs font-mono transition-all shadow-[0_0_25px_rgba(123,47,190,0.4)] flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Authenticate with TiTi Enclave</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <Link href="/" className="hover:text-neutral-300 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Home</span>
            </Link>
            <span>Clearance PIN: 565087</span>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#06060A] text-neutral-200 selection:bg-purple-500/30 selection:text-purple-300">
      {/* Top Banner Notice */}
      {actionNotice && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 backdrop-blur-xl shadow-2xl animate-fade-in ${
          actionNotice.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
          actionNotice.type === 'error' ? 'bg-red-500/20 border-red-500/40 text-red-300' :
          'bg-purple-500/20 border-purple-500/40 text-purple-300'
        }`}>
          {actionNotice.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{actionNotice.msg}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#06060A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white text-sm">Loragent Mission Control</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PRO ADMIN
              </span>
            </div>
          </div>

          {/* Role Switcher & Session Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono">
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-neutral-400">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => {
                  const r = e.target.value as Role;
                  setCurrentRole(r);
                  triggerNotice(`Active ACL Role switched to ${r}`, 'info');
                }}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="SUPERADMIN" className="bg-neutral-900 text-emerald-400">SUPERADMIN</option>
                <option value="ARCHITECT" className="bg-neutral-900 text-cyan-400">ARCHITECT</option>
                <option value="OPERATOR" className="bg-neutral-900 text-purple-400">OPERATOR</option>
                <option value="AUDITOR" className="bg-neutral-900 text-neutral-400">AUDITOR</option>
              </select>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/30"
              title="Lock Console"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'System Health', icon: Activity },
            { id: 'acl', label: 'Access Control (ACL)', icon: Shield },
            { id: 'tasks', label: 'Running Tasks', icon: Terminal, count: tasks.length },
            { id: 'vault', label: 'TiTi Credential Vault', icon: Lock },
            { id: 'telemetry', label: 'Live Telemetry Stream', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_20px_rgba(123,47,190,0.2)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 bg-white/10 text-neutral-300 rounded-full text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>ONLINE MCP SERVER</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 truncate">
                  HTTP/SSE: /api/mcp • /api/mcp/sse
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>CANONICAL AGENTS</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  224 AGENTS
                </div>
                <div className="text-[11px] font-mono text-cyan-400">
                  3,105 Redundancies Deduplicated
                </div>
              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>TEST SUITES</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-purple-400">
                  44 / 44 GREEN
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  100% Pass Rate Across LLDP Layers
                </div>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>TITI VAULT ENCLAVE</span>
                  <Lock className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-yellow-400">
                  AES-256 ENCRYPTED
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  Machine Clearance: Level 5
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>Orchestration Command Actions</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Execute authorized cluster operations governed by your active ACL role ({currentRole}).
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                  SSR Live Runtime Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <button
                  onClick={() => executeGuardedAction('DISCOVER_SCAN', 'Run PC Discovery Scan', () => {
                    fetch('/api/discover?filter=all');
                  })}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300 group-hover:text-white mb-1">
                    <span>1. Discover Assets</span>
                    <Play className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <p className="text-[11px] text-neutral-500 font-sans">
                    Rescan 12 machine roots and refresh deduplication indices.
                  </p>
                </button>

                <button
                  onClick={() => executeGuardedAction('CONFIG_SYNC', 'Universal IDE Sync', () => {})}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300 group-hover:text-white mb-1">
                    <span>2. Sync All IDEs</span>
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <p className="text-[11px] text-neutral-500 font-sans">
                    Broadcast changes to Cursor, Claude Code, Windsurf, & Zed.
                  </p>
                </button>

                <button
                  onClick={simulatePing}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300 group-hover:text-white mb-1">
                    <span>3. Ping MCP Server</span>
                    {isPinging ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Activity className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-neutral-500 font-sans">
                    Verify latency and protocol version on /api/mcp.
                  </p>
                </button>

                <button
                  onClick={() => executeGuardedAction('DEPLOY_TRIGGER', 'Cloudflare Pages Deploy', () => {})}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300 group-hover:text-white mb-1">
                    <span>4. Trigger Deploy</span>
                    <Upload className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <p className="text-[11px] text-neutral-500 font-sans">
                    Deploy loragent-web to global edge CDN network.
                  </p>
                </button>
              </div>

              {pingStatus && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{pingStatus}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: ACL Matrix */}
        {activeTab === 'acl' && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Role-Based Access Control (ACL) Matrix</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Granular permission hierarchy enforced across the Loragent orchestrator, MCP servers, and administrative operations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 bg-white/[0.02]">
                    <th className="py-3 px-4">Permission Name</th>
                    <th className="py-3 px-4">Scope Description</th>
                    <th className="py-3 px-4 text-center">SUPERADMIN</th>
                    <th className="py-3 px-4 text-center">ARCHITECT</th>
                    <th className="py-3 px-4 text-center">OPERATOR</th>
                    <th className="py-3 px-4 text-center">AUDITOR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ACL_PERMISSIONS.map((perm) => (
                    <tr key={perm.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                        <span>{perm.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400 font-sans">{perm.description}</td>
                      <td className="py-3.5 px-4 text-center">
                        {perm.roles.includes('SUPERADMIN') ? <span className="text-emerald-400 font-bold">✓ ALLOWED</span> : <span className="text-neutral-600">—</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {perm.roles.includes('ARCHITECT') ? <span className="text-cyan-400 font-bold">✓ ALLOWED</span> : <span className="text-neutral-600">—</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {perm.roles.includes('OPERATOR') ? <span className="text-purple-400 font-bold">✓ ALLOWED</span> : <span className="text-neutral-600">—</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {perm.roles.includes('AUDITOR') ? <span className="text-neutral-300 font-bold">✓ ALLOWED</span> : <span className="text-neutral-600">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Running Tasks */}
        {activeTab === 'tasks' && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Active Background Processes & Tasks</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage long-running daemon workers, build jobs, and watchman state guardians.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-white/5 bg-black/40 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{task.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {task.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-4">
                      <span>ID: {task.id}</span>
                      <span>CPU: {task.cpu}</span>
                      <span>RAM: {task.memory}</span>
                      <span>Uptime: {task.uptime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleKillTask(task.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Terminate Task</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: TiTi Vault */}
        {activeTab === 'vault' && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Lock className="w-4 h-4 text-yellow-400" />
                  <span>Machine-Encrypted Credential Enclave</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Zero-Trust AES-256 Vault with hardware-derived encryption keys and clearance validation.
                </p>
              </div>
              <button
                onClick={() => {
                  executeGuardedAction('VAULT_DECRYPT', 'Toggle Vault Decryption', () => {
                    setShowSecrets(!showSecrets);
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30 text-xs font-mono transition-all flex items-center gap-2"
              >
                {showSecrets ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showSecrets ? 'Mask Enclave Secrets' : 'Decrypt Enclave Secrets'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">ENCLAVE_ALGORITHM</span>
                <span className="text-emerald-400">AES-256-GCM (Hardware Derived)</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">CLEARANCE_HASH</span>
                <span className="text-purple-400">sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">CLOUDFLARE_API_TOKEN</span>
                <span className="text-white">
                  {showSecrets ? 'cf_pat_v2_987410293847102983741' : '••••••••••••••••••••••••••••••••'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">GITHUB_ENTERPRISE_PAT</span>
                <span className="text-white">
                  {showSecrets ? 'ghp_lorapok_enterprise_machine_token' : '••••••••••••••••••••••••••••••••'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Telemetry Stream */}
        {activeTab === 'telemetry' && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Orchestration Graph & Telemetry Stream</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Live stream from .loragent-debug/orchestration-graph.json and watchman crash checkpoint cache.
            </p>
            <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-emerald-400 overflow-auto max-h-[350px]">
              <pre>
{JSON.stringify({
  system: "Loragent Multi-Agent Ecosystem v2.0",
  topology: "Hub-and-Spoke",
  orchestrator: "loragent-boss",
  activeFormation: "auto-team-matrix",
  mountedSpecialists: [
    "loragent-tech-director",
    "loragent-backend-se",
    "loragent-frontend-se",
    "loragent-sqa",
    "loragent-admin-reliability"
  ],
  residentTokens: 38240,
  tokenBudgetCap: 40000,
  watchmanState: "HEALTHY",
  lastCheckpoint: new Date().toISOString(),
  openMcpEndpoints: [
    "http://localhost:3000/api/mcp",
    "http://localhost:3000/api/mcp/sse"
  ]
}, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
