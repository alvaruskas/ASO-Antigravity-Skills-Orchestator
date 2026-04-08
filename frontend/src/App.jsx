import { useState, useEffect } from 'react';
import logoUrl from './assets/aso-logo.png';

const API_URL = 'http://localhost:4000/api';

function App() {
  const [skills, setSkills] = useState([]);
  const [projectStatus, setProjectStatus] = useState({ projectName: 'Global Context', isProfileActive: false });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('activas'); // 'activas' | 'vault' | 'factory'
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

  const filteredSkills = skills.filter(s => {
    const matchesTab = activeTab === 'activas' ? s.isActive : !s.isActive;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#0e1320] text-[#dee2f5] overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 glass-panel flex flex-col border-r border-[#3a4a49]/30">
        <div className="px-6 pt-8 pb-4 flex flex-col items-center justify-center">
          <img src={logoUrl} alt="ASO Logo" className="w-[160px] h-auto object-contain" style={{filter: "drop-shadow(0px 0px 8px rgba(0,251,251,0.2))"}} />
        </div>
        
        <nav className="flex-1 px-4 mt-8 space-y-2">
          <button 
            onClick={() => setActiveTab('activas')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all ${activeTab === 'activas' ? 'bg-[#007070]/30 border border-[#00fbfb]/50 neon-text' : 'hover:bg-[#161b29] text-[#b9cac9]'}`}
          >
            <span className="font-medium">Activas</span>
            <span className="text-xs py-1 px-2 bg-[#090e1b] rounded-md border border-[#3a4a49]/50">
              {skills.filter(s=>s.isActive).length}
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab('vault')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all ${activeTab === 'vault' ? 'bg-[#007070]/30 border border-[#00fbfb]/50 neon-text' : 'hover:bg-[#161b29] text-[#b9cac9]'}`}
          >
            <span className="font-medium">Bóveda (Vault)</span>
            <span className="text-xs py-1 px-2 bg-[#090e1b] rounded-md border border-[#3a4a49]/50">
              {skills.filter(s=>!s.isActive).length}
            </span>
          </button>

          <div className="pt-4 mt-4 border-t border-[#3a4a49]/30">
             <button 
              onClick={() => setActiveTab('factory')}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-md transition-all ${activeTab === 'factory' ? 'bg-[#1b152d]/80 border border-[#9b51e0]/50 text-[#d4b3ff]' : 'hover:bg-[#161b29] text-[#b9cac9]'}`}
             >
               <span className="text-lg">🤖</span>
               <span className="font-medium">Skill Factory</span>
             </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-[#3a4a49]/30 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] text-[#839493] tracking-widest uppercase font-mono mb-2">
            V2.0 Midnight Terminal
          </div>
          <div className="text-[9px] text-[#6b7b7a] leading-tight">
            © 2026 Desarrollado por <strong className="text-[#00fbfb]/80">BCBiocon</strong><br/>
            con la ayuda de Agentes Antigravity
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Glow effect in background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00fbfb]/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-[#0e1320]/80 backdrop-blur-md z-10 border-b border-[#3a4a49]/30 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium text-white flex items-center gap-3">
              {activeTab === 'activas' ? 'Skills Activas' : activeTab === 'vault' ? 'Skills Guardadas' : 'Skill Factory (Co-Pilot)'}
              
              <span className={`text-xs ml-2 px-3 py-1 rounded-full border shadow-sm ${projectStatus.isProfileActive ? 'bg-[#9b51e0]/20 border-[#9b51e0]/50 text-[#d4b3ff]' : 'bg-[#3a4a49]/30 border-[#3a4a49]/50 text-[#839493]'}`}>
                  {projectStatus.isProfileActive ? '📁 Workspace: ' : '🌍 '}{projectStatus.projectName}
              </span>
            </h2>
            <button
               onClick={fetchSkills}
               disabled={loading}
               className="p-2 ml-2 rounded-lg bg-[#161b29] hover:bg-[#007070] border border-[#3a4a49]/50 hover:border-[#00fbfb]/80 text-[#839493] hover:text-white transition-all shadow-sm disabled:opacity-50"
               title="Sincronizar Skills Manualmente"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
          
          {activeTab !== 'factory' && (
            <div className="relative w-72">
              <input 
                type="text" 
                placeholder="Search skills..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#090e1b] border border-[#3a4a49]/50 focus:border-[#00fbfb] focus:outline-none rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-[#839493] transition-colors"
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-[#839493]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          )}
        </header>

        {/* Content Area */}
        {activeTab !== 'factory' ? (
        <div className="flex-1 overflow-y-auto p-8 z-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-[#00fbfb] animate-pulse">Syncing nodes...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSkills.map(skill => (
                <div key={skill.id} className="glass-card rounded-lg p-5 flex flex-col min-h-[16rem] h-auto relative overflow-hidden group">
                  {/* Subtle hover accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00fbfb]/0 via-[#00fbfb]/0 to-[#00fbfb]/0 group-hover:from-[#00fbfb]/80 group-hover:via-[#00fbfb]/40 group-hover:to-transparent transition-all duration-300"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-[#090e1b] border border-[#3a4a49]/50 flex items-center justify-center group-hover:border-[#00fbfb]/50 transition-colors">
                        <span className="text-xl">🔌</span>
                      </div>
                      <div className="pr-8">
                        <h3 className="font-semibold text-white tracking-tight">{skill.name}</h3>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(skill.id, skill.isActive)}
                      className="absolute top-4 right-4 text-[#839493] hover:text-[#ff4444] transition-colors p-1 opacity-0 group-hover:opacity-100"
                      title="Eliminar Skill Definitivamente"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                  
                  <div className="mb-2 flex items-center gap-2">
                     <span className="inline-block px-2.5 py-1 bg-[#035252] text-[#85c3c3] text-[10px] font-mono tracking-wider uppercase rounded-full border border-[#007070]/50">
                      {skill.category}
                     </span>
                     {skill.isActive && skill.scope && (
                       <span className={`inline-block px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase rounded-sm border ${skill.scope === 'project' ? 'bg-[#9b51e0]/20 text-[#d4b3ff] border-[#9b51e0]/50' : 'bg-[#00fbfb]/10 text-[#00fbfb] border-[#00fbfb]/30'}`}>
                         [{skill.scope === 'project' ? 'Proyecto' : 'Global'}]
                       </span>
                     )}
                  </div>
                  
                  <div className="flex-1 overflow-hidden relative">
                    <p className="text-sm text-[#b9cac9] mt-1 leading-relaxed" style={{display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                      {skill.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#3a4a49]/30 flex items-center justify-between mt-auto">
                    <span className={`text-xs font-mono font-medium ${skill.isActive ? 'text-[#00fbfb]' : 'text-[#839493]'}`}>
                      {skill.isActive ? 'ONLINE' : 'OFFLINE'}
                    </span>
                    
                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={skill.isActive}
                        onChange={() => handleToggle(skill.id, skill.isActive, skill.scope)}
                      />
                      <div className="w-9 h-5 bg-[#090e1b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border border-[#3a4a49] peer-checked:bg-[#007070] peer-checked:border-[#00fbfb]"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && filteredSkills.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-[#839493]">
              <span className="text-4xl mb-4">📭</span>
              <p>No skills found in this sector.</p>
            </div>
          )}
        </div>
        ) : (
          <div className="flex-1 flex flex-col z-0">
             <div className="flex-1 overflow-y-auto p-8 space-y-6 pb-32">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[#007070] text-white rounded-br-none' : 'bg-[#1b152d] border border-[#9b51e0]/30 text-[#d4b3ff] rounded-bl-none shadow-[0_4px_15px_rgba(155,81,224,0.1)]'}`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-[#1b152d] border border-[#9b51e0]/30 text-[#d4b3ff] rounded-2xl rounded-bl-none p-4">
                      <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-[#9b51e0] animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-[#9b51e0] animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 rounded-full bg-[#9b51e0] animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                )}
             </div>
             
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#0e1320]/95 backdrop-blur-xl border-t border-[#3a4a49]/50 shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
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
                       // Ventana de Contexto (Context Window): Limitar a los últimos 6 mensajes + el prompt del system
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
                      className="flex-1 bg-[#161b29] border border-[#3a4a49]/50 focus:border-[#9b51e0] focus:ring-1 focus:ring-[#9b51e0] focus:outline-none rounded-xl py-4 px-6 text-white placeholder-[#839493] transition-all disabled:opacity-50"
                    />
                    <button 
                      type="button"
                      onClick={() => setChatMessages([{
                         role: 'system', content: 'Iniciando Antigravity Co-Pilot. Dime qué código, lógica o acción quieres automatizar y yo redactaré la Skill y la inyectaré en tu Bóveda.'
                      }])}
                      className="p-4 rounded-xl border border-[#3a4a49]/50 hover:bg-[#ff4444]/20 hover:text-[#ff4444] text-[#839493] transition-colors"
                      title="Limpiar Memoria"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <button 
                      type="submit"
                      disabled={isGenerating || !chatPrompt.trim()}
                      className="bg-[#9b51e0] hover:bg-[#8040c0] text-white px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
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
                    className="bg-[#007070] hover:bg-[#00fbfb]/80 hover:text-black border border-[#00fbfb]/50 text-white px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,251,251,0.2)]"
                  >
                    <span className="text-lg mr-2">💾</span>
                    Fabricar Skill
                 </button>
               </div>
             </div>
          </div>
        )}
        {/* Scope Modal */}
        {scopeModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0e1320] border border-[#3a4a49] rounded-xl shadow-2xl p-6 max-w-md w-full relative">
              <h3 className="text-xl font-medium text-white mb-4">¿Ámbito de Activación?</h3>
              <p className="text-sm text-[#839493] mb-6">Estás en un entorno de proyecto. Elige dónde instalar esta Skill:</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => { setScopeModal({isOpen:false, skillId:null}); executeToggle(scopeModal.skillId, true, 'project'); }}
                  className="w-full text-left p-4 rounded-lg bg-[#161b29] border border-[#9b51e0]/40 hover:border-[#9b51e0] hover:bg-[#1b152d] transition-colors group"
                >
                  <div className="font-medium text-[#d4b3ff] mb-1 group-hover:text-white">🚀 Nivel de Proyecto</div>
                  <div className="text-xs text-[#839493]">Se copiará a <code className="text-[#9b51e0]">/skills</code> dentro del código de este proyecto.</div>
                </button>
                
                <button 
                  onClick={() => { setScopeModal({isOpen:false, skillId:null}); executeToggle(scopeModal.skillId, true, 'global'); }}
                  className="w-full text-left p-4 rounded-lg bg-[#161b29] border border-[#00fbfb]/30 hover:border-[#00fbfb] hover:bg-[#090e1b] transition-colors group"
                >
                  <div className="font-medium text-[#00fbfb] mb-1 group-hover:text-white">🌍 Nivel Global</div>
                  <div className="text-xs text-[#839493]">Se moverá a la carpeta base compartida por todos los proyectos.</div>
                </button>
              </div>
              
              <button 
                onClick={() => setScopeModal({isOpen:false, skillId:null})}
                className="mt-6 text-sm text-[#839493] hover:text-white w-full text-center"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
