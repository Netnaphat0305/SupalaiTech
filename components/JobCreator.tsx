import React, { useState } from 'react';
import { generateJobDescription } from '../services/geminiService';
import { Sparkles, Globe, Check, Loader2 } from 'lucide-react';
import { SystemLog } from '../types';

interface JobCreatorProps {
  addLog: (source: any, message: string, type: any) => void;
}

const JobCreator: React.FC<JobCreatorProps> = ({ addLog }) => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleGenerate = async () => {
    if (!title) return;
    setIsGenerating(true);
    addLog('OLLAMA', `Analyzing job market requirements for position: ${title}...`, 'INFO');
    addLog('LANGCHAIN', `Constructing prompt for Job Description generation...`, 'INFO');
    
    const desc = await generateJobDescription(title, keywords);
    
    setGeneratedDescription(desc);
    addLog('OLLAMA', `Content generation completed.`, 'SUCCESS');
    setIsGenerating(false);
  };

  const handlePost = () => {
    setIsPosting(true);
    addLog('SYSTEM', 'Initiating Multi-Platform Posting Sequence...', 'INFO');
    
    // Simulate Selenium Automation
    setTimeout(() => {
        addLog('SELENIUM', 'Webdriver initialized (Headless Chrome).', 'INFO');
    }, 500);
    setTimeout(() => {
        addLog('SELENIUM', `Navigating to LinkedIn Recruiter Portal...`, 'INFO');
    }, 1500);
    setTimeout(() => {
        addLog('SELENIUM', `Filling form fields for ${title}...`, 'INFO');
    }, 2500);
    setTimeout(() => {
        addLog('SELENIUM', `Success: Posted to LinkedIn (ID: #LI-99283).`, 'SUCCESS');
    }, 3500);
    setTimeout(() => {
        addLog('SELENIUM', `Navigating to JobsDB...`, 'INFO');
    }, 4000);
    setTimeout(() => {
        addLog('SELENIUM', `Success: Posted to JobsDB.`, 'SUCCESS');
        setIsPosting(false);
        alert("Job Posted Successfully to all platforms!");
    }, 5500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg shadow-purple-500/5 border border-purple-100 flex flex-col space-y-6">
        <div>
            <h2 className="text-xl font-bold text-gradient flex items-center gap-2">
                <Globe className="w-5 h-5 text-pink-500" />
                New Job Opening
            </h2>
            <p className="text-sm text-gray-500 mt-1">Automated distribution to LinkedIn, JobsDB, and Indeed.</p>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                    placeholder="e.g. Senior React Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Requirements / Keywords</label>
                <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                    placeholder="e.g. TypeScript, AWS, Node.js"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                />
            </div>
            
            <button 
                onClick={handleGenerate}
                disabled={isGenerating || !title}
                className="w-full bg-ig-gradient text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Description with AI
            </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg shadow-orange-500/5 border border-orange-100 flex flex-col h-full">
         <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 uppercase tracking-wider mb-4">Preview</h3>
         <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 overflow-y-auto max-h-[400px] prose prose-sm max-w-none custom-scrollbar">
            {generatedDescription ? (
                 <div className="whitespace-pre-line text-gray-700">{generatedDescription}</div>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Generated content will appear here...
                </div>
            )}
         </div>
         {generatedDescription && (
             <button 
                onClick={handlePost}
                disabled={isPosting}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all transform hover:scale-[1.02]"
             >
                {isPosting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Automating Distribution...
                    </>
                ) : (
                    <>
                        <Globe className="w-5 h-5" />
                        Execute Posting Agent
                    </>
                )}
             </button>
         )}
      </div>
    </div>
  );
};

export default JobCreator;