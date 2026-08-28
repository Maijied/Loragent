#!/usr/bin/env python3

import os
import sys
import shutil

CORE_AGENTS = ["boss", "teacher", "spidernet", "watchman", "workspace-guard"]

def main():
    target_project_root = os.getcwd()
    package_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    target_agents_dir = os.path.join(target_project_root, '.agents', 'skills')
    target_rules_dir = os.path.join(target_project_root, '.agents')
    target_rules_file = os.path.join(target_rules_dir, 'AGENTS.md')

    # Global Roster path
    global_roster_dir = os.path.join(os.path.expanduser('~'), '.loragent', 'master-roster', 'skills')

    print(f"Installing Loragent Officers...")
    print(f"Global Master Roster: {global_roster_dir}")
    print(f"Local Workspace Core: {target_project_root}")

    # Ensure target directories exist
    os.makedirs(target_agents_dir, exist_ok=True)
    os.makedirs(target_rules_dir, exist_ok=True)
    os.makedirs(global_roster_dir, exist_ok=True)

    # Copy Skills (Agents)
    agents_dir = os.path.join(package_root, 'agents')
    if os.path.exists(agents_dir):
        for agent in os.listdir(agents_dir):
            agent_path = os.path.join(agents_dir, agent)
            
            if os.path.isdir(agent_path):
                # 1. ALWAYS copy to Global Roster
                global_agent_path = os.path.join(global_roster_dir, agent)
                os.makedirs(global_agent_path, exist_ok=True)
                for file in os.listdir(agent_path):
                    src_file = os.path.join(agent_path, file)
                    dest_file = os.path.join(global_agent_path, file)
                    if os.path.isfile(src_file):
                        shutil.copy2(src_file, dest_file)
                
                # 2. ONLY copy Core Agents to Local Workspace
                if agent in CORE_AGENTS:
                    target_agent_path = os.path.join(target_agents_dir, agent)
                    os.makedirs(target_agent_path, exist_ok=True)
                    for file in os.listdir(agent_path):
                        src_file = os.path.join(agent_path, file)
                        dest_file = os.path.join(target_agent_path, file)
                        if os.path.isfile(src_file):
                            shutil.copy2(src_file, dest_file)
                    print(f"Injected CORE agent: {agent}")
                else:
                    print(f"Cached GLOBAL agent: {agent} (Ready for lazy-loading)")

    # Copy/Append Rules
    rules_file = os.path.join(package_root, 'rules', 'AGENTS.md')
    if os.path.exists(rules_file):
        with open(rules_file, 'r', encoding='utf-8') as f:
            rule_content = f.read()
        
        # Check if it already exists to append, or create new
        if os.path.exists(target_rules_file):
            with open(target_rules_file, 'r', encoding='utf-8') as f:
                existing_content = f.read()
            if 'Loragent - Dynamic Formation & Self-Improvement Rules' not in existing_content:
                with open(target_rules_file, 'a', encoding='utf-8') as f:
                    f.write(f"\n\n{rule_content}")
                print('Appended Loragent rules to existing AGENTS.md')
            else:
                # Overwrite AGENTS.md to ensure the latest lazy-loading rules are applied
                with open(target_rules_file, 'w', encoding='utf-8') as f:
                    f.write(rule_content)
                print('Updated AGENTS.md with latest Loragent rules')
        else:
            with open(target_rules_file, 'w', encoding='utf-8') as f:
                f.write(rule_content)
            print('Created AGENTS.md with Loragent rules')

    print("\n=========================================")
    print("        Loragent MCP Server Setup          ")
    print("=========================================")
    print("To enable dynamic steering, hooks, and state management,")
    print("add the Loragent MCP server to your AI IDE config.")
    print(f"Command: node {os.path.join(package_root, 'src', 'mcp', 'server.js')}")
    print("=========================================\n")

    print('Installation Complete. Your Virtual Office is ready.')

if __name__ == '__main__':
    main()
