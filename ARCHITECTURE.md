# 🏗️ Loragent Ecosystem Architecture

The following diagram illustrates the flow and hierarchy of the Loragent Ecosystem, featuring Boss Mode orchestration, Spidernet Multi-Agent Routing, the 4 Formation Modes, Chorki Autopilot Verification Loop, Cloudflare Edge MCP, and the LLDP 5-Layer Framework.

```mermaid
flowchart TD
    %% Core Inputs
    User(["Human User / Developer"])
    Teacher["loragent-teacher\n(Prompt Clarification)"]
    Boss{"loragent-boss\n(Central Orchestrator)"}
    Spidernet{"loragent-spidernet\n(Multi-Agent Coordinator)"}
    Chorki{"loragent-chorki\n(Autopilot Continuous Loop)"}

    %% LLDP 5 Layers
    subgraph LLDP ["Lorapok Labs Design Pattern (LLDP)"]
        FACE["FACE: CLI & UI\n(Commander.js)"]
        PULSE["PULSE: State Daemon\n(StateWatcher)"]
        LORE["LORE: Model Intelligence\n(Agent Registry)"]
        PORT["PORT: Edge & Stdio MCP\n(Cloudflare Workers)"]
        LOOM["LOOM: Workflows & DI\n(Hooks & Steering)"]
    end

    %% Formation Modes (The 4 Squads)
    subgraph FormationEngine ["Dynamic Formation Engine"]
        AutoTeam["Auto Team Formation\n(Standard Engineering)"]
        Office["Office Formation\n(Business / Marketing)"]
        Freelance["Freelance Formation\n(Single Task Execution)"]
        Chela["Chela Formation\n(Aggressive Bug Hunting)"]
    end

    %% Key Agents for Auto Team
    subgraph AutoTeamAgents ["Engineering Squad (167 Agents Total)"]
        TechDir["loragent-tech-director"]
        Backend["loragent-backend-se"]
        Frontend["loragent-frontend-se"]
        QA["loragent-sqa"]
        DevOps["loragent-devops"]
        CICD["loragent-cicd-specialist"]
    end

    %% Key Agents for Office
    subgraph OfficeAgents ["Business Squad"]
        PM["loragent-project-coordinator"]
        Marketing["loragent-marketing-strategy-manager"]
        Publisher["loragent-publisher"]
        PR["loragent-pr-specialist"]
    end

    %% Single / Chela Agents
    SoloAgent["Specialist Agents\n(140+ Domain Experts)"]
    ChelaSquad["Chela Squad\n(Bug Hunter + Shift Engineer + Inspector)"]

    %% Global Cache & Cloud MCP
    subgraph GlobalCloud ["Global Edge & Master Roster"]
        CloudMCP["Cloudflare Edge MCP\n(https://mcp.lorapk-labs.workers.dev/mcp)"]
        LocalRoster["Global Master Roster\n(~/.loragent/master-roster/)"]
    end

    %% MCP Server & Communication
    subgraph MCPServer ["Loragent Native MCP Tools"]
        Steer["loragent_steer()"]
        Hook["loragent_trigger_hook()\n(check-done)"]
        State["loragent_get_state()"]
        Watchman["loragent_watchman_save()"]
        Summon["loragent_summon_agent()"]
        Dismiss["loragent_dismiss_agent()"]
    end

    %% Connections
    User -- "Task / Prompt" --> Teacher
    Teacher -- "Clarified Requirements" --> Boss
    
    Boss -- "Complex Multi-Agent Task" --> Spidernet
    Spidernet -- "Routes Parallel Topology" --> FormationEngine
    Boss -- "Standard Task" --> FormationEngine
    Boss -- "Autonomous Continuous Run" --> Chorki
    
    Chorki -- "Iterates Until Verified" --> Hook
    Boss -. "Summons Specialist" .-> Summon
    Summon -. "Fetches SKILL.md" .-> LocalRoster
    LocalRoster -. "Injects to Workspace" .-> AutoTeamAgents
    
    AutoTeam --> AutoTeamAgents
    Office --> OfficeAgents
    Freelance --> SoloAgent
    Chela --> ChelaSquad

    %% MCP Connections
    AutoTeamAgents -. "Handoff Context" .-> Steer
    OfficeAgents -. "Handoff Context" .-> Steer
    SoloAgent -. "Handoff Context" .-> Steer
    ChelaSquad -. "Handoff Context" .-> Steer
    
    Steer -. "Routes Data" .-> Boss
    Boss -. "Context Cleared" .-> Dismiss

    %% Styling
    classDef primary fill:#4A90E2,stroke:#333,stroke-width:2px,color:#fff;
    classDef secondary fill:#50E3C2,stroke:#333,stroke-width:2px,color:#000;
    classDef lldp fill:#9013FE,stroke:#333,stroke-width:2px,color:#fff;
    classDef sp fill:#D0021B,stroke:#333,stroke-width:2px,color:#fff;

    class Boss,Teacher primary;
    class Spidernet,Chorki sp;
    class AutoTeam,Office,Freelance,Chela secondary;
    class FACE,PULSE,LORE,PORT,LOOM lldp;
```
