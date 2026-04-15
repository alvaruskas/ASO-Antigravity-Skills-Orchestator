---
description: Usa esta skill para crear nuevas skills o actualizar las existentes siguiendo el estándar Antigravity v4.x.
category: "🤖 IA & Agentes"
---

# Skill Creator

## Purpose
This skill automates the creation of new Antigravity skills, ensuring they follow the v4.x Structure-First standard. It generates the necessary directory structure and template files.

## Instructions
1.  **Understand the Request**: Identify the name and purpose of the skill the user wants to create.
2.  **Generate Scaffold**: Execute the scaffolding script with the skill name and description.
    ```bash
    python3 ~/.gemini/antigravity/skills/skill-creator/scripts/scaffold_skill.py --name "skill-name-kebab-case" --description "Short description"
    ```
3.  **Confirm & Customize**:
    - Confirm to the user that the skill structure has been created.
    - Ask the user for specific instructions or logic to populate the `SKILL.md` and scripts.

## Constraints
- **Naming**: Skill names must be in `kebab-case` (e.g., `git-commit-formatter`, not `GitCommitFormatter`).
- **Location**: All skills are created in `~/.gemini/antigravity/skills/` (Global Scope) by default.
- **Structure**: Must always include `SKILL.md` with YAML frontmatter.
