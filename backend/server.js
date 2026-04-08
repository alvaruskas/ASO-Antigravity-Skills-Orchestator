const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { exec } = require('child_process');
const { Ollama } = require('ollama');
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

const app = express();
app.use(cors());
app.use(express.json());

const BASE_DIR = '/Users/uskas/.gemini/antigravity';
const SKILLS_DIR = path.join(BASE_DIR, 'skills');
const VAULT_DIR = path.join(BASE_DIR, 'skills_vault');

const PROJECT_PATH = process.env.ASO_PROJECT_PATH || null;
const PROFILE_FILE = PROJECT_PATH ? path.join(PROJECT_PATH, '.aso_profile.json') : null;

function initProfile() {
    if (!PROJECT_PATH) return;
    
    // Si no existe, lo creamos con el estado actual
    if (!fs.existsSync(PROFILE_FILE)) {
        const activeDirs = fs.existsSync(SKILLS_DIR) ? fs.readdirSync(SKILLS_DIR).filter(d => !d.startsWith('.') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()) : [];
        const profile = { activeSkills: activeDirs, projectSkills: [] };
        fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));
        console.log(`Creado .aso_profile.json para el proyecto en ${PROJECT_PATH}`);
    } else {
        // Si existe, leemos las skills esperadas
        const profile = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf8'));
        const expectedActive = profile.activeSkills || [];
        
        // 1. Mandamos todo a vault
        const activeDirs = fs.existsSync(SKILLS_DIR) ? fs.readdirSync(SKILLS_DIR).filter(d => !d.startsWith('.') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()) : [];
        for (const d of activeDirs) {
            fs.renameSync(path.join(SKILLS_DIR, d), path.join(VAULT_DIR, d));
        }
        
        // 2. Extraemos solo lo del profile
        for (const skill of expectedActive) {
            if (fs.existsSync(path.join(VAULT_DIR, skill))) {
                fs.renameSync(path.join(VAULT_DIR, skill), path.join(SKILLS_DIR, skill));
            }
        }
        console.log(`Entorno inicializado desde .aso_profile.json para ${PROJECT_PATH}`);
    }
}

if (PROJECT_PATH) {
    try {
        initProfile();
    } catch(e) {
        console.error("Error initializing project profile:", e);
    }
}

function updateProfile(id, isActive, scope = 'global') {
    if (!PROFILE_FILE || !fs.existsSync(PROFILE_FILE)) return;
    try {
        const profile = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf8'));
        const activeSkills = profile.activeSkills || [];
        const projectSkills = profile.projectSkills || [];
        
        if (isActive) {
            if (scope === 'global' && !activeSkills.includes(id)) {
                activeSkills.push(id);
            } else if (scope === 'project' && !projectSkills.includes(id)) {
                projectSkills.push(id);
            }
        } else {
            if (scope === 'global') {
                const idx = activeSkills.indexOf(id);
                if (idx > -1) activeSkills.splice(idx, 1);
            } else if (scope === 'project') {
                const idx = projectSkills.indexOf(id);
                if (idx > -1) projectSkills.splice(idx, 1);
            }
        }
        profile.activeSkills = activeSkills.filter(s => fs.existsSync(path.join(SKILLS_DIR, s)) || fs.existsSync(path.join(VAULT_DIR, s)));
        // project skills maybe stored in real project, so check existence if running inside project:
        if (PROJECT_PATH) {
            profile.projectSkills = projectSkills.filter(s => fs.existsSync(path.join(PROJECT_PATH, 'skills', s)));
        }
        fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));
    } catch(e) {
        console.error("Error updating profile:", e);
    }
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, {recursive: true});
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}


// Helper to reliably parse Frontmatter from SKILL.md
function parseSkillFile(skillPath, name, isActive) {
    const defaultData = {
        id: name,
        name: name,
        description: 'No description provided.',
        category: 'Uncategorized',
        isActive: isActive
    };
    
    if (!fs.existsSync(skillPath)) return defaultData;
    
    try {
        const content = fs.readFileSync(skillPath, 'utf8');
        const match = content.match(/^---\s*\n([\s\S]*?)\n---/m);
        
        if (match) {
            const doc = yaml.load(match[1]);
            return {
                ...defaultData,
                name: doc.name || name,
                description: doc.description || 'No description provided.',
                category: doc.category || 'Uncategorized'
            };
        }
    } catch (e) {
        console.error(`Error parsing frontmatter for ${name}:`, e);
    }
    
    return defaultData;
}

// Endpoint de estado
app.post('/api/shutdown', (req, res) => {
    console.log('Recibida petición de apagado del sistema...');
    res.json({ success: true, message: "Apagando servidores..." });
    
    // Matar procesos en 500ms para permitir que la respuesta HTTP termine
    setTimeout(() => {
        exec('pkill -f "node server.js"', () => {});
        exec('pkill -f "vite"', () => {});
    }, 500);
});

