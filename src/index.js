/**
 * Loragent Officers - Main Entry
 * Exposes core Steer and Hooks logic for inter-agent communication.
 */

class LoragentOrchestrator {
    constructor() {
        this.officeState = {
            currentTask: null,
            assignedAgent: 'lorapok-client',
            history: []
        };
    }

    /**
     * Steer the workflow to the next agent.
     * @param {string} fromAgent 
     * @param {string} toAgent 
     * @param {object} payload 
     */
    steer(fromAgent, toAgent, payload) {
        console.log(`[STEER] Hand-off from ${fromAgent} -> ${toAgent}`);
        this.officeState.history.push({ fromAgent, toAgent, timestamp: new Date(), payload });
        this.officeState.assignedAgent = toAgent;
        this.officeState.currentTask = payload.taskSummary || null;
        
        // In a real environment, this would trigger an event or an MCP call 
        // to wake up the target agent.
        return this.officeState;
    }

    /**
     * Read the current state of the virtual office (MCP integration point)
     */
    getState() {
        return this.officeState;
    }
}

module.exports = LoragentOrchestrator;
