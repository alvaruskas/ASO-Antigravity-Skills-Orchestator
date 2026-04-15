#!/usr/bin/env python3
"""
Script para calcular la próxima versión semántica basada en el tipo de commit.
Uso: python3 bump_version.py <tipo_commit> [--file <archivo>]
"""
import argparse
import json
import re
from pathlib import Path

def read_version(file_path):
    """Lee la versión actual del archivo especificado."""
    if not file_path.exists():
        return "0.0.0"
    
    content = file_path.read_text()
    
    if file_path.name == "package.json":
        data = json.loads(content)
        return data.get("version", "0.0.0")
    elif file_path.name == "pyproject.toml":
        match = re.search(r'version\s*=\s*"([^"]+)"', content)
        return match.group(1) if match else "0.0.0"
    elif file_path.name in ["version.txt", "VERSION"]:
        return content.strip()
    else:
        return "0.0.0"

def write_version(file_path, new_version):
    """Escribe la nueva versión al archivo."""
    if file_path.name == "package.json":
        data = json.loads(file_path.read_text())
        data["version"] = new_version
        file_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    elif file_path.name == "pyproject.toml":
        content = file_path.read_text()
        new_content = re.sub(r'version\s*=\s*"[^"]+"', f'version = "{new_version}"', content)
        file_path.write_text(new_content)
    elif file_path.name in ["version.txt", "VERSION"]:
        file_path.write_text(new_version + "\n")

def bump_version(current_version, commit_type):
    """Incrementa la versión según el tipo de commit."""
    major, minor, patch = map(int, current_version.split("."))
    
    if commit_type in ["BREAKING", "breaking"]:
        major += 1
        minor = 0
        patch = 0
    elif commit_type == "feat":
        minor += 1
        patch = 0
    elif commit_type in ["fix", "perf"]:
        patch += 1
    # docs, refactor, test, chore no incrementan versión
    
    return f"{major}.{minor}.{patch}"

def find_version_file():
    """Busca el archivo de versión en el directorio actual."""
    candidates = ["package.json", "pyproject.toml", "version.txt", "VERSION"]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return path
    return None

def main():
    parser = argparse.ArgumentParser(description="Bump semantic version")
    parser.add_argument("commit_type", choices=["feat", "fix", "BREAKING", "docs", "refactor", "test", "chore"])
    parser.add_argument("--file", type=str, help="Version file path")
    parser.add_argument("--dry-run", action="store_true", help="Only show new version, don't write")
    
    args = parser.parse_args()
    
    version_file = Path(args.file) if args.file else find_version_file()
    
    if not version_file:
        print("Error: No se encontró archivo de versión (package.json, pyproject.toml, VERSION)")
        return 1
    
    current = read_version(version_file)
    new_version = bump_version(current, args.commit_type)
    
    print(f"Versión actual: {current}")
    print(f"Nueva versión: {new_version}")
    
    if not args.dry_run:
        write_version(version_file, new_version)
        print(f"✅ Versión actualizada en {version_file}")
    
    return 0

if __name__ == "__main__":
    exit(main())