app.get('/api/status', (req, res) => {
    if (PROJECT_PATH) {
        const projectName = path.basename(PROJECT_PATH);
        res.json({ projectPath: PROJECT_PATH, projectName: projectName, isProfileActive: true });
    } else {
        res.json({ projectPath: null, projectName: 'Global Context', isProfileActive: false });
    }
});

// Get all skills with their statuses
app.get('/api/skills', (req, res) => {
    let skills = [];

    // Read active global skills
    if (fs.existsSync(SKILLS_DIR)) {
        const activeDirs = fs.readdirSync(SKILLS_DIR).filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory());
        activeDirs.forEach(dirName => {
            if (dirName.startsWith('.')) return;
            const skillFilePath = path.join(SKILLS_DIR, dirName, 'SKILL.md');
            skills.push({...parseSkillFile(skillFilePath, dirName, true), scope: 'global'});
        });
    }

    // Read project local skills
    if (PROJECT_PATH) {
        const projSkillsDir = path.join(PROJECT_PATH, 'skills');
        if (fs.existsSync(projSkillsDir)) {
            const projDirs = fs.readdirSync(projSkillsDir).filter(d => fs.statSync(path.join(projSkillsDir, d)).isDirectory());
            projDirs.forEach(dirName => {
                if (dirName.startsWith('.')) return;
                const skillFilePath = path.join(projSkillsDir, dirName, 'SKILL.md');
                skills.push({...parseSkillFile(skillFilePath, dirName, true), scope: 'project'});
            });
        }
    }

    // Read vaulted skills
    if (fs.existsSync(VAULT_DIR)) {
        const vaultDirs = fs.readdirSync(VAULT_DIR).filter(d => fs.statSync(path.join(VAULT_DIR, d)).isDirectory());
        vaultDirs.forEach(dirName => {
            if (dirName.startsWith('.')) return;
            // Solo agremos si NO existe ya en skills (así evitamos duplicar si está copiada a un proyecto)
            if (!skills.find(s => s.id === dirName)) {
                const skillFilePath = path.join(VAULT_DIR, dirName, 'SKILL.md');
                skills.push({...parseSkillFile(skillFilePath, dirName, false), scope: null});
            }
        });
    }

    res.json(skills);
});

