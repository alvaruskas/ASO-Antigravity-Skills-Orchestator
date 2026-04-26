import os
import json
import requests
import argparse
from pathlib import Path

CLAUDE_CONFIG_PATH = Path.home() / "Library/Application Support/Claude/claude_desktop_config.json"

class GitHubConnector:
    def __init__(self, token=None):
        self.token = token or os.getenv("GITHUB_TOKEN")
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json"
        }

    def validate_token(self):
        if not self.token:
            return False, "No hay token configurado."
        
        response = requests.get(f"{self.base_url}/user", headers=self.headers)
        if response.status_code == 200:
            user_data = response.json()
            return True, f"Token válido para el usuario: {user_data.get('login')}"
        else:
            return False, f"Error {response.status_code}: {response.json().get('message')}"

    def update_claude_config(self):
        if not CLAUDE_CONFIG_PATH.exists():
            return False, f"No se encontró el archivo de configuración en {CLAUDE_CONFIG_PATH}"

        try:
            with open(CLAUDE_CONFIG_PATH, 'r') as f:
                config = json.load(f)
            
            if "mcpServers" not in config:
                config["mcpServers"] = {}
            
            config["mcpServers"]["github"] = {
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-github"],
                "env": {
                    "GITHUB_PERSONAL_ACCESS_TOKEN": self.token
                }
            }

            with open(CLAUDE_CONFIG_PATH, 'w') as f:
                json.dump(config, f, indent=2)
            
            return True, "Configuración de Claude Desktop actualizada con éxito."
        except Exception as e:
            return False, f"Error al actualizar configuración: {str(e)}"

    def list_repos(self):
        response = requests.get(f"{self.base_url}/user/repos?sort=updated", headers=self.headers)
        if response.status_code == 200:
            repos = response.json()
            return [f"{r['full_name']} ({r['stargazers_count']} ⭐)" for r in repos[:10]]
        return [f"Error: {response.status_code}"]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="GitHub Connector for Antigravity")
    parser.add_argument("--validate", action="store_true", help="Valida el token actual")
    parser.add_argument("--token", help="Nuevo token de GitHub para validar y configurar")
    parser.add_argument("--update-claude", action="store_true", help="Actualiza claude_desktop_config.json")
    parser.add_argument("--list-repos", action="store_true", help="Lista los últimos 10 repositorios")

    args = parser.parse_args()
    
    # Priorizar token del argumento, luego .env
    token = args.token or os.getenv("GITHUB_TOKEN")
    connector = GitHubConnector(token)

    if args.validate:
        success, msg = connector.validate_token()
        print(msg)
    
    if args.update_claude:
        if not token:
            print("Error: Necesitas proporcionar un token con --token para actualizar Claude.")
        else:
            success, msg = connector.validate_token()
            if success:
                s, m = connector.update_claude_config()
                print(m)
            else:
                print(f"Token inválido. No se actualizó la configuración. ({msg})")

    if args.list_repos:
        repos = connector.list_repos()
        for r in repos:
            print(f"- {r}")
