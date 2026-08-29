import { CLOUDFLARE_MCP_DEFAULT_URL } from './constants.js';
import { executeCLI } from './tools/cli-runner.js';
import { LoragentCheckpointEngine } from './durable/checkpoint.js';
import { LoragentTracer } from './telemetry/tracer.js';

/**
 * LoragentClient — Universal Client for interacting with the Loragent MCP Server
 * Compatible with local stdio server, CLI runner, and Cloudflare Edge MCP endpoint.
 */
export class LoragentClient {
  constructor(options = {}) {
    this.endpoint = options.endpoint || options.url || CLOUDFLARE_MCP_DEFAULT_URL;
    this.token = options.token || null;
    this.workspace = options.workspace || (typeof process !== 'undefined' ? process.cwd() : '.');
    this.timeout = options.timeout || 30000;
    this.checkpointer = new LoragentCheckpointEngine({ storageDir: options.checkpointDir });
    this.tracer = new LoragentTracer({ serviceName: options.serviceName || 'loragent-client' });
  }

  /**
   * Internal JSON-RPC 2.0 transport call
   */
  async _rpc(method, params = {}) {
    const spanId = this.tracer.startSpan(`rpc:${method}`, params);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-mcp-version': '2024-11-05'
      };
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method,
          params
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        throw new Error(`Loragent MCP Server returned HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      if (json.error) {
        throw new Error(`Loragent RPC Error [${json.error.code}]: ${json.error.message}`);
      }

      this.tracer.endSpan(spanId, json.result);
      return json.result;
    } catch (err) {
      this.tracer.endSpan(spanId, null, err);
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Execute CLI tools safely with auto-credential injection (wrangler, gh, git, npm, docker)
   */
  async exec(command, options = {}) {
    const spanId = this.tracer.startSpan('cli:exec', { command });
    try {
      const res = await executeCLI(command, { cwd: this.workspace, ...options });
      this.tracer.endSpan(spanId, res);
      return res;
    } catch (err) {
      this.tracer.endSpan(spanId, null, err);
      throw err;
    }
  }

  /**
   * List all agents with optional filtering
   */
  async listAgents(filters = {}) {
    return this._rpc('tools/call', {
      name: 'loragent_list_agents',
      arguments: filters
    });
  }

  /**
   * Search agents by keyword across names, descriptions, and categories
   */
  async searchAgents(query) {
    if (!query) throw new Error('Search query is required');
    return this._rpc('tools/call', {
      name: 'loragent_search_agents',
      arguments: { query }
    });
  }

  /**
   * Summon a specialist agent on demand
   */
  async summonAgent(agentName) {
    if (!agentName) throw new Error('Agent name is required');
    return this._rpc('tools/call', {
      name: 'loragent_summon_agent',
      arguments: { agentName }
    });
  }

  /**
   * Dismiss an agent from the active workspace
   */
  async dismissAgent(agentName) {
    if (!agentName) throw new Error('Agent name is required');
    return this._rpc('tools/call', {
      name: 'loragent_dismiss_agent',
      arguments: { agentName }
    });
  }

  /**
   * Steer context and payload to the next agent in the pipeline
   */
  async steer(targetAgent, payload) {
    if (!targetAgent || !payload) throw new Error('targetAgent and payload are required');
    return this._rpc('tools/call', {
      name: 'loragent_steer',
      arguments: { targetAgent, payload: typeof payload === 'string' ? payload : JSON.stringify(payload) }
    });
  }

  /**
   * Trigger local workspace or remote lifecycle hooks
   */
  async triggerHook(hookName) {
    if (!hookName) throw new Error('Hook name is required');
    return this._rpc('tools/call', {
      name: 'loragent_trigger_hook',
      arguments: { hookName }
    });
  }

  /**
   * Read current execution state and active formation
   */
  async getState() {
    return this._rpc('tools/call', {
      name: 'loragent_get_state',
      arguments: {}
    });
  }

  /**
   * Save session context to the Watchman fault-tolerance cache
   */
  async saveWatchman(currentTask, lastCompletedStep, nextStep) {
    return this._rpc('tools/call', {
      name: 'loragent_watchman_save',
      arguments: { currentTask, lastCompletedStep, nextStep }
    });
  }

  /**
   * Checkpoint persistence
   */
  async saveCheckpoint(taskId, stepIndex, state, metadata) {
    return this.checkpointer.saveCheckpoint(taskId, stepIndex, state, metadata);
  }

  async resumeCheckpoint(taskId) {
    return this.checkpointer.getLatestCheckpoint(taskId);
  }

  getTelemetry() {
    return this.tracer.getTraceSummary();
  }

  /**
   * Health check
   */
  async health() {
    const url = new URL(this.endpoint);
    const healthUrl = `${url.origin}/health`;
    const res = await fetch(healthUrl);
    return res.json();
  }
}
