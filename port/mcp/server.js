#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import os from "os";
import { executeCLI } from "../../sdk/tools/cli-runner.js";
import { LoragentCheckpointEngine } from "../../sdk/durable/checkpoint.js";

// Initialize the Loragent MCP Server
const server = new McpServer({
    name: "Loragent-MCP-Server",
    version: "1.0.0"
});

const checkpointer = new LoragentCheckpointEngine();

// Tool: loragent_exec_cli (Safe CLI execution with auto vault credentials for wrangler, gh, docker, git)
server.tool(
    "loragent_exec_cli",
    "Safely execute CLI tools (wrangler, gh, git, npm, docker) with zero-trust auto-credential vault injection.",
    {
        command: z.string().describe("The shell command to execute (e.g., 'wrangler deploy', 'gh pr list', 'git status')"),
        allowDestructive: z.boolean().optional().describe("Set true to authorize dangerous or destructive operations")
    },
    async ({ command, allowDestructive }) => {
        try {
            const res = await executeCLI(command, { allowDestructive });
            return {
                isError: !res.ok,
                content: [{
                    type: "text",
                    text: `Command: ${command}\nExit Code: ${res.code}\n\nSTDOUT:\n${res.stdout}\n\nSTDERR:\n${res.stderr}`
                }]
            };
        } catch (err) {
            return {
                isError: true,
                content: [{
                    type: "text",
                    text: `Execution Error: ${err.message}`
                }]
            };
        }
    }
);

// Tool: loragent_steer
server.tool(
    "loragent_steer",
    "Formally pass context and payloads to the next agent in the dynamic formation pipeline.",
    {
        targetAgent: z.string().describe("The name of the agent to steer this task towards (e.g., loragent-frontend-se)"),
        payload: z.string().describe("The context or instructions to pass to the target agent"),
    },
    async ({ targetAgent, payload }) => {
        const stateFile = path.join(process.cwd(), '.loragent', 'state.json');
        
        let state = { currentAgent: 'loragent-boss', history: [] };
        if (fs.existsSync(stateFile)) {
            try {
                state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
            } catch (e) {}
        }
        
        state.history.push({
            from: state.currentAgent,
            to: targetAgent,
            timestamp: new Date().toISOString(),
            payload: payload
        });
        
        state.currentAgent = targetAgent;
        
        const dir = path.dirname(stateFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));

        return {
            content: [{
                type: "text",
                text: `Successfully steered execution to ${targetAgent}. The workflow manager has been notified.`
            }]
        };
    }
);

// Tool: loragent_trigger_hook
server.tool(
    "loragent_trigger_hook",
    "Trigger local workspace lifecycle hooks like pre-commit, deploy-retry, or check-done.",
    {
        hookName: z.string().describe("The name of the hook to trigger (e.g., pre-commit, deploy-retry, check-done)")
    },
    async ({ hookName }) => {
        const { execSync } = await import('child_process');
        const shPath = path.join(process.cwd(), '.agents', 'hooks', `${hookName}.sh`);
        const jsPath = path.join(process.cwd(), '.agents', 'hooks', `${hookName}.js`);
        
        let targetScript = null;
        let command = '';

        if (fs.existsSync(jsPath)) {
            targetScript = jsPath;
            command = `node "${jsPath}"`;
        } else if (fs.existsSync(shPath)) {
            targetScript = shPath;
            command = `bash "${shPath}"`;
        }

        if (targetScript) {
            try {
                const output = execSync(command, { encoding: 'utf8' });
                return {
                    content: [{
                        type: "text",
                        text: `✅ Hook '${hookName}' executed successfully:\n\n${output}`
                    }]
                };
            } catch (err) {
                return {
                    isError: true,
                    content: [{
                        type: "text",
                        text: `❌ Hook '${hookName}' execution failed:\n\n${err.stdout || ''}\n${err.stderr || err.message}`
                    }]
                };
            }
        }
        return {
            content: [{
                type: "text",
                text: `Hook '${hookName}' registered (no local script found at .agents/hooks/${hookName}.[sh|js]).`
            }]
        };
    }
);

