# Loragent Architecture

The following diagram illustrates the flow and hierarchy of the Loragent Ecosystem, featuring Boss Mode orchestration, Spidernet Multi-Agent Routing, the 4 Formation Modes, and the Firebase Self-Improvement Loop.

```mermaid
flowchart TD
    %% Core Inputs
    User(["Human User / Developer"])
    Teacher["loragent-teacher\n(Prompt Clarification)"]
    Boss{"loragent-boss\n(Central Orchestrator)"}
    Spidernet{"loragent-spidernet\n(Multi-Agent Coordinator)"}

    %% Formation Modes (The 4 Squads)
    subgraph FormationEngine ["Dynamic Formation Engine"]
        AutoTeam["Auto Team Formation\n(Standard Engineering)"]
        Office["Office Formation\n(Business / Marketing)"]
        Freelance["Freelance Formation\n(Single Task Execution)"]
        Chela["Chela Formation\n(Aggressive Bug Hunting)"]
    end

    %% Key Agents for Auto Team
    subgraph AutoTeamAgents ["Engineering Squad (108 Agents Total)"]
        TechDir["loragent-tech-director"]
        Backend["loragent-backend-se"]
        Frontend["loragent-frontend-se"]
        QA["loragent-sqa"]
        DevOps["loragent-devops"]
    end

    %% Key Agents for Office
    subgraph OfficeAgents ["Business Squad"]
        PM["loragent-project-coordinator"]
        Marketing["loragent-marketing-strategy-manager"]
        Publisher["loragent-publisher"]
    end

    %% Single / Chela Agents
    SoloAgent["Specialist Agents\n(Lazy-Loaded on Demand)"]
    ChelaSquad["Chela Squad\n(Bug Hunter + Shift Engineer)"]

    %% Global Cache
    subgraph GlobalCache ["Global Master Roster (~/.loragent)"]
        LazyAgents["103 Specialized Agents\n(Stored Globally)"]
    end

    %% MCP Server & Communication
    subgraph MCPServer ["Loragent Native MCP Server"]
        Steer["loragent_steer()"]
        Hook["loragent_trigger_hook()"]
        State["loragent_get_state()"]
        Watchman["loragent_watchman_save()"]
        Summon["loragent_summon_agent()\n(Lazy Loading)"]
        Dismiss["loragent_dismiss_agent()\n(Garbage Collection)"]
    end

    %% Self Improvement Loop
    subgraph FirebaseLoop ["Self-Improvement Loop"]
        GoldCollector["loragent-gold-collector\n(Idea Extraction)"]
        SkillCreator["loragent-skill-creator\n(Agent Persona Generation)"]
        DBUpdater["loragent-database-updater\n(Sync to DB)"]
        Firebase[("Global Hivemind\n(Firebase DB)")]
    end
    
    %% Connections
    User -- "Task / Prompt" --> Teacher
    Teacher -- "Clarified Requirements" --> Boss
    
    Boss -- "Complex Multi-Agent Task" --> Spidernet
    Spidernet -- "Routes Parallel Topology" --> FormationEngine
    Boss -- "Standard Task" --> FormationEngine
    
    Boss -. "Summons Specialist" .-> Summon
    Summon -. "Fetches SKILL.md" .-> LazyAgents
    LazyAgents -. "Injects to Workspace" .-> AutoTeamAgents
    
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

    %% Firebase Loop Connections
    Boss -- "Monitors Workflow" --> GoldCollector
    GoldCollector -- "Extracts & Scrubs Novelty" --> SkillCreator
    SkillCreator -- "Generates SKILL.md" --> DBUpdater
    DBUpdater -- "Syncs Knowledge" --> Firebase
    Firebase -. "Queries Memory" .-> Boss

    %% Styling
    classDef primary fill:#4A90E2,stroke:#333,stroke-width:2px,color:#fff;
    classDef secondary fill:#50E3C2,stroke:#333,stroke-width:2px,color:#000;
    classDef db fill:#F5A623,stroke:#333,stroke-width:2px,color:#000;
    classDef sp fill:#D0021B,stroke:#333,stroke-width:2px,color:#fff;

    class Boss,Teacher primary;
    class Spidernet sp;
    class AutoTeam,Office,Freelance,Chela secondary;
    class Firebase db;
```
