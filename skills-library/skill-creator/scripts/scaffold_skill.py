import argparse
import os
from pathlib import Path

def create_skill(name, description):
    # Definir ruta base: .agent/skills/<name>
    # Asumimos que se corre desde la raíz del workspace o ajustamos ruta relativa
    # Mejor usar ruta relativa a .agent/skills si existe
    
    # Definir ruta base: ~/.gemini/antigravity/skills (Global)
    base_skills_dir = Path.home() / ".gemini" / "antigravity" / "skills"
    
    if not base_skills_dir.exists():
         try:
             os.makedirs(base_skills_dir, exist_ok=True)
         except Exception as e:
             print(f"Error creating global skills directory: {e}")
             return

    skill_dir = base_skills_dir / name
    
    if skill_dir.exists():
        print(f"Error: Skill '{name}' already exists at {skill_dir}")
        return

    print(f"Creating skill '{name}' at {skill_dir}...")
    
    # Crear directorios
    os.makedirs(skill_dir, exist_ok=True)
    os.makedirs(skill_dir / "scripts", exist_ok=True)
    os.makedirs(skill_dir / "resources", exist_ok=True)
    
    # Crear SKILL.md
    skill_md_content = f"""---
description: {description}
---

# {name.replace('-', ' ').title()}

## Purpose
{description}

## Instructions
1.  [Step 1]
2.  [Step 2]

## Constraints
- [Constraints]
"""
    (skill_dir / "SKILL.md").write_text(skill_md_content, encoding="utf-8")
    
    print(f"Skill '{name}' created successfully!")
    print(f"Path: {skill_dir}")
    print(f"Remember to edit SKILL.md to add specific instructions.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scaffold a new Antigravity skill.")
    parser.add_argument("--name", required=True, help="Name of the skill (kebab-case)")
    parser.add_argument("--description", required=True, help="Short description of the skill")
    
    args = parser.parse_args()
    create_skill(args.name, args.description)
