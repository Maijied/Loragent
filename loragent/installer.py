"""
Loragent Skill & Officer Installer
"""

import os
import sys
import shutil

CORE_AGENTS = ["boss", "teacher", "spidernet", "watchman", "workspace-guard"]

def install_officers(target_dir=None, global_mode=False):
    """Installs Core or Global Loragent officers and LLDP specifications."""
    target_project_root = target_dir or os.getcwd()
    target_agents_dir = os.path.join(target_project_root, ".agents", "skills")
    target_rules_dir = os.path.join(target_project_root, ".agents")
    target_rules_file = os.path.join(target_rules_dir, "AGENTS.md")

    global_roster_dir = os.path.join(os.path.expanduser("~"), ".loragent", "master-roster", "skills")

    print("🤖 Installing Loragent Officers & LLDP Skills...")
    print(f"📁 Local Workspace: {target_project_root}")
    print(f"🌐 Global Master Roster: {global_roster_dir}")

    os.makedirs(target_agents_dir, exist_ok=True)
    os.makedirs(target_rules_dir, exist_ok=True)
    os.makedirs(global_roster_dir, exist_ok=True)

    # Search for packaged skills in package location
    package_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    skills_dir = os.path.join(package_root, "skills")
    agents_dir = os.path.join(package_root, "agents")

    source_dir = skills_dir if os.path.exists(skills_dir) else agents_dir
    if os.path.exists(source_dir):
        for agent in os.listdir(source_dir):
            agent_path = os.path.join(source_dir, agent)
            if os.path.isdir(agent_path):
                global_agent_path = os.path.join(global_roster_dir, agent)
                os.makedirs(global_agent_path, exist_ok=True)
                for file in os.listdir(agent_path):
                    src = os.path.join(agent_path, file)
                    dst = os.path.join(global_agent_path, file)
                    if os.path.isfile(src):
                        shutil.copy2(src, dst)

                if agent in CORE_AGENTS or global_mode:
                    target_agent_path = os.path.join(target_agents_dir, agent)
                    os.makedirs(target_agent_path, exist_ok=True)
                    for file in os.listdir(agent_path):
                        src = os.path.join(agent_path, file)
                        dst = os.path.join(target_agent_path, file)
                        if os.path.isfile(src):
                            shutil.copy2(src, dst)
                    print(f"  ✓ Injected agent: {agent}")

    print("✨ Installation complete. Loragent Ecosystem is ready.")
    return True

def sync_skills():
    """CLI helper to sync skills to current workspace."""
    return install_officers(os.getcwd())

def main():
    """CLI entrypoint for install-officers."""
    install_officers()

if __name__ == "__main__":
    main()
