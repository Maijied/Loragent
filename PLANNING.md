# Loragent Planning & Roadmap

## Future Project Planning

### Phase 2: Advanced Routing & LLDP Full Integration
- Deep integration of the Lorapok Labs Design Pattern (LLDP). 
- Expanding the `lore/` domain layer to support fully decoupled unit tests of the routing logic.
- Support for distributed agent swarms across local and remote devices.

### Phase 3: Cross-Agent Memory (Firebase Loop)
- Implement Firebase-backed memory so that lessons learned by `loragent-bug-hunter` can be immediately applied by `loragent-frontend-se`.
- Expand the Spidernet workflow coordinator to auto-recover from multi-step tool failures.

## Publishing Planning

### Goal: Ubiquity Across Agent Platforms
Loragent is designed to be framework-agnostic. We will publish it to multiple registries:

1. **NPM Registry**: Publish the core engine and MCP server as `@lorapok/loragent`. This enables `npx -y @lorapok/loragent` to boot the daemon instantly.
2. **PIP (PyPI)**: Expose the core tools via Python bindings for data-science workflows.
3. **Homebrew**: `brew tap lorapok/loragent && brew install loragent` for system-wide native CLI availability.

### Ecosystem Integration
- **Cursor / Claude Code**: Direct support as an MCP extension. The user can simply add `npx @lorapok/loragent-mcp` to their cursor config.
- **Lorapok Atlas**: All 108 agent configurations and SKILL.md specs will be synced to the Atlas API Directory for automatic discovery.
