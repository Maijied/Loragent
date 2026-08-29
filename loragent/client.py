"""
Loragent Python SDK Client
"""

import os
import json
import urllib.request
import urllib.error

DEFAULT_ENDPOINT = "https://loragent.lorapok.tech"
DEFAULT_MCP_ENDPOINT = "https://mcp.lorapk-labs.workers.dev"

FORMATIONS = [
    "auto",
    "office",
    "chela",
    "freelance",
    "observer",
    "spidernet"
]

class LoragentClient:
    """Client for querying the Loragent catalog, formations, and edge MCP servers."""

    def __init__(self, endpoint=None, mcp_endpoint=None):
        self.endpoint = (endpoint or os.environ.get("LORAGENT_ENDPOINT") or DEFAULT_ENDPOINT).rstrip("/")
        self.mcp_endpoint = (mcp_endpoint or os.environ.get("LORAGENT_MCP_ENDPOINT") or DEFAULT_MCP_ENDPOINT).rstrip("/")

    def get_formations(self):
        """Returns list of supported multi-agent squad formations."""
        return list(FORMATIONS)

    def get_catalog(self):
        """Fetches the canonical Loragent catalog registry."""
        url = f"{self.endpoint}/registry/marketplace.json"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Loragent-Python-SDK/2.0.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status == 200:
                    return json.loads(resp.read().decode("utf-8"))
        except Exception:
            pass
        return {"totalItems": 257, "agentsCount": 224, "mcpCount": 20}

    def health_check(self):
        """Checks Edge MCP server health."""
        url = f"{self.mcp_endpoint}/health"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Loragent-Python-SDK/2.0.0"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                return resp.status == 200
        except Exception:
            return False
