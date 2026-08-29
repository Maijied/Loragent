"""
Loragent CLI (Python Interface)
"""

import sys
import argparse
from .installer import install_officers
from .client import LoragentClient, FORMATIONS

def main():
    parser = argparse.ArgumentParser(
        prog="loragent",
        description="Loragent — Universal Multi-Agent Ecosystem for Lorapok Labs (Python CLI)"
    )
    parser.add_argument("--version", "-v", action="version", version="loragent 2.0.0")

    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: install
    install_parser = subparsers.add_parser("install", help="Install Loragent core officers and skills")
    install_parser.add_argument("--global", "-g", dest="global_mode", action="store_true", help="Install full global roster")

    # Command: formations
    subparsers.add_parser("formations", help="List active multi-agent squad formations")

    # Command: health
    subparsers.add_parser("health", help="Check Cloudflare Edge MCP health")

    # Command: boss
    boss_parser = subparsers.add_parser("boss", help="Orchestrate multi-agent workflow")
    boss_parser.add_argument("formation", choices=FORMATIONS, nargs="?", default="auto", help="Formation squad matrix")
    boss_parser.add_argument("prompt", nargs="*", help="Task description or goal")

    args = parser.parse_args()

    client = LoragentClient()

    if args.command == "install":
        install_officers(global_mode=getattr(args, "global_mode", False))
    elif args.command == "formations":
        print("🤖 Loragent 6 Multi-Agent Formations:")
        for f in FORMATIONS:
            print(f"  • {f.upper()}")
    elif args.command == "health":
        status = client.health_check()
        print(f"Edge MCP Health ({client.mcp_endpoint}/health): {'🟢 LIVE' if status else '🔴 UNREACHABLE'}")
    elif args.command == "boss":
        task_str = " ".join(args.prompt) if args.prompt else "Default Workflow"
        print(f"⚡ Loragent Boss activated with formation: [{args.formation.upper()}]")
        print(f"📋 Task: {task_str}")
        print(f"🌐 Portal: {client.endpoint}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
