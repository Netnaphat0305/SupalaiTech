import React, { useState, useEffect } from 'react';
import { ViewState, SystemLog, Candidate } from './types';
import Terminal from './components/Terminal';
import JobCreator from './components/JobCreator';
import Pipeline from './components/Pipeline';
import Dashboard from './components/Dashboard';
import { LayoutDashboard, PlusCircle, Users, Bot, Settings, Instagram } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Function to add logs simulating backend processes
  const addLog = (source: 'SELENIUM' | 'LANGCHAIN' | 'OLLAMA' | 'SYSTEM', message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      source,
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  useEffect(() => {
    addLog('SYSTEM', 'Supalai Tech Core initializing...', 'INFO');
    setTimeout(() => addLog('OLLAMA', 'Model "llama3:latest" loaded in memory.', 'SUCCESS'), 800);
    setTimeout(() => addLog('SELENIUM', 'Headless Browser driver ready.', 'SUCCESS'), 1200);
    setTimeout(() => addLog('LANGCHAIN', 'Agent chains orchestrated.', 'SUCCESS'), 1500);
  }, []);

  const renderContent = () => {
    switch(currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard candidates={candidates} />;
      case ViewState.JOB_CREATOR:
        return <JobCreator addLog={addLog} />;
      case ViewState.CANDIDATE_PIPELINE:
        return <Pipeline candidates={candidates} setCandidates={setCandidates} addLog={addLog} />;
      default:
        return <Dashboard candidates={candidates} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar with IG Mesh Gradient */}
      <aside className="w-64 bg-ig-mesh text-white flex flex-col shadow-xl z-10 hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-tr from-purple-600 to-orange-500 font-bold text-2xl shadow-lg">
                <Instagram className="w-6 h-6 text-pink-600" />
             </div>
             <div>
                <h1 className="text-white font-bold text-lg tracking-tight drop-shadow-sm">Supalai Tech</h1>
                <p className="text-xs text-white/80 uppercase tracking-widest">Recruit OS</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setCurrentView(ViewState.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === ViewState.DASHBOARD 
                ? 'bg-white text-pink-600 shadow-lg' 
                : 'text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${currentView === ViewState.DASHBOARD ? 'text-orange-500' : 'text-white'}`} />
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView(ViewState.JOB_CREATOR)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === ViewState.JOB_CREATOR 
                ? 'bg-white text-pink-600 shadow-lg' 
                : 'text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            <PlusCircle className={`w-5 h-5 ${currentView === ViewState.JOB_CREATOR ? 'text-orange-500' : 'text-white'}`} />
            Post New Job
          </button>
          <button 
            onClick={() => setCurrentView(ViewState.CANDIDATE_PIPELINE)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === ViewState.CANDIDATE_PIPELINE 
                ? 'bg-white text-pink-600 shadow-lg' 
                : 'text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            <Users className={`w-5 h-5 ${currentView === ViewState.CANDIDATE_PIPELINE ? 'text-orange-500' : 'text-white'}`} />
            Candidates Pipeline
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-white/10">
            <Bot className="w-8 h-8 text-yellow-300" />
            <div>
              <p className="text-xs text-white/70">Core Engine</p>
              <p className="text-sm font-mono text-white font-bold text-shadow">Ollama Active</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 ml-auto animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/90 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0">
          <h2 className="text-lg font-bold text-gradient">
            {currentView === ViewState.DASHBOARD && 'Operational Overview'}
            {currentView === ViewState.JOB_CREATOR && 'Job Distribution Agent'}
            {currentView === ViewState.CANDIDATE_PIPELINE && 'Applicant Processing System'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-sm">
              v2.4.0-stable
            </span>
            <button className="text-gray-400 hover:text-pink-600 transition-colors">
                <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
             {renderContent()}
        </div>

        {/* Live Terminal Footer */}
        <div className="h-48 bg-[#1e1e1e] border-t border-gray-800 shrink-0 p-4">
            <Terminal logs={logs} />
        </div>
      </main>
    </div>
  );
};

export default App;