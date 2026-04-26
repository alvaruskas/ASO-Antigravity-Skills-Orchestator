import os
import json
import requests
import argparse
from pathlib import Path

CLAUDE_CONFIG_PATH = Path.home() / "Library/Application Support/Claude/claude_desktop_config.json"

def load_env():
    env_path = Path(".env")
    if env_path.exists():
        with open(env_path, "r") as f:
            for line in f:
                if "=" in line:
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value

class GitHubConnector:
    def __init__(self, token=None):
        load_env()
        self.token = token or os.getenv("GITHUB_TOKEN")
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json"
        }

    def validate_token(self):
        if not self.token:
            return False, "No hay token configurado."
        
        try:
            response = requests.get(f"{self.base_url}/user", headers=self.headers)
            if response.status_code == 200:
                user_data = response.json()
                return True, f"Token válido para el usuario: {user_data.get('login')}"
            else:
                return False, f"Error {response.status_code}: {response.json().get('message')}"
        except Exception as e:
            return False, f"Error de conexión: {str(e)}"

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
        try:
            response = requests.get(f"{self.base_url}/user/repos?sort=updated", headers=self.headers)
            if response.status_code == 200:
                repos = response.json()
                return [f"{r['full_name']} ({r['stargazers_count']} ⭐)" for r in repos[:10]]
            return [f"Error: {response.status_code}"]
        except Exception as e:
            return [f"Error de conexión: {str(e)}"]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="GitHub Connector for Antigravity")
    parser.add_argument("--validate", action="store_true", help="Valida el token actual")
    parser.add_argument("--token", help="Nuevo token de GitHub para validar y configurar")
    parser.add_argument("--update-claude", action="store_true", help="Actualiza claude_desktop_config.json")
    parser.add_argument("--list-repos", action="store_true", help="Lista los últimos 10 repositorios")

    args = parser.parse_args()
    
    # El constructor de la clase ya carga el token de .env o del argumento
    connector = GitHubConnector(args.token)

    if args.validate:
        success, msg = connector.validate_token()
        print(msg)
    
    if args.update_claude:
        # Si se pasa un token nuevo por argumento, se usa ese
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