// Toggle a skill's active state physically
app.post('/api/toggle', (req, res) => {
    const { id, targetState, scope } = req.body;
    // targetState: true (to activate), false (to vault)
    // scope: 'global' | 'project'
    
    try {
        const currentInSkills = path.join(SKILLS_DIR, id);
        const currentInVault = path.join(VAULT_DIR, id);
        const currentInProject = PROJECT_PATH ? path.join(PROJECT_PATH, 'skills', id) : null;

        if (targetState === true) {
            if (fs.existsSync(currentInVault)) {
                if (scope === 'project' && PROJECT_PATH) {
                    // Copy to Project's skills dir
                    const projSkillsDir = path.join(PROJECT_PATH, 'skills');
                    if (!fs.existsSync(projSkillsDir)) fs.mkdirSync(projSkillsDir, { recursive: true });
                    copyRecursiveSync(currentInVault, currentInProject);
                    updateProfile(id, true, 'project');
                    return res.json({ success: true, message: `Skill ${id} activated in project` });
                } else {
                    // Move to global
                    fs.renameSync(currentInVault, currentInSkills);
                    updateProfile(id, true, 'global');
                    return res.json({ success: true, message: `Skill ${id} activated globally` });
                }
            } else {
                return res.status(404).json({ success: false, message: "Skill folder not found in vault" });
            }
        } else {
            // Deactivate
            if (scope === 'project' && currentInProject && fs.existsSync(currentInProject)) {
                // Remove local project copy
                fs.rmSync(currentInProject, { recursive: true, force: true });
                updateProfile(id, false, 'project');
                return res.json({ success: true, message: `Skill ${id} deactivated from project` });
            } else if (fs.existsSync(currentInSkills)) {
                // Move from global to vault
                fs.renameSync(currentInSkills, currentInVault);
                updateProfile(id, false, 'global');
                return res.json({ success: true, message: `Skill ${id} deactivated globally` });
            }
            res.status(404).json({ success: false, message: "Skill folder not found in expected location" });
        }
    } catch (error) {
        console.error("Move error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a skill physically
app.delete('/api/skills/:id', (req, res) => {
    const id = req.params.id;
    const { state } = req.query; // 'active' or 'vault'
    
    // We only support deleting from vault or global skills for now since destroying project skills via delete API seems risky, but let's keep it safe:
    try {
        const targetDir = state === 'active' ? path.join(SKILLS_DIR, id) : path.join(VAULT_DIR, id);
        
        if (fs.existsSync(targetDir)) {
            fs.rmSync(targetDir, { recursive: true, force: true });
            return res.json({ success: true, message: `Skill ${id} deleted forever` });
        }
        res.status(404).json({ success: false, message: "Skill folder not found" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint para leer el contenido de SKILL.md
app.get('/api/skills/:id/content', (req, res) => {
    const id = req.params.id;
    const globalPath = path.join(SKILLS_DIR, id, 'SKILL.md');
    const localPath = PROJECT_PATH ? path.join(PROJECT_PATH, 'skills', id, 'SKILL.md') : null;
    const vaultPath = path.join(VAULT_DIR, id, 'SKILL.md');

    let targetPath = null;
    if (localPath && fs.existsSync(localPath)) targetPath = localPath;
    else if (fs.existsSync(globalPath)) targetPath = globalPath;
    else if (fs.existsSync(vaultPath)) targetPath = vaultPath;

    if (!targetPath) {
        return res.status(404).json({ error: 'SKILL.md no encontrado' });
    }

    try {
        const content = fs.readFileSync(targetPath, 'utf8');
        res.json({ success: true, content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages array is required' });

  try {
    const systemPrompt = `Eres Antigravity Co-Pilot, un ingeniero experto en arquitectura de software y diseño de Agentes Autónomos.
    Tu objetivo es dialogar con el usuario, proponerle ideas para nuevas Skills, cuestionar si le falta lógica a su idea, y estructurarla juntos.
    Debes hablar SIEMPRE y ÚNICAMENTE en riguroso ESPAÑOL. Responde en formato Markdown, de forma concisa y amigable.`;

    const cleanMessages = messages.filter(m => m.role !== 'system');

    const chatResponse = await ollama.chat({
      model: 'llama3.1:latest',
      messages: [
        { role: 'system', content: systemPrompt },
        ...cleanMessages
      ]
    });

    res.json({ success: true, message: chatResponse.message.content });
  } catch (error) {
    console.error("Ollama Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate-skill', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages array is required' });

  try {
    const systemPrompt = `Eres un Compilador Estricto de Agentes de Desarrollo Web. 
    Revisa TODO el historial de la conversación. Basado en la lógica acordada, GENERA un archivo SKILL.md válido.
    DEBE empezar OBLIGATORIAMENTE con un frontmatter YAML acotado por --- y --- que contenga 'name', 'category' y una 'description' BREVE Y EN CASTELLANO. Todo el archivo DEBE estar redactado en riguroso ESPAÑOL.
    Luego, continúa con las instrucciones estrictas en markdown.
    CRÍTICO: Devuelve ÚNICAMENTE el texto puro del archivo SKILL.md, nada más. No me saludes. No lo envuelvas en bloques de código markdown.`;

    const cleanMessages = messages.filter(m => m.role !== 'system');

    const response = await ollama.chat({
      model: 'llama3.1:latest',
      messages: [
        { role: 'system', content: systemPrompt },
        ...cleanMessages
      ]
    });

    let content = response.message.content.trim();
    // In case the model wrapped everything in ```yaml or ```markdown
    content = content.replace(/^```[a-z]*\s*\n/i, '');
    content = content.replace(/\n```\s*$/i, '');
    content = content.trim();

    // Try to extract name to create the folder
    let folderName = 'new-skill-' + Date.now();
    try {
        const match = content.match(/^---\s*\n([\s\S]*?)\n---/m);
        if (match && match[1]) {
            const parsedYaml = yaml.load(match[1]);
            if (parsedYaml.name) {
                folderName = parsedYaml.name;
            }
        }
        if (folderName.startsWith('new-skill-')) {
            // Fallback: extract first # Heading
            const headingMatch = content.match(/^#\s+(.+)$/m);
            if (headingMatch && headingMatch[1]) {
                 folderName = headingMatch[1].trim();
            } else {
                 folderName = "Generada " + new Date().toISOString().split('T')[0];
            }
        }
        folderName = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    } catch(e) {
        console.warn("Could not parse YAML for folder name, using fallback");
    }

    // Save physically to active skills
    const newSkillDir = path.join(SKILLS_DIR, folderName);
    if (!fs.existsSync(newSkillDir)) {
        fs.mkdirSync(newSkillDir, { recursive: true });
    }
    fs.writeFileSync(path.join(newSkillDir, 'SKILL.md'), content);
    
    // Automatically add it to the profile
    updateProfile(folderName, true);

    res.json({ success: true, folderName, message: "Skill created and activated." });
  } catch (error) {
    console.error("Ollama Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`ASO Backend Orchestrator running on http://localhost:${PORT}`);
    console.log(`Watching skills via local API...`);
});
