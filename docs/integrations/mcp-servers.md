# Advanced MCP Integrations

Loragent is fully compatible with the Model Context Protocol (MCP), allowing you to expand your agent's capabilities instantly.

## Built-in Configs

We provide pre-configured integrations for the most powerful developer tools:

### Composio Toolkits
Integrate with over 100+ services including GitHub, Jira, and Slack.
- **Location**: `src/mcp/configs/composio.json`
- **Setup**: Requires `COMPOSIO_API_KEY` in your environment or via `/secure-cred-vault`.

### Firecrawl
Advanced web scraping and data extraction suitable for RAG and research agents.
- **Location**: `src/mcp/configs/firecrawl.json`
- **Setup**: Requires `FIRECRAWL_API_KEY`.

### Frontend Design MCP
An Anthropic-sponsored MCP for advanced UI/UX tasks and Figma integrations.
- **Location**: `src/mcp/configs/frontend-design.json`
- **Setup**: Ready to use out of the box.

## How to Load

To start an agent with these MCPs, pass the configuration directory to your Loragent initialization script:

```bash
loragent start --mcp-dir src/mcp/configs/
```
