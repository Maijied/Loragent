import { LoragentClient } from './client.js';
import { CoreAgents, Formations } from './constants.js';

/**
 * LoragentBoss — Supreme Orchestrator API
 * Automates Auto Team, Office, Freelance, and Chela formations.
 */
export class LoragentBoss {
  constructor(options = {}) {
    this.client = options.client instanceof LoragentClient ? options.client : new LoragentClient(options);
  }

  /**
   * Initialize Auto Team Matrix for software engineering
   */
  async initAutoTeam(projectContext) {
    await this.client.steer(CoreAgents.TECH_DIRECTOR, `Initialize architecture for: ${projectContext}`);
    return {
      formation: Formations.AUTO_TEAM,
      lead: CoreAgents.TECH_DIRECTOR,
      team: [
        CoreAgents.TECH_DIRECTOR,
        CoreAgents.BACKEND_SE,
        CoreAgents.FRONTEND_SE,
        CoreAgents.SQA,
        CoreAgents.CICD_SPECIALIST
      ],
      status: 'INITIALIZED'
    };
  }

  /**
   * Initialize Enterprise Office Matrix for business operations
   */
  async initOffice(initiative) {
    await this.client.steer('loragent-project-coordinator', `Coordinate launch initiative: ${initiative}`);
    return {
      formation: Formations.OFFICE,
      lead: 'loragent-project-coordinator',
      team: [
        'loragent-project-coordinator',
        'loragent-project-manager',
        'loragent-marketing-strategy-manager',
        'loragent-publisher',
        'loragent-pr-specialist',
        'loragent-sales-executive'
      ],
      status: 'INITIALIZED'
    };
  }

  /**
   * Initialize Chela Debugging Protocol for mission-critical bug hunting
   */
  async initChela(errorOrRca) {
    await this.client.steer(CoreAgents.BUG_HUNTER, `Troubleshoot and fix: ${errorOrRca}`);
    return {
      formation: Formations.CHELA,
      lead: CoreAgents.BUG_HUNTER,
      team: [
        CoreAgents.BUG_HUNTER,
        'loragent-shift-engineer',
        'loragent-git-specialist',
        'loragent-debugger',
        'loragent-inspector'
      ],
      status: 'HUNTING'
    };
  }

  /**
   * Delegate a specific task to a specialized agent
   */
  async delegate(agentName, task) {
    await this.client.summonAgent(agentName);
    return this.client.steer(agentName, task);
  }
}
