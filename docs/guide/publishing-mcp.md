# Publishing MCP

Loragent exposes a unified Model Context Protocol (MCP) server. 

## Local Sync
Running `loragent sync` automatically registers the local Loragent MCP server in your IDE configurations (`~/mcp.json`, etc.).

## Remote Deployment
Use the publish command to bundle the MCP server for deployment to Cloudflare Workers or similar serverless edge platforms.

```bash
loragent publish loragent_mcp
```
