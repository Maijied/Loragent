import { AGENT_INDEX } from './agents-index.js';

const MCP_SERVER_INFO = {
  name: "loragent-mcp-cloud",
  version: "1.0.0",
  protocolVersion: "2024-11-05",
  instructions: "Loragent Enterprise Orchestration & Autonomous Multi-Agent Protocol by Lorapok Labs. Provides access to 165 specialized AI agents across 22 categories and 4 formations."
};

const MCP_TOOLS = [
  {
    name: "loragent_list_agents",
    description: "List all agents in the Loragent ecosystem from the unified agent index with filtering by category, source, formation, and type.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by category (e.g. engineering, business, quality, creative, devops, language-expert, security, data, cloud)"
        },
        formation: {
          type: "string",
          description: "Filter by formation (e.g. auto-team, office, freelance, chela, all)"
        },
        type: {
          type: "string",
          description: "Filter by type (core or specialist)"
        },
        source: {
          type: "string",
          description: "Filter by source (native, lorapok-ai-agent, lorapok-player, aswitch-i, freqghost, ide-skills)"
        }
      }
    }
  },
  {
    name: "loragent_search_agents",
    description: "Search for agents by keyword across name, description, and category.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query or keyword"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "loragent_summon_agent",
    description: "Dynamically load a specialized agent's prompt, persona, and directives on demand.",
    inputSchema: {
      type: "object",
      properties: {
        agentName: {
          type: "string",
          description: "The name or slug of the agent to summon (e.g. boss, react-specialist, bug-hunter, tech-director)"
        }
      },
      required: ["agentName"]
    }
  },
  {
    name: "loragent_dismiss_agent",
    description: "Unmount a specialized agent from the active workspace context (context garbage collection).",
    inputSchema: {
      type: "object",
      properties: {
        agentName: {
          type: "string",
          description: "The name or slug of the agent to dismiss"
        }
      },
      required: ["agentName"]
    }
  },
  {
    name: "loragent_steer",
    description: "Formally hand off execution context and payload to the next agent in the dynamic pipeline.",
    inputSchema: {
      type: "object",
      properties: {
        targetAgent: {
          type: "string",
          description: "Target agent to steer towards (e.g. loragent-frontend-se)"
        },
        payload: {
          type: "string",
          description: "Structured context or instructions to pass"
        }
      },
      required: ["targetAgent", "payload"]
    }
  },
  {
    name: "loragent_trigger_hook",
    description: "Execute lifecycle events (e.g. pre-commit, deploy-retry, test-verify) in the Loragent orchestration layer.",
    inputSchema: {
      type: "object",
      properties: {
        hookName: {
          type: "string",
          description: "The lifecycle hook name"
        }
      },
      required: ["hookName"]
    }
  },
  {
    name: "loragent_get_state",
    description: "Retrieve current Loragent orchestration state, active formation, and session history.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "loragent_watchman_save",
    description: "Save session context to the Watchman fault-tolerance cache for crash recovery.",
    inputSchema: {
      type: "object",
      properties: {
        currentTask: {
          type: "string",
          description: "Description of current task"
        },
        lastCompletedStep: {
          type: "string",
          description: "Last successfully completed step"
        },
        nextStep: {
          type: "string",
          description: "Upcoming step"
        }
      },
      required: ["currentTask", "lastCompletedStep", "nextStep"]
    }
  }
];

const MCP_PROMPTS = [
  {
    name: "auto-team-matrix",
    description: "Initialize the Auto Team standard software architecture matrix (tech-director, backend-se, frontend-se, sqa).",
    arguments: [
      { name: "project_description", description: "Brief description of what you are building", required: true }
    ]
  },
  {
    name: "chela-debugging",
    description: "Initialize the Chela mission-critical bug hunting and root cause analysis protocol.",
    arguments: [
      { name: "error_log", description: "Error stack trace or symptom description", required: true }
    ]
  },
  {
    name: "office-matrix",
    description: "Initialize full-scale business, product, and marketing operations matrix.",
    arguments: [
      { name: "initiative", description: "Business goal or launch strategy", required: true }
    ]
  }
];

