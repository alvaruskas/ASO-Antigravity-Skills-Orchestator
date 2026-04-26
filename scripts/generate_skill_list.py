import os
import yaml
import re

def get_skill_info(skill_path):
    skill_file = os.path.join(skill_path, 'SKILL.md')
    if not os.path.exists(skill_file):
        return None
    
    with open(skill_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract YAML frontmatter
    match = re.search(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if match:
        try:
            data = yaml.safe_load(match.group(1))
            category = data.get('category', 'Otros')
            if isinstance(category, list):
                category = category[0] if category else 'Otros'
            
            return {
                'name': data.get('name', os.path.basename(skill_path)),
                'description': data.get('description', 'Sin descripción.'),
                'category': str(category)
            }
        except Exception:
            pass
            
    return {
        'name': os.path.basename(skill_path),
        'description': 'Sin descripción.',
        'category': 'Otros'
    }

def main():
    vault_path = 'skills-library/vault'
    skills = []
    
    if not os.path.exists(vault_path):
        print(f"Error: {vault_path} no existe.")
        return

    for item in os.listdir(vault_path):
        item_path = os.path.join(vault_path, item)
        if os.path.isdir(item_path):
            info = get_skill_info(item_path)
            if info:
                skills.append(info)
    
    # Sort by category and name
    skills.sort(key=lambda x: (x['category'].lower(), x['name'].lower()))
    
    # Generate Markdown table
    markdown = "## 📚 Catálogo Completo de Skills\n\n"
    markdown += "| Categoría | Skill | Descripción |\n"
    markdown += "| :--- | :--- | :--- |\n"
    
    for skill in skills:
        markdown += f"| {skill['category']} | **{skill['name']}** | {skill['description']} |\n"
    
    print(markdown)

if __name__ == "__main__":
    main()
