"""
Loragent Python SDK — Universal Multi-Agent Ecosystem for Lorapok Labs.
Hub-and-Spoke topology with MCP lazy-loading, formations, and crash recovery.
"""

__version__ = "2.0.0"
__author__ = "Lorapok Labs"

from .client import LoragentClient
from .installer import install_officers, sync_skills

__all__ = [
    "__version__",
    "__author__",
    "LoragentClient",
    "install_officers",
    "sync_skills"
]