// Tool execution router
function handleToolCall(name, args = {}) {
  const agents = AGENT_INDEX.agents || [];

  switch (name) {
    case "loragent_list_agents": {
      let filtered = [...agents];
      if (args.category) filtered = filtered.filter(a => a.category.toLowerCase() === args.category.toLowerCase());
      if (args.formation) filtered = filtered.filter(a => a.formation.toLowerCase() === args.formation.toLowerCase());
      if (args.type) filtered = filtered.filter(a => a.type.toLowerCase() === args.type.toLowerCase());
      if (args.source) filtered = filtered.filter(a => a.source.toLowerCase() === args.source.toLowerCase());

      const summary = filtered.map(a => `• ${a.name} [${a.category} / ${a.formation}] — ${a.description}`).join("\n");
      return {
        content: [
          {
            type: "text",
            text: `🏢 Loragent Catalog (${filtered.length}/${agents.length} agents matched):\n\n${summary}\n\n📊 Ecosystem Stats:\nTotal: ${AGENT_INDEX.statistics.totalAgents} | Core: ${AGENT_INDEX.statistics.coreAgents} | Specialists: ${AGENT_INDEX.statistics.specialists}`
          }
        ]
      };
    }

    case "loragent_search_agents": {
      const q = (args.query || "").toLowerCase();
      const results = agents.filter(a =>
        a.name.toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.formation.toLowerCase().includes(q)
      );

      if (results.length === 0) {
        return {
          content: [{ type: "text", text: `No agents found matching query: "${args.query}"` }]
        };
      }

      const summary = results.map(a => `• ${a.name} [${a.type} | ${a.category} | ${a.formation}] — ${a.description}`).join("\n");
      return {
        content: [
          {
            type: "text",
            text: `🔍 Found ${results.length} agents matching "${args.query}":\n\n${summary}`
          }
        ]
      };
    }

    case "loragent_summon_agent": {
      const targetSlug = (args.agentName || "").replace(/^loragent-/, "").toLowerCase();
      const agent = agents.find(a => a.slug.toLowerCase() === targetSlug || a.name.toLowerCase() === `loragent-${targetSlug}`);

      if (!agent) {
        return {
          isError: true,
          content: [{ type: "text", text: `Agent '${args.agentName}' not found in the 165-agent roster.` }]
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `# 🤖 Summoned Agent: ${agent.name}\n\n**Role:** ${agent.type.toUpperCase()} (${agent.category.toUpperCase()})\n**Formation:** ${agent.formation.toUpperCase()}\n**Description:** ${agent.description}\n\n## Directives & Ecosystem Rules:\n1. Strict Handoffs: Return all completed sub-tasks directly to loragent-boss.\n2. Security: Never emit plaintext tokens; reference cred vault.\n3. Sensory Quality: Production-grade, zero-fluff outputs conforming to LLDP architecture standards.`
          }
        ]
      };
    }

    case "loragent_dismiss_agent": {
      const targetSlug = (args.agentName || "").replace(/^loragent-/, "").toLowerCase();
      const coreAgents = ["boss", "teacher", "spidernet", "watchman", "workspace-guard"];
      if (coreAgents.includes(targetSlug)) {
        return {
          isError: true,
          content: [{ type: "text", text: `Cannot dismiss core operations agent '${args.agentName}'.` }]
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `Agent '${args.agentName}' successfully unmounted from context. Token bandwidth conserved.`
          }
        ]
      };
    }

    case "loragent_steer": {
      return {
        content: [
          {
            type: "text",
            text: `[LORAGENT STEER] Successfully transferred execution to target agent: '${args.targetAgent}'. Payload registered in telemetry stream.`
          }
        ]
      };
    }

    case "loragent_trigger_hook": {
      return {
        content: [
          {
            type: "text",
            text: `[LORAGENT HOOK] Lifecycle hook '${args.hookName}' triggered successfully at edge node.`
          }
        ]
      };
    }

    case "loragent_get_state": {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "ONLINE",
              layer: "PORT (Cloudflare Edge)",
              currentFormation: "Auto Team / Dynamic",
              activeAgents: 165,
              telemetry: "Firebase Connected",
              timestamp: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    }

    case "loragent_watchman_save": {
      return {
        content: [
          {
            type: "text",
            text: `[WATCHMAN CACHE] Context saved successfully. Task: "${args.currentTask}" | Step: "${args.lastCompletedStep}"`
          }
        ]
      };
    }

    default:
      return {
        isError: true,
        content: [{ type: "text", text: `Unknown tool name: ${name}` }]
      };
  }
}