// Tool: loragent_get_state
server.tool(
    "loragent_get_state",
    "Read the current status of the Boss Mode workflow.",
    {},
    async () => {
        const stateFile = path.join(process.cwd(), '.loragent', 'state.json');
        if (fs.existsSync(stateFile)) {
            const state = fs.readFileSync(stateFile, 'utf8');
            return {
                content: [{
                    type: "text",
                    text: `Current Loragent State: \n${state}`
                }]
            };
        }
        return {
            content: [{
                type: "text",
                text: "No active state found. The Boss is waiting for a command."
            }]
        };
    }
);

// Tool: loragent_checkpoint_save
server.tool(
    "loragent_checkpoint_save",
    "Durable execution checkpoint saver for multi-step agent tasks.",
    {
        taskId: z.string().describe("The unique task identifier"),
        stepIndex: z.number().describe("The current step index"),
        state: z.string().describe("JSON stringified state object")
    },
    async ({ taskId, stepIndex, state }) => {
        try {
            const parsed = JSON.parse(state);
            const saved = await checkpointer.saveCheckpoint(taskId, stepIndex, parsed);
            return {
                content: [{
                    type: "text",
                    text: `Checkpoint saved successfully: ${saved.checkpointId}`
                }]
            };
        } catch (err) {
            return {
                isError: true,
                content: [{
                    type: "text",
                    text: `Failed to save checkpoint: ${err.message}`
                }]
            };
        }
    }
);

