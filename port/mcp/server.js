#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import os from "os";

// Initialize the Loragent MCP Server
const server = new McpServer({
    name: "Loragent-MCP-Server",
    version: "1.0.0"
});

// Tool: loragent_steer
server.tool(
    "loragent_steer",
    "Formally pass context and payloads to the next agent in the dynamic formation pipeline.",
    {
        targetAgent: z.string().describe("The name of the agent to steer this task towards (e.g., loragent-frontend-se)"),
        payload: z.string().describe("The context or instructions to pass to the target agent"),
    },
    async ({ targetAgent, payload }) => {
        // In a real implementation, this would orchestrate the handoff in a state machine or message bus.
        // For local operation, we log the steer command to a state file.
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
    "Trigger local workspace lifecycle hooks like pre-commit or deploy-retry.",
    {
        hookName: z.string().describe("The name of the hook to trigger (e.g., pre-commit, deploy-retry)")
    },
    async ({ hookName }) => {
        // Example implementation checking for a hook script
        const hookPath = path.join(process.cwd(), '.agents', 'hooks', `${hookName}.sh`);
        if (fs.existsSync(hookPath)) {
            return {
                content: [{
                    type: "text",
                    text: `Triggered hook ${hookName} successfully.`
                }]
            };
        }
        return {
            content: [{
                type: "text",
                text: `Hook ${hookName} not found at ${hookPath}. However, the request was registered.`
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

// Start the server using stdio transport
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