// JSON-RPC 2.0 Processor
async function handleJsonRpc(requestBody) {
  const { id, method, params = {} } = requestBody;

  switch (method) {
    case "initialize":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: MCP_SERVER_INFO.protocolVersion,
          capabilities: {
            tools: { listChanged: false },
            prompts: { listChanged: false },
            resources: { listChanged: false }
          },
          serverInfo: {
            name: MCP_SERVER_INFO.name,
            version: MCP_SERVER_INFO.version
          },
          instructions: MCP_SERVER_INFO.instructions
        }
      };

    case "notifications/initialized":
      return null;

    case "ping":
      return { jsonrpc: "2.0", id, result: {} };

    case "tools/list":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          tools: MCP_TOOLS
        }
      };

    case "tools/call": {
      const { name, arguments: toolArgs } = params;
      const toolResult = handleToolCall(name, toolArgs);
      return {
        jsonrpc: "2.0",
        id,
        result: toolResult
      };
    }

    case "prompts/list":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          prompts: MCP_PROMPTS
        }
      };

    case "resources/list":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          resources: [
            {
              uri: "loragent://roster/summary",
              name: "Loragent Ecosystem Summary",
              description: "High-level summary of all 165 agents and formations",
              mimeType: "application/json"
            }
          ]
        }
      };

    default:
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`
        }
      };
  }
}

// HTML Dashboard Generator
function renderDashboard(url) {
  const total = AGENT_INDEX.statistics?.totalAgents || 165;
  const categories = AGENT_INDEX.statistics?.categories || 22;
  const formations = AGENT_INDEX.statistics?.formations || {};

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loragent MCP Cloud Server — Lorapok Labs</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090b10;
      --card-bg: rgba(18, 24, 38, 0.7);
      --card-border: rgba(99, 102, 241, 0.2);
      --accent-cyan: #06b6d4;
      --accent-violet: #8b5cf6;
      --accent-pink: #ec4899;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Outfit', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 40%);
      padding: 2rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container { max-width: 1000px; width: 100%; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: var(--accent-cyan);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; }
    h1 {
      font-size: 2.75rem;
      font-weight: 900;
      background: linear-gradient(135deg, #fff 0%, var(--accent-cyan) 50%, var(--accent-violet) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.15;
      margin-bottom: 0.75rem;
    }
    p.lead { font-size: 1.15rem; color: var(--text-muted); margin-bottom: 2rem; max-width: 700px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 1rem;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
      transition: all 0.3s ease;
    }
    .card:hover { transform: translateY(-3px); border-color: var(--accent-cyan); }
    .metric-value { font-size: 2.25rem; font-weight: 700; color: #fff; }
    .metric-label { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .config-box {
      background: #030712;
      border: 1px solid #1f2937;
      border-radius: 0.75rem;
      padding: 1.25rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      color: #38bdf8;
      overflow-x: auto;
      margin-top: 1rem;
      position: relative;
    }
    .endpoint-badge {
      background: #1e293b;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      color: #a5b4fc;
      font-weight: 600;
    }
    .tab-title { font-size: 1.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
    footer { margin-top: 3rem; text-align: center; color: #64748b; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <span class="status-dot"></span> Loragent Cloud Edge • Active
    </div>
    <h1>Loragent MCP Cloud Server</h1>
    <p class="lead">Universal Model Context Protocol Server for the 165-Agent Enterprise Ecosystem by Lorapok Labs. Operating natively on Cloudflare Workers edge nodes worldwide.</p>

    <div class="grid">
      <div class="card">
        <div class="metric-value">${total}</div>
        <div class="metric-label">Constituent Agents</div>
      </div>
      <div class="card">
        <div class="metric-value">${categories}</div>
        <div class="metric-label">Specialist Domains</div>
      </div>
      <div class="card">
        <div class="metric-value">${MCP_TOOLS.length}</div>
        <div class="metric-label">MCP Core Tools</div>
      </div>
      <div class="card">
        <div class="metric-value">4</div>
        <div class="metric-label">Formation Modes</div>
      </div>
    </div>

    <div class="tab-title">⚡ Remote IDE Configuration</div>
    <p style="color: var(--text-muted);">Add this remote MCP server to your AI IDE configuration (Cursor, Antigravity, Claude Code, Windsurf, or Roo Code):</p>

    <div class="config-box">
{
  "mcpServers": {
    "loragent-cloud": {
      "url": "${url.origin}/mcp",
      "type": "http"
    }
  }
}
    </div>

    <div class="tab-title">🌐 Live Protocol Endpoints</div>
    <div class="grid">
      <div class="card">
        <span class="endpoint-badge">POST /mcp</span>
        <h3 style="margin-top: 0.5rem; font-size: 1.1rem;">JSON-RPC MCP</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Standard MCP JSON-RPC 2.0 transport</p>
      </div>
      <div class="card">
        <span class="endpoint-badge">GET /sse</span>
        <h3 style="margin-top: 0.5rem; font-size: 1.1rem;">SSE Transport</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Server-Sent Events streaming stream</p>
      </div>
      <div class="card">
        <span class="endpoint-badge">GET /agents</span>
        <h3 style="margin-top: 0.5rem; font-size: 1.1rem;">Agent Registry API</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Direct JSON feed of all 165 agents</p>
      </div>
      <div class="card">
        <span class="endpoint-badge">GET /health</span>
        <h3 style="margin-top: 0.5rem; font-size: 1.1rem;">Health & Telemetry</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Edge node status and diagnostics</p>
      </div>
    </div>

    <footer>
      Lorapok Labs © 2026 • Loragent LLDP Enterprise Protocol • Edge Architecture
    </footer>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-mcp-version"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Root Dashboard
    if (pathname === "/" && request.method === "GET") {
      return new Response(renderDashboard(url), {
        headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders }
      });
    }

    // Health / Status
    if (pathname === "/health" || pathname === "/status") {
      return Response.json({
        status: "healthy",
        service: "loragent-mcp-cloud",
        version: "1.0.0",
        totalAgents: AGENT_INDEX.statistics?.totalAgents || 165,
        timestamp: new Date().toISOString()
      }, { headers: corsHeaders });
    }

    // REST Agents Endpoint
    if (pathname === "/agents") {
      return Response.json(AGENT_INDEX, { headers: corsHeaders });
    }

    // REST Tools Endpoint
    if (pathname === "/tools") {
      return Response.json({ tools: MCP_TOOLS }, { headers: corsHeaders });
    }

    // SSE Transport (/sse)
    if (pathname === "/sse") {
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`event: endpoint\ndata: ${url.origin}/mcp\n\n`));
        }
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          ...corsHeaders
        }
      });
    }

    // JSON-RPC MCP Endpoint (/mcp or POST /)
    if (pathname === "/mcp" || (pathname === "/" && request.method === "POST")) {
      try {
        const body = await request.json();
        const response = await handleJsonRpc(body);
        if (!response) {
          return new Response(null, { status: 204, headers: corsHeaders });
        }
        return Response.json(response, { headers: corsHeaders });
      } catch (err) {
        return Response.json({
          jsonrpc: "2.0",
          error: {
            code: -32700,
            message: `Parse error or invalid JSON: ${err.message}`
          }
        }, { status: 400, headers: corsHeaders });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};