// Tool: loragent_watchman_save
server.tool(
    "loragent_watchman_save",
    "Save the current session context to the Watchman cache to allow uninterrupted execution recovery.",
    {
        currentTask: z.string().describe("The description of the current task being executed"),
        lastCompletedStep: z.string().describe("The last successful step completed"),
        nextStep: z.string().describe("The upcoming step that was about to be executed")
    },
    async ({ currentTask, lastCompletedStep, nextStep }) => {
        const watchmanFile = path.join(process.cwd(), '.loragent', 'watchman-cache.json');
        
        const cache = {
            timestamp: new Date().toISOString(),
            currentTask,
            lastCompletedStep,
            nextStep
        };
        
        const dir = path.dirname(watchmanFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(watchmanFile, JSON.stringify(cache, null, 2));

        return {
            content: [{
                type: "text",
                text: "Watchman cache successfully updated. Execution state is saved."
            }]
        };
    }
);

// Tool: loragent_summon_agent
server.tool(
    "loragent_summon_agent",
    "Dynamically load a specialized agent into the workspace on-demand.",
    {
        agentName: z.string().describe("The name of the agent to summon (e.g., react-specialist, 3d-designer)")
    },
    async ({ agentName }) => {
        const globalAgentPath = path.join(os.homedir(), '.loragent', 'master-roster', 'skills', agentName);
        const localAgentPath = path.join(process.cwd(), '.agents', 'skills', agentName);
        
        if (!fs.existsSync(globalAgentPath)) {
            return {
                content: [{
                    type: "text",
                    text: `Error: Agent ${agentName} not found in the global master roster at ${globalAgentPath}.`
                }]
            };
        }
        
        if (!fs.existsSync(localAgentPath)) {
            fs.cpSync(globalAgentPath, localAgentPath, { recursive: true });
        }

        return {
            content: [{
                type: "text",
                text: `Successfully summoned ${agentName} into the workspace. The Boss can now delegate to it.`
            }]
        };
    }
);

// Tool: loragent_dismiss_agent
server.tool(
    "loragent_dismiss_agent",
    "Remove a specialized agent from the active workspace to free up context (garbage collection).",
    {
        agentName: z.string().describe("The name of the agent to dismiss")
    },
    async ({ agentName }) => {
        const coreAgents = ["boss", "teacher", "spidernet", "watchman", "workspace-guard"];
        if (coreAgents.includes(agentName)) {
            return {
                content: [{
                    type: "text",
                    text: `Error: Cannot dismiss core operations agent: ${agentName}.`
                }]
            };
        }

        const localAgentPath = path.join(process.cwd(), '.agents', 'skills', agentName);
        if (fs.existsSync(localAgentPath)) {
            fs.rmSync(localAgentPath, { recursive: true, force: true });
            return {
                content: [{
                    type: "text",
                    text: `Successfully dismissed ${agentName} and cleaned up workspace context.`
                }]
            };
        }

        return {
            content: [{
                type: "text",
                text: `Agent ${agentName} is not currently in the workspace.`
            }]
        };
    }
);

// Tool: loragent_list_agents
server.tool(
    "loragent_list_agents",
    "List all agents in the Loragent ecosystem from the unified agent-index.json. Supports filtering by category, source, formation, and type.",
    {
        category: z.string().optional().describe("Filter by category (e.g., engineering, business, quality, creative, devops)"),
        source: z.string().optional().describe("Filter by source (e.g., native, lorapok-ai-agent, ide-skills, freqghost)"),
        formation: z.string().optional().describe("Filter by formation (e.g., auto-team, office, freelance, chela, all)"),
        type: z.string().optional().describe("Filter by type (e.g., core, specialist)")
    },
    async ({ category, source, formation, type }) => {
        const indexPath = path.join(process.cwd(), 'agent-index.json');
        if (!fs.existsSync(indexPath)) {
            const wsPath = process.env.LORAGENT_WORKSPACE
                ? path.join(process.env.LORAGENT_WORKSPACE, 'agent-index.json')
                : null;
            if (wsPath && fs.existsSync(wsPath)) {
                var indexData = JSON.parse(fs.readFileSync(wsPath, 'utf8'));
            } else {
                return {
                    content: [{
                        type: "text",
                        text: "Error: agent-index.json not found. Run `node scripts/sync-agents.js` to generate it."
                    }]
                };
            }
        } else {
            var indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        }

        let agents = indexData.agents;

        if (category) agents = agents.filter(a => a.category === category);
        if (source) agents = agents.filter(a => a.source === source);
        if (formation) agents = agents.filter(a => a.formation === formation);
        if (type) agents = agents.filter(a => a.type === type);

        const summary = agents.map(a =>
            `${a.name} [${a.category}/${a.formation}] — ${a.description}`
        ).join('\n');

        return {
            content: [{
                type: "text",
                text: `Loragent Agent Index (${agents.length}/${indexData.statistics.totalAgents} agents):\n\n${summary}\n\nStatistics: ${JSON.stringify(indexData.statistics, null, 2)}`
            }]
        };
    }
);

// Tool: loragent_search_agents
server.tool(
    "loragent_search_agents",
    "Search for agents by keyword across name, description, and category.",
    {
        query: z.string().describe("Search keyword to match against agent names, descriptions, and categories")
    },
    async ({ query }) => {
        const indexPath = path.join(process.cwd(), 'agent-index.json');
        const wsPath = process.env.LORAGENT_WORKSPACE
            ? path.join(process.env.LORAGENT_WORKSPACE, 'agent-index.json')
            : null;

        let indexData;
        if (fs.existsSync(indexPath)) {
            indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        } else if (wsPath && fs.existsSync(wsPath)) {
            indexData = JSON.parse(fs.readFileSync(wsPath, 'utf8'));
        } else {
            return {
                content: [{
                    type: "text",
                    text: "Error: agent-index.json not found."
                }]
            };
        }

        const q = query.toLowerCase();
        const results = indexData.agents.filter(a =>
            a.name.toLowerCase().includes(q) ||
            (a.description || '').toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q)
        );

        if (results.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: `No agents found matching "${query}".`
                }]
            };
        }

        const summary = results.map(a =>
            `• ${a.name} [${a.type}/${a.category}/${a.source}] — ${a.description}`
        ).join('\n');

        return {
            content: [{
                type: "text",
                text: `Found ${results.length} agents matching "${query}":\n\n${summary}`
            }]
        };
    }
);

// Start the server using stdio transport
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
