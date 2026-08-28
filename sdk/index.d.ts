export interface LoragentClientOptions {
  endpoint?: string;
  url?: string;
  token?: string;
  workspace?: string;
  timeout?: number;
}

export interface AgentFilterOptions {
  category?: string;
  formation?: string;
  type?: 'core' | 'specialist';
  source?: string;
}

export interface AgentSummary {
  name: string;
  slug: string;
  type: string;
  source: string;
  category: string;
  formation: string;
  description: string;
}

export interface AgentListResult {
  content: Array<{ type: string; text: string }>;
}

export interface SteerResult {
  content: Array<{ type: string; text: string }>;
}

export interface HookResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

export interface WatchmanCacheResult {
  content: Array<{ type: string; text: string }>;
}

export interface HealthResult {
  status: string;
  service: string;
  version: string;
  totalAgents: number;
  timestamp: string;
}

export declare class LoragentClient {
  constructor(options?: LoragentClientOptions);
  listAgents(filters?: AgentFilterOptions): Promise<AgentListResult>;
  searchAgents(query: string): Promise<AgentListResult>;
  summonAgent(agentName: string): Promise<AgentListResult>;
  dismissAgent(agentName: string): Promise<AgentListResult>;
  steer(targetAgent: string, payload: string | object): Promise<SteerResult>;
  triggerHook(hookName: string): Promise<HookResult>;
  getState(): Promise<AgentListResult>;
  saveWatchman(currentTask: string, lastCompletedStep: string, nextStep: string): Promise<WatchmanCacheResult>;
  health(): Promise<HealthResult>;
}

export declare class LoragentBoss {
  constructor(options?: LoragentClientOptions | { client: LoragentClient });
  initAutoTeam(projectContext: string): Promise<{
    formation: string;
    lead: string;
    team: string[];
    status: string;
  }>;
  initOffice(initiative: string): Promise<{
    formation: string;
    lead: string;
    team: string[];
    status: string;
  }>;
  initChela(errorOrRca: string): Promise<{
    formation: string;
    lead: string;
    team: string[];
    status: string;
  }>;
  delegate(agentName: string, task: string | object): Promise<SteerResult>;
}

export declare class LoragentChorki {
  constructor(options?: LoragentClientOptions | { client?: LoragentClient; maxIterations?: number });
  runLoop(objective: string, options?: {
    maxIterations?: number;
    hook?: string;
    onProgress?: (event: { iteration: number; max: number; status: string; objective?: string; message?: string; error?: string }) => void;
  }): Promise<{
    success: boolean;
    iterations: number;
    objective: string;
    lastError?: string;
  }>;
}

export declare const Formations: {
  AUTO_TEAM: 'auto-team';
  OFFICE: 'office';
  FREELANCE: 'freelance';
  CHELA: 'chela';
  ALL: 'all';
};

export declare const Categories: Record<string, string>;
export declare const CoreAgents: Record<string, string>;
export declare const LifecycleHooks: Record<string, string>;
export declare const CLOUDFLARE_MCP_DEFAULT_URL: string;
