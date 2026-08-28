# LLDP Architecture

Loragent uses the **LLDP** (Lorapok Labs Design Pattern).

- **FACE (UI/CLI/API):** The surface layer. Handles all `loragent` CLI commands and terminal I/O.
- **PULSE (Lifecycle/State):** Manages agent state, memory, and task loops.
- **LORE (Domain Models/Services):** The core business logic. Parsers, URL Ingestion, PC Discovery, and Models.
- **PORT (Integrations/MCP):** External connections. The unified MCP server lives here.
- **LOOM (Orchestration):** Complex multi-agent workflows and event fabrics.
