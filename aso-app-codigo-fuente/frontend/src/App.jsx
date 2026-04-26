import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import logoUrl from './assets/aso-logo.png';

const API_URL = 'http://localhost:4000/api';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('aso_theme') !== 'light';
  });
  const [dashboardFilter, setDashboardFilter] = useState('all');

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('aso_theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('aso_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const [skills, setSkills] = useState([]);
  const [projectStatus, setProjectStatus] = useState({ projectName: 'Global Context', isProfileActive: false });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'activas' | 'vault' | 'factory'
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('aso_chat_history');
    if (saved) return JSON.parse(saved);
    return [{
      role: 'system', content: 'Iniciando Antigravity Co-Pilot. Dime qué código, lógica o acción quieres automatizar y yo redactaré la Skill y la inyectaré en tu Bóveda.'
    }];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [scopeModal, setScopeModal] = useState({ isOpen: false, skillId: null });
  const [inspectModal, setInspectModal] = useState({ isOpen: false, skillName: null, content: '', loading: false });
  const [sessionMemory, setSessionMemory] = useState('');
  const [loadingMemory, setLoadingMemory] = useState(false);

  const fetchSessionMemory = async () => {
    setLoadingMemory(true);
    try {
      const res = await fetch(`${API_URL}/session-memory`);
      const data = await res.json();
      if (data.success) {
        setSessionMemory(data.content);
      } else {
        setSessionMemory(`# 📭 Memoria no disponible\n${data.message || 'No se pudo cargar la memoria.'}`);
      }
    } catch (e) {
      setSessionMemory(`# ❌ Error de red\n${e.message}`);
    } finally {
      setLoadingMemory(false);
    }
  };

  const inspectSkill = async (skillName) => {
    setInspectModal({ isOpen: true, skillName, content: '', loading: true });
    try {
      const res = await fetch(`${API_URL}/skills/${skillName}/content`);
      const data = await res.json();
      if (data.success) {
        setInspectModal({ isOpen: true, skillName, content: data.content, loading: false });
      } else {
        setInspectModal({ isOpen: true, skillName, content: `Error: ${data.error}`, loading: false });
      }
    } catch (e) {
      setInspectModal({ isOpen: true, skillName, content: `Error de red: ${e.message}`, loading: false });
    }
  };

  useEffect(() => {
    localStorage.setItem('aso_chat_history', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/skills`);
      const data = await res.json();
      setSkills(data);
      
      try {
        const statusRes = await fetch(`${API_URL}/status`);
        const statusData = await statusRes.json();
        setProjectStatus(statusData);
      } catch (statusError) {
        console.error("Failed to fetch project status", statusError);
      }
    } catch (e) {
      console.error("Failed to fetch skills", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleToggle = async (id, currentState, currentScope) => {
    const targetState = !currentState;
    
    if (targetState === true) {
        if (projectStatus.isProfileActive) {
            // Preguntar ámbito antes de ejecutar
            setScopeModal({ isOpen: true, skillId: id });
        } else {
            // Siempre a global si no es proyecto
            executeToggle(id, true, 'global');
        }
    } else {
        // Desactivar: hace falta el scope actual
        executeToggle(id, false, currentScope || 'global');
    }
  };

  const executeToggle = async (id, targetState, scope) => {
    // Optimistic UI update
    setSkills(prev => prev.map(s => s.id === id ? { ...s, isActive: targetState, scope } : s));
    
    try {
      const res = await fetch(`${API_URL}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, targetState, scope })
      });
      if (!res.ok) {
        // Revert on failure
        fetchSkills();
      }
    } catch (e) {
      console.error("Failed to toggle skill", e);
      fetchSkills(); // Revert
    }
  };

  const handleDelete = async (id, isActive) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta Skill para siempre? Esta acción destruye la carpeta.")) return;
    
    // Optimistic delete
    setSkills(prev => prev.filter(s => s.id !== id));
    
    try {
      const stateParam = isActive ? 'active' : 'vault';
      const res = await fetch(`${API_URL}/skills/${id}?state=${stateParam}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        fetchSkills();
      }
    } catch (e) {
      console.error("Failed to delete skill", e);
      fetchSkills();
    }
  };

  // Skills del tab activo (sin filtros adicionales) — base para pills y contadores
    const getDashboardSkills = () => {
    switch(dashboardFilter) {
      case 'vault': return skills.filter(s => !s.isActive);
      case 'project': return skills.filter(s => s.scope === 'project');
      case 'global': return skills.filter(s => s.scope !== 'project');
      case 'all': default: return skills;
    }
  };

  const tabSkills = activeTab === 'dashboard' ? getDashboardSkills() : skills.filter(s => activeTab === 'activas' ? s.isActive : !s.isActive);
  const allCategories = ['Todas', ...new Set(tabSkills.map(s => s.category || 'Sin categoría').filter(Boolean).sort())];

  const filteredSkills = tabSkills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || (s.category || 'Sin categoría') === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-[var(--bg-app)] text-[var(--text-main)] overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 glass-panel flex flex-col border-r border-[var(--border-main)]/30">
        <div className="px-6 pt-8 pb-4 flex flex-col items-center justify-center">
          <img src={logoUrl} alt="ASO Logo" className="w-[160px] h-auto object-contain" style={{filter: "drop-shadow(0px 0px 8px rgba(0,251,251,0.2))"}} />
        </div>
        
        <nav className="flex-1 px-4 mt-8 space-y-2">
          <button 
            onClick={() => { setActiveTab('dashboard'); setActiveCategory('Todas'); setDashboardFilter('all'); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-[var(--primary-dark)]/30 border border-[var(--primary-neon)]/50 neon-text' : 'hover:bg-[var(--bg-card)] text-[#b9cac9]'}`}
          >
            <span className="font-medium">Dashboard</span>
            <span className="text-xl">📊</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('activas'); setActiveCategory('Todas'); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all ${activeTab === 'activas' ? 'bg-[var(--primary-dark)]/30 border border-[var(--primary-neon)]/50 neon-text' : 'hover:bg-[var(--bg-card)] text-[#b9cac9]'}`}
          >
            <span className="font-medium">Activas</span>
            <span className="text-xs py-1 px-2 bg-[var(--bg-input)] rounded-md border border-[var(--border-main)]/50">
              {skills.filter(s=>s.isActive).length}
            </span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('vault'); setActiveCategory('Todas'); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all ${activeTab === 'vault' ? 'bg-[var(--primary-dark)]/30 border border-[var(--primary-neon)]/50 neon-text' : 'hover:bg-[var(--bg-card)] text-[#b9cac9]'}`}
          >
            <span className="font-medium">Bóveda (Vault)</span>
            <span className="text-xs py-1 px-2 bg-[var(--bg-input)] rounded-md border border-[var(--border-main)]/50">
              {skills.filter(s=>!s.isActive).length}
            </span>
          </button>

          <div className="pt-4 mt-4 border-t border-[var(--border-main)]/30">
             <button 
              onClick={() => { setActiveTab('factory'); setActiveCategory('Todas'); }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-md transition-all ${activeTab === 'factory' ? 'bg-[var(--accent-purple-bg)]/80 border border-[var(--accent-purple)]/50 text-[var(--accent-purple-text)]' : 'hover:bg-[var(--bg-card)] text-[#b9cac9]'}`}
             >
               <span className="text-lg">🤖</span>
               <span className="font-medium">Skill Factory</span>
             </button>
             
             <button 
              onClick={() => { setActiveTab('memory'); fetchSessionMemory(); }}
              className={`w-full flex items-center gap-2 px-4 py-3 mt-2 rounded-md transition-all ${activeTab === 'memory' ? 'bg-[var(--primary-dark)]/30 border border-[var(--primary-neon)]/50 neon-text' : 'hover:bg-[var(--bg-card)] text-[#b9cac9]'}`}
             >
               <span className="text-lg">🧠</span>
               <span className="font-medium">Memoria de Sesión</span>
             </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-[var(--border-main)]/30 flex flex-col items-center justify-center text-center w-full">
          <button 
           onClick={toggleTheme}
           className="w-full flex items-center justify-center gap-2 mb-2 px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--primary-dark)]/30 border border-[var(--border-main)] hover:border-[var(--primary-neon)]/50 text-[var(--text-main)] rounded-lg transition-all"
          >
           {isDarkMode ? '🌞 Cambiar a Light Mode' : '🌙 Cambiar a Dark Mode'}
          </button>
          
          <button 
           onClick={async () => {
             if(!window.confirm("¿Estás seguro de que quieres cerrar ASO? Se apagarán los servidores.")) return;
             try {
               await fetch(`${API_URL}/shutdown`, { method: 'POST' });
               document.body.innerHTML = '<div style="display:flex; height:100vh; width:100vw; align-items:center; justify-content:center; background: var(--bg-app); color: var(--text-strong); font-family:monospace; flex-direction:column;"><h2>ASO Offline</h2><p>Los servidores han sido apagados. Puedes cerrar esta pestaña.</p></div>';
             } catch (e) {
               console.error("Error al apagar", e);
             }
           }}
           className="w-full flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-[var(--danger)]/10 border border-[var(--danger)]/30 hover:bg-[var(--danger)]/20 hover:border-[var(--danger)] text-[var(--danger)] rounded-lg transition-all"
          >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           Apagar ASO
          </button>
          
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase font-mono mb-2">
            V2.0 Midnight Terminal
          </div>
          <div className="text-[9px] text-[var(--text-subtle)] leading-tight">
            © 2026 Desarrollado por <strong className="text-[var(--primary-neon)]/80">BCBiocon</strong><br/>
            con la ayuda de Agentes Antigravity
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Glow effect in background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary-neon)]/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-[var(--bg-app)]/80 backdrop-blur-md z-10 border-b border-[var(--border-main)]/30 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium text-[var(--text-strong)] flex items-center gap-3">
              {activeTab === 'dashboard' ? 'Dashboard Global' : activeTab === 'activas' ? 'Skills Activas' : activeTab === 'vault' ? 'Skills Guardadas' : activeTab === 'memory' ? 'Memoria de Sesión' : 'Skill Factory (Co-Pilot)'}
              
              <span className={`text-xs ml-2 px-3 py-1 rounded-full border shadow-sm ${projectStatus.isProfileActive ? 'bg-[var(--accent-purple)]/20 border-[var(--accent-purple)]/50 text-[var(--accent-purple-text)]' : 'bg-[var(--border-main)]/30 border-[var(--border-main)]/50 text-[var(--text-muted)]'}`}>
                  {projectStatus.isProfileActive ? '📁 Workspace: ' : '🌍 '}{projectStatus.projectName}
              </span>
            </h2>
            <button
               onClick={fetchSkills}
               disabled={loading}
               className="p-2 ml-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--primary-dark)] border border-[var(--border-main)]/50 hover:border-[var(--primary-neon)]/80 text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-all shadow-sm disabled:opacity-50"
               title="Sincronizar Skills Manualmente"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
          
          {(activeTab === 'activas' || activeTab === 'vault' || activeTab === 'dashboard') && (
            <div className="relative w-72">
              <input 
                type="text" 
                placeholder="Search skills..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-main)]/50 focus:border-[var(--primary-neon)] focus:outline-none rounded-md py-2 pl-10 pr-4 text-sm text-[var(--text-strong)] placeholder-[var(--text-muted)] transition-colors"
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                   {/* Content Area */}
        {activeTab === 'factory' ? (
          <div className="flex-1 flex flex-col z-0">
             <div className="flex-1 overflow-y-auto p-8 space-y-6 pb-32">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[var(--primary-dark)] text-[var(--text-strong)] rounded-br-none' : 'bg-[var(--accent-purple-bg)] border border-[var(--accent-purple)]/30 text-[var(--accent-purple-text)] rounded-bl-none shadow-[0_4px_15px_rgba(155,81,224,0.1)]'}`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-[var(--accent-purple-bg)] border border-[var(--accent-purple)]/30 text-[var(--accent-purple-text)] rounded-2xl rounded-bl-none p-4">
                      <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)] animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)] animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)] animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                )}
             </div>
             
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-[var(--bg-app)]/95 backdrop-blur-xl border-t border-[var(--border-main)]/50 shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
               <div className="flex gap-4 relative max-w-4xl mx-auto">
                 <form 
                   onSubmit={async (e) => {
                     e.preventDefault();
                     if (!chatPrompt.trim() || isGenerating) return;
                     
                     const userMsg = { role: 'user', content: chatPrompt };
                     const currentHistory = [...chatMessages, userMsg];
                     setChatMessages(currentHistory);
                     setChatPrompt('');
                     setIsGenerating(true);
 
                     try {
                       const contextWindow = currentHistory.length > 7 ? 
                         [currentHistory[0], ...currentHistory.slice(-6)] : 
                         currentHistory;
 
                       const res = await fetch(`${API_URL}/chat`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ messages: contextWindow.map(m => m.role === 'system' && m.content.startsWith('Iniciando') ? {role: 'system', content: 'Eres el asistente. Tu respuesta debe ser concisa, sin enrollarte demasiado, pero rigurosa.'} : m) })
                       });
                       const data = await res.json();
                       if (data.success) {
                         setChatMessages(prev => [...prev, {
                           role: 'assistant', 
                           content: data.message
                         }]);
                       } else {
                         throw new Error(data.error || 'Error chatting');
                       }
                     } catch(err) {
                         setChatMessages(prev => [...prev, {
                           role: 'assistant', 
                           content: `❌ Error de conexión: ${err.message}`
                         }]);
                     } finally {
                       setIsGenerating(false);
                     }
                   }}
                   className="flex-1 flex gap-2"
                 >
                    <input 
                      type="text" 
                      placeholder="Responde al Asistente..." 
                      value={chatPrompt}
                      onChange={e => setChatPrompt(e.target.value)}
                      disabled={isGenerating}
                      className="flex-1 bg-[var(--bg-card)] border border-[var(--border-main)]/50 focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] focus:outline-none rounded-xl py-4 px-6 text-[var(--text-strong)] placeholder-[var(--text-muted)] transition-all disabled:opacity-50"
                    />
                    <button 
                      type="button"
                      onClick={() => setChatMessages([{
                         role: 'system', content: 'Iniciando Antigravity Co-Pilot. Dime qué código, lógica o acción quieres automatizar y yo redactaré la Skill y la inyectaré en tu Bóveda.'
                      }])}
                      className="p-4 rounded-xl border border-[var(--border-main)]/50 hover:bg-[var(--danger)]/20 hover:text-[var(--danger)] text-[var(--text-muted)] transition-colors"
                      title="Limpiar Memoria"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <button 
                      type="submit"
                      disabled={isGenerating || !chatPrompt.trim()}
                      className="bg-[var(--accent-purple)] hover:bg-[#8040c0] text-[var(--text-strong)] px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                      Enviar
                    </button>
                 </form>
 
                 <button 
                    type="button"
                    onClick={async () => {
                      if (isGenerating) return;
                      setIsGenerating(true);
                      try {
                        const res = await fetch(`${API_URL}/generate-skill`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ messages: chatMessages })
                        });
                        const data = await res.json();
                        if (data.success) {
                          setChatMessages([{
                            role: 'system', 
                            content: `✅ Skill "${data.folderName}" creada en la Bóveda con éxito.\nMemoria reiniciada para próxima tarea.`
                          }]);
                          fetchSkills();
                        } else {
                           throw new Error(data.error);
                        }
                      } catch(err) {
                        setChatMessages(prev => [...prev, {
                           role: 'system', 
                           content: `❌ Error al fabricar: ${err.message}`
                         }]);
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                    disabled={isGenerating || chatMessages.length < 3}
                    className="bg-[var(--primary-dark)] hover:bg-[var(--primary-neon)]/80 hover:text-[var(--text-strong)] border border-[var(--primary-neon)]/50 text-[var(--text-strong)] px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,251,251,0.2)]"
                  >
                    <span className="text-lg mr-2">💾</span>
                    Fabricar Skill
                 </button>
               </div>
             </div>
          </div>
        ) : activeTab === 'memory' ? (
          <div className="flex-1 overflow-y-auto p-8 z-0 skill-md-viewer">
            {loadingMemory ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-[var(--primary-neon)] animate-pulse">Cargando memoria de sesión...</div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto glass-panel p-8 rounded-2xl border border-[var(--border-main)]/30">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({children}) => <h1 className="text-3xl font-bold text-[var(--text-strong)] mb-6 border-b border-[var(--border-main)]/50 pb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-semibold text-[var(--primary-neon)] mb-4 mt-8 flex items-center gap-2"><span className="w-1.5 h-6 bg-[var(--primary-neon)] rounded-full inline-block"></span>{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-semibold text-[#b9cac9] mb-3 mt-6">{children}</h3>,
                    p: ({children}) => <p className="text-[var(--text-main)] text-sm leading-relaxed mb-4">{children}</p>,
                    ul: ({children}) => <ul className="space-y-2 mb-4 ml-2">{children}</ul>,
                    li: ({children}) => <li className="text-[var(--text-main)] text-sm flex gap-3"><span className="text-[var(--primary-neon)] mt-1 shrink-0">›</span><span>{children}</span></li>,
                    code: ({inline, children}) => inline
                      ? <code className="text-[var(--primary-neon)] bg-[var(--primary-neon)]/10 border border-[var(--primary-neon)]/20 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                      : <code className="block bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl p-6 text-xs font-mono text-[#b9cac9] overflow-x-auto leading-relaxed whitespace-pre shadow-inner">{children}</code>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-[var(--primary-neon)]/40 pl-6 my-6 text-[var(--text-muted)] italic bg-[var(--primary-neon)]/5 py-4 rounded-r-lg">{children}</blockquote>,
                    strong: ({children}) => <strong className="text-[var(--text-strong)] font-bold">{children}</strong>,
                  }}
                >
                  {sessionMemory}
                </ReactMarkdown>
                
                <div className="mt-12 pt-6 border-t border-[var(--border-main)]/30 flex justify-end">
                   <button 
                    onClick={fetchSessionMemory}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--primary-dark)]/20 border border-[var(--border-main)]/50 hover:border-[var(--primary-neon)]/50 text-[var(--text-muted)] hover:text-[var(--primary-neon)] rounded-lg transition-all text-xs"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                     Refrescar Memoria
                   </button>
                </div>
              </div>
            )}
          </div>
                ) : activeTab === 'dashboard' ? (
          <div className="flex-1 overflow-y-auto p-8 z-0 flex flex-col">
            <h3 className="text-xl font-semibold text-[var(--text-strong)] mb-6">Métricas de Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div onClick={() => setDashboardFilter('all')} className={`glass-card rounded-xl p-6 cursor-pointer border-2 transition-all ${dashboardFilter === 'all' ? 'border-[var(--primary-neon)] bg-[var(--primary-dark)]/20' : 'border-transparent hover:border-[var(--primary-neon)]/30'}`}>
                <div className="text-sm text-[var(--text-muted)] font-medium mb-2">Total Skills</div>
                <div className="text-4xl font-bold text-[var(--text-strong)]">{skills.length}</div>
              </div>
              <div onClick={() => setDashboardFilter('global')} className={`glass-card rounded-xl p-6 cursor-pointer border-2 transition-all ${dashboardFilter === 'global' ? 'border-[var(--primary-neon)] bg-[var(--primary-dark)]/20' : 'border-transparent hover:border-[var(--primary-neon)]/30'}`}>
                <div className="text-sm text-[var(--text-muted)] font-medium mb-2">Skills Globales</div>
                <div className="text-4xl font-bold text-[var(--text-strong)]">{skills.filter(s => s.scope !== 'project').length}</div>
              </div>
              <div onClick={() => setDashboardFilter('project')} className={`glass-card rounded-xl p-6 cursor-pointer border-2 transition-all ${dashboardFilter === 'project' ? 'border-[var(--accent-purple)] bg-[var(--accent-purple-bg)]/50' : 'border-transparent hover:border-[var(--accent-purple)]/30'}`}>
                <div className="text-sm text-[var(--text-muted)] font-medium mb-2">Skills de Proyecto</div>
                <div className="text-4xl font-bold text-[var(--text-strong)]">{skills.filter(s => s.scope === 'project').length}</div>
              </div>
              <div onClick={() => setDashboardFilter('vault')} className={`glass-card rounded-xl p-6 cursor-pointer border-2 transition-all ${dashboardFilter === 'vault' ? 'border-[var(--danger)] bg-[var(--danger)]/10' : 'border-transparent hover:border-[var(--danger)]/30'}`}>
                <div className="text-sm text-[var(--text-muted)] font-medium mb-2">En Bóveda (Inactivas)</div>
                <div className="text-4xl font-bold text-[var(--text-strong)]">{skills.filter(s => !s.isActive).length}</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[var(--text-strong)] mt-4 mb-4 border-b border-[var(--border-main)] pb-2">
              Lista Detallada ({filteredSkills.length})
            </h3>
            
            <div className="flex-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border-main)] overflow-hidden shadow-lg flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-input)] border-b border-[var(--border-main)]">
                      <th className="px-6 py-4 text-xs font-mono tracking-wider text-[var(--primary-neon)] uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-mono tracking-wider text-[var(--primary-neon)] uppercase">Nombre</th>
                      <th className="px-6 py-4 text-xs font-mono tracking-wider text-[var(--primary-neon)] uppercase">Categoría</th>
                      <th className="px-6 py-4 text-xs font-mono tracking-wider text-[var(--primary-neon)] uppercase">Scope</th>
                      <th className="px-6 py-4 text-xs font-mono tracking-wider text-[var(--primary-neon)] uppercase text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-main)]/50">
                    {filteredSkills.map(skill => (
                      <tr key={skill.id} className="hover:bg-[var(--bg-card-hover)] transition-colors group">
                        <td className="px-6 py-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={skill.isActive} onChange={() => handleToggle(skill.id, skill.isActive, skill.scope)} />
                            <div className="w-9 h-5 bg-[var(--bg-input)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[var(--text-strong)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--text-strong)] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border border-[var(--border-main)] peer-checked:bg-[var(--primary-dark)] peer-checked:border-[var(--primary-neon)]"></div>
                          </label>
                        </td>
                        <td className="px-6 py-4 font-medium text-[var(--text-strong)] truncate max-w-[200px]">
                          {skill.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-1 bg-[var(--primary-dark)]/30 text-[var(--primary-neon)] text-[10px] font-mono rounded-md border border-[var(--primary-dark)]">
                            {skill.category || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${skill.scope === 'project' ? 'text-[var(--accent-purple-text)]' : 'text-[#839493]'}`}>
                            {skill.scope === 'project' ? '📁 Project' : '🌍 Global'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => inspectSkill(skill.id)} className="text-[var(--text-muted)] hover:text-[var(--primary-neon)] p-1 mr-2">
                             <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredSkills.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-[var(--text-muted)]">📭 No hay skills en esta selección</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        ) : (
          <div className="flex-1 overflow-y-auto p-8 z-0">
            {/* Category Filter Pills — siempre visible con skills cargadas */}
            {!loading && tabSkills.length > 0 && allCategories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all border ${
                      activeCategory === cat
                        ? 'bg-[var(--primary-neon)]/20 border-[var(--primary-neon)] text-[var(--primary-neon)] shadow-[0_0_10px_rgba(0,251,251,0.3)]'
                        : 'bg-[var(--bg-input)] border-[var(--border-main)]/50 text-[var(--text-muted)] hover:border-[var(--primary-neon)]/40 hover:text-[#b9cac9]'
                    }`}
                  >
                    {cat}
                    <span className="ml-1.5 opacity-60">
                      {cat === 'Todas'
                        ? tabSkills.length
                        : tabSkills.filter(s => (s.category || 'Sin categoría') === cat).length
                      }
                    </span>
                  </button>
                ))}
              </div>
            )}
            
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-[var(--primary-neon)] animate-pulse">Syncing nodes...</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSkills.map(skill => (
                    <div key={skill.id} className="glass-card rounded-lg p-5 flex flex-col min-h-[16rem] h-auto relative overflow-hidden group cursor-pointer" onClick={(e) => { if (!e.target.closest('button') && !e.target.closest('label')) inspectSkill(skill.id); }}>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary-neon)]/0 via-[var(--primary-neon)]/0 to-[var(--primary-neon)]/0 group-hover:from-[var(--primary-neon)]/80 group-hover:via-[var(--primary-neon)]/40 group-hover:to-transparent transition-all duration-300"></div>
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-[var(--bg-input)] border border-[var(--border-main)]/50 flex items-center justify-center group-hover:border-[var(--primary-neon)]/50 transition-colors">
                            <span className="text-xl">🔌</span>
                          </div>
                          <div className="pr-8">
                            <h3 className="font-semibold text-[var(--text-strong)] tracking-tight">{skill.name}</h3>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDelete(skill.id, skill.isActive)}
                          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-1 opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                      
                      <div className="mb-2 flex items-center gap-2">
                         <span className="inline-block px-2.5 py-1 bg-[var(--primary-dark)] text-[var(--primary-neon)] text-[10px] font-mono tracking-wider uppercase rounded-full border border-[var(--primary-dark)]/50">
                          {skill.category}
                         </span>
                      </div>
                      
                      <div className="flex-1 overflow-hidden relative">
                        <p className="text-sm text-[#b9cac9] mt-1 leading-relaxed" style={{display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                          {skill.description}
                        </p>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-[var(--border-main)]/30 flex items-center justify-between mt-auto">
                        <span className={`text-xs font-mono font-medium ${skill.isActive ? 'text-[var(--primary-neon)]' : 'text-[var(--text-muted)]'}`}>
                          {skill.isActive ? 'ONLINE' : 'OFFLINE'}
                        </span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => inspectSkill(skill.id)} className="text-[var(--text-muted)] hover:text-[var(--primary-neon)] p-1">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          </button>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={skill.isActive} onChange={() => handleToggle(skill.id, skill.isActive, skill.scope)} />
                            <div className="w-9 h-5 bg-[var(--bg-input)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[var(--text-strong)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--text-strong)] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border border-[var(--border-main)] peer-checked:bg-[var(--primary-dark)] peer-checked:border-[var(--primary-neon)]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredSkills.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
                    <span className="text-4xl mb-4">📭</span>
                    <p>No se encontraron Skills en esta sección.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {/* Scope Modal */}
        {scopeModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--bg-app)] border border-[var(--border-main)] rounded-xl shadow-2xl p-6 max-w-md w-full relative">
              <h3 className="text-xl font-medium text-[var(--text-strong)] mb-4">¿Ámbito de Activación?</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">Estás en un entorno de proyecto. Elige dónde instalar esta Skill:</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => { setScopeModal({isOpen:false, skillId:null}); executeToggle(scopeModal.skillId, true, 'project'); }}
                  className="w-full text-left p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--accent-purple)]/40 hover:border-[var(--accent-purple)] hover:bg-[var(--accent-purple-bg)] transition-colors group"
                >
                  <div className="font-medium text-[var(--accent-purple-text)] mb-1 group-hover:text-[var(--text-strong)]">🚀 Nivel de Proyecto</div>
                  <div className="text-xs text-[var(--text-muted)]">Se copiará a <code className="text-[var(--accent-purple)]">/skills</code> dentro del código de este proyecto.</div>
                </button>
                
                <button 
                  onClick={() => { setScopeModal({isOpen:false, skillId:null}); executeToggle(scopeModal.skillId, true, 'global'); }}
                  className="w-full text-left p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--primary-neon)]/30 hover:border-[var(--primary-neon)] hover:bg-[var(--bg-input)] transition-colors group"
                >
                  <div className="font-medium text-[var(--primary-neon)] mb-1 group-hover:text-[var(--text-strong)]">🌍 Nivel Global</div>
                  <div className="text-xs text-[var(--text-muted)]">Se moverá a la carpeta base compartida por todos los proyectos.</div>
                </button>
              </div>
              
              <button 
                onClick={() => setScopeModal({isOpen:false, skillId:null})}
                className="mt-6 text-sm text-[var(--text-muted)] hover:text-[var(--text-strong)] w-full text-center"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Inspect Modal – Markdown Viewer */}
        {inspectModal.isOpen && (() => {
          // Strip frontmatter YAML before rendering
          const rawContent = inspectModal.content || '';
          const strippedContent = rawContent.replace(/^---[\s\S]*?---\s*\n?/, '').trim();
          // Find the inspected skill metadata
          const sk = skills.find(s => s.name === inspectModal.skillName) || {};
          return (
            <div
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-8"
              onClick={(e) => { if (e.target === e.currentTarget) setInspectModal({isOpen:false, skillName:null, content:'', loading:false}); }}
            >
              <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-t-2xl md:rounded-2xl shadow-[0_0_60px_rgba(0,251,251,0.08)] flex flex-col w-full max-w-3xl h-[90vh] md:h-[85vh] relative overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border-main)]/80 bg-[var(--bg-app)] shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-input)] border border-[var(--border-main)] flex items-center justify-center text-xl shrink-0">📄</div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[var(--text-strong)] font-semibold text-lg leading-tight truncate">{inspectModal.skillName}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      {sk.category && (
                        <span className="text-[10px] font-mono text-[#00c8c8] bg-[var(--primary-neon)]/10 border border-[var(--primary-neon)]/20 px-2 py-0.5 rounded-full">{sk.category}</span>
                      )}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${sk.isActive ? 'text-[var(--primary-neon)] bg-[var(--primary-neon)]/10 border-[var(--primary-neon)]/20' : 'text-[var(--text-muted)] bg-[var(--text-muted)]/10 border-[var(--text-muted)]/20'}`}>
                        {sk.isActive ? '● ONLINE' : '○ OFFLINE'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setInspectModal({isOpen:false, skillName:null, content:'', loading:false})}
                    className="ml-2 w-8 h-8 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors flex items-center justify-center shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-8 py-7 skill-md-viewer">
                  {inspectModal.loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-[var(--primary-neon)] animate-pulse font-mono text-sm">Cargando skill...</div>
                    </div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({children}) => <h1 className="text-2xl font-bold text-[var(--text-strong)] mb-4 mt-2 pb-2 border-b border-[var(--border-main)]">{children}</h1>,
                        h2: ({children}) => <h2 className="text-lg font-semibold text-[var(--primary-neon)] mb-3 mt-6 flex items-center gap-2"><span className="w-1 h-4 bg-[var(--primary-neon)] rounded-full inline-block"></span>{children}</h2>,
                        h3: ({children}) => <h3 className="text-base font-semibold text-[#b9cac9] mb-2 mt-4">{children}</h3>,
                        h4: ({children}) => <h4 className="text-sm font-semibold text-[var(--text-muted)] mb-1 mt-3 uppercase tracking-wider">{children}</h4>,
                        p: ({children}) => <p className="text-[var(--text-main)] text-sm leading-relaxed mb-3">{children}</p>,
                        ul: ({children}) => <ul className="space-y-1.5 mb-4 ml-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal ml-5 space-y-1.5 mb-4">{children}</ol>,
                        li: ({children}) => <li className="text-[var(--text-main)] text-sm leading-relaxed flex gap-2"><span className="text-[var(--primary-neon)] mt-1 shrink-0">›</span><span>{children}</span></li>,
                        code: ({inline, children}) => inline
                          ? <code className="text-[var(--primary-neon)] bg-[var(--primary-neon)]/10 border border-[var(--primary-neon)]/20 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                          : <code className="block bg-[var(--bg-input)] border border-[var(--border-main)] rounded-lg p-4 text-xs font-mono text-[#b9cac9] overflow-x-auto leading-relaxed whitespace-pre">{children}</code>,
                        pre: ({children}) => <div className="mb-4">{children}</div>,
                        blockquote: ({children}) => <blockquote className="border-l-2 border-[var(--primary-neon)]/40 pl-4 my-3 text-[var(--text-muted)] italic text-sm">{children}</blockquote>,
                        strong: ({children}) => <strong className="text-[var(--text-strong)] font-semibold">{children}</strong>,
                        em: ({children}) => <em className="text-[#b9cac9] italic">{children}</em>,
                        hr: () => <hr className="border-[var(--border-main)] my-6" />,
                        a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--primary-neon)] hover:underline">{children}</a>,
                        table: ({children}) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm border-collapse">{children}</table></div>,
                        th: ({children}) => <th className="text-left text-xs font-mono text-[var(--primary-neon)] uppercase tracking-wider px-3 py-2 border-b border-[var(--border-main)] bg-[var(--bg-input)]">{children}</th>,
                        td: ({children}) => <td className="px-3 py-2 text-[var(--text-main)] border-b border-[var(--border-main)]/50 text-sm">{children}</td>,
                        tr: ({children}) => <tr className="hover:bg-[var(--primary-neon)]/5 transition-colors">{children}</tr>,
                      }}
                    >
                      {strippedContent}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}

export default App;
